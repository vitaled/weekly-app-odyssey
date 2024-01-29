function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Function to convert a CryptoKey to a string
async function cryptoKeyToString(key) {
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  const keyArray = new Uint8Array(exportedKey);
  let keyString = "";
  keyArray.forEach((byte) => {
    keyString += String.fromCharCode(byte);
  });
  return keyString;
}

async function stringToCryptoKey(keyString) {
  // Convert the key string to a Uint8Array
  const keyArray = new Uint8Array(keyString.length);
  for (let i = 0; i < keyString.length; i++) {
    keyArray[i] = keyString.charCodeAt(i);
  }

  // Check that the key is the correct size
  if (
    keyArray.length !== 16 &&
    keyArray.length !== 24 &&
    keyArray.length !== 32
  ) {
    throw new Error("Invalid key size");
  }

  // Import the key
  const key = await window.crypto.subtle.importKey(
    "raw",
    keyArray,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
  console.log(key);
  return key;
}

// Function to retrieve the encryption key
async function getEncryptionKey() {
  return new Promise((resolve, reject) => {
    // Retrieve the key from chrome.storage
    chrome.storage.sync.get(["encryptionKey"], function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (result.encryptionKey) {
        // Convert the key string back to a format suitable for encryption (raw)

        stringToCryptoKey(result.encryptionKey).then(resolve).catch(reject);
      } else {
        reject(new Error("No encryption key found."));
      }
    });
  });
}

async function encryptData(data) {
  // Generate a random initialization vector (iv)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Get the encryption key from storage

  const key = await getEncryptionKey();

  // print the type of key
  console.log(typeof key);

  // Convert the data to a format that can be encrypted
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));

  // Encrypt the data
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  // Convert the encrypted data to a Base64 string
  const serializedData = arrayBufferToBase64(encryptedData);

  // Return the encrypted data and the iv (you'll need the iv for decryption)
  return {
    encryptedData: serializedData,
    iv: arrayBufferToBase64(iv),
  };
}

// Function to store user data
async function storeUserData(website, username, url) {
  // Encrypt the data
  const encryptedData = await encryptData({
    website,
    username,
    url,
  });

  // Store the encrypted data in chrome.storage
  chrome.storage.sync.set({ [website]: serializedData }, function () {
    console.log("User data for " + website + " has been stored.");
  });
}

//Listen for tab updates
// chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//   // Check if the tab's URL has been updated
//   if (changeInfo.url) {
//     // Retrieve all data from chrome.storage
//     chrome.storage.sync.get(null, async function (items) {
//       // Check if the updated URL matches a stored website
//       const website = Object.keys(items).find((key) =>
//         changeInfo.url.includes(key)
//       );
//       if (website) {
//         // Retrieve and decrypt the password
//         const decryptedData = await decryptData(items[website]);

//         // Send a notification to the user
//         chrome.notifications.create({
//           type: "basic",
//           iconUrl: "icons/icon48.png",
//           title: "Password Manager",
//           message:
//             "Username: " +
//             decryptedData.username +
//             ", Password: " +
//             decryptedData.password,
//         });
//       }
//     });
//   }
// });

function deleteCredential(url) {
  chrome.storage.sync.remove(url, function () {
    console.log("User data for " + url + " has been removed.");
  });
}

async function decryptData(data) {
  // Get the encryption key
  const key = await getEncryptionKey();

  const encryptData = base64ToArrayBuffer(data.encryptedData);
  const iv = base64ToArrayBuffer(data.iv);

  // Decrypt the data
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptData
  );

  // Convert the decrypted data back to a format suitable for use (string)
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(new Uint8Array(decryptedData));

  // Parse the string back to an object
  return JSON.parse(decodedData);
}

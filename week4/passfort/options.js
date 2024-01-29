// Function to generate and store an encryption key
async function generateAndStoreEncryptionKey() {
  // Generate a new encryption key
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  // Convert the key to a string
  const keyString = await cryptoKeyToString(key);
  console.log(keyString);
  // Store the key in chrome.storage
  chrome.storage.sync.set({ encryptionKey: keyString }, function () {
    console.log("Encryption key has been stored.");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateKey").addEventListener("click", function () {
    generateAndStoreEncryptionKey();
  });
});

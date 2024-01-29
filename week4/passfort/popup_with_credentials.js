document.addEventListener("DOMContentLoaded", () => {
  // Get current tab URL
  let queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, function(tabs) {
    let tab = tabs[0];
    let tabId = tab.id;
    let url = tab.url;
    console.log(url);
    chrome.storage.sync.get(null, async function (items) {
      // Check if the updated URL matches a stored website
      const website = Object.keys(items).find((key) => url.includes(key));
      if (website) {
        console.log("data on change:" + items[website]);
        const decryptedData = await decryptData(items[website]);
        document.getElementById("username").textContent = decryptedData.username;
        document.getElementById("password").value = decryptedData.password;
      }
    });
  });
});

document.getElementById("copyUsername").addEventListener("click", () => {
  navigator.clipboard.writeText(
    document.getElementById("username").textContent
  );
});

document.getElementById("copyPassword").addEventListener("click", () => {
  navigator.clipboard.writeText(document.getElementById("password").value);
});

window.onunload = function () {
  chrome.runtime.sendMessage({ message: "popupClosed" });
};

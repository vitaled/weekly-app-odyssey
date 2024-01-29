console.log("Background script running");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
      chrome.storage.sync.get(null, async function (items) {
        // Check if the updated URL matches a stored website
        const website = Object.keys(items).find((key) => tab.url.includes(key));
        if (website) {

          chrome.browserAction.setPopup({tabId: tabId, popup: 'popup_with_credentials.html'});
          chrome.browserAction.setBadgeText({ text: "!", tabId: tabId });

          // Retrieve and decrypt the password
          // console.log("data on change:" + items[website]);
          // const decryptedData = await decryptData(items[website]);
          // chrome.browserAction.setPopup({tabId: tabId, popup: 'popup_with_credentials.html'});
          // chrome.browserAction.setBadgeText({ text: decryptedData.username, tabId: tabId });
          // currentCredentials = await decryptedData;
          // console.log(currentCredentials+ "current credentials")
        }
      });
  }
});

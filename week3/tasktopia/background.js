chrome.commands.onCommand.addListener(function(command) {
    if (command === "_execute_browser_action") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {file: "popup.js"});
        });
    }
});
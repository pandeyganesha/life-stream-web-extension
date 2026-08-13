console.log("Background script loaded.");

browser.tabs.onActivated.addListener((active_info) => {
    const active_tab = active_info.tabId;
});

browser.runtime.onMessage.addListener((message, sender) => {
    console.log("Received:", message);
    console.log("Sender:", sender);
});
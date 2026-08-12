console.log("Background script loaded.");

browser.runtime.onMessage.addListener((message, sender) => {
    console.log("Received:", message);
    console.log("Sender:", sender);
});
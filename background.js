console.log("Background script loaded.");

TIME_SPENT_MAP = new Map();

let active_tab = null;
let previous_tab = null;
let previous_tab_start_time = null;
let active_tab_start_time = null;

browser.tabs.onActivated.addListener(async (active_info) => {
    previous_tab = active_tab;
    previous_tab_start_time = active_tab_start_time;
    const tab = await browser.tabs.get(active_info.tabId);
    const raw_url = tab.url || tab.pendingUrl || "";
    const url = new URL(raw_url);
    active_tab = url.hostname;
    if (active_tab === "") {
        active_tab = "New Tab (Blank)";
    }
    console.log("Active tab:", active_tab);
    active_tab_start_time = Date.now();


    if (!TIME_SPENT_MAP.has(active_tab)) {
        TIME_SPENT_MAP.set(active_tab, 0);
    }

    if (previous_tab !== null) {
        const previous_time = TIME_SPENT_MAP.get(previous_tab);
        const time_spent = Date.now() - previous_tab_start_time;
        TIME_SPENT_MAP.set(previous_tab, previous_time + time_spent);
    }

    console.log("Active tab changed to:", active_tab);
    console.log("TIME_SPENT_MAP:", TIME_SPENT_MAP);
});

// browser.runtime.onMessage.addListener((message, sender) => {
//     console.log("Received:", message);
//     console.log("Sender:", sender);
// });
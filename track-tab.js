browser.runtime.sendMessage({
    type: "PAGE_INFO",
    url: window.location.href,
    title: document.title
})
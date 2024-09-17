chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // When the tab has finished loading
        chrome.storage.local.set({ currentUrl: tab.url });
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let tab = await chrome.tabs.get(activeInfo.tabId);
    chrome.storage.local.set({ currentUrl: tab.url });
});

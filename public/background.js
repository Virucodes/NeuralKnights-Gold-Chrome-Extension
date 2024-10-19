chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: sendTabUrlToContentScript,
      args: [tab.url, tab.title]  // Send the URL and title to the content script
    });
  }
});

function sendTabUrlToContentScript(url, title) {
  chrome.runtime.sendMessage({ type: 'TAB_URL', url: url, title: title });
}

  
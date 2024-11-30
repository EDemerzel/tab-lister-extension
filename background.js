chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    const blob = new Blob([request.data], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: "tabs_list.txt"
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true });
      }
    });

    return true; // Required to indicate async response
  }
});

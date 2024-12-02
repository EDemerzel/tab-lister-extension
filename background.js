chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    try {
      // Create a Blob from the request data
      const blob = new Blob([request.data], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      // Initiate the download
      chrome.downloads.download({
        url: url,
        filename: "tabs_list.txt"
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          // Send an error response if there was a problem with the download
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          // Send a success response if the download was initiated successfully
          sendResponse({ success: true });
        }

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);
      });

      // Indicate that the response will be sent asynchronously
      return true;
    } catch (error) {
      // Handle any unexpected errors
      sendResponse({ error: error.message });
      return false;
    }
  }
});
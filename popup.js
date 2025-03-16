// ------------------------
// Utility: Show Toast Notification
// ------------------------
// Displays a transient notification in the popup window.
function showToast(message) {
  // Create a toast element with the provided message.
  const toast = document.createElement('div');
  toast.textContent = message;
  // Set positioning and styling for visibility.
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  
  // Add toast to the document
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

// ------------------------
// Function: List Tabs
// ------------------------
// Retrieves all open tabs, removes duplicate URLs, and displays them as clickable list items.
function listTabs() {
  chrome.tabs.query({}, (tabs) => {
    // Check for runtime errors (e.g. invalid permissions)
    if (chrome.runtime.lastError) {
      console.error('Error querying tabs: ', chrome.runtime.lastError.message);
      return;
    }
    
    // Get the list container element from popup.html
    const list = document.getElementById('tabsList');
    if (!list) {
      console.error('Element with id "tabsList" not found.');
      return;
    }
    
    // Clear any existing list items
    list.innerHTML = '';
    const uniqueTabs = new Set();
    
    // Iterate over each tab and build the UI elements for each unique tab.
    tabs.forEach(tab => {
      if (uniqueTabs.has(tab.url)) {
        return;
      }
      uniqueTabs.add(tab.url);
      
      // Create the list item container
      const listItem = document.createElement('li');
      listItem.style.position = 'relative';
      
      // Create and configure the title element (bold)
      const title = document.createElement('b');
      title.textContent = tab.title.replace(/\s*-\s*/g, ' ').trim();
      
      // Create and configure the link element for the tab URL
      const url = document.createElement('a');
      url.href = tab.url;
      url.textContent = tab.url;
      url.target = '_blank'; // Opens link in a new tab/window
      url.style.display = 'block';
      url.style.color = '#0645AD';
      
      // Create a copy button using an image icon.
      const copyButton = document.createElement('img');
      copyButton.src = 'icons/copy-icon16.png';
      copyButton.alt = 'Copy URL';
      copyButton.style.position = 'absolute';
      copyButton.style.top = '5px';
      copyButton.style.right = '5px';
      copyButton.style.cursor = 'pointer';
      copyButton.style.width = '16px';
      copyButton.style.height = '16px';
      
      // Add an event listener to copy the URL when the button is clicked.
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(tab.url)
          .then(() => {
            showToast("URL copied to clipboard!");
          })
          .catch(err => {
            console.error('Could not copy URL: ', err);
          });
      });
      
      // Append all elements to the list item, then to the list.
      listItem.appendChild(copyButton);
      listItem.appendChild(title);
      listItem.appendChild(url);
      list.appendChild(listItem);
    });
  });
}

// ------------------------
// Function: Copy Tabs to Clipboard
// ------------------------
// Aggregates tab details into a tab-separated string and copies it to the clipboard.
async function copyToClipboard() {
  try {
    const tabsText = Array.from(document.querySelectorAll('#tabsList li'))
      .map(li => {
        const title = li.querySelector('b').textContent;
        const url = li.querySelector('a').href;
        return `${title}\t${url}`; // Format: title, then URL, separated by a tab.
      })
      .join('\n'); // Separate each tab with a newline.

    // Write the formatted string to the clipboard
    await navigator.clipboard.writeText(tabsText);
    showToast("Copied to clipboard!");
  } catch (err) {
    console.error('Could not copy text: ', err);
  }
}

// ------------------------
// Function: Save Tabs as File
// ------------------------
// Creates a data URL from the tab list text and triggers a download with a timestamped filename.
async function saveToFile() {
  try {
    // Generate the tab information string from the list items.
    const tabsText = Array.from(document.querySelectorAll('#tabsList li'))
      .map(li => {
        const title = li.querySelector('b').textContent;
        const url = li.querySelector('a').href;
        return `${title}\t${url}`;
      })
      .join('\n');

    // Create a filename with date and time
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const filename = `tabs_list_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.txt`;

    // Create a data URL that encodes the tabs information.
    const downloadLink = document.createElement("a");
    downloadLink.href = "data:text/plain;charset=utf-8," + encodeURIComponent(tabsText);
    downloadLink.download = filename; // Set the generated filename.
    
    // Append the link, simulate a click, and remove it.
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    showToast("File download initiated!");
  } catch (err) {
    console.error('Error saving file: ', err);
  }
}

// ------------------------
// Function: Reopen Tabs from File (Updated)
// ------------------------
// Reads a saved text file, validates its type and size, shows a progress indicator during file read,
// extracts URLs, and opens each URL in a new tab.
async function reopenTabsFromFile() {
  // Create a hidden file input element.
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt';  // Restrict file selection to text files.

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    
    // Safeguard 1: Validate file extension.
    if (!file.name.toLowerCase().endsWith('.txt')) {
      showToast("Invalid file type. Please select a .txt file.");
      return;
    }
    
    // Safeguard 2: Validate file size (e.g., maximum 2MB).
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes.
    if (file.size > MAX_SIZE) {
      showToast("File too large. Please select a file smaller than 2MB.");
      return;
    }
    
    const reader = new FileReader();

    // Create a progress indicator element.
    const progressContainer = document.createElement('div');
    progressContainer.style.position = 'fixed';
    progressContainer.style.bottom = '10px';
    progressContainer.style.left = '50%';
    progressContainer.style.transform = 'translateX(-50%)';
    progressContainer.style.backgroundColor = '#fff';
    progressContainer.style.border = '1px solid #ccc';
    progressContainer.style.padding = '5px 10px';
    progressContainer.style.borderRadius = '5px';
    progressContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    progressContainer.textContent = 'Reading file: 0%';
    document.body.appendChild(progressContainer);
    
    // Safeguard 3: Set up progress event handler.
    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        progressContainer.textContent = `Reading file: ${percentLoaded}%`;
      }
    };

    // When file read is complete.
    reader.onload = (e) => {
      document.body.removeChild(progressContainer); // Remove progress indicator.
      const content = e.target.result;
      // Extract URLs assuming each line is tab-separated and the URL is the second field.
      const urls = content.split('\n').map(line => {
        const parts = line.split('\t');
        return parts[1] ? parts[1].trim() : '';
      });
      urls.forEach(url => {
        if (url) {
          chrome.tabs.create({ url: url });
        }
      });
    };

    // Handle read errors.
    reader.onerror = () => {
      document.body.removeChild(progressContainer);
      showToast("Error reading file.");
    };

    // Read file as plain text.
    reader.readAsText(file);
  };

  // Trigger the file selection dialog.
  input.click();
}

// ------------------------
// Event Listeners
// ------------------------
// Initialize tab listing when the popup loads.
document.addEventListener('DOMContentLoaded', listTabs);

// Attach button listeners to handle copying, saving, and reopening tabs.
document.getElementById('copyButton').addEventListener('click', copyToClipboard);
document.getElementById('saveButton').addEventListener('click', saveToFile);
document.getElementById('reopenButton').addEventListener('click', reopenTabsFromFile);
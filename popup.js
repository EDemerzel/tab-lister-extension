// popup.js

// Function to show a toast notification with a given message
function showToast(message) {
  // Create a div element for the toast
  const toast = document.createElement('div');
  toast.textContent = message;
  // Style the toast
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  // Append the toast to the body
  document.body.appendChild(toast);
  // Remove the toast after 3 seconds
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

// Function to list all open tabs in the browser
function listTabs() {
  // Query all open tabs
  chrome.tabs.query({}, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error('Error querying tabs: ', chrome.runtime.lastError.message);
      return;
    }
    
    // Get the list element to display the tabs
    const list = document.getElementById('tabsList');
    if (!list) {
      console.error('Element with id "tabsList" not found.');
      return;
    }
    
    // Clear the list
    list.innerHTML = '';
    const uniqueTabs = new Set();
    
    // Iterate over each tab
    tabs.forEach(tab => {
      // Skip duplicate tabs
      if (uniqueTabs.has(tab.url)) {
        return;
      }
      uniqueTabs.add(tab.url);
      
      // Create a list item for the tab
      const listItem = document.createElement('li');
      listItem.style.position = 'relative';

      // Create a bold element for the tab title
      const title = document.createElement('b');
      title.textContent = tab.title.replace(/\s*-\s*/g, ' ').trim();

      // Create a link element for the tab URL
      const url = document.createElement('a');
      url.href = tab.url;
      url.textContent = tab.url;
      url.target = '_blank';
      url.style.display = 'block';
      url.style.color = '#0645AD';

      // Create an image element for the copy button
      const copyButton = document.createElement('img');
      copyButton.src = 'icons/copy-icon16.png';
      copyButton.alt = 'Copy URL';
      copyButton.style.position = 'absolute';
      copyButton.style.top = '5px';
      copyButton.style.right = '5px';
      copyButton.style.cursor = 'pointer';
      copyButton.style.width = '16px';
      copyButton.style.height = '16px';
      // Add click event listener to copy the URL to clipboard
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(tab.url).then(() => {
          showToast("URL copied to clipboard!");
        }).catch(err => {
          console.error('Could not copy URL: ', err);
        });
      });

      // Append the elements to the list item
      listItem.appendChild(copyButton);
      listItem.appendChild(title);
      listItem.appendChild(url);
      // Append the list item to the list
      list.appendChild(listItem);
    });
  });
}

// Function to copy the list of tabs to the clipboard
async function copyToClipboard() {
  try {
    // Convert the list of tab elements into a formatted string
    const tabsText = Array.from(document.querySelectorAll('#tabsList li'))
      .map(li => {
        // Extract the title text from the <b> element within the list item
        const title = li.querySelector('b').textContent;
        // Extract the URL from the <a> element within the list item
        const url = li.querySelector('a').href;
        // Format the title and URL as a tab-separated string
        return `${title}\t${url}`;
      })
      // Join all the formatted strings with a newline character
      .join('\n');

    // Write the formatted string to the clipboard
    await navigator.clipboard.writeText(tabsText);

    // Show a toast notification indicating the text was copied successfully
    showToast("Copied to clipboard!");
  } catch (err) {
    // Log an error message if the text could not be copied
    console.error('Could not copy text: ', err);
  }
}

// Function to save the list of tabs as a file
async function saveToFile() {
  try {
    // Convert the list of tab elements into a formatted string
    const tabsText = Array.from(document.querySelectorAll('#tabsList li'))
      .map(li => {
        // Extract the title text from the <b> element within the list item
        const title = li.querySelector('b').textContent;
        // Extract the URL from the <a> element within the list item
        const url = li.querySelector('a').href;
        // Format the title and URL as a tab-separated string
        return `${title}\t${url}`;
      })
      // Join all the formatted strings with a newline character
      .join('\n');
    
    // Send a message to the background script to initiate the download
    const response = await chrome.runtime.sendMessage({action: "download", data: tabsText});
    if (chrome.runtime.lastError) {
      console.error('Error sending message: ', chrome.runtime.lastError.message);
      return;
    }
    if (response && response.error) {
      console.error('Error from background script: ', response.error);
    }
  } catch (err) {
    // Log an error message if there was an issue sending the message
    console.error('Error sending message: ', err);
  }
}

// Event listener to list tabs when the DOM content is loaded
document.addEventListener('DOMContentLoaded', listTabs);
// Event listener for the "Copy to Clipboard" button
document.getElementById('copyButton').addEventListener('click', copyToClipboard);
// Event listener for the "Save as File" button
document.getElementById('saveButton').addEventListener('click', saveToFile);
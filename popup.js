// popup.js

function listTabs() {
    // Query all tabs currently open in the browser
    chrome.tabs.query({}, (tabs) => {
      // Handle potential errors that could occur while querying tabs
      if (chrome.runtime.lastError) {
        console.error('Error querying tabs: ', chrome.runtime.lastError.message);
        return;
      }
      
      // Get the element where the list of tabs will be displayed
      const list = document.getElementById('tabsList');
      if (!list) {
        console.error('Element with id "tabsList" not found.');
        return;
      }
      
      // Iterate through each tab and create list items for them
      tabs.forEach(tab => {
        // Create a new list item for the tab
        const listItem = document.createElement('li');
  
        // Create a bold element for the tab title
        const title = document.createElement('b');
        // Use a more robust title formatting approach to ensure better readability
        title.textContent = tab.title.replace(/\s*-\s*/g, ' ').trim();
  
        // Create a clickable link element for the tab URL
        const url = document.createElement('a');
        url.href = tab.url; // Set the href attribute to the tab's URL
        url.textContent = tab.url; // Set the link text to the URL itself
        url.target = '_blank'; // Ensure the link opens in a new tab when clicked
        url.style.display = 'block'; // Display the URL as a block element for better layout
        url.style.color = '#0645AD'; // Set the link color for better visibility
  
        // Append the title and URL to the list item
        listItem.appendChild(title);
        listItem.appendChild(url);
        // Append the list item to the list element in the popup
        list.appendChild(listItem);
      });
    });
  }
  
  async function copyToClipboard() {
    try {
      // Gather all the list items (tabs) and create a tab-delimited string
      const tabsText = Array.from(document.querySelectorAll('#tabsList li'))
                           .map(li => {
        const title = li.querySelector('b').textContent; // Get the title text
        const url = li.querySelector('a').href; // Get the URL
        return `${title}\t${url}`; // Separate title and URL with a tab character
      }).join('\n'); // Join each tab's info with a newline
  
      // Copy the gathered text to the clipboard
      await navigator.clipboard.writeText(tabsText);
      // Display a non-blocking toast notification instead of alert
      const toast = document.createElement('div');
      toast.textContent = "Copied to clipboard!";
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = '#333';
      toast.style.color = '#fff';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000); // Remove the toast after 3 seconds
    } catch (err) {
      console.error('Could not copy text: ', err); // Log any error that occurs while copying
    }
  }
  
  async function saveToFile() {
    try {
      // Gather all the list items (tabs) and create a tab-delimited string
      const tabsText = Array.from(document.querySelectorAll('#tabsList li'))
                           .map(li => {
        const title = li.querySelector('b').textContent; // Get the title text
        const url = li.querySelector('a').href; // Get the URL
        return `${title}\t${url}`; // Separate title and URL with a tab character
      }).join('\n'); // Join each tab's info with a newline
      
      // Send a message to the background script to initiate the download
      const response = await chrome.runtime.sendMessage({action: "download", data: tabsText});
      // Handle potential errors that could occur while sending the message
      if (chrome.runtime.lastError) {
        console.error('Error sending message: ', chrome.runtime.lastError.message);
        return;
      }
      if (response && response.error) {
        console.error('Error from background script: ', response.error);
      }
    } catch (err) {
      console.error('Error sending message: ', err); // Log any error that occurs during sendMessage
    }
  }
  
  // Add an event listener to run the listTabs function when the document content is loaded
  document.addEventListener('DOMContentLoaded', listTabs);
  // Add click event listeners for the buttons to trigger their respective functions
  document.getElementById('copyButton').addEventListener('click', copyToClipboard);
  document.getElementById('saveButton').addEventListener('click', saveToFile);
  
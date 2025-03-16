# Tab Lister - Store Information

## Single purpose description

_Tab Lister is a Chrome extension that lists all open tabs, allowing you to copy them to the clipboard or save them as a file so you can reload them later. This helps users efficiently manage and restore their browsing sessions._

## Permission Justifications

- **tabs justification**  
  _This permission is required to access all open tabs in the browser, which is essential for listing the tabs. Without it, the extension cannot retrieve the needed tab information._

- **activeTab justification**
  _The “activeTab” permission provides temporary access to the tab that the user is interacting with. It is necessary to display tab details and handle interactions such as copying, saving, and reloading tabs._

- **clipboardWrite justification**
  _This permission is core to the extension’s functionality. It allows the extension to copy the list of tabs to the clipboard when the user clicks the "Copy to Clipboard" button._

- **downloads justification**  
  _The extension uses this permission to trigger file downloads when saving the list of tabs as a text file with a timestamped filename. This is a critical function for the extension’s purpose._

**Are you using remote code?**  
_No, I am not using remote code. All JavaScript code (and any other code) is included locally within the extension’s package, and no external files are loaded or eval’d._

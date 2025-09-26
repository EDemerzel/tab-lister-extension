# Tab Lister - Store Information

## Single purpose description

_Tab Lister is a Chrome extension that lists all open tabs, allowing you to copy them to the clipboard or save them as a file so you can reload them later. This helps users efficiently manage and restore their browsing sessions._

## Permission Justifications

- **tabs justification**  
  _This permission is required to access all open tabs in the browser, which is essential for listing the tabs. Without it, the extension cannot retrieve the needed tab information._

- **activeTab justification**
  _The "activeTab" permission provides temporary access to the tab that the user is interacting with. It is necessary to display tab details and handle interactions such as copying, saving, and reloading tabs._

- **clipboardWrite justification**
  _This permission is core to the extension's functionality. It allows the extension to copy the list of tabs to the clipboard when the user clicks the "Copy to Clipboard" button._

**Are you using remote code?**  
_No, I am not using remote code. All JavaScript code (and any other code) is included locally within the extension's package, and no external files are loaded or eval'd._

## Additional Security Features

- File type validation (only .txt files accepted)
- File size limits (maximum 2MB)
- URL validation (only http/https URLs are opened)
- Tab opening limits (maximum 50 tabs per file for performance)
- Progress indicators for file operations
- Comprehensive error handling

# Tab Lister Extension

Tab Lister is a Chrome extension that lists all open tabs, allows you to copy them to the clipboard, and save them as a text file with a timestamped filename (e.g., `tabs_list_YYYYMMDD_HHMMSS.txt`). You can also reopen tabs from a previously saved file.

## Features

- List all open tabs in the browser.
- Copy the list of tabs to the clipboard.
- Save the list of tabs as a text file with a timestamped filename.
- Reopen tabs from a saved file.

## Installation

1. Clone the repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on the "Load unpacked" button and select the directory containing the extension's source code.

## Usage

1. Click on the Tab Lister extension icon in the Chrome toolbar.
2. A popup will appear displaying a list of all open tabs.
3. Use the **Copy to Clipboard** button to copy the list of tabs.
4. Use the **Save as File** button to save the list of tabs as a text file with a timestamped filename.
5. Use the **Reopen Tabs from File** button to open tabs listed in a saved file.

## File Structure

- **.vscode/**
  - `settings.json`: VS Code workspace settings.
- **icons/**: Directory containing icon images for the extension.
  - `copy-icon.png`
  - `copy-icon16.png`
  - `icon16.png`
  - `icon48.png`
  - `icon128.png`
  - `icon445.png`
- `manifest.json`: Configuration file for the Chrome extension. *(Manifest V3)*
- `popup.html`: HTML file for the extension's popup interface.
- `popup.js`: JavaScript file for the popup’s business logic.
- `style.css`: CSS file for styling the popup interface.
- `README.md`: Documentation for the project.
- `TabLister.zip`: Compressed package of the extension source (if needed).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements or bug fixes.

## License

This project is licensed under the MIT License.

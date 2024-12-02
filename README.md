# Tab Lister Extension

Tab Lister is a Chrome extension that lists all open tabs, allows you to copy them to the clipboard, or save them as a file.

## Features

- List all open tabs in the browser.
- Copy the list of tabs to the clipboard.
- Save the list of tabs as a text file.
- Reopen tabs from a saved file.

## Installation

1. Clone the repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on the "Load unpacked" button and select the directory containing the extension's source code.

## Usage

1. Click on the Tab Lister extension icon in the Chrome toolbar.
2. A popup will appear displaying a list of all open tabs.
3. Use the "Copy to Clipboard" button to copy the list of tabs to the clipboard.
4. Use the "Save as File" button to save the list of tabs as a text file.

## File Structure

- `.vscode/`
  - `settings.json`: VS Code settings for the workspace.
- `background.js`: Background script for handling download requests.
- `icons/`: Directory containing icon images for the extension.
- `manifest.json`: Configuration file for the Chrome extension.
- `popup.html`: HTML file for the extension's popup interface.
- `popup.js`: JavaScript file for the extension's popup functionality.
- `README.md`: Documentation file for the project.
- `style.css`: CSS file for styling the popup interface.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

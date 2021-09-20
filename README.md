# Crashacters
![Build & Test](https://github.com/davidreis97/Crashacters/actions/workflows/main.yml/badge.svg)

### Highlights invisible and misleading UTF-8 characters as errors
<br/>

![Example](screenshots/misleadinghyphen1.png)

## Features

Crashacters prevents you from running into those frustrating and hard to debug situations where your parser crashes when processing a certain file because it has a weird character that you copied from somewhere.

You can customize the ranges of Unicode characters that you want the extension to highlight as errors using the extension settings in VSCode. 

If you believe that a certain character should be included in/excluded from the default character ranges, please [open an issue with the tag "default blacklist"](https://github.com/davidreis97/Crashacters/issues/new). Feel free to also send any further suggestions/bug reports.

## Development

- Run `npm install` in the root folder.
- Open VS Code in the root folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open any document.
- Enter blacklisted characters and the extension will highlight them.

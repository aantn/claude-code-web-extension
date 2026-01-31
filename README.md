# Claude Code Sessions Search & Filter

A Chrome extension that adds a search bar and repository filter to the Claude Code web interface for easier session navigation.

## Features

- **Search by title** - Quickly find sessions by typing part of the title
- **Filter by repository** - Dropdown to filter sessions by repo name
- **Keyboard shortcuts**
  - `Ctrl+K` / `Cmd+K` - Focus the search input
  - `Escape` - Clear search and unfocus
- **Real-time filtering** - Results update as you type
- **Auto-updating** - Repository list updates when sessions change

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right corner)
4. Click **Load unpacked**
5. Select the extension folder
6. Navigate to https://claude.ai/code - the search/filter UI will appear in the sidebar

## Usage

The extension adds a search bar and repository dropdown below the "Sessions" header in the sidebar:

- **Search box** - Type to filter sessions by title (case-insensitive)
- **Repo dropdown** - Select a repository to show only sessions from that repo
- Both filters work together - you can search within a specific repo

## Files

```
├── manifest.json   # Chrome extension manifest
├── content.js      # Main content script
├── styles.css      # UI styles matching Claude's design
└── icons/          # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Compatibility

- Chrome/Chromium browsers (Manifest V3)
- Works on https://claude.ai/code pages

## License

MIT

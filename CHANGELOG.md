# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- N/A

## [0.4.0 Alpha] 8-21-2024

### Added

- External terminal
- Internal terminal
  - Shows in bottom panel
- Toggle to switch between external and internal terminal in settings
- Light theme
- Settings for changing editor tab size and line height
- Editor code folding, bracket matching, auto indent, indentation markers
- Detect indentation size on files
- Copy/paste files in file tree
- Autocomplete in the editor
- Notification system

### Changed

- Tab context menu options disabled for new files with no path
- Custom styled scrollbars
- Improved syntax highlighting look

### Fixed

- Text in editor no longer overflows window

## [0.3.0 Alpha] 11-7-2023

### Added

- Logging
  - Logs are located at C:{user}\AppData\Roaming\nucleus\logs
  - If the app crashes, the error outputs to the log file
  - You can open the log file folder from the editor toolbar menu under "Help"
- Syntax Highlighting
- Handling of opening a binary file or unsupported file type. Now shows prompt in editor view telling you so
- Ability to focus on buttons and inputs via Tab
  - Keyboard support for the file tree is not yet included
- App version shows in status bar
- File tree opens when new folder loads
- Create folder/file in root file context menu
- File encoding support
  - Supports major encodings

### Fixed

- Renaming/creating a file with an invalid name should no longer create an empty file in the editor
- Can no longer create files and folders that already exist
- Having a large tab list no longer causes overflow in the window
- Can no longer move files/folders into itself
- Opening the context menu on the file no longer freezes file tree/node
- File language returns correct value in the status bar after saving
- Open tabs update path properly after parent folder is renamed
- Context menu options (Open in Explorer, Rename) for a new tab with no path disabled
- Close tab context item works as intended

### Changed

- Removed extra input box in Rename modal
- Autocomplete box disabled in input fields
- Tabs info update on change file
- Improved performance of the file watcher
- UI Changes
  - Tab list no longer overflows window

## [0.2.1 Alpha] 7-16-2023

### Added

-  Nucleus icons. Should now show the correct app icon
-  Added progress bar for file loading
   -  Timeouts if directory loading takes too long
  
### Fixed

- font family not updating after opening a new editor tab ([#91](https://github.com/mellobacon/Nucleus/issues/91))
- Going fullscreen (f11) disables maximizing while you are in fullscreen mode ([#92](https://github.com/mellobacon/Nucleus/issues/92))

### Changed

- Filetree no longer expanded by default
- Disabled maximize when fullscreen

## [0.2.0 Alpha] 7-14-2023

### Added

- Working functions to (most) the header menus
- Shortcuts ([#77](https://github.com/mellobacon/Nucleus/issues/77))
- Settings file (points to C:/Users/USERNAME/AppData/Local/nucleus)
- Settings tab ([#78](https://github.com/mellobacon/Nucleus/issues/78))
- Tab close buttons more visible on hover ([#80](https://github.com/mellobacon/Nucleus/issues/80))
- Tabs no longer drag when attempting to close it ([#80](https://github.com/mellobacon/Nucleus/issues/80))
- A loading bar when opening directories ([#86](https://github.com/mellobacon/Nucleus/issues/86))
  - If loading a directory takes too long, it will timeout to prevent app crashing
- Added modals for creating and renaming files and folders
- Unsaved files prompts save dialog on close
- Added "Close Tab" and Minimize/Maximize window buttons to toolbar
- Shortcuts
- File Watcher
  - Watches for changes in files outside the editor and updates accordingly

### Fixed

- Dropdown menu put in proper positions
- Disabled dragging on root folder

### Changed

- Removed toggle dev tools option
- UI improvements
  - changed editor text color to be less bright
  - Improved look of context and dropdown menus
  - Added background color to selected tree node

## [0.1.0 Alpha] 6-27-2023

### Added

- Initial release
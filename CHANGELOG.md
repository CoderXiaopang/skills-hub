# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2026-03-06

### Added
- **Skill Preview**: View SKILL.md content with built-in markdown viewer
- **AI-Powered Translation**: Translate skill documentation to Chinese using OpenAI-compatible LLM APIs
  - Support for any OpenAI-compatible API endpoint
  - Connection testing before use
  - Content length warnings for long documents
  - Option to replace original file or keep both versions
  - 120-second timeout for translation operations
- **Custom Skill Notes**: Add personalized remarks/notes directly on skill cards for better organization
  - Inline editing with click-to-edit interface
  - Auto-save on Enter/blur, ESC to cancel
  - Persistent storage in localStorage
  - 60-character limit with visual feedback
- **Drag & Drop Support**: Drag and drop local folders directly to add skills
  - Visual feedback during drag operation
  - Automatic path extraction from dropped files
  - Works seamlessly with existing browse button
- **LLM Configuration**: Comprehensive settings for AI translation
  - Base URL, API Key, and Model configuration
  - Connection testing with latency display
  - Detailed error messages for troubleshooting
  - Support for all OpenAI-compatible APIs (GPT-4, Claude, DeepSeek, etc.)
- **Enhanced UI/UX**:
  - Professional README with bilingual support (English/Chinese)
  - Improved modal designs with better visual hierarchy
  - Better error messaging throughout the application
  - Scrollable settings page with proper overflow handling

### Changed
- Updated README to professional format with comprehensive documentation
- Improved skill card layout with inline remark editing
- Enhanced preview modal with translation capabilities
- Better visual feedback for all user interactions

### Fixed
- Settings page scroll overflow issue
- Translation timeout handling for long documents
- Preview modal error display improvements

### Technical
- Added `read_skill_md` and `write_skill_md` Rust commands for file operations
- Enhanced i18n resources with new translation keys
- Improved CSS organization with new component styles
- Better state management for remarks and LLM configuration

## [0.2.0] - 2026-02-01

### Added
- **Windows platform support**: Full support for Windows build and release (thanks @jrtxio [PR#6](https://github.com/qufei1993/skills-hub/pull/6)).
- Support and display for many new tools (e.g., Kimi Code CLI, Augment, OpenClaw, Cline, CodeBuddy, Command Code, Continue, Crush, Junie, iFlow CLI, Kiro CLI, Kode, MCPJam, Mistral Vibe, Mux, OpenClaude IDE, OpenHands, Pi, Qoder, Qwen Code, Trae/Trae CN, Zencoder, Neovate, Pochi, AdaL).
- UI confirmation and linked selection for tools that share the same global skills directory.
- Local import multi-skill discovery aligned with Git rules, with a selection list and invalid-item reasons.
- New local import commands for listing candidates and installing a selected subpath with SKILL.md validation.

### Changed
- Antigravity global skills directory updated to `~/.gemini/antigravity/global_skills`.
- OpenCode global skills directory corrected to `~/.config/opencode/skills`.
- Tool status now includes `skills_dir`; frontend tool list/sync is driven by backend data and deduped by directory.
- Sync/unsync now updates records across tools sharing a skills directory to avoid duplicate filesystem work and inconsistent state.
- Local import flow now scans candidates first; single valid candidate installs directly, multi-candidate opens selection.

## [0.1.1] - 2026-01-26

### Changed
- GitHub Actions release workflow for macOS packaging and uploading `updater.json` (`.github/workflows/release.yml`).
- Cursor sync now always uses directory copy due to Cursor not following symlinks when discovering skills: https://forum.cursor.com/t/cursor-doesnt-follow-symlinks-to-discover-skills/149693/4
- Managed skill update now re-syncs copy-mode targets using copy-only overwrite, and forces Cursor targets to copy to avoid accidental relinking.

## [0.1.0] - 2026-01-25

### Added
- Initial release of Skills Hub desktop app (Tauri + React).
- Central repository for Skills; sync to multiple AI coding tools (symlink/junction preferred, copy fallback).
- Local import from folders.
- Git import via repository URL or folder URL (`/tree/<branch>/<path>`), with multi-skill selection and batch install.
- Sync and update: copy-mode targets can be refreshed; managed skills can be updated from source.
- Migration intake: scan existing tool directories, import into central repo, and one‑click sync.
- New tool detection and optional sync.
- Basic settings: storage path, language, and theme.
- Git cache with cleanup (days) and freshness window (seconds).

### Build & Release
- Local packaging scripts for macOS (dmg), Windows (msi/nsis), Linux (deb/appimage).
- GitHub Actions build validation and tag-based draft releases (release notes pulled from `CHANGELOG.md`).

### Performance
- Git import and batch install optimizations: cached clones reduce repeated fetches; timeouts and non‑interactive git improve stability.

<div align="center">

<img src="docs/assets/logo.png" alt="Skills Hub Logo" width="120" height="120">

# Skills Hub

### Unified AI Skills Management Platform

[![Release](https://img.shields.io/github/v/release/CoderXiaopang/skills-hub?include_prereleases&label=Release)](https://github.com/CoderXiaopang/skills-hub/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/CoderXiaopang/skills-hub)
[![CI](https://github.com/CoderXiaopang/skills-hub/workflows/CI/badge.svg)](https://github.com/CoderXiaopang/skills-hub/actions)

**[English](#english)** | **[中文](#中文)**

</div>

---

## English

### 🎯 Overview

**Skills Hub** is a powerful cross-platform desktop application built with **Tauri** and **React** that revolutionizes how you manage AI agent skills across multiple coding tools. Install once, sync everywhere.

Tired of managing the same skills across different AI coding assistants? Skills Hub provides a centralized solution to manage, preview, translate, and synchronize your agent skills to all your favorite tools with a single click.

### ✨ Key Features

#### 🎨 **Unified Management Dashboard**
- **Visual Control Center**: Modern, intuitive interface for managing all your AI skills
- **Real-time Status Monitoring**: See which skills are active across all your tools at a glance
- **Smart Search & Filter**: Quickly find skills with fuzzy search and intelligent filtering

#### 🔄 **Intelligent Synchronization**
- **One-Click Sync**: Deploy skills to multiple tools simultaneously
- **Smart Sync Modes**: Automatic symlink/junction preference with copy fallback
- **Selective Tool Sync**: Choose exactly which tools receive each skill
- **Auto-Detection**: Automatically detects newly installed AI coding tools

#### 📦 **Flexible Import Options**
- **Local Folder Import**: Drag & drop or browse to add skills from your filesystem
- **Git Repository Integration**: Import skills directly from GitHub/GitLab repositories
- **Multi-Skill Detection**: Automatically detects and imports multiple skills from a single source
- **Smart Migration**: Scan existing skills in installed tools and migrate to centralized management

#### 🌐 **AI-Powered Translation**
- **Automatic Translation**: Translate skill documentation to Chinese using OpenAI-compatible LLMs
- **Preview Before Translate**: Review content before translation with built-in markdown viewer
- **Replace or Keep**: Choose to replace original or keep both versions
- **Connection Testing**: Verify LLM API configuration before use

#### 📝 **Enhanced Skill Management**
- **Live Preview**: View skill documentation (SKILL.md) with markdown rendering
- **Custom Notes**: Add personalized remarks/notes to skills for better organization
- **Update Propagation**: One-click update from source, automatically syncs to all tools
- **Version Control**: Track skill updates with timestamps

#### 🎨 **Modern User Experience**
- **Dark/Light Themes**: Automatic theme detection with manual override
- **Responsive Design**: Optimized for all screen sizes
- **Drag & Drop Support**: Intuitive file operations
- **Multi-language**: Full i18n support (English/Chinese)
- **Auto-Updates**: Built-in update checker with one-click install

### 🛠️ Supported AI Coding Tools

Skills Hub supports **40+ AI coding assistants**, including:

| Popular Tools | More Tools |
|--------------|-----------|
| **Claude Code** • **Cursor** • **Continue** | **Windsurf** • **Codex** • **OpenCode** |
| **GitHub Copilot** • **Cline** • **Augment** | **Goose** • **Roo Code** • **Kilo Code** |
| **OpenHands** • **CodeBuddy** • **Crush** | **Qwen Code** • **Gemini CLI** • **Antigravity** |

<details>
<summary><b>View Full Tool List</b></summary>

- Claude Code
- Cursor
- Codex
- OpenCode
- Antigravity
- Amp
- Kimi Code CLI
- Augment
- OpenClaw
- Cline
- CodeBuddy
- Command Code
- Continue
- Crush
- Junie
- iFlow CLI
- Kiro CLI
- Kode
- MCPJam
- Mistral Vibe
- Mux
- OpenClaude IDE
- OpenHands
- Pi
- Qoder
- Qwen Code
- Trae
- Trae CN
- Zencoder
- Neovate
- Pochi
- AdaL
- Kilo Code
- Roo Code
- Goose
- Gemini CLI
- GitHub Copilot
- Clawdbot
- Droid
- Windsurf

</details>

### 📸 Screenshots

<div align="center">
<img src="docs/assets/home-example.png" alt="Skills Hub Dashboard" width="800">
<p><i>Clean and intuitive dashboard for managing all your AI skills</i></p>
</div>

### 🚀 Quick Start

#### Installation

**macOS**
```bash
# Download from releases
# Or use Homebrew (coming soon)
```

**Windows**
```bash
# Download installer from releases
```

**Linux**
```bash
# Download AppImage/deb from releases
```

#### First-Time Setup

1. **Launch Skills Hub**
2. **Scan Existing Tools**: Click "Scan now" to detect installed AI coding tools
3. **Import Existing Skills**: Review and import skills from detected tools
4. **Configure LLM** (Optional): Go to Settings → AI Translation to set up OpenAI-compatible API for translation features

### 💻 Development

#### Prerequisites

- **Node.js** 18+ (Recommended: 20+)
- **Rust** (stable toolchain)
- **Tauri Prerequisites**: Follow [Tauri Prerequisites Guide](https://v2.tauri.app/start/prerequisites/)

#### Setup

```bash
# Clone the repository
git clone https://github.com/CoderXiaopang/skills-hub.git
cd skills-hub

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev
```

#### Build

```bash
# Run full quality checks
npm run check

# Build for production
npm run tauri:build
```

#### Platform-Specific Builds

```bash
# macOS
npm run tauri:build:mac:dmg              # Intel/Apple Silicon
npm run tauri:build:mac:universal:dmg    # Universal binary

# Windows
npm run tauri:build:win:exe              # NSIS installer
npm run tauri:build:win:msi              # MSI installer
npm run tauri:build:win:all              # Both

# Linux
npm run tauri:build:linux:deb            # Debian package
npm run tauri:build:linux:appimage       # AppImage
npm run tauri:build:linux:all            # Both
```

### 📚 Documentation

- **System Design**: [docs/system-design.md](docs/system-design.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Security Policy**: [SECURITY.md](SECURITY.md)

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) - The next-generation desktop framework
- UI powered by [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

### 📮 Support

- **Issues**: [GitHub Issues](https://github.com/CoderXiaopang/skills-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CoderXiaopang/skills-hub/discussions)

---

## 中文

### 🎯 项目简介

**Skills Hub** 是一款功能强大的跨平台桌面应用程序，基于 **Tauri** 和 **React** 构建，彻底改变了您在多个编码工具中管理 AI 代理技能的方式。一次安装，处处同步。

厌倦了在不同的 AI 编码助手中管理相同的技能？Skills Hub 提供了一个集中式解决方案，让您可以通过单击来管理、预览、翻译和同步代理技能到所有喜爱的工具。

### ✨ 核心功能

#### 🎨 **统一管理仪表板**
- **可视化控制中心**：现代化、直观的界面管理所有 AI 技能
- **实时状态监控**：一目了然地查看哪些技能在所有工具中处于活动状态
- **智能搜索与过滤**：快速找到技能，支持模糊搜索和智能过滤

#### 🔄 **智能同步**
- **一键同步**：同时将技能部署到多个工具
- **智能同步模式**：自动优先使用符号链接/junction，回退到复制
- **选择性工具同步**：精确选择哪些工具接收每个技能
- **自动检测**：自动检测新安装的 AI 编码工具

#### 📦 **灵活的导入选项**
- **本地文件夹导入**：拖放或浏览从文件系统添加技能
- **Git 仓库集成**：直接从 GitHub/GitLab 仓库导入技能
- **多技能检测**：自动检测并从单个源导入多个技能
- **智能迁移**：扫描已安装工具中的现有技能并迁移到集中管理

#### 🌐 **AI 驱动的翻译**
- **自动翻译**：使用 OpenAI 兼容的 LLM 将技能文档翻译成中文
- **翻译前预览**：使用内置 markdown 查看器在翻译前查看内容
- **替换或保留**：选择替换原文或保留两个版本
- **连接测试**：使用前验证 LLM API 配置

#### 📝 **增强的技能管理**
- **实时预览**：使用 markdown 渲染查看技能文档 (SKILL.md)
- **自定义备注**：为技能添加个性化备注/笔记以便更好地组织
- **更新传播**：一键从源更新，自动同步到所有工具
- **版本控制**：使用时间戳跟踪技能更新

#### 🎨 **现代化用户体验**
- **深色/浅色主题**：自动主题检测，支持手动覆盖
- **响应式设计**：针对所有屏幕尺寸优化
- **拖放支持**：直观的文件操作
- **多语言**：完整的国际化支持（英文/中文）
- **自动更新**：内置更新检查器，一键安装

### 🛠️ 支持的 AI 编码工具

Skills Hub 支持 **40+ AI 编码助手**，包括：

| 热门工具 | 更多工具 |
|---------|---------|
| **Claude Code** • **Cursor** • **Continue** | **Windsurf** • **Codex** • **OpenCode** |
| **GitHub Copilot** • **Cline** • **Augment** | **Goose** • **Roo Code** • **Kilo Code** |
| **OpenHands** • **CodeBuddy** • **Crush** | **Qwen Code** • **Gemini CLI** • **Antigravity** |

<details>
<summary><b>查看完整工具列表</b></summary>

- Claude Code（Claude 代码）
- Cursor
- Codex
- OpenCode
- Antigravity（反重力）
- Amp
- Kimi Code CLI（Kimi 代码 CLI）
- Augment
- OpenClaw
- Cline
- CodeBuddy
- Command Code
- Continue
- Crush
- Junie
- iFlow CLI
- Kiro CLI
- Kode
- MCPJam
- Mistral Vibe
- Mux
- OpenClaude IDE
- OpenHands
- Pi
- Qoder
- Qwen Code（通义千问代码）
- Trae
- Trae CN
- Zencoder
- Neovate
- Pochi
- AdaL
- Kilo Code
- Roo Code
- Goose
- Gemini CLI
- GitHub Copilot
- Clawdbot
- Droid
- Windsurf

</details>

### 📸 应用截图

<div align="center">
<img src="docs/assets/home-example.png" alt="Skills Hub 仪表板" width="800">
<p><i>简洁直观的仪表板，管理所有 AI 技能</i></p>
</div>

### 🚀 快速开始

#### 安装

**macOS**
```bash
# 从 releases 下载
# 或使用 Homebrew（即将推出）
```

**Windows**
```bash
# 从 releases 下载安装程序
```

**Linux**
```bash
# 从 releases 下载 AppImage/deb
```

#### 首次设置

1. **启动 Skills Hub**
2. **扫描现有工具**：点击"立即扫描"检测已安装的 AI 编码工具
3. **导入现有技能**：查看并从检测到的工具导入技能
4. **配置 LLM**（可选）：进入设置 → AI 翻译，设置 OpenAI 兼容 API 以使用翻译功能

### 💻 开发

#### 前置要求

- **Node.js** 18+（推荐：20+）
- **Rust**（稳定工具链）
- **Tauri 前置条件**：遵循 [Tauri 前置条件指南](https://v2.tauri.app/start/prerequisites/)

#### 设置

```bash
# 克隆仓库
git clone https://github.com/CoderXiaopang/skills-hub.git
cd skills-hub

# 安装依赖
npm install

# 在开发模式下运行
npm run tauri:dev
```

#### 构建

```bash
# 运行完整质量检查
npm run check

# 生产构建
npm run tauri:build
```

#### 平台特定构建

```bash
# macOS
npm run tauri:build:mac:dmg              # Intel/Apple Silicon
npm run tauri:build:mac:universal:dmg    # 通用二进制

# Windows
npm run tauri:build:win:exe              # NSIS 安装程序
npm run tauri:build:win:msi              # MSI 安装程序
npm run tauri:build:win:all              # 两者都生成

# Linux
npm run tauri:build:linux:deb            # Debian 包
npm run tauri:build:linux:appimage       # AppImage
npm run tauri:build:linux:all            # 两者都生成
```

### 📚 文档

- **系统设计**：[docs/system-design.zh.md](docs/system-design.zh.md)
- **贡献指南**：[CONTRIBUTING.md](CONTRIBUTING.md)
- **行为准则**：[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **安全策略**：[SECURITY.md](SECURITY.md)

### 🤝 贡献

我们欢迎贡献！详情请参阅我们的[贡献指南](CONTRIBUTING.md)。

### 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

### 🙏 致谢

- 使用 [Tauri](https://tauri.app/) 构建 - 下一代桌面框架
- UI 由 [React](https://react.dev/) 和 [Tailwind CSS](https://tailwindcss.com/) 驱动
- 图标来自 [Lucide](https://lucide.dev/)

### 📮 支持

- **问题反馈**：[GitHub Issues](https://github.com/CoderXiaopang/skills-hub/issues)
- **讨论**：[GitHub Discussions](https://github.com/CoderXiaopang/skills-hub/discussions)

---

<div align="center">

**Made with ❤️ by the Skills Hub Team**

**[⬆ Back to Top](#skills-hub)**

</div>

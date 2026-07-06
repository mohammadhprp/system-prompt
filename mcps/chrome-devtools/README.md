# Chrome DevTools MCP

## Overview

Chrome DevTools MCP lets coding agents control and inspect a live Chrome browser. It acts as an MCP server giving AI assistants access to the full power of Chrome DevTools for reliable automation, in-depth debugging, and performance analysis.

Official source:

- [GitHub: ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)

## Features

- **Performance insights**: Record traces and extract actionable performance insights using Chrome DevTools.
- **Advanced browser debugging**: Analyze network requests, take screenshots, and check browser console messages with source-mapped stack traces.
- **Reliable automation**: Uses Puppeteer to automate actions in Chrome and automatically wait for action results.
- **Memory debugging**: Take heap snapshots, compare them, analyze retainers, dominators, and duplicate strings.
- **Lighthouse audits**: Run accessibility, performance, SEO, and best-practice audits.
- **Slim mode**: Minimal toolset for basic browsing tasks (3 tools).

## Supported AI Clients

Chrome DevTools MCP officially documents setup for Antigravity, Claude Code, Cline, Codex, Command Code, Copilot, Cursor, Factory, Gemini, JetBrains, Kiro, Katalon Studio, Mistral Vibe, OpenCode, Qoder, Visual Studio, Warp, and Windsurf.

- OpenCode

## When to Use

Use Chrome DevTools MCP when an AI coding agent needs to inspect, debug, or automate a live browser.

Good fits:

- Debugging runtime errors and console messages with stack traces.
- Analyzing network requests and performance traces.
- Taking screenshots and snapshots of pages.
- Running Lighthouse audits for performance, accessibility, and SEO.
- Automating browser interactions (click, fill forms, navigate).
- Memory analysis with heap snapshots.

Avoid using it when no browser interaction is needed.

## Requirements

- Node.js LTS version.
- Google Chrome (stable or newer) or Chrome for Testing.
- npm available on `PATH`.

## Related Skills

Relevant skills in this repository:

- [`debugging`](../../skills/debugging/SKILL.md): diagnosing runtime errors, console messages, and network issues.
- [`performance`](../../skills/performance/SKILL.md): analyzing performance traces and Lighthouse results.
- [`testing`](../../skills/testing/SKILL.md): browser automation and visual regression checks.
- [`security`](../../skills/security/SKILL.md): inspecting network requests and console warnings.
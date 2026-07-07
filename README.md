# system-prompt

A bootstrap CLI for installing the AI Coding Agent Framework into any project.

## Prerequisites

- **Node.js >= 18**

## Quick Start

```sh
git clone <repo-url>
cd system-prompt
npm install
npm link
system-prompt
```

The CLI walks you through selecting which skills, agents, commands, MCPs, and references to install, then wires everything into your project's `.opencode/` directory.

## Project Structure

```
├── bin/system-prompt.js   CLI entry point
├── src/                   CLI source code
│   ├── cli.js             Interactive prompt flow
│   ├── installer.js       File copy and config generation
│   ├── catalog.js         Catalog data for all framework components
│   └── agent-configs.js   OpenCode config generator
├── framework/             AI Coding Agent Framework content
│   ├── agents/            Subagent definitions
│   ├── commands/          Slash command workflows
│   ├── skills/            Task-specific procedures
│   ├── mcps/              MCP server catalog
│   ├── plugins/           Plugin catalog
│   ├── styles/            Design system references
│   ├── references/        Standards and templates
│   └── harness/           Self-configuration harnesses
├── package.json
├── AGENTS.md
└── README.md
```

## Development

```sh
npm run <script>      # if scripts exist
node src/cli.js       # run CLI directly
node --check src/     # syntax check all files
```

## License

[MIT](LICENSE)

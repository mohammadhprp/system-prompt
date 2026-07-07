# System prompt 

A CLI for installing the **AI Coding Agent Framework** into any project.

## Prerequisites

- **Node.js >= 18**

## Quick Start

### Install

```sh
npm install -g @mohammadhprp/system-prompt
```

### Authenticate (GitHub Packages)

```sh
export GITHUB_TOKEN=<your-github-personal-access-token>
```

Your `~/.npmrc` should contain:

```ini
@mohammadhprp:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Run

```sh
system-prompt
```

The CLI walks you through selecting which skills, agents, commands, MCPs, and references to install, then wires everything into your project directory.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md). Contributions should improve clarity, correctness, and operational usefulness. Avoid duplicating guidance that belongs in standards.

## License

[MIT](LICENSE)

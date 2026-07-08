# Quicklyzer

> Understand any codebase in seconds.

Quicklyzer is a fast, lightweight CLI that instantly analyzes software projects and provides useful insights about their structure, environment, dependencies, repository, and project statistics.

Whether you've just cloned a GitHub repository or started working on a new project, Quicklyzer helps you understand what's inside with a single command.

---

## Features

### Project Information

* Project name
* Project version
* Package manager detection
* Language detection

### Environment Detection

* Framework detection
* Framework version detection
* Build tool detection
* Build tool version detection
* Required Node.js version
* Docker detection
* CI/CD detection
* ESLint detection
* Prettier detection
* Monorepo detection

### Dependencies

* Dependency count
* Dev dependency count
* Total packages

### Scripts

Displays all available npm scripts.

### Project Statistics

* Total files
* Source files
* Directory count
* Largest directory
* Lines of code (LOC)
* Largest source file
* Empty directories
* Hidden files
* Project size
* Scan duration

### Repository

* Git repository detection
* README detection
* LICENSE detection

---

# Installation

## Using npm

```bash
npm install -g quicklyzer
```

---

# Usage

Analyze the current project:

```bash
quicklyzer scan
```

Show version:

```bash
quicklyzer version
```

About Quicklyzer:

```bash
quicklyzer about
```

---

# Example Output

```text
QUICKLYZER
====================================

Project
────────────────────────────
Name              : quicklyzer
Version           : 0.0.5

Environment
────────────────────────────
Package Manager   : npm
Language          : TypeScript
Framework         : Unknown
Framework Version : Unknown
Build Tool        : Unknown
Build Tool Version: Unknown
Node.js Required  : >=20
Docker            : No
CI/CD             : None
ESLint            : No
Prettier          : No
Monorepo          : No

Dependencies
────────────────────────────
Dependencies      : 4
Dev Dependencies  : 4
Total Packages    : 8

Scripts
────────────────────────────
 dev
 build
 prepublishOnly
 start
 test

Project Statistics
────────────────────────────
Total Files       : 38
Source Files      : 18
Directories       : 7
Largest Directory : src (10 files)
Lines of Code     : 1,327
Largest File      : project.ts (391 lines)
Empty Directories : 0
Hidden Files      : 2
Project Size      : 156.4 KB
Scan Time         : 14.63 ms

Repository
────────────────────────────
Git               : Yes
README            : Yes
LICENSE           : Yes
```

---

# Requirements

* Node.js 20 or later

---

# Roadmap

## v0.0.1

* CLI foundation

## v0.0.2

* Project analysis
* Version command
* About command
* Scan command

## v0.0.3

* Git detection
* README detection
* LICENSE detection

## v0.0.4

* Framework detection
* Build tool detection
* Dependency statistics
* Script detection
* Environment intelligence

## v0.0.5

* Project statistics
* Lines of code
* Largest file
* Largest directory
* Project size
* Hidden files
* Scan duration

## Upcoming

* Project structure visualization
* Entry point detection
* Configuration file detection
* Technology summary
* Project health analysis

---

# Contributing

Contributions, issues, and feature requests are welcome.

If you have ideas to improve Quicklyzer, feel free to open an issue or submit a pull request.

---

# License

MIT License

---

**A Sabtain Ali production**

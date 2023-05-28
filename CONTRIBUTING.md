# Contributing

Before you get started, please note the following:

This project was made with [Tauri](https://tauri.app/) and was built with...

- [Svelte](https://svelte.dev/) (Frontend)
- [Rust](https://www.rust-lang.org/) (Backend)
- [TypeScript](https://www.typescriptlang.org/)

...and these build dependencies...

- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org)

Note that yarn is the package manager I've decided to use for this project and it's what I have Tauri rely on for building the app at the moment. If you want to use another package manager like npm, you can but you'll just need to change yarn to npm in the [tauri config](https://github.com/mellobacon/Nucleus/blob/master/src-tauri/tauri.conf.json) and for any command in these instructions that uses yarn.

## Submitting Issues

If you found a bug, [submit a bug report](https://github.com/mellobacon/Nucleus/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D). If you want to discuss a feature you would like to see added, [submit a feature request](https://github.com/mellobacon/Nucleus/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D).

When writing your issue, don't delete the template. You can fill it out and delete parts that do not apply, but don't delete the whole thing. It's there as a guideline and makes it easier for me to understand your request.

## Submitting PRs

If you want to contribute to Nucleus via code, doc edits, or otherwise make a pull request. Note that only PRs to the `dev` branch will be reviewed.

- When making commits, please follow the Conventional Commits guildines outlined [here](https://www.conventionalcommits.org/en/v1.0.0/#specification). 
- Your commits must be [signed](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits).

- Do not submit a pull request that contains major changes unless an issue has been opened for it first. This way it can be discussed. Any PR that is submitted without an issue being open on it will not be accepted.

**Note**: Any issue or pull request that contains spam or trolling will be marked as such and closed. Don't do it.

**Note 2:** Keep in mind I am one person. *Do not beg me to look at your issue or PR.* I will get to it when I get to it. No PR is guarenteed to be merged. As life happens activity will fluctuate but that does not mean this project is abandoned. If this project is no longer being worked on I will say so. 

___

## Development Guide

Note: Right now only Windows is supported

### Prerequisites

- Rust
- Node 16+
- TypeScript
- Yarn/Npm

Follow these instructions for installing the prerequisites on Windows:

1. Download and install [Build Tools for Visual Studio 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. If you dont have it already, download and install [webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)
3. Download and install Rust via `winget` or get it from [here](https://www.rust-lang.org/tools/install).

```shell
winget install --id Rustlang.Rustup
```

4. Download and install [nodejs](https://nodejs.org/en/)  

5. Install yarn

```shell
npm i -g yarn
```

6. Install [git](https://git-scm.com/download/win)

## Project Setup

Clone the repo via...

```bash
gh repo clone mellobacon/Nucleus
```

or

```bash
git clone https://github.com/mellobacon/Nucleus.git
```

If you want to clone from within your editor, copy ```https://github.com/mellobacon/Nucleus.git``` and follow the instructions for cloning a repo for your editor. Alternatively you can [download the zip file](https://github.com/mellobacon/Nucleus/archive/refs/heads/master.zip).

Navigate to the project...

```bash
cd Nucleus
```

Finally install the packages...

```bash
yarn install # Packages are listed in the package.json
```

and build the files...

```bash
yarn build
```

This will bundle the scripts, css, and other required project files to be run later.

___

## Running Nucleus

With Nucleus set up, follow this guide to run the development environment.

Once you have the project built, you can run it via a desktop window.

### To run via a desktop window...

```bash
yarn tauri dev
```

(*Note on building for desktop: Make sure you have these [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) as well as [the Tauri CLI](https://tauri.app/v1/guides/getting-started/tauri-cli)*.)
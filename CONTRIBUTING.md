# Contributing

Before you get started, please note the following:

This project was made with [Tauri](https://tauri.app/) and was built with...
- [Svelte](https://svelte.dev/) (Frontend)
- [Rust](https://www.rust-lang.org/) (Backend)
- [TypeScript](https://www.typescriptlang.org/)

...and these build dependencies...
- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org)

Note that yarn is the package manager I've decided to use for this project and it's what I have Tauri rely on for building the app at the moment. If you want to use another package manager like npm, you can but youll just need to change yarn to npm in the [tauri config](https://github.com/mellobacon/Nucleus/blob/master/src-tauri/tauri.conf.json) and for any command in these instructions that uses yarn.

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

## Running Nucleus

Once you have the project open, you can run it via a desktop window or alternatively on a browser window*.

\**Nucleus is meant to be run on a desktop window; though it can load and run in a browser*

### To run via a desktop window...

(*Note on building for desktop: Make sure you have these [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) as well as [the Tauri CLI](https://tauri.app/v1/guides/getting-started/tauri-cli)*.)
```bash
yarn tauri dev
```

### To run via browser...

```bash
yarn build
yarn start
```

Navigate to [localhost:8080](http://localhost:8080). You should see the app running in the browser.

## Compiling Nucleus

To create an executable file...
```bash
yarn tauri build
```
(*Note: this is for building a single executable for your current OS. To build for other operating systems, read [how to build a Tauri app](https://tauri.app/v1/guides/building/).*)
___

## Submitting Issues

If you found a bug, [submit a bug report](https://github.com/mellobacon/Nucleus/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D). If you want to discuss a feature you would like to see added, [submit a feature request](https://github.com/mellobacon/Nucleus/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D).

***Do not*** submit a pull request that contains major changes unless an issue has been opened for it first. This way it can be discussed. 

Also, when writing your issue, don't delete the issue template. You can fill it out and delete parts that do not apply, but don't delete the whole thing. It's there as a guideline and makes it easier for me to understand your request.

**Note**: Any issue or pull request that contains spam or trolling will be marked as such and closed. Don't do it.


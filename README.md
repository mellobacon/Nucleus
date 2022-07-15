<h1 align="center" style="position: relative;">
  <img width="200" src="./public/assets/images/Icon(1).png" alt="The nucleus icon" /><br>
  Nucleus
</h1>
<h3 align="center">A text editor with better UI than [enter funny thing here]</h3>
<p align="center">
  License •
  Download
</p>

### Known issues
- TBA

**This project is a WIP. Bugs and missing or incomplete features will be present**

## Installation
*TBA*

## Building for development
This is for those that want to contribute or build on their local machines. If you want to install without building, follow the steps in Installation.

---
This project was made with [Tauri](https://tauri.app/) and was built with...
- [Svelte](https://svelte.dev/) (Frontend)
- [Rust](https://www.rust-lang.org/) (Backend)
- [TypeScript](https://www.typescriptlang.org/)

...and these build dependencies...
- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org)

Clone the repo via...
```bash
gh repo clone mellobacon/Nucleus
```
or
```bash
git clone https://github.com/mellobacon/Nucleus.git
```

If you want to clone from within your editor, copy ```https://github.com/mellobacon/Nucleus.git``` and follow the instructions for cloning a repo for your editor. Alternatively you can [download the zip file](https://github.com/mellobacon/Nucleus/archive/refs/heads/master.zip).

Install the dependencies...

```bash
cd Nucleus
yarn install
```

### To run via browser...

```bash
yarn build
yarn start
```

Navigate to [localhost:8080](http://localhost:8080). You should see the app running in the browser.

### To run via a desktop window...

(*Note on building for desktop: Make sure you have these [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) as well as [the Tauri CLI](https://tauri.app/v1/guides/getting-started/tauri-cli)*.)
```bash
yarn tauri dev
```

## Building

To create an executable version of the app:

```bash
yarn tauri build
```
(*Note: this is for building a single executable for your current OS. To build for other operating systems, read [how to build a Tauri app](https://tauri.app/v1/guides/building/).*)
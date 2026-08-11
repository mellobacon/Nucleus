import { FitAddon } from "@xterm/addon-fit";
import { SerializeAddon } from "@xterm/addon-serialize";
import { Terminal, type ITerminalInitOnlyOptions, type ITerminalOptions } from "@xterm/xterm";
import { ImageAddon, type IImageAddonOptions } from '@xterm/addon-image';
import { terminalTheme } from "../lib/components/Terminal.svelte";
import { LigaturesAddon } from '@xterm/addon-ligatures';
import { get } from "svelte/store";

const customSettings: IImageAddonOptions = {
    enableSizeReports: true,    // whether to enable CSI t reports (see below)
    pixelLimit: 16777216,       // max. pixel size of a single image
    sixelSupport: true,         // enable sixel support
    sixelScrolling: true,       // whether to scroll on image output
    sixelPaletteLimit: 256,     // initial sixel palette size
    sixelSizeLimit: 25000000,   // size limit of a single sixel sequence
    storageLimit: 128,          // FIFO storage limit in MB
    showPlaceholder: true,      // whether to show a placeholder for evicted images
    iipSupport: true,           // enable iTerm IIP support
    iipSizeLimit: 20000000      // size limit of a single IIP sequence
}

export class NucleusTerminal {
    terminalElement: HTMLElement;
    options: ITerminalOptions & ITerminalInitOnlyOptions;
    terminalController!: Terminal;
    termFit!: FitAddon;
    termSerialize!: SerializeAddon;
    termImage!: ImageAddon;
    termLigma!: LigaturesAddon;
    command: string = "";
    constructor(element: HTMLElement, options: ITerminalOptions & ITerminalInitOnlyOptions) {
        this.options = options;
        this.terminalElement = element;
        this.termFit = new FitAddon();
        this.termSerialize = new SerializeAddon();
        this.termImage = new ImageAddon(customSettings);
        this.termLigma = new LigaturesAddon();
    }

    async initShell() {
        await Promise.all(Array.from(document.fonts).map(ff => ff.load()));
        this.terminalController = new Terminal(this.options);
        this.terminalController.loadAddon(this.termFit);
        this.terminalController.loadAddon(this.termSerialize);
        this.terminalController.loadAddon(this.termImage);
        this.terminalController.open(this.terminalElement);
        this.terminalController.loadAddon(this.termLigma);

        this.updateTheme();

        this.fitTerminal();

        this.write('\x1b[4h'); // insert mode

        this.terminalController.onData(async e => {
            switch (e) {
                case '\u0003': // Ctrl+C
                    this.write('^C');
                    this.prompt();
                    break;
                case '\r': // Enter
                    await this.processCommand();
                    break;
                case '\u007F': // Backspace (DEL)
                    this.write('\x1b[4l'); // replace mode

                    let inputIndex = this.terminalController.buffer.normal.cursorX - 2;
                    // Do not delete the prompt
                    if (this.terminalController.buffer.normal.cursorX > 2) {
                        this.write('\u001B[D') // Move cursor left
                        this.write('\x1b[P'); // Insert DEL
                        if (this.command.length > 0) {
                            let x = this.command.slice(0, inputIndex - 1);
                            let y = this.command.slice(inputIndex);
                            this.command = x + y;
                        }
                    }
                    this.write('\x1b[4h'); // insert mode
                    break;
                case '\u001B[D': // Left
                    if (this.terminalController.buffer.normal.cursorX > 2) {
                        this.write(e);
                    }
                    break;
                case '\u001B[C': // Right
                    if (this.terminalController.buffer.normal.cursorX < this.command.length + 2) {
                        this.write(e);
                    }
                    break;
                case '\u001B[A': // Up
                    break;
                case '\u001B[B': // Down
                    break;
                default: // Print all other characters for demo
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                        let inputIndex = this.terminalController.buffer.normal.cursorX - 2;
                        this.command = this.command.slice(0, inputIndex) + e + this.command.slice(inputIndex)
                        this.write(e);
                    }
            }
        });

        this.test();
        this.prompt();
    }
    writeln(input: string) {
        this.terminalController.writeln(input);
    }
    write(input: string) {
        this.terminalController.write(input);
    }
    fitTerminal() {
        if (!this.terminalController) return;
        this.termFit.fit();
    }
    prompt() {
        this.write('\r\n$ ');
    }
    private async processCommand() {
        this.command = "";
        this.prompt();
    }
    updateTheme() {
        if (!this.terminalController) return;
        this.terminalController.options.theme = get(terminalTheme);
    }
    test() {
        this.writeln([
            '    Xterm.js is the frontend component that powers many terminals including',
            '                           \x1b[3mVS Code\x1b[0m, \x1b[3mHyper\x1b[0m and \x1b[3mTheia\x1b[0m!',
            '',
            ' ┌ \x1b[1mFeatures\x1b[0m ──────────────────────────────────────────────────────────────────┐',
            ' │                                                                            │',
            ' │  \x1b[31;1mApps just work                         \x1b[32mPerformance\x1b[0m                        │',
            ' │   Xterm.js works with most terminal      Xterm.js is fast and includes an  │',
            ' │   apps like bash, vim and tmux           optional \x1b[3mWebGL renderer\x1b[0m           │',
            ' │                                                                            │',
            ' │  \x1b[33;1mAccessible                             \x1b[34mSelf-contained\x1b[0m                     │',
            ' │   A screen reader mode is available      Zero external dependencies        │',
            ' │                                                                            │',
            ' │  \x1b[35;1mUnicode support                        \x1b[36mAnd much more...\x1b[0m                   │',
            ' │   Supports CJK 語 and emoji \u2764\ufe0f            \x1b[3mLinks\x1b[0m, \x1b[3mthemes\x1b[0m, \x1b[3maddons\x1b[0m,            │',
            ' │                                          \x1b[3mtyped API\x1b[0m, \x1b[3mdecorations\x1b[0m            │',
            ' │                                                                            │',
            ' └────────────────────────────────────────────────────────────────────────────┘',
            ''
        ].join('\n\r'));

        this.writeln('Welcome to xterm.js');
        this.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
        this.writeln('Type some keys and commands to play around.');
        this.writeln('');
    }
}

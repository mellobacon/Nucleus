<script lang="ts">
	import "xterm/css/xterm.css";
	import { onMount } from "svelte";
	import {Terminal} from "xterm";
	import {FitAddon} from "xterm-addon-fit";
    import { get, writable } from "svelte/store";
	import { spawn, type IPty } from "tauri-pty";

	let terminalElement: HTMLElement;

	function initializeXterm() {
		initShell(terminalElement);
	}

	onMount(async () => {
		console.log("mount");
		initializeXterm();
	});
</script>
<script lang="ts" context="module">

export const termTheme = writable();
export const termOptions = writable();
let terminalController: Terminal = null;
let termFit = new FitAddon();
let pty: IPty;

export function clearTerminal() {
	terminalController.clear();
	pty.clear();
}

export function closeTerminal() {
	if (pty) pty.kill();
}

export function updateTermTheme() {
	if (!terminalController) return;
	terminalController.options.theme = get(termTheme);
}
export function updateTermOptions() {
	if (!terminalController) return;
	const options: any = get(termOptions);
	terminalController.options.fontFamily = options.fontFamily;
	terminalController.options.fontSize = options.fontSize;
	terminalController.options.lineHeight = options.lineHeight;
	terminalController.options.cursorStyle = options.cursorStyle;
}

export function fitTerminal() {
	if (!terminalController) return;
	termFit.fit();
	pty.resize(terminalController.cols, terminalController.rows);
}

function initShell(terminalElement: HTMLElement) {
	terminalController = new Terminal({
		fontFamily: "Cascadia Mono",
		fontSize: 14,
	});
	updateTermTheme();
	updateTermOptions();
	let dir = localStorage.getItem("lastDir");
	pty = spawn("powershell.exe", [], {
		cols: terminalController.cols,
		rows: terminalController.rows,
		cwd: dir
	})
	terminalController.loadAddon(termFit);
	terminalController.open(terminalElement);
	pty.onData(data => terminalController.write(data));
	terminalController.onData(data => pty.write(data));
}
</script>

<svelte:window on:resize={fitTerminal}></svelte:window>

<div id="terminal" bind:this={terminalElement} />

<style>
	#terminal {
		height: 97.5%;
		width: 100%;
	}
</style>

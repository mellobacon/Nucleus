<script lang="ts">
	import "xterm/css/xterm.css";
	import { onMount } from "svelte";
	import {Terminal} from "xterm";
	import {FitAddon} from "xterm-addon-fit";
	import { invoke } from "@tauri-apps/api";
    import { get, writable } from "svelte/store";
    import { workingDir } from "./File";
    import { getThemeProperty } from "../config/themehandler";

	let terminalElement: HTMLElement;

	function initializeXterm() {
		terminalController.loadAddon(termFit);
		terminalController.open(terminalElement);
		fitTerminal();

		initShell();
		terminalController.onData(writeToPty);

		window.requestAnimationFrame(readFromPty);
	}

	onMount(async () => {
		initializeXterm();
	});
</script>
<script lang="ts" context="module">

export const termTheme = writable();
let terminalController = new Terminal({
	fontFamily: "Cascadia Mono",
	fontSize: 14
});

export function updateTermTheme() {
	terminalController.options.theme = get(termTheme);
}

let termFit = new FitAddon();
export function fitTerminal() {
	termFit.fit();
	void invoke<string>("async_resize_pty", {
		rows: terminalController.rows,
		cols: terminalController.cols,
	});
}
function writeToTerminal(data: string) {
	return new Promise<void>((r) => {
		terminalController.write(data, () => r());
	});
}

function writeToPty(data: string) {
	void invoke("async_write_to_pty", {
		data,
	});
}

function initShell() {
	updateTermTheme();
	invoke("async_create_shell", {path: get(workingDir)}).catch((error) => {
		// on linux it seem to to "Operation not permitted (os error 1)" but it still works because echo $SHELL give /bin/bash
		console.error("Error creating shell:", error);
	});
}
async function readFromPty() {
	const data = await invoke<string>("async_read_from_pty");
	if (data) {
		await writeToTerminal(data);
	}
	window.requestAnimationFrame(readFromPty);
}
</script>

<svelte:window on:resize={fitTerminal}></svelte:window>

<div id="terminal" bind:this={terminalElement} />

<style>
	#terminal {
		height: 100%;
		width: 100%;
	}
</style>
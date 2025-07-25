<script lang="ts">
	import "@xterm/xterm/css/xterm.css";
	import { afterUpdate, onMount } from "svelte";
    import { NucleusTerminal } from "../../scripts/Terminal";
    import { writable, type Writable } from "svelte/store";
    import type { ITheme } from "@xterm/xterm";

	let terminalElement: HTMLElement;
    let terminal: NucleusTerminal;
	export let hidden = false;
    export function getTerminalInstance() {
        return terminal;
    }

	onMount(async () => {
		terminal = new NucleusTerminal(terminalElement, {
            fontFamily: "Cascadia Mono",
            fontSize: 14,
            cursorBlink: true,
            allowProposedApi: true
        })
        terminalInstance.set(terminal);
        terminal.initShell();
	});
    afterUpdate(() => {
        terminal.fitTerminal();
        terminal.updateTheme();
    })
</script>

<script lang="ts" context="module">
    export const terminalInstance: Writable<NucleusTerminal> = writable();
    export const terminalTheme: Writable<ITheme> = writable({});
</script>

<svelte:window on:resize={terminal.fitTerminal}></svelte:window>

<div id="terminal" bind:this={terminalElement} class:hidden />

<style>
	#terminal {
		height: 97.5%;
		width: 100%;
        background-color: var(--terminal-background);
	}
	.hidden {
		display: none;
	}
</style>
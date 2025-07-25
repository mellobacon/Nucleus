import { get, writable } from "svelte/store";

const editorTheme = writable();
const editorKeymap = writable();
const editorAutosave = writable(false);
const editorFontFamily = writable();
const editorFontSize = writable();
const editorLineHeight = writable();
const editorFontLigatures = writable();
const editorShowWhitespace = writable();
const editorShowIndentGuides = writable();
const editorAutoIndent = writable();
const editorIndentConfig = writable();
const editorIndentSize = writable();

export const paneLeft = writable(false);
export const paneRight = writable(false);
export const paneBottom = writable(false);
export const showNewLines = writable(false);
export const showWhiteSpace = writable(false);

export const paneLeftSize = writable(15);
export const paneRightSize = writable(15);
export const paneBottomSize = writable(15);

export function toggleLeftPanel() {
    paneLeft.set(!get(paneLeft));
}
export function toggleBottomPanel() {
    paneBottom.set(!get(paneBottom));
}
export function toggleRightPanel() {
    paneRight.set(!get(paneRight));
}
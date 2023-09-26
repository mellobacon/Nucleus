import "./theme.scss";
import "./global.css";
import App from './App.svelte';
import { attachConsole } from "tauri-plugin-log-api";

attachConsole();

const app = new App({
	target: document.body
});

export default app;
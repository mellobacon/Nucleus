import './app.css'
import 'overlayscrollbars/overlayscrollbars.css';
import "./theme.scss";
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app

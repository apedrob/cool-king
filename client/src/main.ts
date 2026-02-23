import { mount } from "svelte";
import App from "./App.svelte";
import "./styles/tavern.css";
import "./styles/cardDesign.css";

const app = mount(App, { target: document.getElementById("app")! });

export default app;

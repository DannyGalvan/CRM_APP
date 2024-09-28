import "bootstrap-icons/font/bootstrap-icons.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "react-toastify/dist/ReactToastify.css";
import App from "./App.js";
import { api, authorization } from "./config/axios/interceptors.js";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/styles.css";

window.addEventListener("beforeunload", () => {
  api.interceptors.response.eject(authorization);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

serviceWorkerRegistration.register();

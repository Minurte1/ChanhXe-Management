import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider
    clientId={`980511465818-uerpms9v83cjgcbpld0iggdhpvm8eld4.apps.googleusercontent.com`}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";  // Import from 'react-dom/client'
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'select2/dist/js/select2.min.js';
import App from "./App";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./store/store";

// Use ReactDOM.createRoot() instead of ReactDOM.render()
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
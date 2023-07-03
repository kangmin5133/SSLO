import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";
import store, { persistor } from "./redux/store";
import router from "./router";
import { ResetGlobalStyles } from "./globals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById(
  "root"
) as HTMLElement);
const head = document.querySelector("head");
const style = document.createElement("style");
style.innerHTML =
  "@import url('https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css')";
if (head) {
  head.appendChild(style);
}

root.render(
  <HelmetProvider>
    <Helmet>
      {/* <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        /> */}
      <title>SSLO</title>
    </Helmet>
    <ToastContainer position={"top-right"} autoClose={2000} />
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ResetGlobalStyles />
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </HelmetProvider>
);

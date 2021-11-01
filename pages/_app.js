import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { Provider as StoreProvider } from "react-redux";
import { store } from "../store";
import { Provider as SessionProvider } from "next-auth/client";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider store={store}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </StoreProvider>
  );
}

export default MyApp;

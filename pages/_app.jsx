import "../styles/globals.css";
import { UserContextProvider } from "../utils/useUser";
import Head from "next/head";

import Navbar from "components/Navbar";

const MyApp = ({ Component, pageProps }) => {
  return (
    <UserContextProvider>
      <Navbar />
      <Component {...pageProps} />
    </UserContextProvider>
  );
};

export default MyApp;

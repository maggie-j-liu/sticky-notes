import "../styles/globals.css";
import { UserContextProvider } from "../utils/useUser";
import Head from "next/head";

import Navbar from "components/Navbar";

const MyApp = ({ Component, pageProps }) => {
  return (
    <UserContextProvider>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </UserContextProvider>
  );
};

export default MyApp;

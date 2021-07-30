import "../styles/globals.css";
import { UserContextProvider } from "../utils/useUser";

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

import Head from "next/head";
import Image from "next/image";
import useUser from "utils/useUser";
import SignIn from "components/SignIn";

const Home = () => {
  const { user, logout } = useUser();
  if (!user) {
    return <SignIn />;
  }
  return <div></div>;
};

export default Home;

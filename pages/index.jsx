import Head from "next/head";
import Image from "next/image";
import useUser from "utils/useUser";
import SignIn from "components/SignIn";

const Home = () => {
  const { user, logout } = useUser();
  return (
    <div>
      <h1 className={"text-5xl font-bold text-primary-800"}>
        Sticky Note Wall
      </h1>
    </div>
  );
};

export default Home;

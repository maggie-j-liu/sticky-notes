import Head from "next/head";
import Image from "next/image";
import useUser from "utils/useUser";
import SignIn from "components/SignIn";
import ReactTypingEffect from "react-typing-effect";
import Link from "next/link";
import firebase from "utils/firebase";
import WallGrid from "components/WallGrid";
import exampleimage from "../public/image.png";

const Home = ({ walls }) => {
  const { user, logout } = useUser();
  return (
    <div className={"bg-gray-100"}>
      <div
        className={
          "h-96 flex flex-col justify-center bg-gradient-to-br from-indigo-200 to-indigo-50"
        }
      >
        <div
          className={
            "mx-auto w-full flex justify-between items-center px-8 lg:px-16"
          }
        >
          <div className={"max-w-2xl"}>
            <h1
              className={
                "text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent"
              }
            >
              Sticky Note Wall
            </h1>
            <h2 className={"text-2xl text-gray-600 mt-4"}>
              <ReactTypingEffect
                staticText={"Add sticky notes to"}
                text={[
                  "manage your todo list.",
                  "store ideas for future reference.",
                  "connect with others!",
                ]}
                speed={100}
                eraseSpeed={50}
                cursorClassName={"font-bold"}
                typingDelay={1000}
                eraseDelay={2000}
              />
            </h2>
          </div>
          <div className={"max-w-2xl"}>
            <Image src={exampleimage} className={"rotate-2"} alt="demo image" />
          </div>
        </div>
      </div>
      <div className={"mt-12"}>
        {user ? (
          <Link href={`/walls/${user.displayName}`}>
            <a
              className={
                "text-2xl rounded-md text-white font-bold gradient-button px-8 py-6 block w-max mx-auto"
              }
            >
              View your ✨Sticky Note Wall✨
            </a>
          </Link>
        ) : (
          <Link href={"/sign-in"}>
            <a
              className={
                "text-2xl rounded-md text-white font-bold gradient-button px-8 py-6 block w-max mx-auto"
              }
            >
              Sign in to ✨get started✨
            </a>
          </Link>
        )}
      </div>
      <div className={"py-20"}>
        <h3
          className={
            "text-2xl font-semibold text-center mb-6 text-primary-900 wavy"
          }
        >
          View walls
        </h3>
        <WallGrid walls={walls} />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const db = firebase.firestore();
  const walls = {};
  await db
    .collection("walls")
    .get()
    .then((snap) =>
      snap.forEach((doc) => {
        const data = doc.data();
        walls[doc.id] = {
          creator: data.creator,
          name: data.name,
        };
      })
    );
  const users = {};
  await db
    .collection("users")
    .get()
    .then((snap) =>
      snap.forEach((doc) => {
        const data = doc.data();
        users[doc.id] = {
          username: data.username,
          photo: data.photo,
        };
      })
    );
  const wallArray = [];
  for (const [wallId, value] of Object.entries(walls)) {
    wallArray.push({
      id: wallId,
      ...users[value.creator],
      name: value.name,
    });
  }
  return {
    props: {
      walls: wallArray,
    },
  };
};

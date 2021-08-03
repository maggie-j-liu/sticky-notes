import { useEffect, useState } from "react";
import userExists from "utils/userExists";
import useUser from "utils/useUser";
import firebase from "utils/firebase";
import Loading from "components/Loading";
import FourOhFour from "components/404";
import Image from "next/image";
import { useRouter } from "next/router";
const Edit = ({ error, userId }) => {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const router = useRouter();
  const changeUsername = async () => {
    if (!username || alreadyUsed) {
      return;
    }
    const db = firebase.firestore();
    await db.collection("users").doc(user.uid).update({
      username: username,
    });
    await user.updateProfile({
      displayName: username,
    });
    setUsername("");
    router.replace(`/profile/${username}/edit`);
  };
  const validateUsername = async () => {
    const { exists } = await userExists(username, false);
    setAlreadyUsed(exists);
  }
  if (error) {
    return <FourOhFour />;
  }
  if (!userId || !user) {
    return <Loading />;
  }
  if (userId !== user.uid) {
    return <FourOhFour />;
  }
  return (
    <div>
      <div className={"flex flex-col items-center justify-center mt-8"}>
        <Image
          src={user.photoURL}
          alt={`${user.displayName}'s profile picture`}
          width={256}
          height={256}
          className={"rounded-full"}
        />
        <label className={"mt-4"}>
          <p>Username</p>
          <input
            type="text"
            className={`form-input input-box ${alreadyUsed ? 'focus:!ring-red-400 !border-red-400 !ring-offset-red-400' : ""}`}
            placeholder={user.displayName}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => validateUsername()}
          />
          {alreadyUsed && <p className={'text-red-400 text-sm'}>This username is not available</p>}
        </label>
        <button
          type="button"
          onClick={() => changeUsername()}
          className={
            "bg-primary-700 hover:bg-primary-600 mt-4 text-white font-semibold px-4 py-2 rounded-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
          }
          disabled={!username || alreadyUsed}
        >
          Change Username
        </button>
      </div>
    </div>
  );
};

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async ({ params }) => {
  const { exists, userId, userData } = await userExists(params.username);
  if (!exists) {
    return {
      props: {
        error: true,
      },
      revalidate: 1000 * 60 * 60,
    };
  }
  return {
    props: {
      error: false,
      userId,
    },
  };
};

export default Edit;

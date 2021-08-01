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
  const router = useRouter();
  /*
  useEffect(() => {
    const getData = async () => {
      const db = firebase.firestore();
    };
    if (userId === user.uid) {
    }
  }, [userId, user]);
  */
  const changeUsername = async () => {
    if (!username) {
      return;
    }
    const db = firebase.firestore();
    await db.collection("users").doc(user.uid).update({
      username: username,
    });
    await user.updateProfile({
      displayName: username,
    });
    router.replace(`/profile/${username}/edit`);
  };
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
            className={"form-input input-box"}
            placeholder={user.displayName}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => changeUsername()}
          className={
            "bg-primary-700 hover:bg-primary-600 mt-4 text-white font-semibold px-4 py-2 rounded-lg"
          }
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
      revalidate: 1,
    };
  }
  return {
    props: {
      error: false,
      userId,
    },
    revalidate: 1,
  };
};

export default Edit;

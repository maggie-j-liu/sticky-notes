import Loading from "components/Loading";
import StickyNoteWall from "components/StickyNoteWall";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import userExists from "utils/userExists";
import Link from "next/link";
import FourOhFour from "components/404";
import useUser from "utils/useUser";
import firebase from "utils/firebase";

const CreateNew = ({ username, userId, error }) => {
  const [wallName, setWallName] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const createNewWall = async () => {
    if (!wallName) return;
    const db = firebase.firestore();
    const wallId = await db
      .collection("walls")
      .add({
        messages: [],
        creator: userId,
        name: wallName,
      })
      .then((doc) => doc.id);
    await db
      .collection("users")
      .doc(userId)
      .update({
        walls: firebase.firestore.FieldValue.arrayUnion(wallId),
      });
    setWallName("");
    router.push(`walls/${username}/${wallName}`);
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
    <div className={"bg-primary-50 min-h-screen"}>
      <h1
        className={
          "font-bold text-7xl text-primary-900 text-center max-w-2xl mx-auto pt-16 leading-tight"
        }
      >
        Create a new sticky note wall!
      </h1>
      <div className={"max-w-sm w-full mx-auto mt-16"}>
        <label>
          <p className={"text-lg w-max"}>Name</p>
          <input
            type="text"
            className={"form-input input-box w-full"}
            value={wallName}
            onChange={(e) => setWallName(e.target.value)}
          />
        </label>
        <button
          type="button"
          className={
            "disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-70 gradient-button px-6 py-2 text-white rounded-md text-lg font-semibold mt-4"
          }
          disabled={!wallName}
          onClick={() => createNewWall()}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateNew;

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async ({ params }) => {
  const {
    exists: inRegisteredUsers,
    userId,
    userData,
  } = await userExists(params.username);
  if (!inRegisteredUsers) {
    return {
      props: {
        error: true,
      },
      revalidate: 1,
    };
  }
  return {
    props: {
      username: params.username,
      userId,
      error: false,
    },
    revalidate: 1,
  };
};

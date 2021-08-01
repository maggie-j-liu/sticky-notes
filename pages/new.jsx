import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "utils/useUser";
import firebase from "utils/firebase";
import NotSignedIn from "components/NotSignedIn";

const CreateNew = () => {
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
        creator: user.uid,
        name: wallName,
      })
      .then((doc) => doc.id);
    await db
      .collection("users")
      .doc(user.uid)
      .update({
        walls: firebase.firestore.FieldValue.arrayUnion(wallId),
      });
    setWallName("");
    router.push(`walls/${user.displayName}/${wallName}`);
  };
  if (!user) {
    return <NotSignedIn message={"to create a new sticky note wall!"} />;
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

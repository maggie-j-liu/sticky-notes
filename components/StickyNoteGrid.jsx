import { useEffect, useState } from "react";
import firebase from "utils/firebase";
import StickyNote from "./StickyNote";
const StickyNoteGrid = ({ notes = [] }) => {
  const sorted = [...notes].sort((a, b) => b.timestamp - a.timestamp);
  const [userData, setUserData] = useState();
  useEffect(() => {
    const getData = async () => {
      const db = firebase.firestore();
      const userDocs = {};
      await db
        .collection("users")
        .get()
        .then((snap) => {
          snap.forEach((doc) => (userDocs[doc.id] = doc.data()));
        });
      setUserData(userDocs);
    };
    getData();
  }, [notes]);

  if (!userData) {
    return null;
  }
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-12 bg-white pt-20 pb-16"
      }
    >
      {sorted.map((note, idx) => (
        <StickyNote
          key={idx}
          text={note.message}
          className={`${note.backgroundColor} ${note.textColor} ${note.rotation}`}
          userInfo={userData[note.user]}
        />
      ))}
    </div>
  );
};

export default StickyNoteGrid;

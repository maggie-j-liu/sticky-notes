import { useEffect, useState } from "react";
import firebase from "utils/firebase";
import StickyNote from "./StickyNote";
const StickyNoteGrid = ({ notes = [] }) => {
  const sorted = [...notes].sort((a, b) => b.timestamp - a.timestamp);
  const usersInWall = [...new Set(notes.map((note) => note.user))];
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getData = async () => {
      const db = firebase.firestore();
      const userDocs = {};
      for (const userInWall of usersInWall) {
        //console.log(userInWall);
        await db
          .collection("users")
          .doc(userInWall)
          .get()
          .then((doc) => {
            userDocs[doc.id] = doc.data();
          });
      }
      //console.log(userDocs);
      setUserData(userDocs);
    };
    getData();
  }, [notes]);

  if (!Object.keys(userData).length) {
    return null;
  }
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-12 bg-white pt-20 pb-16"
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

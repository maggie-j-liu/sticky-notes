import { useEffect, useState } from "react";
import firebase from "utils/firebase";
import useUser from "utils/useUser";
import StickyNoteGrid from "./StickyNoteGrid";
const StickyNoteWall = ({ wallId }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const [addedMessage, setAddedMessage] = useState("");
  const addMessage = async () => {
    const db = firebase.firestore();
    await db
      .collection("walls")
      .doc(wallId)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          user: user.uid,
          message: addedMessage,
        }),
      });
  };
  useEffect(() => {
    const getData = async () => {
      const db = firebase.firestore();
      const m = await db
        .collection("walls")
        .doc(wallId)
        .get()
        .then((doc) => doc.data().messages);
      console.log(m);
      setMessages(m);
    };
    if (wallId && user) {
      getData();
    }
  }, [wallId, user]);
  if (!user) {
    return <div>Log in</div>;
  }
  return (
    <div>
      <input
        type="text"
        value={addedMessage}
        onChange={(e) => setAddedMessage(e.target.value)}
      />
      <button onClick={() => addMessage()}>Add message</button>
      <StickyNoteGrid notes={messages} />
    </div>
  );
};

export default StickyNoteWall;

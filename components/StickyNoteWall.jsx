import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import firebase from "utils/firebase";
import useUser from "utils/useUser";
import AddMessageModal from "./AddMessageModal";
import NotSignedIn from "./NotSignedIn";
import StickyNoteGrid from "./StickyNoteGrid";
const StickyNoteWall = ({ wallId, username }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
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
    if (wallId) {
      getData();
    }
  }, [wallId]);
  return (
    <div>
      {user ? (
        <>
          <button onClick={openModal}>Add sticky note</button>
          <AddMessageModal
            isOpen={isOpen}
            onClose={closeModal}
            username={username}
            wallId={wallId}
          />
        </>
      ) : (
        <NotSignedIn message={"to add a sticky note"} />
      )}
      <StickyNoteGrid notes={messages} />
    </div>
  );
};

export default StickyNoteWall;

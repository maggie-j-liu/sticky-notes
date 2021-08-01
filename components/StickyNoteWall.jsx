import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import firebase from "utils/firebase";
import useUser from "utils/useUser";
import AddMessageModal from "./AddMessageModal";
import StickyNoteGrid from "./StickyNoteGrid";
import Link from "next/link";
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
      setMessages(m);
    };
    if (wallId) {
      getData();
    }
  }, [wallId]);
  return (
    <div>
      {user ? (
        <div className={"flex justify-center items-center"}>
          <button
            onClick={openModal}
            className={
              "gradient-button mt-10 mb-2 rounded-md px-6 py-4 text-white text-lg font-bold"
            }
          >
            Add sticky note
          </button>
          <AddMessageModal
            isOpen={isOpen}
            onClose={closeModal}
            username={username}
            wallId={wallId}
          />
        </div>
      ) : (
        <div className={"flex justify-center items-center"}>
          <Link href={"/sign-in"}>
            <a
              onClick={openModal}
              className={
                "gradient-button mt-10 mb-2 rounded-md px-6 py-4 text-white text-lg font-bold block"
              }
            >
              You're not signed in! Sign in to add a sticky note.
            </a>
          </Link>
        </div>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 150 1440 170"
        fill="currentColor"
        className={"text-white mt-1 bg-primary-50"}
      >
        <path d="M0,192L34.3,181.3C68.6,171,137,149,206,165.3C274.3,181,343,235,411,245.3C480,256,549,224,617,229.3C685.7,235,754,277,823,277.3C891.4,277,960,235,1029,218.7C1097.1,203,1166,213,1234,229.3C1302.9,245,1371,267,1406,277.3L1440,288L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z" />
      </svg>
      <StickyNoteGrid notes={messages} />
    </div>
  );
};

export default StickyNoteWall;

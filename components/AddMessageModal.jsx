import { Transition, Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import firebase from "utils/firebase";
import useUser from "utils/useUser";
const AddMessageModal = ({ onClose, isOpen, username, wallId }) => {
  const [addedMessage, setAddedMessage] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const addMessage = async () => {
    const db = firebase.firestore();
    await db
      .collection("walls")
      .doc(wallId)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          user: user.uid,
          message: addedMessage,
          timestamp: Date.now(),
        }),
      });
    onClose();
    router.reload();
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-gray-900"
                >
                  Add Message
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-lg text-gray-500">
                    Add a message to {username}'s sticky note wall!
                  </p>

                  <textarea
                    value={addedMessage}
                    onChange={(e) => setAddedMessage(e.target.value)}
                    className={
                      "form-textarea w-full rounded-md border-gray-300 h-48"
                    }
                    placeholder="Write your message..."
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 font-medium text-primary-900 bg-primary-100 border border-transparent rounded-md hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-50-500"
                    onClick={() => {
                      setAddedMessage("");
                      onClose();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setAddedMessage("");
                      addMessage();
                    }}
                    className={
                      "font-medium text-primary-700 bg-primary-200 px-4 py-2 rounded-md hover:text-primary-50 hover:bg-primary-700"
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddMessageModal;

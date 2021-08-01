import { Transition, Dialog, RadioGroup } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import firebase from "utils/firebase";
import useUser from "utils/useUser";
import { FiCheck } from "react-icons/fi";

const backgroundColors = [
  "bg-indigo-600",
  "bg-sky-500",
  "bg-yellow-200",
  "bg-fuchsia-400",
];

const textColors = [
  "text-white",
  "text-gray-900",
  "text-gray-900",
  "text-gray-900",
];

const rotations = [
  "rotate-0",
  "rotate-1",
  "rotate-2",
  "rotate-3",
  "-rotate-1",
  "-rotate-2",
  "-rotate-3",
];

const AddMessageModal = ({ onClose, isOpen, username, wallId }) => {
  const [addedMessage, setAddedMessage] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const { user } = useUser();
  const router = useRouter();
  const addMessage = async () => {
    if (addedMessage === "") {
      return;
    }
    const db = firebase.firestore();
    await db
      .collection("walls")
      .doc(wallId)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          user: user.uid,
          message: addedMessage,
          timestamp: Date.now(),
          backgroundColor: backgroundColors[colorIdx],
          textColor: textColors[colorIdx],
          rotation: rotations[Math.floor(Math.random() * rotations.length)],
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
          <div className="min-h-screen px-8 text-center">
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
              <div className="inline-block w-full max-w-4xl px-10 py-8 my-10 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-primary-900"
                >
                  Add Sticky Note
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-lg text-gray-500">
                    Add a sticky note to {username}'s sticky note wall!
                  </p>
                  <label>
                    <h4
                      className={
                        "mt-4 text-xl font-medium wavy text-primary-900"
                      }
                    >
                      Message
                    </h4>
                    <textarea
                      value={addedMessage}
                      onChange={(e) => setAddedMessage(e.target.value)}
                      className={"mt-4 form-textarea w-full h-48 input-box"}
                      placeholder="Write your message..."
                    />
                  </label>
                  <RadioGroup
                    value={colorIdx}
                    onChange={setColorIdx}
                    className={"mt-4"}
                  >
                    <RadioGroup.Label
                      className={"text-xl font-medium wavy text-primary-900"}
                    >
                      Sticky note color
                    </RadioGroup.Label>
                    <div className={"flex flex-wrap gap-4 mt-4"}>
                      {backgroundColors.map((color, idx) => (
                        <RadioGroup.Option
                          key={color}
                          value={idx}
                          className={"focus-visible:outline-none"}
                        >
                          {({ checked, active }) => (
                            <div
                              className={`flex items-center justify-center ${color} h-10 w-10 ${
                                active
                                  ? "ring-2 ring-offset-1 ring-offset-white ring-primary-600"
                                  : ""
                              }
                              relative rounded-full shadow-md cursor-pointer flex`}
                            >
                              {checked && (
                                <FiCheck
                                  className={`h-5 w-5 ${textColors[idx]}`}
                                />
                              )}
                            </div>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 font-medium text-primary-900 bg-primary-100 border border-transparent rounded-md hover:bg-primary-200 focus:bg-primary-200 focus-ring"
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
                      "disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed font-medium text-primary-700 bg-primary-200 px-4 py-2 rounded-md hover:text-primary-50 hover:bg-primary-700 focus:text-primary-50 focus:bg-primary-700 focus-ring"
                    }
                    disabled={addedMessage === ""}
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

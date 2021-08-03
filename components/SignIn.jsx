import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "utils/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "utils/useUser";
import { FcGoogle } from "react-icons/fc";
import { FiMail } from "react-icons/fi";
import userExists from "utils/userExists";

const processUser = async ({ additionalUserInfo, user }, newUsername) => {
  const db = firebase.firestore();
  if (additionalUserInfo.isNewUser) {
    const id = await db
      .collection("walls")
      .add({
        messages: [],
        creator: user.uid,
        name: "",
      })
      .then((doc) => doc.id);
    let needsUpdateName = false;
    let updatedName = user.displayName;
    if (user.displayName) {
      // logged in with google
      // need to check if username has been used already
      const MAX_TRIES = 5;
      if (userExists(user.displayName, false).exists) {
        for (let i = 0; i < MAX_TRIES; i++) {
          const newName =
            user.displayName +
            "-" +
            Math.floor(Math.random() * 10000).toString();
          if (!userExists(newName, false).exists) {
            needsUpdateName = true;
            updatedName = newName;
            break;
          }
        }
      }
      if (!needsUpdateName) {
        // rip, hopefully never happens
        needsUpdateName = true;
        updatedName = user.uid;
      }
    }
    if (!user.photoURL || !user.displayName || needsUpdateName) {
      const nameToUpdateTo = newUsername || updatedName;
      await user.updateProfile({
        photoURL: `https://robohash.org/${user.uid}?set=set4`,
        displayName: nameToUpdateTo,
      });
    }
    await db
      .collection("users")
      .doc(user.uid)
      .set({
        walls: [id],
        username: user.displayName,
        photo: user.photoURL || `https://robohash.org/${user.uid}?set=set4`,
      });
  } else {
    // user might exist but signed in with email first
    const existed = await db
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          return { photo: data.photo, username: data.username };
        }
        return false;
      });
    if (existed) {
      await user.updateProfile({
        photoURL: existed.photo,
        displayName: existed.username,
      });
    }
  }
};

const Card = ({ children }) => (
  <div className={"bg-white w-full max-w-2xl mx-auto py-12 mt-6"}>
    <div className={"w-full max-w-sm mx-auto"}>{children}</div>
  </div>
);

const defaults = {
  email: "",
  username: "",
  password: "",
  choseEmailSignIn: false,
  enteredEmail: false,
  emailValid: true,
  canUseEmail: false,
  newUser: true,
  usernameAlreadyUsed: false,
  signInError: "",
};

const SignIn = () => {
  const { signInWithGoogle, signInWithEmail, createUserWithEmail } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState(defaults.email);
  const [username, setUsername] = useState(defaults.username);
  const [password, setPassword] = useState(defaults.password);

  const [choseEmailSignIn, setChoseEmailSignIn] = useState(
    defaults.choseEmailSignIn
  );
  const [enteredEmail, setEnteredEmail] = useState(defaults.enteredEmail);
  const [emailValid, setEmailValid] = useState(defaults.emailValid);
  const [canUseEmail, setCanUseEmail] = useState(defaults.canUseEmail);
  const [newUser, setNewUser] = useState(defaults.newUser);
  const [usernameAlreadyUsed, setUsernameAlreadyUsed] = useState(
    defaults.usernameAlreadyUsed
  );
  const [signInError, setSignInError] = useState(defaults.signInError);

  const [loading, setLoading] = useState(false);

  const checkForUserEmail = async () => {
    const info = await fetch("/api/getUserByEmail", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then((res) => res.json());
    setNewUser(!info.exists);
    setCanUseEmail(!info.otherAccount);
  };

  const validateEmail = () => {
    if (!email) {
      setEmailValid(true);
      return;
    }
    const regex =
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    setEmailValid(regex.test(email));
  };

  const validateUsername = async () => {
    const { exists } = await userExists(username, false);
    setUsernameAlreadyUsed(exists);
  };

  const createUser = () => {
    createUserWithEmail(email, password, username, processUser);
  };

  const logInUser = async () => {
    try {
      await signInWithEmail(email, password);
      setSignInError("");
      setPassword("");
      setUsername("");
    } catch (error) {
      console.log(error);
      setSignInError(error.message);
    }
  };

  if (loading) {
    return null;
  }

  if (enteredEmail) {
    if (canUseEmail) {
      return (
        <Card>
          <h2 className={"text-xl font-medium"}>Sign in with email</h2>
          {newUser && (
            <label className={"block mb-3"}>
              <p>Username</p>
              <input
                type="text"
                className={`form-input input-box w-full ${
                  usernameAlreadyUsed
                    ? "focus:!ring-red-400 !border-red-400"
                    : ""
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => validateUsername()}
              />
              {usernameAlreadyUsed && (
                <p className={"text-red-400 text-sm"}>
                  This username is unavailable.
                </p>
              )}
            </label>
          )}
          <label className={"block"}>
            <p>Password</p>
            <input
              type="password"
              className={"form-input input-box w-full"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSignInError(defaults.signInError);
              }}
            />
            {signInError && (
              <p className={"text-red-400 text-sm"}>{signInError}</p>
            )}
          </label>
          <div className={"flex justify-between mt-3"}>
            <button
              onClick={() => {
                setEnteredEmail(false);
                setUsername("");
                setPassword("");
              }}
              className={"secondary-button"}
              type="button"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (newUser) {
                  createUser();
                } else {
                  logInUser();
                }
              }}
              className={"main-button"}
              disabled={
                (newUser && !username) || signInError || usernameAlreadyUsed
              }
              type="button"
            >
              Submit
            </button>
          </div>
        </Card>
      );
    } else {
      return (
        <Card>
          <h2 className={"text-xl font-medium"}>
            You've already created an account with this email. Use Google to
            sign in.
          </h2>
          <button
            onClick={() => {
              setEnteredEmail(defaults.enteredEmail);
              setChoseEmailSignIn(defaults.choseEmailSignIn);
              setUsername(defaults.username);
              setPassword(defaults.password);
              setEmail(defaults.email);
              setNewUser(defaults.newUser);
              setEmailValid(defaults.emailValid);
              setCanUseEmail(defaults.canUseEmail);
            }}
            className={"main-button mt-3"}
            type="button"
          >
            Back
          </button>
        </Card>
      );
    }
  }
  if (choseEmailSignIn) {
    return (
      <Card>
        <h2 className={"text-xl font-medium mb-2"}>Sign in with email</h2>
        <label className={"block"}>
          <p>Email</p>
          <input
            type="email"
            className={`form-input input-box w-full ${
              emailValid ? "" : "focus:!ring-red-400 !border-red-400"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail()}
          />
          {!emailValid && (
            <p className={"text-red-400 text-sm"}>
              Please enter a valid email.
            </p>
          )}
        </label>
        <div className={"flex justify-between mt-3"}>
          <button
            onClick={() => {
              setChoseEmailSignIn(false);
              setEmail(defaults.email);
            }}
            type="button"
            className={"secondary-button"}
          >
            Back
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              setEnteredEmail(true);
              await checkForUserEmail();
              setLoading(false);
            }}
            className={"main-button"}
            type="button"
            disabled={!emailValid || !email}
          >
            Next
          </button>
        </div>
      </Card>
    );
  }
  return (
    <div>
      <div className={"flex flex-col gap-6 mt-4 w-max mx-auto"}>
        <button
          onClick={() => signInWithGoogle(processUser)}
          className={
            "w-full shadow-md px-6 py-3 bg-white hover:bg-gray-50 flex items-center justify-center gap-4"
          }
          type="button"
        >
          <FcGoogle className={"h-8 w-8"} />
          <span className={"text-gray-700 font-semibold text-lg"}>
            Sign in with Google
          </span>
        </button>
        <button
          onClick={() => setChoseEmailSignIn(true)}
          className={
            "w-full shadow-md px-6 py-3 bg-red-500 hover:bg-red-400 text-white flex items-center justify-center gap-4"
          }
          type="button"
        >
          <FiMail className={"h-8 w-8"} />
          <span className={"font-semibold text-lg"}>Sign in with Email</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "utils/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SignIn = () => {
  const router = useRouter();
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: async ({ user, additionalUserInfo }) => {
        console.log(user);
        console.log(additionalUserInfo);
        if (additionalUserInfo.isNewUser) {
          const db = firebase.firestore();
          const id = await db
            .collection("walls")
            .add({
              messages: [],
            })
            .then((doc) => doc.id);
          await db
            .collection("users")
            .doc(user.uid)
            .set({
              walls: [id],
              username: user.displayName,
            });
        }
        router.back();
      },
    },
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      {mounted ? (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
    </>
  );
};

export default SignIn;

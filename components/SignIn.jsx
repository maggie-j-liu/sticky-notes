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
      signInSuccess: () => {
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

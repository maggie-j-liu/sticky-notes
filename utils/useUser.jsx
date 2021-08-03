import { createContext, useContext, useEffect, useState } from "react";
import firebase from "./firebase";
import {
  setUserCookie,
  removeUserCookie,
  getUserFromCookie,
} from "./userCookies";
import { useRouter } from "next/router";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleUser = (rawUser) => {
    if (rawUser) {
      //setUserCookie(rawUser);
      setUser(rawUser);
      setLoading(false);
    } else {
      //removeUserCookie();
      setUser(null);
      setLoading(false);
    }
  };
  const signInWithGoogle = (fn) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async (response) => {
        handleUser(response.user);
        await fn(response);
        router.back();
      });
  };
  const createUserWithEmail = (email, password, username, fn) => {
    setLoading(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (response) => {
        handleUser(response.user);
        await fn(response, username);
        router.back();
      });
  };

  const signInWithEmail = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user);
        router.back();
      });
  };
  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };
  useEffect(() => {
    const cancelAuthListener = firebase.auth().onIdTokenChanged(handleUser);
    /*const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);*/
    return () => {
      cancelAuthListener();
    };
  }, []);
  return {
    user,
    logout,
    signInWithGoogle,
    signInWithEmail,
    createUserWithEmail,
  };
};
const UserContext = createContext({ user: null, logout: () => {} });
export const UserContextProvider = ({ children }) => {
  const auth = useAuth();
  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
const useUser = () => useContext(UserContext);
export default useUser;

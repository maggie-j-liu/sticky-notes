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
  const router = useRouter();
  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          setUserCookie(user);
          setUser(user);
        } else {
          removeUserCookie();
          setUser(null);
        }
      });
    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    return () => {
      cancelAuthListener();
    };
  }, []);
  return { user, logout };
};
const UserContext = createContext({ user: null, logout: () => {} });
export const UserContextProvider = ({ children }) => {
  const auth = useAuth();
  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
const useUser = () => useContext(UserContext);
export default useUser;

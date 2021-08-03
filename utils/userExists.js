import firebase from "./firebase";
const userExists = async (username, getData = true) => {
  const db = firebase.firestore();
  return await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get()
    .then((snapshot) => {
      let exists = false;
      let userId, userData;
      snapshot.forEach((doc) => {
        exists = true;
        if (getData) {
          const data = doc.data();
          userId = doc.id;
          userData = data;
        }
      });
      if (getData) {
        return { exists, userId, userData };
      }
      return { exists };
    });
};

export default userExists;

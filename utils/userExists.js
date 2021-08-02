import firebase from "./firebase";
const userExists = async (username) => {
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
        const data = doc.data();
        exists = true;
        userId = doc.id;
        userData = data;
      });
      return { exists, userId, userData };
    });
};

export default userExists;

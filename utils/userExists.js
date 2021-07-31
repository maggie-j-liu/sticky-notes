import firebase from "./firebase";
const userExists = async (username) => {
  const db = firebase.firestore();
  return await db
    .collection("users")
    .get()
    .then((snapshot) => {
      let exists = false;
      let userId, userData;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (username === data.username) {
          exists = true;
          userId = doc.id;
          userData = data;
        }
      });
      return { exists, userId, userData };
    });
};

export default userExists;

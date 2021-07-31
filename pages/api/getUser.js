import admin from "utils/admin";
const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.redirect(303, "/404");
    return;
  }
  const body = JSON.parse(req.body);
  const { userId, fields } = body;
  const userInfo = await admin
    .auth()
    .getUser(userId)
    .then((userRecord) => {
      return userRecord;
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
      res.status(400).json(error);
      return;
    });
  const filteredInfo = {};
  for (const field of fields) {
    filteredInfo[field] = userInfo[field];
  }
  res.status(200).json(filteredInfo);
  return;
};

export default handler;

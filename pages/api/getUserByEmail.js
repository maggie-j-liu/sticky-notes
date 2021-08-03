import admin from "utils/admin";
const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.redirect(303, "/404");
    return;
  }
  const body = JSON.parse(req.body);
  const { email } = body;
  if (!email) {
    res.status(400).send("no email");
    return;
  }
  const emailExists = await admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      const providers = user.providerData.map((p) => p.providerId);
      if (!providers.includes("password")) {
        return { exists: true, otherAccount: true };
      }
      return { exists: true, otherAccount: false };
    })
    .catch(() => ({
      exists: false,
    }));
  res.status(200).json(emailExists);
  return;
};

export default handler;

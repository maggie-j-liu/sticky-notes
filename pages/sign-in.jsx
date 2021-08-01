import FirebaseSignIn from "components/SignIn";

const SignIn = () => {
  return (
    <div className={"mt-16"}>
      <h1
        className={"text-center font-semibold text-2xl text-primary-800 wavy"}
      >
        Sign In
      </h1>
      <FirebaseSignIn />
    </div>
  );
};

export default SignIn;

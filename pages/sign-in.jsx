import SignInBox from "components/SignIn";

const SignIn = () => {
  return (
    <div className={"pt-16 bg-gray-100 min-h-screen"}>
      <h1
        className={"text-center font-semibold text-2xl text-primary-800 wavy"}
      >
        Sign In
      </h1>
      <SignInBox />
    </div>
  );
};

export default SignIn;

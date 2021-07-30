import Link from "next/link";
const NotSignedIn = ({ message = "to view this page." }) => {
  return (
    <div>
      You're not signed in!{" "}
      <Link href="/sign-in">
        <a className={"font-bold text-primary-700 hover:wavy focus:wavy"}>
          Sign In
        </a>
      </Link>{" "}
      {message}
    </div>
  );
};
export default NotSignedIn;

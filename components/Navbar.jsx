import useUser from "utils/useUser";
import Link from "next/link";

const Navbar = () => {
  const { user, logout } = useUser();
  return (
    <nav className={"h-14 shadow-sm"}>
      <div
        className={"h-full flex justify-between items-center max-w-6xl mx-auto"}
      >
        <Link href="/">
          <a className={"font-bold"}>Sticky Notes</a>
        </Link>
        <div>
          {user ? (
            <div className={"flex space-x-8"}>
              <div>{user.displayName}</div>
              <button onClick={() => logout()}>Sign Out</button>
            </div>
          ) : (
            <Link href="/sign-in">
              <a>Sign In</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import useUser from "utils/useUser";
import Link from "next/link";

const Navbar = () => {
  const { user, logout } = useUser();
  return (
    <nav className={"h-16 shadow-sm"}>
      <div
        className={"h-full flex justify-between items-center max-w-6xl mx-auto"}
      >
        <Link href="/">
          <a className={"font-bold hover:wavy"}>Sticky Note Wall</a>
        </Link>
        <div>
          {user ? (
            <div className={"flex space-x-8"}>
              <Link href={`/profile/${user.displayName}`}>
                <a className={"hover:wavy"}>{user.displayName}</a>
              </Link>
              <button onClick={() => logout()} className={"hover:wavy"}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/sign-in">
              <a className={"hover:wavy"}>Sign In</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

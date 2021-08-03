import useUser from "utils/useUser";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useUser();
  return (
    <nav className={"h-16 shadow-sm"}>
      <div
        className={"h-full flex justify-between items-center max-w-6xl mx-auto"}
      >
        <Link href="/">
          <a className={"font-bold hover:wavy"}>✨ Sticky Note Wall</a>
        </Link>
        <div className={"flex space-x-8 items-center"}>
          {user ? (
            <>
              <Link href={`/profile/${user.displayName}`}>
                <a className={"hover:wavy"}>{user.displayName}</a>
              </Link>
              <button onClick={() => logout()} className={"hover:wavy"}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/sign-in">
              <a className={"hover:wavy"}>Sign In</a>
            </Link>
          )}
          <Link href="https://github.com/maggie-j-liu/sticky-notes">
            <a
              className={
                "hover:text-primary-700 hover:bg-gray-50 p-2 rounded-full group"
              }
            >
              <FiGithub className={"h-6 w-6 group-hover:scale-105"} />
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

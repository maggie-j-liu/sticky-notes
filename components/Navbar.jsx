import useUser from "utils/useUser";

const Navbar = () => {
  const { user, logout } = useUser();
  return (
    <nav className={"h-14 shadow-sm"}>
      <div
        className={"h-full flex justify-between items-center max-w-6xl mx-auto"}
      >
        <div className={"font-bold"}>Sticky Notes</div>
        <div>
          {user ? (
            <div className={"flex space-x-8"}>
              <div>{user.displayName}</div>
              <button onClick={() => logout()}>Sign Out</button>
            </div>
          ) : (
            <div>Sign In</div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

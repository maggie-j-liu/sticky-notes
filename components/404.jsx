import Link from "next/link";
const FourOhFour = () => {
  return (
    <div className={"w-full flex flex-col text-center mt-12"}>
      <h1 className={"text-6xl font-bold"}>404</h1>
      <p className={"text-xl"}>This page was not found</p>
      <Link href="/">
        <a className={"text-primary-700 hover:text-primary-500"}>
          &larr; Return home
        </a>
      </Link>
    </div>
  );
};

export default FourOhFour;

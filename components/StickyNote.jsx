import Image from "next/image";
import Link from "next/link";

const StickyNote = ({ text, className, userInfo }) => {
  const darkText = className.includes("text-gray-900");
  return (
    <div
      className={`flex flex-col justify-between gap-8 text-lg rounded-lg py-4 px-6 shadow-xl whitespace-pre-wrap ${className}`}
    >
      <p>{text}</p>
      <div className={"flex justify-end"}>
        <Link href={`/profile/${userInfo.username}`}>
          <a
            className={`w-max flex items-center justify-end gap-2 font-semibold hover:wavy ${
              darkText ? "text-primary-700" : "text-primary-100"
            }`}
          >
            <Image
              src={userInfo.photo}
              width={36}
              height={36}
              className={"rounded-full"}
            />
            @{userInfo.username}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default StickyNote;

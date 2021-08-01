import Link from "next/link";
import Image from "next/image";
import { FiPlusCircle } from "react-icons/fi";
const WallGrid = ({ walls, canAddNew = false }) => {
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-12"
      }
    >
      {canAddNew && (
        <Link href={"/new"}>
          <a
            className={
              "hover:wavy text-primary-700 font-semibold text-xl py-10 bg-white rounded-md shadow-sm hover:shadow-xl transition duration-200 flex items-center justify-center gap-4 group"
            }
          >
            <FiPlusCircle /> Add New
          </a>
        </Link>
      )}
      {walls.map((wall) => (
        <Link key={wall.id} href={`/walls/${wall.username}/${wall.name}`}>
          <a
            className={
              "hover:wavy text-primary-700 font-semibold text-xl py-10 bg-white rounded-md shadow-sm hover:shadow-xl transition duration-200 flex items-center justify-center gap-4 group"
            }
          >
            <div
              className={
                "border-2 w-10 h-10 relative border-primary-300 rounded-full overflow-hidden"
              }
            >
              <Image
                src={wall.photo}
                alt={`${wall.username}'s profile picture`}
                layout={"fill"}
              />
            </div>
            {wall.name ? `${wall.username}/${wall.name}` : wall.username}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default WallGrid;

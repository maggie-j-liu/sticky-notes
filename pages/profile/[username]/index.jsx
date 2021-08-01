import userExists from "utils/userExists";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "utils/useUser";
import Image from "next/image";
import Loading from "components/Loading";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import FourOhFour from "components/404";

const ProfilePage = ({ error, userId }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState();
  const { user } = useUser();
  useEffect(() => {
    const getUserInfo = async () => {
      const userInf = await fetch("/api/getUser", {
        method: "POST",
        body: JSON.stringify({
          userId,
          fields: ["photoURL", "displayName"],
        }),
      }).then((res) => res.json());
      setUserInfo(userInf);
    };
    if (userId) {
      getUserInfo();
    }
  }, [userId]);
  if (error) {
    return <FourOhFour />;
  }
  if (!userId || !userInfo) {
    return <Loading />;
  }
  return (
    <div>
      <div className={"flex flex-col items-center justify-center mt-8"}>
        <Image
          src={userInfo.photoURL}
          alt={`${userInfo.displayName}'s profile picture`}
          width={256}
          height={256}
          className={"rounded-full"}
        />
        <h1 className={"text-primary-900 font-bold text-xl mt-4"}>
          @{userInfo.displayName}
        </h1>
        <Link href={`/walls/${userInfo.displayName}`}>
          <a
            className={
              "my-6 gradient-button text-white text-xl font-bold px-8 py-5 rounded-lg"
            }
          >
            View {userInfo.displayName}'s ✨Sticky Note Wall✨
          </a>
        </Link>
        {user && user.uid === userId && (
          <Link href={`/profile/${user.displayName}/edit`}>
            <a
              className={
                "mt-4 font-semibold text-gray-500 hover:text-gray-600 flex items-center justify-center gap-2"
              }
            >
              <FiEdit />
              Edit your profile
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps = async ({ params }) => {
  const { exists, userId, userData } = await userExists(params.username);
  if (!exists) {
    return {
      props: {
        error: true,
      },
      revalidate: 1,
    };
  }
  return {
    props: {
      error: false,
      userId,
    },
    revalidate: 1,
  };
};

export default ProfilePage;

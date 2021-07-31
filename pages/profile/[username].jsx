import userExists from "utils/userExists";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "utils/useUser";
import Image from "next/image";
import Loading from "components/Loading";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";

const ProfilePage = ({ error, userId }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState();
  const { user } = useUser();
  useEffect(() => {
    if (error) {
      router.replace("/404");
    }
  }, [error]);
  useEffect(() => {
    const getUserInfo = async () => {
      const userInf = await fetch("/api/getUser", {
        method: "POST",
        body: JSON.stringify({
          userId,
          fields: ["photoURL", "displayName"],
        }),
      }).then((res) => res.json());
      console.log(userInf);
      setUserInfo(userInf);
    };
    if (userId) {
      getUserInfo();
    }
  }, [userId]);
  if (!userId || !userInfo) {
    return <Loading />;
  }
  return (
    <div>
      <div className={"flex flex-col items-center justify-center mt-8"}>
        <Image
          src={userInfo.photoURL}
          width={256}
          height={256}
          className={"rounded-full"}
        />
        <h1 className={"text-primary-900 font-bold text-xl mt-4"}>
          @{userInfo.displayName}
        </h1>
        <button
          className={
            "my-6 gradient-button text-white text-xl font-bold px-8 py-5 rounded-lg"
          }
        >
          View Maggie's ✨Sticky Note Wall✨
        </button>
        {user && user.uid === userId && (
          <Link href={`/profile/${user.displayName}`}>
            <a className={"mt-4 flex items-center justify-center gap-2"}>
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
      revalidate: 10,
    };
  }
  return {
    props: {
      error: false,
      userId,
    },
    revalidate: 10,
  };
};

export default ProfilePage;

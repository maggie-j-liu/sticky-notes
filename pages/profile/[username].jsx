import firebase from "utils/firebase";
import userExists from "utils/userExists";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useUser from "utils/useUser";
import Image from "next/image";
import Loading from "components/Loading";

const ProfilePage = ({ error, userId }) => {
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    if (error) {
      router.replace("/404");
    }
  }, [error]);
  if (!userId || !user) {
    return <Loading />;
  }
  return (
    <div>
      {userId}
      <Image src={user.photoURL} width={160} height={160} />
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

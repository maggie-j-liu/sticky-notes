import Loading from "components/Loading";
import StickyNoteWall from "components/StickyNoteWall";
import { useRouter } from "next/router";
import { useEffect } from "react";
import firebase from "utils/firebase";

const UserPage = ({ username, userId, wallId, error }) => {
  const router = useRouter();
  useEffect(() => {
    console.log(error);
    if (error) {
      router.replace("/404");
    }
  }, [error]);
  if (error || !username) {
    return <Loading />;
  }
  return (
    <div>
      <h1
        className={
          "font-bold text-7xl text-primary-900 text-center max-w-2xl mx-auto mt-28"
        }
      >
        {username}'s <span className={"text-outline"}>Sticky Note Wall</span>
      </h1>
      <StickyNoteWall wallId={wallId} username={username} />
    </div>
  );
};

export default UserPage;

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps = async ({ params }) => {
  const db = firebase.firestore();
  const {
    good: inRegisteredUsers,
    userId,
    wallId,
  } = await db
    .collection("users")
    .get()
    .then((snapshot) => {
      let good = false;
      let userId, wallId;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (params.username === data.username) {
          good = true;
          userId = doc.id;
          wallId = data.walls[0];
        }
      });
      return { good, userId, wallId };
    });
  if (!inRegisteredUsers) {
    return {
      props: {
        error: true,
      },
      revalidate: 10,
    };
  }
  return {
    props: {
      username: params.username,
      userId,
      wallId,
      error: false,
    },
    revalidate: 10,
  };
};

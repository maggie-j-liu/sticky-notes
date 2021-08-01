import Loading from "components/Loading";
import StickyNoteWall from "components/StickyNoteWall";
import { useRouter } from "next/router";
import { useEffect } from "react";
import userExists from "utils/userExists";
import Link from "next/link";
import FourOhFour from "components/404";
import firebase from "utils/firebase";

const UserPage = ({ username, userId, wallId, error }) => {
  const router = useRouter();
  if (error) {
    return <FourOhFour />;
  }
  if (error || !username) {
    return <Loading />;
  }
  return (
    <div className={"bg-primary-50"}>
      <h1
        className={
          "font-bold text-7xl text-primary-900 text-center max-w-2xl mx-auto pt-28 leading-tight"
        }
      >
        <Link href={`/profile/${username}`}>
          <a className={"hover:wavy"}>{username}'s</a>
        </Link>{" "}
        <span className={"text-outline"}>Sticky Note Wall</span>
      </h1>
      <StickyNoteWall wallId={wallId} username={username} />
    </div>
  );
};

export default UserPage;

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async ({ params }) => {
  const path = params.username;
  if (!params.username || (path.length !== 1 && path.length !== 2)) {
    return {
      props: {
        error: true,
      },
    };
  }
  const username = path[0];
  const wallName = path.length === 1 ? "" : path[1];
  const {
    exists: inRegisteredUsers,
    userId,
    userData,
  } = await userExists(username);
  if (!inRegisteredUsers) {
    return {
      props: {
        error: true,
      },
      revalidate: 1,
    };
  }
  const db = firebase.firestore();
  let userWallId;
  await db
    .collection("walls")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.creator === userId && data.name === wallName) {
          userWallId = doc.id;
        }
      });
    });
  if (!userWallId) {
    return {
      props: {
        error: true,
      },
      revalidate: 1,
    };
  }
  return {
    props: {
      username: username,
      userId,
      wallId: userWallId,
      error: false,
    },
    revalidate: 1,
  };
};

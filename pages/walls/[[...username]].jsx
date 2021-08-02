import Loading from "components/Loading";
import StickyNoteWall from "components/StickyNoteWall";
import { useRouter } from "next/router";
import { useEffect } from "react";
import userExists from "utils/userExists";
import Link from "next/link";
import FourOhFour from "components/404";
import firebase from "utils/firebase";
import Image from "next/image";

const UserPage = ({ username, wallId, error, wallName, profilePic }) => {
  if (error) {
    return <FourOhFour />;
  }
  if (error || !username) {
    return <Loading />;
  }
  return (
    <div className={"bg-primary-50"}>
      {wallName === "" ? (
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
      ) : (
        <>
          <h1
            className={
              "text-outline font-bold text-7xl text-primary-900 text-center max-w-2xl mx-auto pt-28 leading-tight"
            }
          >
            {wallName}
          </h1>
          <h2
            className={
              "text-2xl text-center mx-auto max-w-2xl text-primary-900"
            }
          >
            <Link href={`/profile/${username}`}>
              <a
                className={
                  "hover:wavy font-bold flex items-center justify-center gap-2"
                }
              >
                <Image
                  src={profilePic}
                  alt={`${username}'s profile picture`}
                  height={48}
                  width={48}
                  className={"rounded-full"}
                />
                @{username}
              </a>
            </Link>
          </h2>
        </>
      )}
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
      revalidate: 1000 * 60 * 60,
    };
  }
  const db = firebase.firestore();
  let userWallId;
  await db
    .collection("walls")
    .where("creator", "==", userId)
    .where("name", "==", wallName)
    .limit(1)
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        console.log("doc");
        userWallId = doc.id;
      });
    });
  if (!userWallId) {
    return {
      props: {
        error: true,
      },
      revalidate: 1000 * 60 * 60,
    };
  }
  return {
    props: {
      username: username,
      wallId: userWallId,
      error: false,
      wallName,
      profilePic: userData.photo,
    },
  };
};

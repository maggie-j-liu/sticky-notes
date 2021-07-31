import { useEffect } from "react";
import userExists from "utils/userExists";
import useUser from "utils/useUser";
import firebase from "utils/firebase";
import Loading from "components/Loading";
import FourOhFour from "components/404";
const Edit = ({ error, userId }) => {
  const { user } = useUser();
  /*
  useEffect(() => {
    const getData = async () => {
      const db = firebase.firestore();
    };
    if (userId === user.uid) {
    }
  }, [userId, user]);
  */
  if (error) {
    return <FourOhFour />;
  }
  if (!userId || !user) {
    return <Loading />;
  }
  return <FourOhFour />;
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

export default Edit;

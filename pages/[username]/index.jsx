const UserPage = ({ username }) => {
  return <div>{username}</div>;
};

export default UserPage;

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      username: params.username,
    },
    revalidate: 10,
  };
};

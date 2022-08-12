export default function UserProfilePage(props) {
    return <h1>{props.username}</h1>
  }
  
  export async function getServerSideProps(context) {
    const { params, req, res } = context;
    // console.log(req,res) server data/cookie data
    // can not set revalidate bc getServerSideProps always revalidates
    return {
      props: {
        username: 'Jess'
      }
    };
  }
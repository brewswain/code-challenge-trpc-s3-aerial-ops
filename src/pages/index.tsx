import { type NextPage } from "next";

import { MessageModule } from "../components";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <MessageModule />
    </>
  );
};

export default Home;

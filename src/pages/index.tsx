import { type NextPage } from "next";

import { Messages } from "../features";

import { api } from "../utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="bg-background">
      <Messages />
    </div>
  );
};

export default Home;

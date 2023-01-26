import { type NextPage } from "next";

import { Messages } from "../features";

import { api } from "../utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="h-[100vh]  bg-slate-500">
      <Messages />
    </div>
  );
};

export default Home;

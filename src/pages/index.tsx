import { type NextPage } from "next";

import { Messages } from "../features";

const Home: NextPage = () => {
  return (
    <div className="h-[100vh]  bg-slate-500">
      <Messages />
    </div>
  );
};

export default Home;

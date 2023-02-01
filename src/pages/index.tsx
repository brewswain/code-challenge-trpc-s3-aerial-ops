import { type NextPage } from "next";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Messages } from "../features";

const Home: NextPage = () => {
  return (
    <div className="h-[100vh]  bg-slate-500">
      <Messages />
      <ToastContainer
        theme="dark"
        position="bottom-right"
        closeOnClick
        draggable
      />
    </div>
  );
};

export default Home;

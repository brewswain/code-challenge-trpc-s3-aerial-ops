import { type NextPage } from "next";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Messages } from "../features";

const Home: NextPage = () => {
  const renderToast = (toastMessage: string) => toast(toastMessage);

  return (
    <div className="h-[100vh]  bg-slate-500">
      <button onClick={() => renderToast("test")}>toast!</button>
      <Messages />
      <ToastContainer />
    </div>
  );
};

export default Home;

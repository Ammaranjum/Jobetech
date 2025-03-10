// import Header from "@/components/header";
import New_header from "@/components/new_header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <New_header />
        <Outlet />
      </main>
      {/* // footer will do abdullah */}
    </div>
  );
};

export default AppLayout;

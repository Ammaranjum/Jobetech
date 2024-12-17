import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      {/* /footer Componnent should be written here */}
      <div className="p-10 text-center bg-gray-800 mt-10">
        Copy Right Trademark of Ammar Anjum. 
      </div>
    </div>
  );
};

export default AppLayout;

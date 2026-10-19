import Navbar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* SideBar controls its own visibility (hidden lg:flex) and width —
          render it directly as a flex sibling, don't wrap it in another
          breakpoint here or the two can fight each other. */}
      <SideBar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main
          style={{ scrollbarWidth: "none" }}
          className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
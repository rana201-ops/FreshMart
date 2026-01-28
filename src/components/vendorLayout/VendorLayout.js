import VendorNav from "./VendorNav";
import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <VendorNav />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;

import SellerDrawerList from "../sidebar/SellerDrawerList";
import Navbar from "../../Common/Navbar";
import SellerRoutes from "../../routes/SellerRoutes";

const SellerDashboard = () => {
  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <Navbar DrawerList={SellerDrawerList} />
      <section className="lg:flex lg:h-[90vh]">
        <div className="hidden lg:block h-full">
          <SellerDrawerList />
        </div>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <SellerRoutes />
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;

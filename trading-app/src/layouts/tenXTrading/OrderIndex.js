// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Orders from "./Header/Order/Order";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <Orders />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;

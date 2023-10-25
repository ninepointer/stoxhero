import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import AdminReportHeader from "./Header";

function AdminReport() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <AdminReportHeader/>
    </DashboardLayout>
  );
}

export default AdminReport;

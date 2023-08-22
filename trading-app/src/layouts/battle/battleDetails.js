// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateBattleForm from "./createBattleForm";
// import TabContext from '@material-ui/lab/TabContext';

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CreateBattleForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;

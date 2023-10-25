// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

export default function UserReportData() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  // useEffect(()=>{
  //   axios.get(`${baseUrl}api/v1/readuserdetails`)
  //   .then((res) => {
  //       setUserDetail(res.data);
  //   }).catch((err) => {
  //       return new Error(err);
  //   })
  // }, [])

  return {
    columns: [
      { Header: "Trader Name", accessor: "name", align: "center" },
      { Header: "Date", accessor: "date", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", align: "center" },
      { Header: "Transaction Cost", accessor: "brokerage", align: "center" },
      { Header: "Net P&L", accessor: "netPnl", align: "center" },
      { Header: "# of Trades", accessor: "noOfTrade", align: "center" },
      { Header: "# of Lots Used", accessor: "lotUsed", align: "center" },
    ],

    rows: [

    ],
  };
}

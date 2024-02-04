// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect} from "react"
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

function AddFunds({ render}) {

  const [totalCredit, setTotalCredit] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {

    axios.get(`${baseUrl}api/v1/getTotalFundsCredited`, { withCredentials: true })
      .then((res) => {
        setTotalCredit(res.data);
      }).catch((err) => {
        // window.alert("Error Fetching Trader Details");
        return new Error(err);
      })
  }, [render])



  let totalAmountCredited = totalCredit[0] ? totalCredit[0]?.totalCredit : 0
  let totalAmountCreditedStrings = totalAmountCredited >= 0 ? "+₹" + Number(totalAmountCredited).toLocaleString() : "-₹" + (-Number(totalAmountCredited)).toLocaleString()
  

  return (<>
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Total Funds Details
        </MDTypography>
        
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
          <MDBox p="15px" fontWeight="600">
              Total Amount Credited:
          </MDBox>
          </Grid>
          <Grid item xs={12} md={4}>
          <MDBox p="15px" fontWeight="600">
              {totalAmountCreditedStrings}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
    </>
  );
}



export default AddFunds;

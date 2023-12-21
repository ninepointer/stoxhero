import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";
// import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import DataTable from "../../../examples/Tables/DataTable";
import {apiUrl} from "../../../constants/constants"
import { Divider } from '@mui/material';
import MDButton from '../../../components/MDButton'

function ReferralProduct() {
  const [data,setData] = useState([]);
  const [transaction,setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 4;

  useEffect(()=>{

    axios.get(`${apiUrl}referrals/referredproduct`,{withCredentials:true})
    .then((res)=>{
        setTransaction(res?.data?.data[0]?.transaction);
        const startIndex = (currentPage - 1) * perPage;
        const slicedData = res?.data?.data[0]?.transaction?.slice(startIndex, startIndex + perPage);
        setData(slicedData);
        // setData(res?.data?.data[0]?.transaction);
    }).catch((err)=>{
        return new Error(err);
    });
  },[]);

  useEffect(()=>{
    const startIndex = (currentPage - 1) * perPage;
    const slicedData = transaction?.slice(startIndex, startIndex + perPage);
    setData(slicedData);
  }, [currentPage])



  let referralRows = [];

//   data?.map((elem,index)=>{
//     let joinedRowData = {}

//     joinedRowData.serialno = (
//         <MDTypography variant="Contained" color = 'dark' fontWeight="small">
//             {index+1}
//         </MDTypography>
//     );
//     joinedRowData.fullName = (
//         <MDTypography variant="Contained" color = 'dark' fontWeight="small">
//             {elem?.buyer_name}
//         </MDTypography>
//     );
//     joinedRowData.product = (
//         <MDTypography variant="Contained" color = 'dark' fontWeight="small">
//             {elem?.product}
//         </MDTypography>
//     );
//     joinedRowData.referredProduct = (
//         <MDTypography variant="Contained" color = 'dark' fontWeight="small">
//             {elem?.productReferred}
//         </MDTypography>
//     );
//     joinedRowData.earnings = (
//         <MDTypography variant="Contained" color = 'dark' fontWeight="small">
//             { "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.payout))}
//         </MDTypography>
//     );

//     referralRows.push(joinedRowData);
//   })

//   data?.transaction?.map((elem)=>{
//     referralRows.push(elem?.product)
//   })

const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
            <Grid item xs={12} md={12} lg={12}>
                <Card>
                    <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
                        px={2}
                        variant="gradient"
                        bgColor="dark"
                        borderRadius="lg"
                        coloredShadow="dark"
                        sx={{
                            display: 'flex',
                            justifyContent: "space-between",
                        }}>
                        <MDTypography variant="h6" color="white" py={1}>
                            Affiliate Transactions
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={2}>
                        {/* <DataTable
                            table={{ columns : referralColumns, rows : referralRows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                        /> */}
                        {
                            data.map((elem)=>{
                                return (
                                    <>
                                        <Grid>
                                            <MDTypography color="dark" fontSize={15} fontWeight='bold'>{`${elem.buyer_first_name} is purchased ${elem.product}`}</MDTypography>
                                        </Grid>
                                        <Grid item xs={0} md={0.5} lg={0.5}>
                                            <Divider orientation="vertical" style={{ backgroundColor: 'dark', height: '96vh' }} hidden={{ mdDown: true }} />
                                        </Grid>
                                    </>
                                )
                            })
                        }

                          {data?.length > 0 &&
                              <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                                  <MDButton variant='outlined' color='warning' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
                                  <MDTypography color="light" fontSize={12} fontWeight='bold'>Transactions: {transaction.length} | Page {currentPage} of {Math.ceil(transaction.length / perPage)}</MDTypography>
                                  <MDButton variant='outlined' color='warning' disabled={Math.ceil(transaction.length / perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
                              </MDBox>
                          }
                    </MDBox>
                </Card>
            </Grid>
        </Grid>
    </MDBox>
  );
}

export default ReferralProduct;

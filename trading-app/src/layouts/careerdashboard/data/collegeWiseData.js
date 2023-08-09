import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from '../../../AuthContext';
import moment from 'moment';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress, TextField} from "@mui/material";
import { Autocomplete, Box, Grid } from "@mui/material";

import { styled } from '@mui/material';


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;
export default function CollegeWiseData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // let [skip, setSkip] = useState(0);
  // const limitSetting = 10;
  // const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(true);
  // const [college, setCollege] = useState([]);
  // const [value, setValue] = useState({})
  const perPage = 10; // Number of documents per page
  // const pageNumber = 1; // Current page number


  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${baseUrl}api/v1/internbatch/collegewiseuser`, {
        withCredentials: true,
      })
      .then((res) => {
        const allData = res.data.data;
        setAllData(res.data.data);
        const startIndex = (currentPage - 1) * perPage;
        const slicedData = allData.slice(startIndex, startIndex + perPage);
        setData(slicedData);
        setIsLoading(false);
      })
      .catch((err) => {
        // Handle errors here
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        console.error(err);
      });
  }, []);

  useEffect(()=>{
    const startIndex = (currentPage - 1) * perPage;
    const slicedData = allData.slice(startIndex, startIndex + perPage);
    setData(slicedData);
  }, [currentPage])

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  console.log("current page", currentPage, allData.length)

  return (

    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container >
        <Grid container p={1} style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={12} md={2} lg={6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">College Name</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Total User</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Active User</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Inactive User</MDTypography>
              </Grid>
        </Grid>

            {!isLoading ?
             data?.map((elem)=>{
                // const fullName = elem?.trader?.first_name + ' ' + elem?.trader?.last_name
                // const typecolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
                return(
              
                    
                    <Grid container mt={1} p={1} style={{border:'1px solid white', borderRadius:5}}>
                        <Grid item xs={12} md={2} lg={6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem.collegeName}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2}>
                            <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.activeUser + elem?.inactiveUser}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.activeUser}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.inactiveUser}</MDTypography>
                        </Grid>
                        {/* <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={typecolor} fontSize={10} fontWeight="bold">{elem?.buyOrSell}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.order_id}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.status}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{moment.utc(elem?.trade_time).utcOffset('+00:00').format('DD-MMM HH:mm:ss')}</MDTypography>
                        </Grid> */}
                    </Grid>
                    
                
                )
            })
            :
            <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                <MDBox mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                </Grid>
            </Grid>
            }
            {!isLoading &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                <MDButton variant='outlined' color='warning' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
                <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Data: {allData.length} | Page {currentPage} of {Math.ceil(allData.length/perPage)}</MDTypography>
                <MDButton variant='outlined' color='warning' disabled={Math.ceil(allData.length/perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
            </MDBox>
            }

      </Grid>
    </MDBox>

  );
}

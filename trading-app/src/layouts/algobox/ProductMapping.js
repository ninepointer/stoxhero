import React from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
// import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";
import AlgoHeader from "./Header";
import ProductMappingModel from './ProductMappingModel';
import ProductData from './data/ProductData';


const ProductMapping = () => {
  const { columns, rows } = ProductData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  return (
    <>
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
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                        sx={{
                            display: 'flex',
                            justifyContent: "space-between",
                          }}>

                        <MDTypography variant="h6" color="white" py={2.5}>
                        Product Mapping
                        </MDTypography>
                        <ProductMappingModel/>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                            table={{ columns, rows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                </Card>
            </Grid>
            {/* <Grid item xs={12} md={12} lg={12}>
                <Card>
                    <MDBox
                        mx={2}
                        mt={-3}
                        py={3}
                        px={2}
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                    >
                        <MDTypography variant="h6" color="white">
                            Histroical Traders Orders(Mock)
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                            table={{ columns: pColumns, rows: pRows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                </Card>
            </Grid>*/}
        </Grid> 
    </MDBox> 
    </>
  )
}

export default ProductMapping
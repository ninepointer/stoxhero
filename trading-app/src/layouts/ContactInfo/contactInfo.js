import React from 'react'
import MDBox from '../../components/MDBox'
import MDTypography from '../../components/MDTypography'
import DataTable from '../../examples/Tables/DataTable';
import { Grid } from '@mui/material';

const contactInfo = () => {
    let rows =[];
    let columns = [];
  return (
    <Grid container>
        <MDBox>
            <MDTypography>
                Contact Information
            </MDTypography>
            <MDBox>
                {/* <DataTable
                    rows={rows}
                    columns={columns}
                /> */}
            </MDBox>
        </MDBox>
    </Grid>
  )
}

export default contactInfo
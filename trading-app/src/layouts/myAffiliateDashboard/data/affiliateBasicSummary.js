import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardContent, CardMedia, Divider, FormControl, Grid, InputLabel, Select } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import logo from '../../../assets/images/logo1.jpeg'
import affiliate from '../../../assets/images/affiliate.jpg'

import { userContext } from '../../../AuthContext';
import { apiUrl } from '../../../constants/constants';
import { userRole, adminRole} from "../../../variables"

export default function AfiliateBasicSummary({affiliateData, setReferralData}) {
  let [isLoading,setIsLoading] = useState([])
  const getDetails = useContext(userContext);
  const userDetails = getDetails.userDetails

  const [basicSummary,setBasicSummary] = useState([])

  useEffect(() => {
    setIsLoading(true)
    if (affiliateData || userDetails?.role?.roleName === userRole) {
      let call1 = axios.get((`${apiUrl}affiliate/${userDetails?.role?.roleName === adminRole ? "adminoverview" : "overview"}?affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`), {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      Promise.all([call1])
        .then(([api1Response]) => {
          setBasicSummary(api1Response?.data?.data)
          setReferralData(api1Response?.data?.data)
          setIsLoading(false)
        })
        .catch((error) => {
          //   Handle errors here
          console.error(error);
        });
    }

  }, [affiliateData])

  return (
    <Card sx={{ minWidth: '100%', minHeight: '410px', maxWidth: '100%', maxHeight: '410px', alignContent: 'center', alignItems: 'center' }}>
      <CardMedia
        component="img"
        alt="signup"
        height={userDetails?.role?.roleName === userRole ? "80" : "150"}
        image={userDetails?.role?.roleName === userRole ?
          (basicSummary?.image?.url || logo) :
          affiliate
        }
      />
      <CardContent style={{ mt: -1, width: '100%' }} display='flex' justifyContent='center'>
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          {userDetails?.role?.roleName === userRole &&
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                {basicSummary?.userName}
              </MDTypography>
            </Grid>}
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDTypography fontSize={10} fontWeight="bold" color="text.secondary" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px', backgroundColor: 'lightgrey' }}>
              Lifetime Earnings
            </MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
              {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(basicSummary?.lifetimeEarning || 0))}
            </MDTypography>
          </Grid>

          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
              <MDTypography fontSize={10} fontWeight="bold" color="warning" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Total Referrals
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
              <MDTypography fontSize={10} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Active Referrals
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
              <MDTypography fontSize={10} fontWeight="bold" color="success" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Paid Referrals
              </MDTypography>
            </Grid>
          </Grid>
          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
              <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((basicSummary?.affiliateRefferalCount) || 0))}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
              <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((basicSummary?.activeAffiliateRefferalCount) || 0))}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
              <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((basicSummary?.paidAffiliateRefferalCount) || 0))}
              </MDTypography>
            </Grid>
          </Grid>

          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
              <MDTypography fontSize={10} fontWeight="bold" color="warning" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Active/Total
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
              <MDTypography fontSize={10} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Paid/Total
              </MDTypography>
            </Grid>
          </Grid>
          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
              <MDTypography variant="h6" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                {basicSummary?.affiliateRefferalCount > 0 ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((basicSummary?.activeAffiliateRefferalCount * 100 / basicSummary?.affiliateRefferalCount) || 0)) : 0}%
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
              <MDTypography variant="h6" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                {basicSummary?.affiliateRefferalCount > 0 ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((basicSummary?.paidAffiliateRefferalCount * 100 / basicSummary?.affiliateRefferalCount) || 0)) : 0}%
              </MDTypography>
            </Grid>
          </Grid>
        </Grid>

        {(affiliateData?.affiliatePrograme === "All" || affiliateData?.affiliateType === "All") ?
          <></>
          :
          <>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                <MDTypography fontSize={10} fontWeight="bold" color="text.secondary" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px', backgroundColor: 'lightgrey' }}>
                  Amount/Referral
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                <MDTypography fontSize={10} fontWeight="bold" color="text.secondary" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px', backgroundColor: 'lightgrey' }}>
                  Commission %
                </MDTypography>
              </Grid>
            </Grid>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                <MDTypography variant="h6" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                  {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(basicSummary?.rewardPerReferral || 0))}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                <MDTypography variant="h6" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(basicSummary?.commissionPercentage || 0))}%
                </MDTypography>
              </Grid>
            </Grid>
          </>
        }

      </CardContent>
    </Card>
  );
}
import React, {useContext} from "react";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import FnOImage from "../../assets/images/fnoImage.jpg";
import equityImage from "../../assets/images/equityImage.jpg";
import { userContext } from "../../AuthContext";
import { Link } from "react-router-dom";

import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


function PreTrading() {
  const getDetails = useContext(userContext);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={0} mt={5} display="flex" justifyContent='space-around' alignContent='center' alignItem='center'>

        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={FnOImage}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              F&O Trading
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign={"justify"}>
              Futures and options are financial derivatives that allow traders to speculate on the price movements of an underlying asset without actually owning it.
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
            size="small"
            component = {Link}
            to={{
                pathname: `/${getDetails.userDetails.collegeDetails.college.route}/market`,
              }}
            >Start Trading</Button>
          </CardActions>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={equityImage}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Stock Trading
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign={"justify"}>
              Stock trading broadly refers to any buying and selling of stock, but is colloquially used to refer to more shorter-term investments made by very active investors.
            </Typography>
            {/* <Typography variant="body2" color="#4F93ED" textAlign={"center"}>
            Comming Soon!
            </Typography> */}
          </CardContent>
          <CardActions>
            <Button size="small">Comming Soon!</Button>
          </CardActions>
        </Card>

      </MDBox>
    </DashboardLayout>
  );
}

export default PreTrading;
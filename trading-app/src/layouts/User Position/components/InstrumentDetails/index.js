import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiStockFill } from "react-icons/ri";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";
import MDSnackbar from "../../../../components/MDSnackbar";


// Data
import data from "./data";
import { useEffect } from "react";
import axios from "axios";
import BuyModel from "./data/BuyModel";
import SellModel from "./data/SellModel";
import { Typography } from "@mui/material";






function InstrumentDetails({socket, Render}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { reRender, setReRender } = Render;
  let { columns, rows, instrumentData } = data(reRender);
  console.log("rows", rows)
  const [menu, setMenu] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [isAppLive, setisAppLive] = useState('');
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);



  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {

      // setMarketData(data);
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })
  }, [reRender])


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`)
      .then((res) => {
        setisAppLive(res.data[0].isAppLive);
      });
  }, [reRender]);

  async function removeInstrument(instrumentToken){
    console.log("in remove")
    const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        isAddedWatchlist: false
      })
    });

    const permissionData = await response.json();
    console.log("remove", permissionData)
    if (permissionData.status === 422 || permissionData.error || !permissionData) {
        window.alert(permissionData.error);
        //console.log("Failed to Edit");
    }else {
      // window.alert(permissionData.massage);
        //console.log(permissionData);
        // window.alert("Edit succesfull");
        //console.log("Edit succesfull");
        openSuccessSB();
    }
    reRender ? setReRender(false) : setReRender(true);
  }

  
  rows.map((elem)=>{

    console.log("rows elem", elem)
    let ltpObj = {};
    let pericularInstrument = instrumentData.filter((element)=>{
      return elem.instrumentToken.props.children == element.instrumentToken
    })
    marketData.map((subelem)=>{
      const percentagechangecolor = subelem.change >= 0 ? "success" : "error"
      const percentagechangecolor1 = (((subelem.last_price - subelem.average_price) / subelem.average_price)*100) >= 0 ? "success" : "error"
      if(elem.instrumentToken.props.children === subelem.instrument_token){
        console.log("rows ltp", elem.symbol.props.children, subelem.last_price)
        elem.last_price = (
            <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
              {"₹"+(subelem.last_price).toFixed(2)}
            </MDTypography>
          );
          if(subelem.change){
            elem.change = (
              <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
                {subelem.change >= 0 ? "+" + ((subelem.change).toFixed(2))+"%" : ((subelem.change).toFixed(2))+"%"}
              </MDTypography>
            );
          } else{
            elem.change = (
              <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor1} fontWeight="medium">
                {(((subelem.last_price - subelem.average_price) / subelem.average_price)*100) >= 0 ? "+" + (((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%" : (((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%"}
              </MDTypography>
            );
          }

          elem.buy = (
            <BuyModel Render={{ reRender, setReRender }} symbol={pericularInstrument[0].symbol} exchange={pericularInstrument[0].exchange} instrumentToken={pericularInstrument[0].instrumentToken} symbolName={pericularInstrument[0].instrument} lotSize={pericularInstrument[0].lotSize} maxLot={pericularInstrument[0].maxLot} ltp={(subelem.last_price).toFixed(2)}/>
          );
          
          elem.sell = (
            <SellModel Render={{ reRender, setReRender }} symbol={pericularInstrument[0].symbol} exchange={pericularInstrument[0].exchange} instrumentToken={pericularInstrument[0].instrumentToken} symbolName={pericularInstrument[0].instrument} lotSize={pericularInstrument[0].lotSize} maxLot={pericularInstrument[0].maxLot} ltp={(subelem.last_price).toFixed(2)}/>
          );

          elem.remove = (
            <MDButton size="small" color="secondary" onClick={()=>{removeInstrument(elem.instrumentToken.props.children)}}>
              <RemoveCircleOutlineIcon  />
            </MDButton>
          );

      }
    })
    // ltpArr.push(elem);
  })


  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

    // let title = "App " + appstatus
  // let enablestatus = settingData[0]?.isAppLive === true ? "enabled" : "disabled"
  let content = "Instrument Removed"
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      // title={title}
      content={content}
      // dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox display="flex">
          <MDTypography variant="h6" gutterBottom>
            Market Watchlist
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
            <MDTypography 
            p={1}
            fontWeight="bold" 
            variant="button" 
            color={isAppLive ? "success" : "error"}
            style={{borderRadius: '4px', border: '1px solid grey', animation: 'blinking 1s infinite'}}
            >
              {isAppLive ? "System Live" : "System Offline"}
            </MDTypography>
        </MDBox>
      </MDBox>
      {rows.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <RiStockFill style={{fontSize: '40px'}}/>
        <Typography style={{fontSize: '25px'}}>Nothing here</Typography>
        <Typography mb={2} fontSize={15}>Use the search bar to add instruments.</Typography>
        <MDButton variant="outlined" color="info">Add Instrument</MDButton>
      </MDBox>)
      :
      (<MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
      )}
      {renderSuccessSB}
    </Card>
  );
}

export default InstrumentDetails;



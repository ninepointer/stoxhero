import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Grid, TextField, MenuItem } from '@mui/material';
import { withStyles } from '@mui/styles';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MonthLineChart from '../data/MonthLineChart'
import { apiUrl } from '../../../constants/constants';
import TableView from "../data/tableView"
import moment from 'moment';

export default function LabTabs() {
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  const [dateWiseData, setDateWiseData] = useState([]);
  const [subscriptions,setSubscription] = useState([]);
  const [selectedSubscription, setselectedSubscription] = useState();
  const [payout, setPayout] = useState();
  const [selectTab, setselectedTab] = useState("Trader Side");

  const CustomTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#ffffff', // Replace 'red' with your desired text color
        textAlign: 'center',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  const CustomTextField2 = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#ffffff', // Replace 'red' with your desired text color
        textAlign: 'center',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  useEffect(()=>{
    axios.get(`${apiUrl}dailycontest/contests/completedadmin`, {withCredentials: true})
    .then((res)=>{
      setSubscription(res.data.data);
      setselectedSubscription(res.data.data[0])
    }).catch(e => console.log(e));
  },[])


  useEffect(()=>{
    handleShowDetails();
  },[ selectedSubscription?._id, selectTab])

  const handleShowDetails = async() => {
    if (selectedSubscription?._id) {
      let endpoint;
      if(selectTab === "Trader Side"){
        endpoint = "traderwisetraderpnlreport"
      } else{
        endpoint = "traderwisecompanypnlreport"
      }
      const res = await axios.get(`${apiUrl}dailycontest/trade/${selectedSubscription?._id}/${endpoint}`, { withCredentials: true });
      console.log(res.data.data);
      setDateWiseData(prev => res.data.data);
      setPayout(res?.data?.user);
    }
  }

  console.log("selectedSubscription", selectedSubscription)


  let totalgpnl =0 , totalnpnl =0, totalBrokerage =0, totalOrders=0, totalTradingDays =0, positiveTrader =0, negetiveTrader = 0;
  if(dateWiseData.length>0){
    // console.log('datewise',dateWiseData);
    for(let item of dateWiseData ){
      totalgpnl += item.gpnl;
      totalnpnl += item.npnl;
      totalBrokerage += item.brokerage;
      totalOrders += item.noOfTrade;

      if(item.npnl >= 0){
        positiveTrader += 1;
      }
      else{
        negetiveTrader+=1;
      }
    }


  }

  function changeDateFormat(givenDate) {

    const date = new Date(givenDate);

    // Convert the date to IST
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());

    // Format the date as "dd Month yyyy | hh:mm AM/PM"
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

    console.log(formattedDate);

    // Helper function to get the month name
    function getMonthName(month) {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return monthNames[month];
    }

    // Helper function to format time as "hh:mm AM/PM"
    function formatTime(hours, minutes) {
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes} ${meridiem}`;
    }

    return formattedDate;

  }

  let ptraders = selectedSubscription?.participants?.reduce((count, currentItem) => {
    if (currentItem?.payout && currentItem?.payout > 0) {
      return count + 1;
    }
    return count;
  }, 0)

  // console.log("+ve Trader", dateWiseData)

  return (

    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>

      <MDBox mb={2} style={{ border: '1px solid white', borderRadius: 5 }} display="flex" justifyContent="space-between">
        <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">Daily Contest Report</MDTypography>
        <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            select
            label=""
            value={`${selectedSubscription?.contestName} - ${changeDateFormat(selectedSubscription?.contestStartTime)}`}
            minHeight="4em"
            placeholder="Select Contest"
            variant="outlined"
            sx={{ width: "400px" }}
            onChange={(e) => {setselectedSubscription(subscriptions.filter((item) => item.contestName == (e.target.value).split(" | ")[0].slice(0, -13).trim())[0]) }}
            InputLabelProps={{
              style: { color: '#ffffff' },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { width: '400px' }, // Replace '200px' with your desired width
                },
              },
            }}
          >
            {subscriptions?.map((option) => (
              <MenuItem key={`${option?.contestName} - ${changeDateFormat(option?.contestStartTime)}`} value={`${option?.contestName} - ${changeDateFormat(option?.contestStartTime)}`} minHeight="4em" width='300px'>
                {`${option?.contestName} - ${changeDateFormat(option?.contestStartTime)}`}
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField2
            select
            label=""
            value={selectTab}
            minHeight="4em"
            placeholder="Select Type"
            variant="outlined"
            sx={{ width: '150px', marginLeft: '4px', marginRight: '4px' }}
            onChange={(e) => setselectedTab(e.target.value)}
            InputLabelProps={{
              style: { color: '#ffffff' },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { width: '150px' }, // Replace '200px' with your desired width
                },
              },
            }}
          >
            <MenuItem value="Trader Side" minHeight="4em">
              Trader Side
            </MenuItem>
            <MenuItem value="Company Side" minHeight="4em">
              Company Side
            </MenuItem>
          </CustomTextField2>
        </MDBox>

      </MDBox>

      <Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="light" borderRadius={5}>

            <MDBox>
              <Grid container spacing={0} p={2} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">

                <Grid item xs={12} md={6} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Gross:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color={totalgpnl > 0 ? "success" : "error"}>{totalgpnl >= 0 ? `₹${totalgpnl?.toFixed(2)}` : `-₹${-1 * totalgpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Net:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color={totalnpnl > 0 ? "success" : "error"}>{totalnpnl >= 0 ? `₹${totalnpnl?.toFixed(2)}` : `-₹${-1 * totalnpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Brokerage:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="info">{totalBrokerage >= 0 ? `₹${totalBrokerage?.toFixed(2)}` : `-₹${Math.abs(totalBrokerage?.toFixed(2))}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Orders:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="#344767">{totalOrders}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Payout:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="#344767">{payout?.totalPayout?.toFixed(2)}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">+Ve Trader:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="success">{positiveTrader}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">-Ve Trader:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="error">{negetiveTrader}</MDTypography>
                  </MDBox>
                </Grid>

              </Grid>
            </MDBox>

          </MDBox>
        </Grid>
      </Grid>

      {<Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="light" borderRadius={5}>

            <MDBox>
              <Grid container spacing={0} p={1} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
                
                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11}>Contest:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{selectedSubscription?.contestName}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11}>Gross P&L:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{totalgpnl >= 0 ? `₹${totalgpnl?.toFixed(2)}` : `-₹${-1 * totalgpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11}>Net P&L:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{totalnpnl >= 0 ? `₹${totalnpnl?.toFixed(2)}` : `-₹${-1 * totalnpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Date:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {moment.utc(selectedSubscription?.contestStartTime).utcOffset('+05:30').format('DD-MMM-YY')}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Day:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {moment.utc(selectedSubscription?.contestStartTime).utcOffset('+05:30').format('dddd')}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Contest For:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.contestFor}
                    </MDTypography>
                  </MDBox>
                </Grid> 

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Max. Participants:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.maxParticipants}
                    </MDTypography>
                  </MDBox>
                </Grid> 

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} ># of Participants:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.participants?.length}
                    </MDTypography>
                  </MDBox>
                </Grid>  

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Filled(%):&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {((selectedSubscription?.participants?.length)/(selectedSubscription?.maxParticipants)*100).toFixed(2)}%
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Entry Fee:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(selectedSubscription?.entryFee)}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Portfolio Value:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(selectedSubscription?.portfolio?.portfolioValue)}
                    </MDTypography>
                  </MDBox>
                </Grid> 

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Payout Percentage:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.payoutPercentage}%
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Max Payout:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(
                          selectedSubscription?.participants.reduce((max, participant) => {
                            console.log(max,participant)
                              return Math.max(parseFloat(max ? max : 0), (participant?.payout ? parseFloat(participant?.payout) : 0));
                            }, parseFloat(selectedSubscription?.participants[0].payout))
                        )}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Total Payout:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                        selectedSubscription?.participants?.reduce((total,item)=>{
                          return parseFloat(total) + parseFloat(item?.payout ? item?.payout : 0)
                        },0)
                        )}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >(+) Traders:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {ptraders}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >(-) Traders:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.participants?.length-ptraders}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Traders(%) in loss:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {(((selectedSubscription?.participants?.length-ptraders)/selectedSubscription?.participants?.length)*100).toFixed(0)}%
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >NIFTY:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.isNifty ? 'Yes' : 'No'}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >BANKNIFTY:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.isBankNifty ? 'Yes' : 'No'}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >FINNIFTY:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >
                      {selectedSubscription?.isFinNifty ? 'Yes' : 'No'}
                    </MDTypography>
                  </MDBox>
                </Grid>

              </Grid>
            </MDBox>

          </MDBox>
        </Grid>
      </Grid>}

      <Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <MonthLineChart monthWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

      <Grid mt={0} container spacing={3}>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} borderRadius={4}>
            <TableView dateWiseData={dateWiseData} contestData={selectedSubscription} tab={selectTab}/>
          </MDBox>
        </Grid>

      </Grid>

    </MDBox>
  );
}
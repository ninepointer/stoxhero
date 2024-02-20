import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import { withStyles } from '@mui/styles';
import { MenuItem, TextField } from "@mui/material";



function TenxOrderDetail({infinityView, selectedSubscription, setselectedSubscription, userSubs, setUserSubs}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

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

    const [allSubsciption, setAllSubsription] = useState([]);
    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/tenX/mySubscription`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
        })
        .then((res) => {
            setAllSubsription(res.data.data)
            setselectedSubscription(res.data.data[0])
            setUserSubs(res.data.data[0]?.userPurchaseDetail[0])
        }).catch((err) => {
            console.log(err)
            return new Error(err);
        })
    }, [])

    function onChangeSubs(e){
      let data = allSubsciption.filter((item) => item.subscriptionName == (e.target.value))[0]
      setselectedSubscription(data)
      setUserSubs(data?.userPurchaseDetail[0])
    }

    function changeDateFormat(givenDate) {

        const date = new Date(givenDate);

        // Convert the date to IST
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());

        // Format the date as "dd Month yyyy | hh:mm AM/PM"
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

        // console.log(formattedDate);

        // Helper function to get the month name
        function getMonthName(month) {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
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

    // console.log("userSubs", userSubs)

    return (

        <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            select
            label=""
            value={`${selectedSubscription?.subscriptionName}`}
            minHeight="4em"
            placeholder="Select Subscription"
            variant="outlined"
            sx={{ width: "220px", marginRight: '8px',  }}
            onChange={(e) => { onChangeSubs(e) }}
            InputLabelProps={{
              style: { color: '#ffffff' },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { width: '220px' }, // Replace '200px' with your desired width
                },
              },
            }}
          >
            {allSubsciption?.map((option) => (
              <MenuItem key={`${option?.subscriptionName}`} value={`${option?.subscriptionName}`} minHeight="4em" width='300px'>
                {`${option?.subscriptionName}`}
              </MenuItem>
            ))}
          </CustomTextField>
          {/* value={selectedSubscription.userPurchaseDetail[0].subscribedOn && userSubs?.subscribedOn ? `${selectedSubscription?.subscriptionName}-${changeDateFormat(userSubs?.subscribedOn)}` : `${selectedSubscription?.subscriptionName}-${changeDateFormat(selectedSubscription.userPurchaseDetail[0].subscribedOn)}`} */}
          {infinityView !== "today" &&
          <CustomTextField2
            select
            label=""
            value={`${selectedSubscription?.subscriptionName}-${changeDateFormat(userSubs?.subscribedOn)}`}
            minHeight="4em"
            placeholder="Select Type"
            variant="outlined"
            sx={{ width: '370px', marginRight: '8px' }}
            // onChange={(e) => setUserSubs((e.target.value).split("-")[1])}
            onChange={(e)=>{setUserSubs(selectedSubscription?.userPurchaseDetail.filter((item) => changeDateFormat(item.subscribedOn) == ((e.target.value).split("-")[1]))[0]) }}
            InputLabelProps={{
              style: { color: '#ffffff' },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { width: '370px' }, // Replace '200px' with your desired width
                },
              },
            }}
          >
            {selectedSubscription?.userPurchaseDetail?.map((option) => (
              <MenuItem key={`${option?._id}`} value={`${selectedSubscription?.subscriptionName}-${changeDateFormat(option?.subscribedOn)}`} minHeight="4em" width='300px'>
                {`${selectedSubscription?.subscriptionName}-${changeDateFormat(option?.subscribedOn)}`}
              </MenuItem>
            ))}
          </CustomTextField2>
          }
        </MDBox>
    );
}


export default TenxOrderDetail;

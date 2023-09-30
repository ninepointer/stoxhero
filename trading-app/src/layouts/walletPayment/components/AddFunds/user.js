import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import MDBox from "../../../../components/MDBox";
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Grid } from "@mui/material";
import { styled } from '@mui/material';


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;
function Users({ setPaymentBy }) {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [trader, setTrader] = useState([]);
  const [value, setValue] = useState({})

  useEffect(() => {

    let abortController;

    (async () => {
      abortController = new AbortController();
      let signal = abortController.signal;

      // the signal is passed into the request(s) we want to abort using this controller
      const { data } = await axios.get(`${baseUrl}api/v1/normalusers`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        signal: signal
      }
      );
      setTrader(data.data);
      setValue(data?.data[0])

    })();

    return () => abortController.abort();
  }, [])


  const handleTraderOptionChange = (event, newValue) => {
    console.log("Trader Selection:",newValue)
    setValue(newValue);
    setPaymentBy(newValue);
  };

  return (
    <MDBox sx={{ backgroundColor: "white", display: "flex", borderRadius: 2 }}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{ width: "100%" }}>

        <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAutocomplete
            id="country-select-demo"
            sx={{
              width: "100%",
              '& .MuiAutocomplete-clearIndicator': {
                color: 'dark',
              },
              
            }}
            options={trader}
            value={value}
            onChange={handleTraderOptionChange}
            autoHighlight
            getOptionLabel={(option) => option.first_name + ' ' + option.last_name + ' - ' + option.mobile}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {/* <img
                  loading="lazy"
                  width="20"
                  src={option.profilePhoto?.url || Logo}
                  srcSet={option.profilePhoto?.url || Logo}
                  alt=""
                /> */}
                {option.first_name + ' ' + option.last_name + ' - ' + option.mobile}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a Trader"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                  style: { color: 'dark', height: "10px" }, // set text color to dark
                }}
                InputLabelProps={{
                  style: { color: 'dark' },
                }}
              />
            )}
          />


        </MDBox>

        {
          Object.keys(value ? value : {}).length !== 0 &&
          <Grid container lg={12} paddingRight={2} key={value?._id}
            sx={{
              fontSize: 13,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
              color: "#000000",
            }}
          >
            <Grid xs={5} lg={3} >{value?.first_name + " " + value?.last_name}</Grid>
            <Grid xs={5} lg={3}>{value?.email}</Grid>
            <Grid xs={5} lg={3}>{value?.mobile}</Grid>
            <Grid xs={5} lg={3} >{value?.employeeid}</Grid>
          </Grid>
        }
      </MDBox>
    </MDBox>
  )
}

export default Users;

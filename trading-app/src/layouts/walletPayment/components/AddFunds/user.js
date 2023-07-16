import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import MDBox from "../../../../components/MDBox";
import TextField from '@mui/material/TextField';
import { Autocomplete, Grid } from "@mui/material";

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

        })();

        return () => abortController.abort();
    }, [])



    return (
        <MDBox sx={{ backgroundColor: "white", display: "flex", borderRadius: 2 }}>
            <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{ width: "100%" }}>

                <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <Autocomplete
                        value={Object.keys(value ? value : {}).length !== 0 ? value : ""}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                setValue({
                                    title: newValue,
                                });
                                setPaymentBy({
                                    title: newValue,
                                })
                            } else if (newValue && newValue.inputValue) {
                                // Create a new value from the user input
                                setValue({
                                    title: newValue.inputValue,
                                });
                                setPaymentBy({
                                    title: newValue.inputValue,
                                });
                            } else {
                                setPaymentBy(newValue);
                                setValue(newValue);
                            }
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="traders"
                        options={trader}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return `${option.first_name} ${option.last_name}`;
                        }}
                        renderOption={(props, option) => <li {...props}>{`${option.first_name} ${option.last_name}`}</li>}
                        sx={{ width: "100%" }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} label="Select User for payment" />
                        )}
                    /> */}

<Autocomplete
  value={Object.keys(value ? value : {}).length !== 0 ? value : ""}
  onChange={(event, newValue) => {
    
    if (typeof newValue === 'string') {
      setValue({
        title: newValue,
      });
      setPaymentBy({
        title: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setValue({
        title: newValue.inputValue,
      });
      setPaymentBy({
        title: newValue.inputValue,
      });
    } else {
      setPaymentBy(newValue);
      setValue(newValue);
    }
  }}
  selectOnFocus
  clearOnBlur
  handleHomeEndKeys
  id="traders"
  options={trader}
  getOptionLabel={(option) => {
    
    if (typeof option === 'string') {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return `${option.first_name} ${option.last_name} (${option.mobile})`;
  }}
  renderOption={(props, option) => (
    // console.log("option", option)  
    <li {...props}>
      {`${option.first_name} ${option.last_name} (${option.mobile})`}
    </li>
  )}
  sx={{ width: "100%" }}
  freeSolo
  renderInput={(params) => (
    <TextField {...params} label="Search by name or mobile" />
  )}
/>



                </MDBox>

                {
                Object.keys(value ? value : {}).length !== 0 &&
                    <Grid container lg={12} paddingRight={2} key={value?._id} mt={.5}
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

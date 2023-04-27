import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


const RolesModel = ({Render}) => {
  const {reRender, setReRender} = Render
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [formstate, setformstate] = useState({
    roleName: "",
    status: ""
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  async function formSubmit() {
    setformstate(formstate);

    const { roleName, status} = formstate;

    const res = await fetch(`${baseUrl}api/v1/role`, {
      
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          roleName, status
        })
    });


    const data = await res.json();
    //console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        //console.log("Invalid Entry");
    }else{
        window.alert("User Created Successfully");
        //console.log("entry succesfull");
    }
    setOpen(false);
    reRender ? setReRender(false) : setReRender(true)

  }

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create Role
      </MDButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
            {/* <TextField
              id="outlined-basic" label="Role Name" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} /> */}

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Role Name</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Role Name"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.roleName = e.target.value}}
              > 
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Infinity Trader">Infinity Trader</MenuItem>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Moderator">Moderator</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.status = e.target.value}}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={formSubmit}>
            Save
          </Button>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RolesModel;
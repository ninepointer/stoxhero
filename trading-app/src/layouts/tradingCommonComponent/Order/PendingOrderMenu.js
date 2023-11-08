import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { apiUrl } from '../../../constants/constants';
import EditPriceModal from './editPriceModal';
import { renderContext } from '../../../renderContext';


export default function AccountMenu({id, setUpdate, lots, symbol, type, buyOrSell, ltp, from}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { render, setRender } = useContext(renderContext);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cancelOrder = async () => {
    const res = await fetch(`${apiUrl}pendingorder/${id}/${from}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        // body: JSON.stringify({
        //     marginDeduction
        // })
    });
    const dataResp = await res.json();
    if (dataResp.status === 500 || dataResp.error || !dataResp) {

    } else {
        const data = dataResp.data;
        setUpdate(data);
    }

    handleClose();
    render ? setRender(false) : setRender(true);
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {/* <Tooltip title="Account settings"> */}
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 3 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertTwoToneIcon  />
          </IconButton>
        {/* </Tooltip> */}
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={cancelOrder} >
          <HighlightOffIcon sx={{ mr: 2 }} /> Cancel Order
        </MenuItem>
        <MenuItem>
          <EditPriceModal id={id} lots={lots} symbol={symbol} type={type} buyOrSell={buyOrSell} ltp={ltp} />
        </MenuItem>
      </Menu>
      {/* <EditPriceModal openEditModal = {openEditModal} setOpenEditModal={setOpenEditModal}/> */}
    </React.Fragment>
  );
}

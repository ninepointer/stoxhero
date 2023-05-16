import React, {useState} from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import man from '../../../assets/images/man.png'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

//data

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <MDBox bgColor="white" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
        {/* <MDBox display='flex' justifyContent='center'>

        
            <MDBox bgColor='green' width={{ xs: '50%', sm: '45%', lg: '15%' }} ml={1} mr={1} borderRadius={4}>
                <MDBox display='flex' justifyContent='left'>
                    <MDTypography m={1} fontSize={15} fontWeight='bold' color="light">New User</MDTypography>
                </MDBox>
                <MDBox display='flex' alignContent='center' alignItems='center'>
                    <MDBox width='25%' ml={2} display='flex' justifyContent='flex-start'>
                        <PersonAddAltIcon color='white' fontSize='medium'/>
                    </MDBox>
                    <MDBox width='75%' display='flex' flexDirection='column' justifyContent='flex-end'>
                        <MDTypography display='flex' justifyContent='center' fontSize={20} fontWeight='bold' color="light">NA</MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox mt={1} bgColor='lightgreen' display='flex' justifyContent='center'>
                    <MDButton variant='text' color='dark' size='small' style={{ flex: 1 }}>
                        View Details
                    </MDButton>
                </MDBox>
            </MDBox>

            <MDBox bgColor='info' width={{ xs: '50%', sm: '45%', lg: '15%' }} ml={1} mr={1} borderRadius={4}>
                <MDBox display='flex' justifyContent='left'>
                    <MDTypography m={1} fontSize={15} fontWeight='bold' color="light">Career App.</MDTypography>
                </MDBox>
                <MDBox display='flex' alignContent='center' alignItems='center'>
                    <MDBox width='25%' ml={2} display='flex' justifyContent='flex-start'>
                        <PersonAddAltIcon color='white' fontSize='medium'/>
                    </MDBox>
                    <MDBox width='75%' display='flex' flexDirection='column' justifyContent='flex-end'>
                        <MDTypography display='flex' justifyContent='center' fontSize={20} fontWeight='bold' color="light">NA</MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox mt={1} bgColor='lightblue' display='flex' justifyContent='center'>
                    <MDButton variant='text' color='dark' size='small' style={{ flex: 1 }}>
                        View Details
                    </MDButton>
                </MDBox>
            </MDBox>

            <MDBox bgColor='green' width={{ xs: '50%', sm: '45%', lg: '15%' }} ml={1} mr={1} borderRadius={4}>
                <MDBox display='flex' justifyContent='left'>
                    <MDTypography m={1} fontSize={15} fontWeight='bold' color="light">New User</MDTypography>
                </MDBox>
                <MDBox display='flex' alignContent='center' alignItems='center'>
                    <MDBox width='25%' ml={2} display='flex' justifyContent='flex-start'>
                        <PersonAddAltIcon color='white' fontSize='medium'/>
                    </MDBox>
                    <MDBox width='75%' display='flex' flexDirection='column' justifyContent='flex-end'>
                        <MDTypography display='flex' justifyContent='center' fontSize={20} fontWeight='bold' color="light">1,500</MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox mt={1} bgColor='lightgreen' display='flex' justifyContent='center'>
                    <MDButton variant='text' color='dark' size='small' style={{ flex: 1 }}>
                        View Details
                    </MDButton>
                </MDBox>
            </MDBox>

            <MDBox bgColor='green' width={{ xs: '50%', sm: '45%', lg: '15%' }} ml={1} mr={1} borderRadius={4}>
                <MDBox display='flex' justifyContent='left'>
                    <MDTypography m={1} fontSize={15} fontWeight='bold' color="light">New User</MDTypography>
                </MDBox>
                <MDBox display='flex' alignContent='center' alignItems='center'>
                    <MDBox width='25%' ml={2} display='flex' justifyContent='flex-start'>
                        <PersonAddAltIcon color='white' fontSize='medium'/>
                    </MDBox>
                    <MDBox width='75%' display='flex' flexDirection='column' justifyContent='flex-end'>
                        <MDTypography display='flex' justifyContent='center' fontSize={20} fontWeight='bold' color="light">1,500</MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox mt={1} bgColor='lightgreen' display='flex' justifyContent='center'>
                    <MDButton variant='text' color='dark' size='small' style={{ flex: 1 }}>
                        View Details
                    </MDButton>
                </MDBox>
            </MDBox>

            <MDBox bgColor='green' width={{ xs: '50%', sm: '45%', lg: '15%' }} ml={1} mr={1} borderRadius={4}>
                <MDBox display='flex' justifyContent='left'>
                    <MDTypography m={1} fontSize={15} fontWeight='bold' color="light">New User</MDTypography>
                </MDBox>
                <MDBox display='flex' alignContent='center' alignItems='center'>
                    <MDBox width='25%' ml={2} display='flex' justifyContent='flex-start'>
                        <PersonAddAltIcon color='white' fontSize='medium'/>
                    </MDBox>
                    <MDBox width='75%' display='flex' flexDirection='column' justifyContent='flex-end'>
                        <MDTypography display='flex' justifyContent='center' fontSize={20} fontWeight='bold' color="light">1,500</MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox mt={1} bgColor='lightgreen' display='flex' justifyContent='center'>
                    <MDButton variant='text' color='dark' size='small' style={{ flex: 1 }}>
                        View Details
                    </MDButton>
                </MDBox>
            </MDBox>

            <MDBox bgColor='green' width={{ xs: '50%', sm: '45%', lg: '15%' }} ml={1} mr={1} borderRadius={4}>
                <MDBox display='flex' justifyContent='left'>
                    <MDTypography m={1} fontSize={15} fontWeight='bold' color="light">New User</MDTypography>
                </MDBox>
                <MDBox display='flex' alignContent='center' alignItems='center'>
                    <MDBox width='25%' ml={2} display='flex' justifyContent='flex-start'>
                        <PersonAddAltIcon color='white' fontSize='medium'/>
                    </MDBox>
                    <MDBox width='75%' display='flex' flexDirection='column' justifyContent='flex-end'>
                        <MDTypography display='flex' justifyContent='center' fontSize={20} fontWeight='bold' color="light">1,500</MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox mt={1} bgColor='lightgreen' display='flex' justifyContent='center'>
                    <MDButton variant='text' color='dark' size='small' style={{ flex: 1 }}>
                        View Details
                    </MDButton>
                </MDBox>
            </MDBox>

        </MDBox> */}

        <MDBox minHeight='40vH' border='1px solid grey' borderRadius={4} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
            <MDAvatar src={man}></MDAvatar>
            <MDTypography fontSize={20} fontWeight='bold'>Under Construction</MDTypography>
        </MDBox>

    </MDBox>
  );
}
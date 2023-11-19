import * as React from 'react';
import {useState} from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
// import EditFeature from './editFeature';
import MDSnackbar from "../../../components/MDSnackbar";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';



export default function FeatureData({updatedDocument, setUpdatedDocument}) {
    console.log("updatedDocument", updatedDocument)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    let columns = [
        { Header: "#", accessor: "orderNo", align: "center" },
        { Header: "Header", accessor: "description", align: "center" },
        { Header: "Content", accessor: "content", align: "center" },
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Delete", accessor: "delete", align: "center" },
      ]

    let rows = [];

    // async function deleteFeature(id){
    //   const res = await fetch(`${baseUrl}api/v1/tenX/removefeature/${id}`, {
    //     method: "PATCH",
    //     credentials: "include",
    //     headers: {
    //         "Accept": "application/json",
    //         "content-type": "application/json"
    //     },
    //     body: JSON.stringify({
          
    //     })
    // });
    // const dataResp = await res.json();
    // //console.log(dataResp);
    // if (dataResp.status === 422 || dataResp.error || !dataResp) {
    //     // window.alert(dataResp.error);
    //     openErrorSB("Error", "Unexpected error")

    // } else {
    //     //console.log(dataResp);
    //     setUpdatedDocument(dataResp?.data)
    //     openSuccessSB("Success", "Feature deleted successfully")
    //     // window.alert("delete succesfull");
    //     //console.log("Edit succesfull");
    // }
    // }

    updatedDocument?.blogContent?.map((elem)=>{
      let featureObj = {}
      featureObj.orderNo = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem?.serialNumber}
        </MDTypography>
      );
      featureObj.header = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem?.header}
        </MDTypography>
      );
      featureObj.content = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem?.content}
        </MDTypography>
      );
      featureObj.edit = (
        <MDButton size='small' component="a" variant="caption" color="text" fontWeight="medium">
          {/* <EditFeature data={elem} setUpdatedDocument={setUpdatedDocument}/> */}
        </MDButton>
      );
      featureObj.delete = (
        <MDButton size='small' component="a" variant="caption" color="text" fontWeight="medium" 
        // onClick={()=>{deleteFeature(elem._id)}}
        >
          {/* <DeleteForeverIcon/> */}
        </MDButton>
      );

      rows.push(featureObj)
    })

    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title,content) => {
        setTitle(title)
        setContent(content)
        setSuccessSB(true);
    }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Content
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          // noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
      {renderSuccessSB}
      {renderErrorSB}
    </Card>
  

  );
}


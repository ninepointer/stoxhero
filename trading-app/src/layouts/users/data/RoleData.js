// Material Dashboard 2 React components
import MDTypography from "../../../components/MDTypography";
import {useEffect, useState} from 'react';
import axios from 'axios';

export default function RoleData(reRender) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [role, setRole] = useState([]);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/role`)
      .then((res)=>{
            setRole(res?.data?.data);
            console.log(res?.data?.data);
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  },[reRender])

  // numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/limit);
  // console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)
console.log(role)
  let roleArr = [];
  
  role?.map((elem)=>{
    let obj = {}

    obj.createdOn = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {(elem.createdOn)?.toString()?.split("T")[0]}
      </MDTypography>
      );
      obj.roleName = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.roleName}
      </MDTypography>
    );
    obj.createdBy = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.createdBy?.name}
      </MDTypography>
    );
    obj.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );

    roleArr.push(obj)
  })

  return {
    columns: [
      { Header: "Created On", accessor: "createdOn", align: "center"},
      { Header: "Role Name", accessor: "roleName", align: "center" },
      { Header: "Created By", accessor: "createdBy", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
    ],

    rows: roleArr,
  };
}
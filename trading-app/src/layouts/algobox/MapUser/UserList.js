import React, { useState } from "react";
import { useEffect } from "react";
import Select from 'react-select';
import axios from "axios"
import uniqid from "uniqid";

export default function UserList({addUser, setAddUser, setPermissionData, algoId, reRender}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [data, setData] = useState([]);
    const [permissionArr, setPermission] = useState([]);
    // const {setReRender, reRender} = Render;
    const _id = uniqid();

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readuserdetails`, {withCredentials: true})
        .then((res)=>{
            setData(res.data);
            //console.log(res.data);

        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readpermission`, {withCredentials: true})
        .then((res)=>{
            setPermission(res.data);
            setPermissionData(res.data);

        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })

    },[reRender])

    if(data.length !== 0 && permissionArr.length !== 0){
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < permissionArr.length; j++){
                if(data[i] && data[i]._id === permissionArr[j].userId && permissionArr[j].algoId === algoId){
                    data.splice(i, 1);
                    j = -1;
                }
            }
        }
    }

    let options = [];
    if(data.length !== 0){
        for(let elem of data){
            options.push({value: elem._id, label: elem.name, userId: {_id: elem._id, name: elem.name}, _id:_id});
        }
    }

    return (
        <div>
            <Select
                placeholder="Select User"
                onChange={setAddUser}
                isMulti
                options={options}
                className="primary"
            />
        </div>
    )
}
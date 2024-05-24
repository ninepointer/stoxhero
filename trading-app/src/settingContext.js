import React, {useEffect, useState} from 'react'
import { apiUrl } from "./constants/constants";
import axios from "axios"

export const settingContext = React.createContext();

export default function SettingContext({children}) {

  const [setting, setSetting] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}usersetting`, {withCredentials: true})
      .then((res) => {
        setSetting(res.data.data)
      });
  }, []);

  return (
      <settingContext.Provider value={setting}>
        {children}
      </settingContext.Provider>
  )
}

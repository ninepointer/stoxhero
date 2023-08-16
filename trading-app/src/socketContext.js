import { io } from "socket.io-client";
import React, {useEffect, useContext} from 'react'
import { userContext } from "./AuthContext";

export const socketContext = React.createContext();

export default function SocketContext({children}) {
    // const getDetails = useContext(userContext);
    console.log("socket is connected 1st")
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

    let socket;
    // let socket;
    try {
      socket = io.connect(`${baseUrl1}`);
    //   socket.on("connect", () => {
    //     console.log("socket is connected 3rd", socket);
    //   });
    } catch (err) {
      throw new Error(err);
    }

    useEffect(() => {
        console.log("socket is connected 2nd", socket)
        socket.on("connect", () => {
            console.log("socket is connected 3rd", socket)
        //   socket.emit('userId', getDetails.userDetails._id)
        //   socket.emit("user-ticks", getDetails.userDetails._id)
        })
      }, []);
  return (
      <socketContext.Provider value={socket}>
        {children}
      </socketContext.Provider>
  )
}

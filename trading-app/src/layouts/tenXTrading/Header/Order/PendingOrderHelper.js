import {memo, useState} from 'react';
import AccountMenu from './PendingOrderMenu';


function OrderHelper({from, symbol, averagePrice, amount, quantity, buyOrSell, type, status, time, id, setUpdatePendingOrder}) {


    let styleTD = {
      textAlign: "center",
      fontSize: ".75rem",
      fontColor: "grey",
      color: "#7b809a",
      fontWeight: "600",
      paddingTop: "2.5px",
      paddingBottom: "2.5px"
    }

  return (
    <>
      <td style={styleTD} >{symbol}</td>
      <td style={styleTD} >{quantity}</td>
      <td style={styleTD} >₹{averagePrice}</td>
      <td style={styleTD} >₹{amount}</td>
      <td style={styleTD} >{type}</td>
      <td style={{...styleTD, color: `${buyOrSell === "BUY" ? "green" : "red"}`}} >{buyOrSell}</td>
      <td style={{...styleTD, color: `${status === "Pending" ? "grey" : status === "Executed" ? "green" : "red"}`}} >{status}</td>
      <td style={styleTD} >{time}</td>
      {from !=="ExecutedOrder" &&
        <td style={styleTD} ><AccountMenu setUpdate={setUpdatePendingOrder} id={id} /> </td>
      }
    </>
  );
}

export default memo(OrderHelper);
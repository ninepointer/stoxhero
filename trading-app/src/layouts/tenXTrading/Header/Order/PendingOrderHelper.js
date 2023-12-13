import {memo, useState} from 'react';
import AccountMenu from './PendingOrderMenu';


function OrderHelper({execution_price, execution_time, ltp, from, symbol, averagePrice, amount, quantity, buyOrSell, type, status, time, id, setUpdatePendingOrder}) {


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
      {/* {from =="ExecutedOrder" ?
      <td style={styleTD} >₹{execution_price}</td>
      : */}
      <td style={styleTD} >₹{averagePrice}</td>
      {/* } */}
      {from =="ExecutedOrder" ?
      <td style={styleTD} >₹{amount}</td>
      :
      <td style={styleTD} >{ltp}</td>
      }
      <td style={styleTD} >{type}</td>
      <td style={{...styleTD, color: `${buyOrSell === "BUY" ? "green" : "red"}`}} >{buyOrSell}</td>
      <td style={{...styleTD, color: `${status === "Pending" ? "grey" : status === "Executed" ? "green" : "red"}`}} >{status}</td>
      {/* {from =="ExecutedOrder" ? */}
      <td style={styleTD} >{time}</td>
       {/* :
       <td style={styleTD} >{execution_time}</td>} */}
      {from !=="ExecutedOrder" &&
        <td style={styleTD} ><AccountMenu setUpdate={setUpdatePendingOrder} id={id} lots={quantity} symbol={symbol} type={type} buyOrSell={buyOrSell} ltp={ltp} /> </td>
      }
    </>
  );
}

export default memo(OrderHelper);
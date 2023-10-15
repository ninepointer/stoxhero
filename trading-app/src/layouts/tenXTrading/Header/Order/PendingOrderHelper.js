import {memo, useState} from 'react';
import AccountMenu from './PendingOrderMenu';


function OrderHelper({ symbol, averagePrice, amount, quantity, buyOrSell, type, status, time, id}) {

  const [update, setUpdate] = useState();

  console.log(update)
    let styleTD = {
      textAlign: "center",
      fontSize: ".75rem",
      fontColor: "grey",
      color: "#7b809a",
      fontWeight: "600",
      paddingTop: "4px",
      paddingBottom: "4px"
    }

  return (
    <>
      <td style={styleTD} >{symbol}</td>
      <td style={styleTD} >{quantity}</td>
      <td style={styleTD} >{averagePrice}</td>
      <td style={styleTD} >{amount}</td>
      <td style={styleTD} >{type}</td>
      <td style={{...styleTD, color: `${buyOrSell === "BUY" ? "green" : "red"}`}} >{buyOrSell}</td>
      {update?.status ?
      <td style={{...styleTD, color: `${update?.status === "Pending" ? "grey" : update?.status === "Executed" ? "green" : "red"}`}} >{update?.status}</td>
      :
      <td style={{...styleTD, color: `${status === "Pending" ? "grey" : status === "Executed" ? "green" : "red"}`}} >{status}</td>
      }
      <td style={styleTD} >{time}</td>
      <td style={styleTD} ><AccountMenu setUpdate={setUpdate} id={id} /> </td>
    </>
  );
}

export default memo(OrderHelper);

import {memo} from 'react';
import { AiOutlineLineChart } from 'react-icons/ai';
import { InfinityTraderRole } from "../../../variables";


function OrderHelper({from, symbol, averagePrice, amount, quantity, buyOrSell, orderid, status, time}) {


    let styleTD = {
      textAlign: "center",
      fontSize: ".75rem",
      fontColor: "grey",
      color: "#7b809a",
      fontWeight: "600"
    }

  return (
    <>
      <td style={styleTD} >{symbol}</td>
      <td style={styleTD} >{quantity}</td>
      <td style={styleTD} >{averagePrice}</td>
      <td style={styleTD} >{amount}</td>
      <td style={styleTD} >{buyOrSell}</td>
      <td style={styleTD} >{orderid}</td>
      <td style={styleTD} >{status}</td>
      <td style={styleTD} >{time}</td>
    </>
  );
}

export default memo(OrderHelper);














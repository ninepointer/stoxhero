
import {memo} from 'react';
import { AiOutlineLineChart } from 'react-icons/ai';
import { InfinityTraderRole } from "../../../variables";


function InstrumentComponent({from, chartInstrument, last_price, change, contractDate, symbol, instrument}) {

  // console.log("rendering : InstrumentComponent", chartInstrument)

    let styleTD = {
      textAlign: "center",
      fontSize: ".75rem",
      fontColor: "grey",
      color: "#7b809a",
      fontWeight: "600"
    }

  return (
    <>
      <td style={styleTD} >{contractDate}</td>
      <td style={{...styleTD, color: `${symbol.includes('CE') ? "green" : "red"}`}} >{symbol}</td>
      <td style={{...styleTD, color: `${symbol.includes('CE') ? "green" : "red"}`}} >{instrument}</td>
      <td style={{...styleTD, color: `${(change.includes('+')) ? "green" : "red"}`}} >{last_price}</td>
      <td style={{...styleTD, color: `${(change.includes('+')) ? "green" : "red"}`}} >{change}</td>
      {from !== InfinityTraderRole &&
      <td style={{...styleTD, cursor: "pointer"}} onClick={() => { window.open(`/chart?instrument=${chartInstrument}`, '_blank') }} >
        <AiOutlineLineChart size={20} />
      </td>}
    </>
  );
}

export default memo(InstrumentComponent);














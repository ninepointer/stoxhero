
import {memo} from 'react';


function InstrumentComponent({last_price, change, contractDate, symbol, instrument}) {

  console.log("rendering : InstrumentComponent")

    let styleTD = {
        textAlign: "center",
        fontSize: ".75rem",
        fontColor: "grey",
        color: "#7b809a",
        fontWeight: "600",
        marginTop:"20px"
      }

  return (
    <>
      <td style={styleTD} >{contractDate}</td>
      <td style={{...styleTD, color: `${symbol.includes('CE') ? "green" : "red"}`}} >{symbol}</td>
      <td style={{...styleTD, color: `${symbol.includes('CE') ? "green" : "red"}`}} >{instrument}</td>
      <td style={{...styleTD, color: `${(change.includes('+')) ? "green" : "red"}`}} >{last_price}</td>
      <td style={{...styleTD, color: `${(change.includes('+')) ? "green" : "red"}`}} >{change}</td>
    </>
  );
}

export default memo(InstrumentComponent);














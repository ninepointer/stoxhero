import {memo} from 'react';


function CollegeComponent({college,zone,action}) {


    let styleTD = {
        textAlign: "center",
        fontSize: ".75rem",
        fontColor: "grey",
        color: "#7b809a",
        fontWeight: "600"
      }

  return (
    <>
      
      <td style={{...styleTD}}>{college}</td>
      <td style={{...styleTD}}>{zone}</td>
      <td style={{...styleTD}}>{action}</td>
      
    </>
  );
}

export default memo(CollegeComponent);
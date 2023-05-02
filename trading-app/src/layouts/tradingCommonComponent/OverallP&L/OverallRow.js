
// import {memo} from 'react';
// // import colors from '../../../assets/theme/base/colors';
// import Grid from '@mui/material/Grid'
// import MDTypography from '../../../components/MDTypography';



// function OverallRow({last_price, change, grossPnl, avgPrice, product, symbol, quantity, netPnl}) {

//     // let styleTD = {
//     //     textAlign: "center",
//     //     fontSize: ".75rem",
//     //     fontColor: "#7b809a",
//     //     color: "#7b809a",
//     //     fontWeight: "600" , color: "#7b809a"
//     //   }

//   return (
//     <>
          
//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center"  style={{borderBottom:'1px solid #f8f9fa'}}>
//             <MDTypography style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}  color={`${quantity ==0 ? 'secondary' : product === 'NRML' ? 'info' : product === 'MIS' ? 'warning' : 'error'}`}>{product}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
//             <MDTypography color = {`${quantity ===0 ? 'secondary' : symbol?.includes('CE') ? "success" : "error"}`} style={{ textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{symbol}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography  style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}} color={`${quantity ==0 ? 'secondary' : quantity > 0 ? "success" : "error"}`}>{quantity}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color={`${quantity ==0 ? 'secondary' : (change?.includes('+')) ? "success" : "error"}`} style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{avgPrice}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color={`${quantity ==0 ? 'secondary' : change?.includes('+') > 0 ? "success" : "error"}`} style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{last_price}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//           <MDTypography color={`${quantity ==0 ? 'secondary' : grossPnl?.includes('+') > 0 ? "success" : "error"}`} style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{grossPnl}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//           <MDTypography color={`${quantity ==0 ? 'secondary' : netPnl?.includes('+') > 0 ? "success" : "error"}`} style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{netPnl}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color={`${quantity ==0 ? 'secondary' : (change?.includes('+')) ? "success" : "error"}`} style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{change}</MDTypography>
//           </Grid>

//     </>
//   );
// }

// export default memo(OverallRow);


import {memo} from 'react';
import colors from '../../../assets/theme/base/colors';


function OverallRow({last_price, change, grossPnl, avgPrice, product, symbol, quantity, netPnl}) {

    let styleTD = {
        textAlign: "center",
        fontSize: ".65rem",
        fontColor: "grey",
        color: "#7b809a",
        fontWeight: "600"
      }

  return (
    <>
      {/* <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : product === 'NRML' ? colors.info.main : product === 'MIS' ? colors.warning.main : 'red'}`, paddingLeft: "20px"}} >{product}</td> */}
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : symbol?.includes('CE') ? "green" : "red"}` }} >{symbol}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : quantity > 0 ? "green" : "red"}`}} >{quantity}</td>
      <td style={{...styleTD}} >{avgPrice}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : (change?.includes('+')) ? "green" : "red"}`}} >{last_price}</td>
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : grossPnl?.includes('+') > 0 ? "green" : "red"}`}} >{grossPnl}</td>
      {/* <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : netPnl?.includes('+') > 0 ? "green" : "red"}`}} >{netPnl}</td> */}
      <td style={{...styleTD, color: `${quantity ==0 ? 'grey' : (change?.includes('+')) ? "green" : "red"}`}} >{change}</td>
    </>
  );
}

export default memo(OverallRow);
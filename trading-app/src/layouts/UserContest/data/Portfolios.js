import React, {useState, useEffect, memo} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {Link} from 'react-router-dom'
import MDSnackbar from "../../../components/MDSnackbar";
import {useNavigate} from 'react-router-dom';
import { CircularProgress } from "@mui/material";





const ContestPortfolioCard = ({contestId, endDate, contestName, entry, minEntry}) => {
  
  const [contestPortfolioData,setContestPortfolioData] = useState([]);
  const [portfolioPnl, setUserPortfolioPnl] = useState([]);
  const [objectId,setObjectId] = useState(contestId);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [isLoading,setIsLoading] = useState(true)

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const nevigate = useNavigate();

  const isDummy = (new Date()) < new Date(endDate);


  useEffect(()=>{
  
    axios.get(`${baseUrl}api/v1/portfolio/user`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
        setContestPortfolioData(res.data.data);
        setIsLoading(false);
        console.log(res.data.data)
      }).catch((err)=>{
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/portfolio/pnl`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      .then((res)=>{
        setUserPortfolioPnl(res.data);
        setIsLoading(false);
        console.log(res.data)
      }).catch((err)=>{
        return new Error(err);
      })

  },[])

    const [buttonClicked, setButtonClicked] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState(false);
  
    const handleButtonClick = async () => {
      if(!selectedPortfolio){
        console.log("in join if")
        openSuccessSB("Failed","Please select a portfolio", "FAIL")
        return;
      }
      await joinContest();
      
    };
  
    useEffect(() => {
      if (buttonClicked) {
        setShouldNavigate(true);
      }
    }, [buttonClicked]);
  
    useEffect(() => {
      if (shouldNavigate) {
        nevigate(`/battlestreet/${contestName}`, {
          state: {entry: entry, minEntry: minEntry, contestId: objectId, portfolioId: selectedPortfolio, isDummy: isDummy}
        });
      }
    }, [shouldNavigate]);


  async function joinContest(){
    console.log("in join")

    // console.log("in joinContest func", contestId, selectedPortfolio)
    const res = await fetch(`${baseUrl}api/v1/contest/${contestId}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio
        })
    });
    
    const data = await res.json();
    console.log(data);
    if(data.status === "error" || data.error || !data){
        // window.alert(data.error);
        console.log("invalid entry");
        openSuccessSB("Warning", data.message, "FAIL")
    }else{
        // setNextPage(false)
        // window.alert("entry succesfull");
        openSuccessSB("Great",`You have successfully registered for the battle ${contestName}`, "SUCCESS")
        
        console.log("entry succesfull");
        setButtonClicked(true);
    }

  }

  // const [title,setTitle] = useState('')
  // const [content,setContent] = useState('')
  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    // successSB: false,
    color: "",
    icon: ""
  })
  const openSuccessSB = (title,content, message) => {
    msgDetail.title = title;
    msgDetail.content = content;
    // msgDetail.successSB = true;
    if(message == "SUCCESS"){
      msgDetail.color = 'success';
      msgDetail.icon = 'check'
    } else {
      msgDetail.color = 'error';
      msgDetail.icon = 'warning'
    }
    console.log(msgDetail)
    setMsgDetail(msgDetail)
    // setTitle(title)
    // setContent(content)
    setSuccessSB(true);
  }

  const closeSuccessSB = () =>{
    // msgDetail.successSB = false
    setSuccessSB(false);

  }

  // const closeSuccessSB = () => msgDetail.successSB = false;


  const renderSuccessSB = (
  <MDSnackbar
      color={msgDetail.color}
      icon={msgDetail.icon}
      title={msgDetail.title}
      content={msgDetail.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
  />
  );
      
  console.log(renderSuccessSB) 
    
    return (
      <>
      {isLoading ?
      <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="light" />
      </Grid>
      :
      <>
      {contestPortfolioData.length > 0 ?
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          {contestPortfolioData?.map((e)=>{

            let color = (selectedPortfolio === e._id) ? "warning" : "light";
            let portfolio = portfolioPnl.filter((elem)=>{
              return e?._id === elem?._id?.portfolioId
            })

            let netPnl = portfolio[0]?.amount - portfolio[0]?.brokerage;

          return (
            
            <Grid key={e._id} item xs={12} md={6} lg={6} >
            <MDBox bgColor='light' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color={color} size="small" 
              // component={Link} 

              onClick={()=>{setSelectedPortfolio(e._id)}}
              
            >
                <Grid container spacing={0}>
                    
                    <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{e?.portfolioName}</MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black"}}>Portfolio Value: <span>₹{(e?.portfolioValue).toLocaleString()}</span> </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black"}}>Current Value: <span>₹{netPnl ? (e?.portfolioValue + netPnl).toFixed(0): e?.portfolioValue.toFixed(0)}</span> </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioType}</span></MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e.portfolioAccount}</span></MDTypography>
                    </Grid>

                </Grid>
            </MDButton>
            </MDBox>
            </Grid>
            
          )
          })}
          <Grid container >
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">Select Your Portfolio and click on join!</MDTypography>
          </Grid>
            <Grid item mt={2} xs={6} md={3} lg={6} display="flex" justifyContent="center"> 
                <MDButton variant="outlined" size="small" color="light"
                  component={selectedPortfolio && Link} 
                  // to={ selectedPortfolio && {
                  //     pathname: `/arena/contest/${nextPagePath}`,
                  //   }}
                    // state= { selectedPortfolio && {contestId: contestId, portfolioId: selectedPortfolio}}

                    onClick={handleButtonClick}
                >
                    Join
                </MDButton>
                { renderSuccessSB}
                {/* {buttonClicked && renderSuccessSB} */}
                {/* {nevigate(`/arena/contest/${nextPagePath}`)} */}
            </Grid>
            <Grid item mt={2} xs={6} md={3} lg={6} display="flex" justifyContent="center"> 
                <MDButton variant="outlined" size="small" color="light" 
                  component={Link} 
                  to={{
                      pathname: `/battlestreet`,
                    }}
                >
                    Back
                </MDButton>
                
            </Grid>
          </Grid>
        </Grid>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">You do not have any portfolio to join the battle</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
      }
      </>
)}



export default memo(ContestPortfolioCard);
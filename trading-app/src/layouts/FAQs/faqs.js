import React, { useState } from "react";
import MDBox from "../../components/MDBox";
import { Grid } from "@mui/material";
import MDTypography from "../../components/MDTypography";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MDButton from "../../components/MDButton";


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";


function FAQs() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();
  const [expanded, setExpanded] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  
  const expansion = (id) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [id]: !prevExpanded[id]
    }));
  };

  return (
    <>
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10}>
        <MDBox>
            <MDTypography mt={2} fontSize={25} fontWeight="bold" color="light" align="center">Have questions about StoxHero?</MDTypography>
            <MDTypography fontSize={20} fontWeight="normal" color="light" align="center">Find your answers in the Frequently Asked Questions (FAQs)</MDTypography>
        </MDBox>
        <Grid container spacing={2} xs={12} md={12} lg={12} mt={1}  mb={5} display="flex" justifyContent="center">
            <Grid item xs={12} md={12} lg={10}>
                <MDBox bgColor="light" style={{border:'1px solid white', borderRadius:5}}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography style={{fontSize:18, fontWeight:700}} color="dark" ml={2}>About StoxHero</MDTypography>
                    
                    <MDButton 
                        variant="text" 
                        size="large" 
                        color="dark"
                        onClick={()=>expansion(1)}
                        style={{transition: "all 0.8s ease-out"}}
                        >
                            {!expanded[1] ?  <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </MDButton>
                    
                    </MDBox>
                    {expanded[1] && 
                    <>
                    <MDTypography ml={2} mr={2} fontSize={15} fontWeight="bold" color="dark">What is StoxHero?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark">
                        StoxHero is India's fastest growing options trading learning platform aimed at helping genZ master the art of 'Trading'. On StoxHero, Traders learn how to pick the right contracts using virtual money by participating in experiential learning programs.
                    </MDTypography> 

                    {/* <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Can I Join A Battle On StoxHero Without A Trading Account?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark">
                        Yes, trading account is not needed to get started. At registration, each user is awarded virtual currency of INR 10,00,000 in three different portfolios named Trading, Battle Mania and Battle Fever. While Trading Portfolio is for virtual intra-day trading, Battle Mania and Battle Fever are used only to participate in StoxHero Battles. Users can start adding contracts to these portfolios with the virtual cash.
                    </MDTypography> */}

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Do I Trade Contracts With Real Money?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        No, you trade with virtual money. This money can be used to build a portfolio consisting of virtual contracts.
                    </MDTypography>      
                    </>
                    }
                </MDBox>
            </Grid>

            <Grid item xs={12} md={12} lg={10}>
                <MDBox bgColor="light" style={{border:'1px solid black', borderRadius:5}}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography style={{fontSize:18, fontWeight:700}} color="dark" ml={2}>Login & Registration</MDTypography>
                    
                    <MDButton 
                        variant="text" 
                        size="large" 
                        color="dark"
                        onClick={()=>expansion(2)}
                        style={{transition: "all 0.8s ease-out"}}
                        >
                            {!expanded[2] ?  <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </MDButton>
                    
                    </MDBox>
                    {expanded[2] && 
                    <>
                    <MDTypography ml={2} mr={2} fontSize={15} fontWeight="bold" color="dark">How Do I Register On StoxHero?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Enter your First Name</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Enter your Last Name</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Enter your Email ID</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Enter your Mobile Number</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Hit on SignUp and confirm your OTP</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Check your email for account details</span>
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Where Can I Find Invitation Code?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        You don't need an invitation code to sign up on the website. This is an optional feature applicable when a user is being invited by another registered user / or StoxHero Ambassador. So if you don't have an invitation code, you can proceed without entering it.
                    </MDTypography>

                    </>
                    }
                </MDBox>
            </Grid>

            <Grid item xs={12} md={12} lg={10}>
                <MDBox bgColor="light" style={{border:'1px solid black', borderRadius:5}}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography style={{fontSize:18, fontWeight:700}} color="dark" ml={2}>Portfolios</MDTypography>
                    
                    <MDButton 
                        variant="text" 
                        size="large" 
                        color="dark"
                        onClick={()=>expansion(3)}
                        style={{transition: "all 0.8s ease-out"}}
                        >
                            {!expanded[3] ?  <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </MDButton>
                    
                    </MDBox>
                    {expanded[3] && 
                    <>
                    <MDTypography ml={2} mr={2} fontSize={15} fontWeight="bold" color="dark">What Is A Portfolio?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>A portfolio is a collection of stocks. On StoxHero, one Trading portfolio and two empty battle portfolios (Mania and Fever) are provided at the time of registration.</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>You can buy or sell contracts to add new positions to the portfolios.</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Once added, every position will either be in a state of profit or loss.</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>To check this, you can open the relevant portfolio.</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>To remove a position from the portfolio, you must execute a transaction in the opposite direction i.e. to close a buy trade, you must sell the stock and vice versa.</span>
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Are Mania And Fever Portfolios?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark">
                        Mania and Fever Portfolios are Lifetime Free Battle Portfolios. This means that these portfolios can be used to participate in the daily, weekly and special battles that run on the app.
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark">
                        Every time you register in a battle, you are required to link one of the two portfolios. Each of them contains INR 10,00,000 virtual currency which can be used to buy or sell contracts.
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark">
                        Do note, Mania and Fever Portfolios gets exhausted with the losses you make in the contest.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is A Trading Portfolio?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        Trading portfolio is similar to the Mania and Fever Portfolios but it cannot be linked to any battle.
                    </MDTypography>     
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        The purpose of this portfolio is to help users leran options trading by participating in virtual trading that do not reset every time a battle ends. Buy and Sell trades can be executed using the Trading Portfolio but they remain open until you square off i.e. sell the stocks/contract you bought and vice versa.
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        This can be used to test different options trading Strategies.
                    </MDTypography> 

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is The Difference Between Mania And Fever Portfolios?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        There is no difference between Mania and Fever Portfolios. They exist only to help you participate in two different battles at the same time. You can only link one portfolio to one battle at any given time. So, with these two portfolios you can only participate in two different battles simultaneously.
                    </MDTypography> 

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Can I Join Multiple Leagues With The Same Portfolio?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        No, you can only join 1 league with 1 portfolio.
                    </MDTypography> 

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Can I Join A League With Multiple Portfolios?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        No, you can only join a league with a single portfolio.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Is There A Limit On The Number Of Portfolios I Can Use?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark">
                        Yes, as of now, StoxHero provides 1 Trading Portfolio and 2 battle portfolios at the time of registration, you can buy additional portfolio by taking the subscription.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is Portfolio Value? How Is It Different From Opening Balance?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Portfolio Value reflects the value of your portfolio after accounting for realised & unrealised profit or loss, transaction charges and cash balance.</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} mb={2} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Opening balance reflects cash available before taking any trade for that day.</span>
                    </MDTypography>
                   
                    </>
                    }
                </MDBox>
            </Grid>

            {/* <Grid item xs={12} md={12} lg={10}>
                <MDBox bgColor="light" style={{border:'1px solid black', borderRadius:5}}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography style={{fontSize:18, fontWeight:700}} color="dark" ml={2}>StoxHero Battles</MDTypography>
                    
                    <MDButton 
                        variant="text" 
                        size="large" 
                        color="dark"
                        onClick={()=>expansion(4)}
                        style={{transition: "all 0.8s ease-out"}}
                        >
                            {!expanded[4] ?  <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </MDButton>
                    
                    </MDBox>
                    {expanded[4] && 
                    <>
                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is A Battle?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        A battle is where different StoxHero users compete against each other using their portfolios to win rewards. After joining the battle and adding stocks/contract to the linked portfolio, users are assigned ranks based on the portfolio's performance. Depending on your rank category, you may or may not win a reward. Such battles run on all business days for varying time periods (daily, weekly, monthly etc.)
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Can I Create My Own League?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Currently, only StoxHero can create battles. Please contact us if you are interested in creating custom Battles @ tream@stoxhero.com.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What is 'Upcoming Battles' tab?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Upcoming Battles tab has all those battles which are yet to start. You can register for these battles subject to availability of seats.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What is 'My Battle' tab?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        My Battles tab has all those battle which you've enrolled in and is yet to end.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What is 'History' tab?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        History tab has all those battles in which you've participated.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Can I Join Battle Everyday And At Any Time?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Battle run during regular market hours. Each Battle has specific timings associated with it, which can be viewed by clicking on the Battle in the 'Upcoming Battle' section under 'Battle Ground' tab.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">How Can I Join Leagues?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>To join Battle, tap on 'Battle Ground'</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>All upcoming battles will be listed here</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Find a Battle of your choice which has seats 'Left'</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>On the next screen, battle rules and rewards table are displayed.</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Accept the League 'Terms & Conditions' and click 'Register'</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Accept the League 'Terms & Conditions' and click 'Register'</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Next, Link one of the available battle Portfolios and click on 'Join'</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Now you can go to 'My Battles' tab to see the battle in which you have registered</span>
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Are The Rules Of A Battle?</MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Every user who joins a Battle needs to link an unlinked league portfolio to it</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Note that a portfolio can be linked to one Battle only and one Battle will only support one portfolio</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Once the portfolio is linked, the user can come to the battle and after the battle starts can buy and sell contracts</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>To find more rules specific to the Battle, check out the battle rules inside Battle Info section</span>
                    </MDTypography> 

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Can I Exit The Battle Before It Starts?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Yes, a battle can be exited before it starts.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">Where Can I See The Battle I Joined In The Past?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        You can visit 'History' tab under Battle Ground tab to see the battles which you joined in the past.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is 'Transaction Fee'?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Each time a trade is executed on the StoxHero App, a transaction fee of 20 Rupees/Order + standard NSE/BSE, STT/CTT, STAMP Duty, GST charges on the total traded value is charged on the buy as well as sell side side. This is deducted from INR 10,00,000 virtual cash in your portfolio.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">When Does Trading Start On The StoxHero App?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        In the Trading Portfolio, you can start trading at 9:15 AM when the market opens. However, in the case of battles, please check the Battle Ground section as each battle has a different starting time. Do note - all battles start after 9:30 AM and end before 3:25 PM.
                    </MDTypography>
                    </>
                    }
                </MDBox>
            </Grid> */}

            {/* <Grid item xs={12} md={12} lg={10}>
                <MDBox bgColor="light" style={{border:'1px solid black', borderRadius:5}}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography style={{fontSize:18, fontWeight:700}} color="dark" ml={2}>Points & Ranking System</MDTypography>
                    
                    <MDButton 
                        variant="text" 
                        size="large"
                        color="dark" 
                        onClick={()=>expansion(5)}
                        style={{transition: "all 0.8s ease-out"}}
                        >
                            {!expanded[5] ?  <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </MDButton>
                    
                    </MDBox>
                    {expanded[5] && 
                    <>
                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">When Are The Winners Announced?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Winners are announced at the end of the Battle. Participants must visit the 'Ranks' section inside a Battle under 'History' tab to know their position.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">How Are The Winners Decided?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Participants are ranked on the basis of the profit made in that contest.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">How Are Rewards Distributed To The Players?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        All the Battles participants are continuously ranked in the order of their return. At the end of the Battle, the rewards are distributed among the top rankers in the predetermined ratio. This ratio is published in advance on the Battle Rules page that appears at the time of joining the league.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is The Hero's Chart?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        All StoxHero users are ranked continuously based on the total amount of rewards across battles. The top users are recognized in the Hero's Chart that can be accessed from the side menu.
                    </MDTypography>

                    </>
                    }
                </MDBox>
            </Grid> */}

            <Grid item xs={12} md={12} lg={10}>
                <MDBox bgColor="light" style={{border:'1px solid black', borderRadius:5}}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography style={{fontSize:18, fontWeight:700}} color="dark" ml={2}>StoxHero Account</MDTypography>
                    
                    <MDButton 
                        variant="text" 
                        size="large" 
                        color="dark"
                        onClick={()=>expansion(6)}
                        style={{transition: "all 0.8s ease-out"}}
                        >
                            {!expanded[6] ?  <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </MDButton>
                    
                    </MDBox>
                    {expanded[6] && 
                    <>
                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is A StoxHero Account?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        StoxHero Account reflects all your rewards. It shows your StoxHero cash and Bonus cash balance.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">How Can I Withdraw Money From My StoxHero Account?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        Currently you will get the withdrawal amount through UPI from StoxHero, for that you need to raise a request through email.
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Are The Limits For Withdrawing Money?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={1} fontSize={13} color="dark">
                        For all listed Payment Methods (PayTm, Bank and UPI transfer), the following withdrawal limits apply :
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Minimum Withdrawal Amount Per Transaction: Rs. 500/-</span>
                    </MDTypography> 
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Maximum Withdrawal Amount Per Transaction: Rs. 1000/-</span>
                    </MDTypography>
                    <MDTypography ml={2} mr={2} fontSize={13} color="dark" display="flex" justifyContent="left" flexDirection="flex-start" alignContent="center" alignItems="center">
                       <span>&#x2022; &nbsp;</span> 
                       <span>Maximum Daily Withdrawal Amount: Rs. 1000/-</span>
                    </MDTypography>

                    <MDTypography ml={2} mr={2} mt={1} fontSize={15} fontWeight="bold" color="dark">What Is Hero Cash? Can I Withdraw It?</MDTypography>
                    <MDTypography ml={2} mr={2} mb={2} fontSize={13} color="dark">
                        In StoxHero Account, Hero cash is the in-app currency that's awarded on various activities like when you invite friends through a referral program which giving Hero Cash onto the platform. The amount is not withdrawable but it can be used to redeem exciting coupons.
                    </MDTypography>
                    </>
                    }
                </MDBox>
            </Grid>

        </Grid>
        <MDBox>
            <MDTypography mt={2} fontSize={20} mb={2} color="light" fontWeight="bold" align="center">For any additional queries, drop us an email @ team@stoxhero.com</MDTypography>
        </MDBox>
    </MDBox>
    </>
  );
}

export default FAQs;

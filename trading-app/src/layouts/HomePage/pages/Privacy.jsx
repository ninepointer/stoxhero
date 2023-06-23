import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import Title from '../components/Title/index'
import React, {useEffect} from 'react'
import ReactGA from "react-ga"
import ServiceCard from '../components/Cards/ServiceCard'

import useMeasure from 'react-use-measure'

import Footer from '../components/Footers/Footer'

import Navbar from '../components/Navbars/Navbar'
import theme from '../utils/theme/index'

// IMages for about 

import about1 from '../assets/images/About/about1.png'
import about2 from '../assets/images/About/about2.png'
import about3 from '../assets/images/About/about3.webp'
import about4 from '../assets/images/About/about4.png'
import about5 from '../assets/images/About/about5.webp'
import { fontWeight } from '@mui/system';



const About = () => {
    
    useEffect(()=>{
        ReactGA.pageview(window.location.pathname)
      }, [])
   
      return (
        <ThemeProvider theme={theme}>

            <Navbar />
            <Box bgcolor="#06070A" sx={{mt:{xs:-10,lg:-15}}} >
                
                <Container>
                    <Grid container spacing={10} flexWrap="wrap-reverse" justifyContent="start" alignItems="center" sx={{ mt: { xs: 10, md: 15, } }}>
                        <Grid item xs={12} md={6} sx={{mt:10}}  >
                            <Stack spacing={2} sx={{ maxWidth: 1280 }}>
                                <Title variant={{ xs: 'h3', sm: 'h2', md: 'h1' }} sx={{ letterSpacing: "0.02em", mb: 1, p:0}} style={{ color: "white" }} >StoxHero Privacy Policy</Title>
                                <Title variant={{ xs: 'body2', sm: 'body2', md: "body2" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "rgba(255, 255, 255, 0.6)" }} >Updated on 31 May, 2023</Title>
                                <Title variant={{ xs: 'body1', sm: 'body1', md: "body1" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "#ffffff", fontWeight:"bold" }} >Your privacy is critically important to us.</Title>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                        <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px'}}  >
                            <Stack spacing={0} sx={{ width: "100%"}}>
                                <Typography color="#ffffff">
                                    Stoxhero Games Technologies Private Limited, having its registered office at S-77, NRI Colony, Sec-24,Pratap Nagar, Sanganer, Pratap Nagar Housing Board, Jaipur-302033 operates the web-portal www.Stoxhero.com (and Uniform Resource Locators (URLs) that redirect thereto) and the mobile application known as ‘StoxHero’ in India (collectively referred to as the “Portal”), offers a ‘Virtual Trading Platform’ aimed at helping you master the art of ‘Trading & Investment’. Stoxhero Games Technologies Private Limited is referred to herein as “StoxHero” or “we” or “us” or “our”. Any person ('User' or 'you' or 'your') utilizing the Portal or any of its features, including participation in the various programs, competitions, or any social activity being conducted on StoxHero ('Services') shall be legally bound by this Privacy Policy. This Privacy Policy and all other applicable terms and disclaimers made available on the Portal, all of which constitute legally binding agreements between you and StoxHero and all of which you agree to be legally bound by.
                                    StoxHero respects the privacy of its Users and is committed to protect it in all respects. With a view to offer an enriching and holistic internet experience to its Users, StoxHero offers a vast repository of Services. Kindly take time to read the 'About Us' section to know more about StoxHero. The information about the User is collected by StoxHero as (i) information supplied by Users, whether as part of their registration on the Portal or otherwise, and (ii) information automatically tracked during Users' navigation on StoxHero.
                                    Before you submit any information to the Portal, please read this Privacy Policy for an explanation of how we will treat your personal information. By using any part of the Portal, you consent to the collection, use, disclosure and transfer of your personal information for the purposes outlined in this Privacy Policy and to the collection, processing and maintenance of this information. If you do not agree to this Privacy Policy, please do not use the Portal. Your use of any part of the Portal indicates your acceptance of this Privacy Policy and of the collection, use and disclosure of your personal information in accordance with this Privacy Policy. While you have the option not to provide us with certain information or withdraw your consent to our collection or processing of information, kindly note that in such an event you may not be able to take full advantage of the entire scope of features and Services offered to you and we reserve the right not to provide you with our Services.
                                </Typography>
                            </Stack>
                        </Grid>
                </Container>
                
                <Container>
                <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px', mb:8}}  >
                            <Stack spacing={0} sx={{ width: "100%"}}>
                                <Typography color="#ffffff">
                                1. Mobile number <br/>
2.Email<br/><br/>
Our Services have optional features which, if used by you, require us to collect additional information to provide such features. You will be notified of such collection, as appropriate. If you choose not to provide the information needed to use a feature, you will be unable to use the feature. 
<br/>In the course of providing you with access to the Services , and in order to provide you access to the features offered through the Portal and to verify your identity, as we move forward in future, you may be required to furnish additional information including your Location, access to SMS, Permanent Account Number, Know Your Customer (KYC) information including bank account details to transfer money. While we don't collect these details right now, we might start collecting them subject to change in regulations and requirements. In certain instances, we may also collect Sensitive Personal Information (“SPI”) from you on StoxHero. SPI means such personal information which consists of passwords or financial information, such as information regarding the payment instrument/modes used by you to make such payments, which may include cardholder name, credit/debit card number (in encrypted form) with expiration date, banking details, wallet details etc. This information is presented to you at the time of making a payment to enable you to complete your payment expeditiously. Except for any passwords or any financial information that you choose to provide while making payment for any StoxHero Services on StoxHero, StoxHero does not collect any other SPI in the course of providing the StoxHero Services. Any SPI collected by StoxHero shall not be disclosed to any third party without your express consent, save as otherwise set out in this Privacy Policy or as required by law. It is clarified that this condition shall not apply to publicly available information, including SPI, in relation to you on the Portal.<br/>
<br/>
The information you provide and how we use such information:<br/>
1. Your Account Information (Mobile Number, Email Id,):<br/>You must provide your mobile phone number and/or Email Id to create a StoxHero account. If you don't provide us with this information, you will not be able to create an account to use our Services.
<br/>2. In the course of providing the Services, Users may invite/refer other users ('Referred Users') to participate in any of the Services. The participation of the referred User in any of the programs/competition/activity shall be subject to the terms of this Privacy Policy and the Terms and Conditions for the use of the Portal. 
<br/>3. Subsequently to further authenticate your identity and prevent fraud and to ensure the safety and security of Users, we may request you to link your social media accounts (Facebook or LinkedIn) to use certain features of StoxHero portal.
<br/><br/>
Disclosure/Sharing:<br/><br/>
StoxHero may also share information as provided by you, and data concerning usage of the Services and Portal and participation by you in the program/league/activity on the Portal, with third party service providers engaged by StoxHero, for the purpose of data analytics or other similar purposes, for the purpose of storage, improving the services and helping StoxHero serve you better. Where we propose to use your personal information (that is, information that may be used to identify the User and that is not otherwise publicly available) for any other uses we will ensure that we notify you first.
By using the Portal, you hereby expressly agree and grant consent to the collection, use and storage of this information by StoxHero. StoxHero reserves the right to share, disclose and transfer information collected hereunder with its own affiliates. In the event StoxHero sells or transfers all or a portion of its business assets, consumer information may be one of the business assets that are shared, disclosed or transferred as part of the transaction. You hereby expressly grant consent and permission to StoxHero for disclosure and transfer of information to such third parties. StoxHero may share information as provided by you and data concerning your usage of the Services and participation in the program/league/activity on the Portal with its commercial partners for the purpose of facilitating user engagement, for marketing and promotional purposes and other related purposes. Further, StoxHero reserves the right to disclose personal information as obligated by law, in response to duly authorized legal process, governmental requests and as necessary to protect the rights and interests of StoxHero.
<br/><br/>Use of Cookies:<br/><br/>
To improve the effectiveness and usability of the Portal for our Users, we use 'cookies', or such similar electronic tools to collect information to assign each visitor a unique random number as a User Identification (User ID) to understand the User's individual interests using the identified computer. Unless the User voluntarily identifies himself/herself (e.g., through registration), StoxHero has no way of knowing who the User is, even if we assign a cookie to the User's computer. The only personal information a cookie can contain is information supplied by the User. A cookie cannot read data off the User's hard drive. StoxHero’s advertisers may also assign their own cookies to the User's browser (if the User clicks on their ad banners), a process that StoxHero does not control. StoxHero's web servers automatically collect limited information about User's computer's connection to the Internet, including User's IP address, when the User visits the Portal. (User's IP address is a number that lets computers attached to the Internet know where to send data to the User -- such as the web pages viewed by the User). StoxHero uses this information to deliver its web pages to Users upon request, to tailor its Portal to the interests of its users, to measure traffic within the Portal and let advertisers know the geographic locations from where StoxHero's visitors come.
<br/><br/>Links:<br/><br/>
StoxHero may also include links to other websites. Such websites are governed by their respective privacy policies, which are beyond StoxHero's control. Once the User leaves StoxHero's servers, use of any information provided by the User is governed by the privacy policy of the operator of the site which the User is visiting. That policy may differ from StoxHero's own. If the User can't find the privacy policy of any of these sites via a link from the site's homepage, the User may contact the site directly for more information. StoxHero is not responsible for the privacy practices or the content of such websites.
<br/><br/>Security Procedures:<br/><br/>
All information gathered on StoxHero is securely stored within StoxHero- controlled database and protected by reasonable security practices and procedures. The database is stored on servers secured behind a firewall; access to such servers being password-protected and strictly limited based on need-to-know basis. However, we understand that as effective as our security measures are, no security system is impenetrable. Thus, we cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. Further, any information you post or share on the Portal will be available to anyone with Internet access, unless specifically indicated on the Portal. By using the Portal, you understand and agree that your information may be used in or transferred to countries other than India and you specifically consent to same. StoxHero also believes that the internet is an ever-evolving medium. We may periodically review from time to time and change our Privacy Policy to incorporate such future changes as may be considered appropriate, without any prior notice to you. Our use of any information we gather will always be consistent with the policy under which the information was collected, regardless of what the new policy may be. Any changes to our Privacy Policy will be posted on this page, so you are always aware of what information we collect, how we use it, how we store it and under what circumstances we disclose it.
<br/><br/>Advertising:<br/><br/>
When StoxHero presents information to its online advertisers -- to help them understand our audience and confirm the value of advertising on StoxHero -- it is usually in the form of aggregated statistics on traffic to various pages within our site. When you register with StoxHero, we contact you from time to time about updating your content to provide features which we believe may benefit you. Several deceptive emails, websites, blogs etc. claiming to be from or associated with StoxHero may or are circulating on the Internet. These emails, websites, blogs etc. often include our logo, photos, links, content or other information. Some emails, websites, blogs etc. call the user to provide login name, password etc. or that the user has won a prize/ gift or provide a method to commit illegal/ unauthorized act or deed or request detailed personal information or a payment of some kind. The sources and contents of these emails, websites, blogs etc. and accompanying materials are in no way associated with StoxHero. For your own protection, we strongly recommend not responding to emails or using websites, blogs etc. We may use the information provided by you to StoxHero, including your email address or phone number, to contact you about the Services availed by you or to inform you of our updated Services if any.
<br/><br/>Limitation:<br/><br/>
StoxHero WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THIS PORTAL, INCLUDING, BUT NOT LIMITED TO COMPENSATORY, DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL AND CONSEQUENTIAL DAMAGES, LOSS OF DATA, GOODWILL, BUSINESS OPPORTUNITY, INCOME OR PROFIT, LOSS OF OR DAMAGE TO PROPERTY AND CLAIMS OF THIRD PARTIES. IN NO EVENT WILL StoxHero BE LIABLE FOR ANY DAMAGES WHATSOEVER.
<br/><br/>User account Deletion, Retention of Data & Data deletion:<br/><br/>
Users are entitled to request StoxHero to delete their User accounts and their personal information by sending an email on team@stoxhero.com mentioned their need to delete their account. Users must be sending this email from their registered email id only. Post that we may start a verification process to identify the user’s identity. After the successful verification the account will be deleted.
<br/><br/>Note: When you delete your account you will permanently lose your user data and other info associated with it.<br/><br/>
Your personal information may be retained and may continue to be used until: (i) the relevant purposes for the use of your information described in this Privacy Policy are no longer applicable; and (ii) we are no longer required by applicable law, regulations, contractual obligations or legitimate business purposes to retain your personal information and the retention of your personal information is not required for the establishment, exercise or defence of any legal claim.
<br/><br/>When your Account is deleted, we make sure it is no longer viewable on the portal. For up to 28 days, it is still possible to restore your Account if it was accidentally deleted. After 28 days, we begin the process of deleting your personal information from our systems, unless:<br/><br/>
<br/>1.we must keep it to comply with applicable law (for instance, if you make purchases within the portal, some personal data may be kept for tax and accounting purposes);
<br/>2.we must keep it to evidence our compliance with applicable law (for example, if an account is blocked, we keep some account information and a record of the behaviour that led to the block - this information is retained for evidential purposes in case of queries or legal claims concerning the block);
<br/>3.there is an outstanding issue, claim or dispute requiring us to keep the relevant information until it is resolved; or
<br/>4.the information must be kept for our legitimate business interests, such as fraud prevention and enhancing Users’ safety and security (for example, information may need to be keep it to prevent a user who was banned for unsafe behaviour or security incidents from opening a new account)
<br/><br/>Warning: Even after you remove information from your profile or delete your Account, copies of that information may still be viewable and/or accessed to the extent such information has been previously shared with others or copied or stored by others. We cannot control this, nor do we accept any liability for this. If you have given third party applications or websites access to your personal information, they may retain such information to the extent permitted under their terms of service or privacy policies.
<br/><br/>Applicable Law and Jurisdiction:<br/><br/>
By visiting this Portal, you agree that the laws of India without regard to its conflict of laws principles, govern this Privacy Policy and any dispute arising in respect hereof shall be subject to and governed by the dispute resolution process set out in the Terms and Conditions.
<br/><br/>Updating Information:<br/><br/>
You will promptly notify StoxHero if there are any changes, updates or modifications to your information. Further, you may also review, correct, update or modify your information and user preferences by logging into your Profile page on StoxHero.
<br/><br/>Contact Us:<br/><br/>
Any questions or clarifications with respect to this Policy or any complaints, comments, concerns or feedback can be sent to our Grievance Officer at:
<br/><br/>Contact details:<br/><br/>
Email: team@StoxHero.com
Physical mail addressed to: Attn: StoxHero Team:
Stoxhero Games Technologies Private Limited
S-77, NRI Colony, Sec-24, Pratap Nagar, Sanganer, Pratap Nagar Housing Board, Jaipur-302033
                                </Typography>
                            </Stack>
                        </Grid>
                </Container>

                <Footer />
            </Box>


        </ThemeProvider>
    )
}

export default About;




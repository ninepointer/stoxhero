import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import {apiUrl} from './constants/constants';
import MDButton from './components/MDButton';
import MDBox from './components/MDBox';


export default function MessagePopUp({socket, userId}) {
    const [open, setOpen] = React.useState(false);
    const [serverTime, setServerTime] = useState("");
    const [lang, setLang] = useState("en");
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const [setting, setSetting] = useState([]);

    // const [holiday, setHoliday] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
    useEffect(() => {

        axios.get(`${baseUrl}api/v1/readsetting`, { withCredentials: true })
            .then((res) => {
                setSetting(res.data);
            });

    }, []);

    useEffect(()=>{
        if(socket){
          socket.on("serverTime", (data)=>{
            // console.log("serverTime", data)
            setServerTime(data)
          })
        }else{

        }
      }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const understood = async() =>{
      try{
        const res = await axios.post(`${apiUrl}/user/understood`,{}, {withCredentials:true});
      }catch(e){
        console.log(e);
      }
      handleClose();
    }

    useEffect(() => {

        // let date = new Date();
        // let weekDay = date.getDay();
     //   if (weekDay > 0 && weekDay < 6 && holiday === 0) {
          if(!socket && !userId){
            return handleClickOpen();
          }
          const appEndTime = new Date(setting[0]?.time?.message);

          appEndTime.setHours(appEndTime.getHours() - 5);
          appEndTime.setMinutes(appEndTime.getMinutes() - 30);
          const appEndHour = appEndTime.getHours().toString().padStart(2, '0');
          const appEndMinute = appEndTime.getMinutes().toString().padStart(2, '0');

          const appOfflineTime = new Date(`${todayDate}T${appEndHour}:${appEndMinute}:00.000Z`);
          const now = new Date(serverTime);
    // console.log(now.getMinutes(), appOfflineTime.getMinutes(), now.getSeconds(), appOfflineTime.getSeconds(), now.getHours() , appOfflineTime.getHours())
          if ((now.getMinutes() === appOfflineTime.getMinutes()) && (now.getSeconds() === appOfflineTime.getSeconds()) && (now.getHours() === appOfflineTime.getHours())) {
            handleClickOpen();
          }
    
      //  }
    
      }, [serverTime]);
    
  return (
   
    <>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogContent>
            <MDBox display='flex' justifyContent='center' alignItems='center'>  
              {lang == 'en' ? <MDButton color='info' variant='text' onClick={()=>{setLang('en')}}>English</MDButton>:
              <MDButton onClick={()=>{setLang('en')}}>English</MDButton>}
              {lang == 'hi' ? <MDButton color='info' variant='text' onClick={()=>{setLang('hi')}}>हिन्दी</MDButton>:
              <MDButton onClick={()=>{setLang('hi')}}>हिन्दी</MDButton>}
            </MDBox>    
            {lang =='en' &&<>
            <Typography textAlign="center" fontWeight={600} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">
              Important Financial News: New GST and TDS Rules Simplified!
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
              Hold on tight, because there are some exciting changes happening in the world of taxes that affect your money. Let's break it down in easy terms:
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>1. GST on Adding Money - More for You</b>: When you put money into your wallet (like adding 100 rupees), there's a small extra fee called GST, which is 28%. So, you'll need to pay 128 rupees to get 100 rupees in your wallet. <b>But here's the cool part: We're giving you 28% cashback on every wallet addition!</b> You can use this bonus to buy different Contests, MarginX and TenX Subscriptions.
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>2. No GST on Buying Stuff - Shop Without Extra Tax</b>: If you earned money by participating in contests or other StoxHero products (let's say you won 100 rupees) and you want to spend it on something you like, there's good news. You won't have to pay any extra tax (GST) when you buy stuff with your winnings. It's like a tax-free shopping spree!
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>3. What's TDS? - Don't Worry, You Can Get It Back</b>: Now, about TDS (Tax Deducted at Source). Government will take 30% from your total winnings. But don't fret! You can get this money back from the government by filing your tax returns. It's not a loss; it's just a temporary hold on some of your winnings.
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            These changes are all about making money matters clear and simple for you. Stay tuned for more updates as we explore these new rules together!
            </Typography>
            <Typography textAlign="left" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">For more details, visit <a href='https://bit.ly/gstnews' target="_blank">here</a></Typography>
              </>}  
            {lang =='hi' &&<>
            <Typography textAlign="justify" fontWeight={600} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">
            महत्वपूर्ण वित्तीय समाचार: नए जीएसटी और टीडीएस नियम सरल रूप में!
            </Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            मजबूत रहें, क्योंकि पैसों के दुनिया में कुछ दिलचस्प बदलाव हो रहे हैं जो आपके पैसों को प्रभावित करेंगे। हम इसे सरल शब्दों में समझाते हैं:
            </Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>1. पैसे डालने पर जीएसटी - आपके लिए अधिक</b>:अब से, जब आप अपने वॉलेट में पैसे डालते हैं (उदाहरण के लिए, 100 रुपए जोड़ते हैं), तो एक छोटी और अतिरिक्त शुल्क होता है जिसे जीएसटी कहते हैं, जो 28% है। तो, आपको 100 रुपए में 128 रुपए जमा करने के लिए देने होंगे।<b>लेकिन यहां की बात है: हम आपके लिए एक बोनस के रूप में हर वॉलेट में 28% कैशबैक दे रहे हैं!</b>आप इसे उपयोग करके चीज़ें खरीदने के लिए कर सकते हैं।
            </Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>2. चीज़ें खरीदने पर जीएसटी नहीं - अतिरिक्त कर के बिना खरीदारी</b>: अगर आपने खेलों या प्रतियोगिताओं में पैसे कमाए हैं (यहां मान लीजिए, आपने 100 रुपए जीते हैं) और आप चाहते हैं कि आपको पसंद आने वाली कुछ चीज़ें खरीदने के लिए उन पैसों का उपयोग करें, तो यहां अच्छी खबर है। जब आप अपने जीते हुए पैसों का उपयोग करते हैं, तो आपको कोई अतिरिक्त कर (जीएसटी) नहीं देना पड़ता है। यह कर की खरीदारी के रूप में एक अतिरिक्त छूट जैसा है!
            </Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>3. टीडीएस क्या है? - चिंता नहीं, आप इसे वापस पा सकते हैं</b>:अब, टीडीएस (स्रोत पर कर कटाना) के बारे में। हम जानते हैं कि यह थोड़ा सा डरावना लग सकता है, लेकिन यह वैसा बुरा नहीं है जैसा लगता है। आपके पूरे जीते हुए राशि से 30% कटा जाएगा। पूरे जीते हुए राशि का मतलब है, जिसका आपने किसी भी कार्यक्रम में जीता है, उसमें शामिल राशि से कम करके। लेकिन यहां सोने की परत है - आप इस टीडीएस को सरकार से अपने आयकर रिटर्न दाखिल करके वापस पा सकते हैं। यह कोई नुकसान नहीं है; यह बस आपके जीते हुए पैसों पर कुछ समय के लिए है। 
            </Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            इन बदलावों का मकसद है पैसे के मामलों को आपके लिए स्पष्ट और सरल बनाना, हम सब मिलकर इन नए नियमों को समझेंगे!
            </Typography>
            <Typography textAlign="left" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">ज्यादा जानकारी के लिए <a href='https://bit.ly/gstnews' target="_blank">यहां जाएं</a></Typography>
              </>}  
            </DialogContent>

            <DialogActions>
            <Button onClick={understood} autoFocus>
                {lang=='en'?'Understood':'समझ में आ गया'}
            </Button>
            </DialogActions>
        </Dialog>
    </>
  );
}

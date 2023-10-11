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
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  
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
        const res = await axios.post(`${apiUrl}user/understood`,{}, {withCredentials:true});
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
            <Typography textAlign="justify" fontSize={15} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">
              Hold on tight, because there are some exciting changes happening in the world of taxes that affect your money. Let's break it down in easy terms:
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>GST Charges</b>:  The government has implemented a 28% GST on wallet top-ups, but here's the good news: You won't need to worry about paying this GST yourself because we've got it covered. We'll be taking care of the GST on your behalf.
            </Typography>    
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>What's TDS? - Don't Worry, You Can Get It Back</b>: Now, about TDS (Tax Deducted at Source). Government will take 30% from your total winnings. But don't fret! You can get this money back from the government by filing your tax returns. It's not a loss; it's just a temporary hold on some of your winnings.
            </Typography>  
            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
            These changes are all about making money matters clear and simple for you. Stay tuned for more updates as we explore these new rules together!
            </Typography>
            <Typography textAlign="left" fontSize={15} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">For more details, visit <a href='https://bit.ly/gstnews' target="_blank">here</a></Typography>
              </>}  
            {lang =='hi' &&<>
            <Typography textAlign="justify" fontWeight={600} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">
            महत्वपूर्ण वित्तीय समाचार: नए जीएसटी और टीडीएस नियम सरलित!
            </Typography>  
            <Typography textAlign="justify" fontSize={14} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">
            मजबूती से कसकर बैठिए, क्योंकि वर्गीय पैसों को प्रभावित करने वाले करों के दुनिया में कुछ दिलचस्प बदलाव हो रहे हैं। आइए इसे आसान शब्दों में समझें:
            </Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>जीएसटी शुल्क</b>:सरकार ने वॉलेट जमा पर 28% जीएसटी लागू किया है, लेकिन यहां अच्छी खबर है: आपको इस जीएसटी को खुद से चुकाने की चिंता करने की आवश्यकता नहीं है क्योंकि हमने इसका समर्थन किया है। हम आपके प्रतिष्ठान पर जीएसटी का ध्यान रखेंगे।
            </Typography>   
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            <b>टीडीएस क्या है? - चिंता न करें, आप इसे वापस पा सकते हैं</b>:टीडीएस (स्रोत पर कटाई गई कर) के बारे में। सरकार आपकी कुल जीत से 30% ले लेगी। लेकिन चिंता नहीं करें! आप अपने कर रिटर्न जमा करके इस पैसे को सरकार से वापस पा सकते हैं। यह कोई नुकसान नहीं है; यह आपकी जीती हुई राशि के कुछ समय के लिए स्थायित रखने की बात है।</Typography>  
            <Typography textAlign="justify" fontSize={14} sx={{ width: "100%" }} color="#000" variant="body2">
            ये बदलाव आपके लिए वित्त प्रस्तावों को स्पष्ट और सरल बनाने के बारे में हैं। हम इन नए नियमों को खोजते हुए और और अधिक अपडेट्स के लिए बने रहें!
            </Typography>
            <Typography textAlign="left" fontSize={14} mt={2} sx={{ width: "100%" }} color="#000" variant="body2">ज्यादा जानकारी के लिए <a href='https://bit.ly/gstnews' target="_blank">यहां जाएं</a></Typography>
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

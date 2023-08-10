import React, {useState} from 'react';
import axios from 'axios';
import { apiUrl } from '../../constants/constants';

const Index = () => {
    const [data, setData] = useState(null);
        const makePayment = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/paymenttest/generate');
                const { data } = response;
                setData(data);
                let form = document.createElement('form');
                form.setAttribute('method', 'post');
                form.setAttribute('action', 'https://securegw-stage.paytm.in/order/process');
                form.setAttribute('target', '_top');
                for(let key in data){
                    if(data.hasOwnProperty(key)){
                        let hiddenField = document.createElement('input');
                        hiddenField.setAttribute('type', 'hidden');
                        hiddenField.setAttribute('name', key);
                        hiddenField.setAttribute('value', data[key]);
                        form.appendChild(hiddenField);
                    }
                }
                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                console.log('Error', error);
            }
        }
        const phonePayment = async() => {
            try{
                const res = await axios.post(`${apiUrl}payment/initiate`,{amount:20000, mobileNumber:'9090877020', redirectTo:window.location.href},{withCredentials: true});
                console.log(res?.data?.data?.instrumentResponse?.redirectInfo?.url);
                window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url;
            }catch(e){
                console.log(e);
            }
        }
  return (
    <div>
        <button onClick={makePayment}>
            PayTM
        </button>
        <button onClick={phonePayment}>
            Phone Pe
        </button>
    </div>
  )
}

export default Index
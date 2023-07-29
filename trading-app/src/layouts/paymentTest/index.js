import React, {useState} from 'react';
import axios from 'axios';

const Index = () => {
    const [data, setData] = useState(null);
        const makePayment = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/v1/paymenttest/generate');
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
  return (
    <div>
        <button onClick={makePayment}>
            Payment
        </button>
    </div>
  )
}

export default Index
import React, {useEffect, useState} from 'react'
import MDBox from '../../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../../components/Navbars/Navbar';
import theme from '../../utils/theme/index';
import Footer from '../../../authentication/components/Footer'
import { Helmet } from 'react-helmet';
import CalculatorHelper from './calcHelper';
import CalculatorHome from './calcHome';
import axios from 'axios';
import { apiUrl } from '../../../../constants/constants';


export default function Calculator() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get('value');
  const [data, setData] = useState([]);

  useEffect(()=>{
    window.webengage.track('calculator_clicked', {
    })

    const fetch = async ()=>{
      const data = await axios.get(`${apiUrl}assetclass`);
      setData(data?.data?.data);
    }
    fetch();
  },[])

  const [assetSum, setAssetSum] = useState(0);
  const [liabilitiesSum, setLiabilitiesSum] = useState(0);
  const assets = [];
  const liabilities = [];
  for (const elem of data) {
    const nameArr = elem?.assetName?.split(' ');
    let keyword = '';
    if (nameArr) {
        nameArr.forEach((word, index) => {
            if (index === 0) {
                keyword = word.toLowerCase();
            } else {
                keyword += word;
            }
        });
    }
    if (elem?.type === 'Asset') {
        assets.push({ name: elem?.assetName, description: elem?.description, keyword: keyword, roi: elem?.expectedRoi });
    }
    if (elem?.type === 'Liability') {
        liabilities.push({ name: elem?.assetName, description: elem?.description, keyword: keyword, roi: elem?.expectedRoi });
    }
}

  const metaDescription = 'Net worth is what you own minus what you owe. Know where you stand and what it takes to become an everyday millionaire with the Net Worth Calculator.';
  const metaTitle = 'Net Worth Calculator: What is My Net Worth? - StoxHero';
  const metaKeyword = 'net worth, net worth calculator, brokerage caclulator, discount broker, discount brokerage, lowest brokerage commissions, lowest brokerage fees, indian discount brokerage, indian discount broker, cheap brokerage, discount brokerage bangalore, fixed brokerage bangalore, cheap trading, cheap commodity trading, trading terminal, futures trading, stock broker, fixed stock brokerage, cheapest brokerage, cheapest brokerage in india, online trading, online brokerage, cheap demat account, broker, commodities trading';
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name='description' content={metaDescription} />
        <meta name='keywords' content={metaKeyword} />
      </Helmet>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', minHeight: '100%', height: 'auto', width: 'auto', maxWidth: '100%', minHeight: "80vh" }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <>
            {(value === 'past' || value === 'future') ?
              <CalculatorHelper
                assets={assets}
                liabilities={liabilities}
                assetSum={assetSum}
                setAssetSum={setAssetSum}
                liabilitiesSum={liabilitiesSum}
                setLiabilitiesSum={setLiabilitiesSum}
                timePeriod={value}
              />
              :
              <CalculatorHome />}
          </>
        </ThemeProvider>
      </MDBox>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
        <Footer />
      </MDBox>
    </>
  );
}
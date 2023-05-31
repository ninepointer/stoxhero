// const User = require("../models/User/userDetailSchema");
const TradingAlgo = require("../models/AlgoBox/tradingAlgoSchema");
const AccessToken = require("../models/Trading Account/requestTokenSchema");
const ApiKey = require("../models/Trading Account/accountSchema");
const UserPermission = require("../models/User/permissionSchema");
// const UserPermission = require("../models/User/permissionSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const authoizeTrade = require('../controllers/authoriseTrade');
 


const ApplyAlgo = async (req, res, next)=>{
    //console.log("caseStudy 5: applyalgo")
    // //console.log(req.body, "in apply algo")
    // //console.log(req.user)
    // //console.log("in if", req.user.isAlgoTrader)

    if(!req.user.isAlgoTrader){
        // //console.log("in if")
        return res.status(401).send({message: "Your profile is not authorised."})  
    }
    const {symbol, instrumentToken, Quantity, buyOrSell} = req.body;

    let userId = req.user._id;
    let accessTokenDetails = await AccessToken.find({status: "Active"});
    let apiKeyDetails = await ApiKey.find({status: "Active"});
    let tradingAlgoData = await TradingAlgo.find({status: "Active"});
    let userPermission = await UserPermission.find({userId: userId}).populate('algoId', 'algoName')
    let instrumentMapping = await InstrumentMapping.find({Status: "Active"});

    // console.log("userPermission", userPermission)

    let companyTrade = {};

    const tradingAlgoArr = [];
    apiKeyDetails.map((elem) => {
        accessTokenDetails.map((subelem) => {
            tradingAlgoData.map((element) => {
                if (element.status === "Active" && subelem.accountId == element.tradingAccount && elem.accountId == element.tradingAccount) {
                    tradingAlgoArr.push(element);
                }
            })
        })
    })

    const userPermissionAlgo = [];
    for (let elem of tradingAlgoArr) {
        for (let subElem of userPermission) {
            if ((elem._id).toString() === (subElem.algoId._id).toString() && subElem.isTradeEnable) {
                userPermissionAlgo.push(elem)
            }
        }
    }

    // console.log("userPermissionAlgo", userPermissionAlgo, tradingAlgoArr)

    function instrumentMappingFunc(){
        let flag = true;
        for(let i = 0; i < instrumentMapping.length; i++){
          if(instrumentMapping[i].InstrumentNameIncoming === symbol){
            companyTrade.realSymbol = instrumentMapping[i].InstrumentNameOutgoing;
            companyTrade.real_instrument_token = instrumentMapping[i].OutgoingInstrumentCode;
            flag = false;
            break;
          }
          if(flag){
            companyTrade.realSymbol = symbol;
            companyTrade.real_instrument_token = instrumentToken;
          }
        }
    }

    async function tradingAlgo() {
        userPermissionAlgo?.map((elem) => {
            if(elem.transactionChange) {
                if(buyOrSell === "BUY"){
                    companyTrade.realBuyOrSell = "SELL"
                }
                else if(buyOrSell === "SELL"){
                    companyTrade.realBuyOrSell = "BUY"
                }
                
            }else if(!elem.transactionChange){
                if(buyOrSell === "BUY"){
                    companyTrade.realBuyOrSell = "BUY"
                }
                else if(buyOrSell === "SELL"){
                    companyTrade.realBuyOrSell = "SELL"
                }
            }else{
                return;
            }

            if(elem.instrumentChange){
                instrumentMappingFunc();
            } else{
                companyTrade.realSymbol = symbol;
                companyTrade.real_instrument_token = instrumentToken;
            }

            companyTrade.realQuantity = elem.lotMultipler * (Quantity);
            let accessTokenParticular = accessTokenDetails.filter((element) => {
                return elem.tradingAccount === element.accountId
            })

            let apiKeyParticular = apiKeyDetails.filter((element) => {
                return elem.tradingAccount === element.accountId
            })
            // //console.log("userPermission", userPermission)
    
            userPermission.map((subElem)=>{
                if(subElem.algoId.algoName === elem.algoName){
                    if(subElem.isRealTradeEnable && subElem.isTradeEnable){
                        // sendOrderReq(elem, checkingMultipleAlgoFlag, apiKeyParticular, accessTokenParticular);
                        const { apiKey } = apiKeyParticular[0];
                        const { accessToken } = accessTokenParticular[0];

                        req.body.realSymbol = companyTrade.realSymbol;
                        req.body.real_instrument_token = companyTrade.real_instrument_token;
                        req.body.realBuyOrSell = companyTrade.realBuyOrSell;
                        req.body.realQuantity = companyTrade.realQuantity;
                        req.body.apiKey = apiKey;
                        req.body.accessToken = accessToken;
                        req.body.algoBoxId = elem._id;
                        req.body.isAlgoTrader = req.user.isAlgoTrader

                    } else if(subElem.isTradeEnable){
                        // mockTradeCompany(elem, checkingMultipleAlgoFlag);
                        req.body.realSymbol = companyTrade.realSymbol;
                        req.body.real_instrument_token = companyTrade.real_instrument_token;
                        req.body.realBuyOrSell = companyTrade.realBuyOrSell;
                        req.body.realQuantity = companyTrade.realQuantity;
                        req.body.algoBoxId = elem._id,
                        req.body.isAlgoTrader = req.user.isAlgoTrader
                    }
                }
            })
    
        })

    }



    if(userPermissionAlgo?.length === 0){
        if(req.user.isAlgoTrader){
            return res.status(401).send({message: "Your profile is not active yet, please contact the admin @ team@stoxhero.com for more details."})
        } else{
            req.body.isAlgoTrader = req.user.isAlgoTrader
        }
    }
    await tradingAlgo();
    //console.log("caseStudy 6: end apply aplgo")

    next();

}

module.exports = ApplyAlgo;
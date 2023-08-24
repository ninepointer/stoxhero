// const User = require("../models/User/userDetailSchema");
const TradingAlgo = require("../models/AlgoBox/tradingAlgoSchema");
const AccessToken = require("../models/Trading Account/requestTokenSchema");
const ApiKey = require("../models/Trading Account/accountSchema");
const UserPermission = require("../models/User/permissionSchema");
// const UserPermission = require("../models/User/permissionSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const authoizeTrade = require('../controllers/authoriseTrade');
const DailyContest = require("../models/DailyContest/dailyContest");
const { ObjectId } = require("mongodb");
 

const ApplyAlgo = async (req, res, next) => {
    // console.log('apply alog middleware');
    if (!req.user.isAlgoTrader) {
        return res.status(401).send({ message: "Your profile is not authorised." });
    }

    const { symbol, instrumentToken, Quantity, buyOrSell } = req.body;
    const userId = req.user._id;

    const [accessTokenDetails, apiKeyDetails, tradingAlgoData, userPermission, instrumentMapping] = await Promise.all([
        AccessToken.find({ status: "Active" }),
        ApiKey.find({ status: "Active" }),
        TradingAlgo.find({ status: "Active" }),
        UserPermission.find({ userId: userId }).populate('algoId', 'algoName'),
        InstrumentMapping.find({ Status: "Active" })
    ]);

    const tradingAlgoMap = new Map();
    tradingAlgoData.forEach(algo => {
        if (!tradingAlgoMap.has(algo.tradingAccount)) {
            tradingAlgoMap.set(algo.tradingAccount, []);
        }
        tradingAlgoMap.get(algo.tradingAccount).push(algo);
    });

    const activeTradingAlgos = [];
    accessTokenDetails.forEach(token => {
        if (tradingAlgoMap.has(token.accountId)) {
            activeTradingAlgos.push(...tradingAlgoMap.get(token.accountId));
        }
    });

    const userPermissionAlgo = activeTradingAlgos.filter(algo =>
        userPermission.some(permission => 
            permission.algoId._id.toString() === algo._id.toString() && permission.isTradeEnable)
    );

    const companyTrade = {
        realSymbol: symbol,
        real_instrument_token: instrumentToken,
        realBuyOrSell: buyOrSell
    };

    userPermissionAlgo.forEach((algo) => {
        if (algo.transactionChange) {
            companyTrade.realBuyOrSell = buyOrSell === "BUY" ? "SELL" : "BUY";
        }

        if (algo.instrumentChange) {
            const mappedInstrument = instrumentMapping.find(instrument => instrument.InstrumentNameIncoming === symbol);
            if (mappedInstrument) {
                companyTrade.realSymbol = mappedInstrument.InstrumentNameOutgoing;
                companyTrade.real_instrument_token = mappedInstrument.OutgoingInstrumentCode;
            }
        }

        companyTrade.realQuantity = algo.lotMultipler * Quantity;

        const accessTokenParticular = accessTokenDetails.find(element => element.accountId === algo.tradingAccount);
        const apiKeyParticular = apiKeyDetails.find(element => element.accountId === algo.tradingAccount);

        userPermission.forEach(subElem => {
            if (subElem.algoId.algoName === algo.algoName) {
                const isRealTradeEnable = subElem.isRealTradeEnable && subElem.isTradeEnable;

                req.body = {
                    ...req.body,
                    realSymbol: companyTrade.realSymbol,
                    real_instrument_token: companyTrade.real_instrument_token,
                    realBuyOrSell: companyTrade.realBuyOrSell,
                    realQuantity: companyTrade.realQuantity,
                    algoBoxId: algo._id,
                    isAlgoTrader: req.user.isAlgoTrader,
                    ...(isRealTradeEnable ? { apiKey: apiKeyParticular.apiKey, accessToken: accessTokenParticular.accessToken } : {})
                };
            }
        });
    });

    if (userPermissionAlgo.length === 0 && req.user.isAlgoTrader) {
        return res.status(401).send({ message: "Your profile is not active yet, please contact the admin @ team@stoxhero.com for more details." });
    }
    // console.log('working');
    next();
};

const DailyContestApplyAlgo = async (req, res, next)=>{

    const {symbol, instrumentToken, Quantity, buyOrSell, contestId} = req.body;

    let userId = req.user._id;
    let accessTokenDetails = await AccessToken.find({status: "Active"});
    let apiKeyDetails = await ApiKey.find({status: "Active"});
    let tradingAlgoData = await TradingAlgo.find({status: "Active", isDefault: true});
    const dailyContest = await DailyContest.findOne({_id: new ObjectId(contestId)});

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


    async function tradingAlgo() {
        tradingAlgoData?.map((elem) => {
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
                // instrumentMappingFunc();
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

            if(dailyContest?.currentLiveStatus === "Live"){
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
                req.body.dailyContest = true;


            } else{
                req.body.realSymbol = companyTrade.realSymbol;
                req.body.real_instrument_token = companyTrade.real_instrument_token;
                req.body.realBuyOrSell = companyTrade.realBuyOrSell;
                req.body.realQuantity = companyTrade.realQuantity;
                req.body.algoBoxId = elem._id,
                req.body.isAlgoTrader = req.user.isAlgoTrader;
                req.body.dailyContest = true;
            }
    
        })

    }


    await tradingAlgo();
    //console.log("caseStudy 6: end apply aplgo")

    next();

}

module.exports = {ApplyAlgo, DailyContestApplyAlgo};
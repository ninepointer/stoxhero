const contestTrade = require('../controllers/contestTradeController');

exports.autoTradeHelper = async (data, contestId) => { 
    for(let i = 0; i < data.length; i++){
        let date = new Date();
        let transaction_type = data[i].lots > 0 ? "BUY" : "SELL";
        let quantity = Math.abs(data[i].lots);

        let buyOrSell
        if(transaction_type === "BUY"){
            buyOrSell = "SELL";
        } else{
            buyOrSell = "BUY";
        }

        // console.log("this is data", data[i])
        // realSymbol: data[i]._id.symbol,
        let Obj = {};
        Obj.symbol = data[i]._id.symbol ;
        Obj.Product = data[i]._id.product ;
        Obj.instrumentToken = data[i]._id.instrumentToken ;
        Obj.real_instrument_token = data[i]._id.instrumentToken ;
        Obj.exchange = data[i]._id.exchange ;
        Obj.validity = data[i]._id.validity ;
        Obj.OrderType = data[i]._id.order_type ;
        Obj.variety = data[i]._id.variety ;
        Obj.buyOrSell = buyOrSell ;
        Obj.createdBy = data[i]._id.name ;
        Obj.trader = data[i]._id.trader ;
        Obj.portfolioId = data[i]._id.portfolioId ;
        Obj.autoTrade = true ;
        Obj.uId = Date.now(),
        Obj.order_id = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
        Obj.dontSendResp = (i !== (data.length-1));

        await recursiveFunction(quantity)
 
        async function recursiveFunction(quantity) {
            if(quantity == 0){
                return;
            }
            else if (quantity < 1800) {
                Obj.Quantity = quantity;
                await contestTrade.takeAutoTrade(Obj, contestId);
                return;
            } else {
                Obj.Quantity = 1800;
                await contestTrade.takeAutoTrade(Obj, contestId);
                return recursiveFunction(quantity - 1800);
            }
        }


    }
}
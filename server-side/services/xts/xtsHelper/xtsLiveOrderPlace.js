const {placeOrder} = require("../xtsInteractive")

exports.liveTrade = async (req, res) => {

    let {algoBoxId, exchange, symbol, buyOrSell, Quantity, 
        Product, OrderType, validity, variety,trader,
        uId, instrumentToken, realBuyOrSell, realQuantity, 
        dontSendResp, exchangeInstrumentToken} = req.body

        // console.log(req.body)

    if(!exchange || !symbol || !buyOrSell || !realQuantity || !Product || !OrderType || !validity || !variety || !exchangeInstrumentToken){
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    let obj = {
        exchange: exchange,
        exchangeInstrumentToken: exchangeInstrumentToken,
        Product: Product,
        OrderType: OrderType,
        buyOrSell: realBuyOrSell,
        validity: validity,
        disclosedQuantity: 0,
        Quantity: realQuantity,
        // orderUniqueIdentifier: `${req.user.first_name}${req.user.mobile}`
    }

    console.log(obj)
    const placeorder = await placeOrder(obj, req, res);

}

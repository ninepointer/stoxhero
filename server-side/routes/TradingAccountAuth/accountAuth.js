const express = require("express");
const router = express.Router();
require("../../db/conn");
const Account = require("../../models/Trading Account/accountSchema");
const { disconnectTicker, createNewTicker } = require('../../marketData/kiteTicker');
const getKiteCred = require('../../marketData/getKiteCred');
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');

router.post("/account", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res) => {
    const { brokerName, accountId, accountName, apiKey, apiSecret, status, uId, createdOn, lastModified, createdBy } = req.body;

    if (!brokerName || !accountId || !accountName || !apiKey || !apiSecret || !status || !uId || !createdOn || !lastModified || !createdBy) {
        //console.log("data nhi h pura");
        return res.status(422).json({ error: "plz filled the field..." })
    }

    Account.findOne({ accountId: accountId })
        .then((dateExist) => {
            if (dateExist) {
                //console.log("data already");
                return res.status(422).json({ error: "date already exist..." })
            }
            const account = new Account({ brokerName, accountId, accountName, apiKey, apiSecret, status, uId, createdOn: new Date(), lastModified: new Date(), createdBy: req.user._id });

            account.save().then(() => {

                // disconnectTicker();
                // getKiteCred.getAccess().then((data) => {
                //     //console.log(data);
                //     createNewTicker(data.getApiKey, data.getAccessToken);
                // });


                res.status(201).json({ massage: "data enter succesfully" });
            }).catch((err) => res.status(500).json({ error: "Failed to enter data" }));
        }).catch(err => { console.log("fail in account auth") });

})

router.get("/readAccountDetails", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res) => {
    Account.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send(data);
        }
    }).sort({ $natural: -1 })
})

router.get("/readAccountDetails/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res) => {
    //console.log(req.params)
    const { id } = req.params
    Account.findOne({ _id: id })
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch((err) => {
            return res.status(422).json({ error: "date not found" })
        })
})

router.put("/readAccountDetails/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res) => {
    //console.log(req.params)
    //console.log("this is body", req.body);
    try {
        const { id } = req.params
        const account = await Account.findOneAndUpdate({ _id: id }, {
            $set: {
                brokerName: req.body.Broker,
                accountId: req.body.AccountID,
                accountName: req.body.AccountName,
                apiKey: req.body.APIKey,
                apiSecret: req.body.APISecret,
                status: req.body.Status,
                lastModified: new Date()
            }
        });

        // disconnectTicker();
        // getKiteCred.getAccess().then((data) => {
        //     //console.log(data);
        //     createNewTicker(data.getApiKey, data.getAccessToken);
        // });

        //console.log("this is role", account);
        res.send(account)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Failed to edit data" });
    }
})

router.delete("/readAccountDetails/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res) => {
    //console.log(req.params)
    try {
        const { id } = req.params
        const account = await Account.deleteOne({ _id: id })
        //console.log("this is userdetail", account);
        // res.send(userDetail)
        res.status(201).json({ massage: "data delete succesfully" });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
})

router.patch("/readAccountDetails/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res) => {
    //console.log(req.params)
    //console.log("this is body", req.body);
    try { // Broker, AccountID, AccountName, APIKey, APISecret, Status, lastModified
        const { id } = req.params
        const account = await Account.findOneAndUpdate({ _id: id }, {
            $set: {
                status: req.body.Status,
                lastModified: req.body.lastModified
            }
        })
        //console.log("this is role", account);
        res.send(account)
    } catch (e) {
        res.status(500).json({ error: "Failed to edit data" });
    }
})

module.exports = router;
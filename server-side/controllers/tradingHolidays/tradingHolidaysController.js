const TradingHoliday = require("../../models/TradingHolidays/tradingHolidays");
const user = require("../../models/User/userDetailSchema")
const moment = require('moment');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.createTradingHoliday = async (req, res, next) => {
    const { holidayName, description, holidayDate, status } = req.body;

    // Convert the holidayDate to a Date object
    const holidayDateObject = new Date(holidayDate);

    // Set the time to the beginning of the day (midnight)
    const startTimeOfDay = new Date(holidayDateObject);
    startTimeOfDay.setHours(0, 0, 0, 0);

    // Set the time to the end of the day (11:59:59 PM)
    const endTimeOfDay = new Date(holidayDateObject);
    endTimeOfDay.setHours(23, 59, 59, 999);

    // Check if a holiday already exists for the given date
    if (await TradingHoliday.findOne({ holidayDate: { $gte: startTimeOfDay, $lte: endTimeOfDay } })) {
        return res.status(400).json({ message: 'This holiday already exists.' });
    }

    // Create the trading holiday
    const holiday = await TradingHoliday.create({
        holidayName: holidayName.trim(),
        description,
        holidayDate: holidayDateObject,
        createdBy: req.user._id,
        lastModifiedBy: req.user._id,
    });

    res.status(201).json({ status: 'success', message: 'Trading Holiday successfully created.', data: holiday });
};


exports.getTradingHolidays = async(req, res, next)=>{
    try{
        const holiday = await TradingHoliday.find();
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getTodaysTradingHolidays = async(req, res, next)=>{

    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 18, 30, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 29, 59));
     
    try{
        const holiday = await TradingHoliday.find({holidayDate : {$gte: startOfDay, $lte:endOfDay}}).sort({holidayDate:1});
       
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getUpcomingTradingHolidays = async(req, res, next)=>{
    const now = new Date();
    const fromTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 29, 59));

    try{
        const holiday = await TradingHoliday.find({holidayDate : {$gt:fromTomorrow}}).sort({holidayDate:1});
       
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getPastTradingHolidays = async(req, res, next)=>{
    const now = new Date();
    const beforeYesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 18, 30, 0));
    try{
        const holiday = await TradingHoliday.find({holidayDate : {$lt:beforeYesterday}}).sort({holidayDate:-1});
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getTradingHolidayById = async(req, res, next) => {
    const id = req.params.id;

    try {
        const holiday = await TradingHoliday.findById(id);
        res.status(200).json({status: 'success', data: holiday});
    } catch (e) {
      
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.editTradingHoliday = async(req, res, next) => {
    const id = req.params.id;

    const holiday = await TradingHoliday.findById(id);

    const filteredBody = filterObj(req.body, "holidayName", "holidayDate", "description");
    filteredBody.lastModifiedBy = req.user._id;  
    filteredBody.lastModifiedOn = new Date();  

    const updated = await TradingHoliday.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited Trading Holiday.', data: updated});
}

exports.deleteTradingHoliday = async(req, res, next) => {
    const id = req.params.id;

    const history = await TradingHoliday.findOneAndUpdate({_id : id}, {
        $set:{
            isDeleted: true,
            // lastModifiedBy: req.user._id,
            lastModifiedOn: new Date()
        }
    }, {new: true})

    res.status(200).json({message: 'Successfully deleted trading holiday.', data: holiday});
}

exports.getTradingHolidayBetweenDates = async(req, res, next) => {
    let {startDate, endDate} = req.params;
    startDate = new Date(startDate);
    endDate = new Date(endDate)

    let startDateDateComponent = startDate.toISOString().split('T')[0];
    let endDateDateComponent = endDate.toISOString().split('T')[0];

    const fullStartDate = new Date(`${startDateDateComponent}T00:00:00.000Z`);
    const fullEndDate = new Date(`${endDateDateComponent}T23:59:59.000Z`);

    console.log(fullStartDate, fullEndDate, startDate, endDate)
    try {
        const holiday = await TradingHoliday.find({
            holidayDate: {
              $gte: fullStartDate,
              $lte: fullEndDate
            },
            $expr: {
              $and: [
                { $ne: [{ $dayOfWeek: "$holidayDate" }, 1] }, // 1 represents Sunday
                { $ne: [{ $dayOfWeek: "$holidayDate" }, 7] }  // 7 represents Saturday
              ]
            }
          });

        //   console.log(holiday)
        // const holiday = await TradingHoliday.find({holidayDate: {$gte: startDate, $lte: endDate}});
        res.status(200).json({status: 'success', data: holiday.length});
    } catch (e) {
      
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.nextTradingDay = async (req, res, next) => {

    try {
        for (let i = 1; i < 30; i++) {
            let date = new Date();
            date.setDate(date.getDate() + i);
            const endOfTomorrow = new Date(date);
            endOfTomorrow.setHours(23, 59, 59, 999);
            // console.log(date.getDate() + i);
            // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate() + i).padStart(2, '0')}`
            // const currentDate = new Date(todayDate);
            // let secondDate = new Date(`${todayDate}T23:59:00.000Z`);
            // console.log(currentDate, secondDate)
            // const currentDate = new Date();

            // // Get tomorrow's date
            // const tomorrowDate = new Date(currentDate);
            // tomorrowDate.setDate(currentDate.getDate() + 1);
            
            // // Start of tomorrow
            // const startOfTomorrow = new Date(tomorrowDate);
            // startOfTomorrow.setHours(0, 0, 0, 0);
            
            // // End of tomorrow
            // const endOfTomorrow = new Date(tomorrowDate);
            // endOfTomorrow.setHours(23, 59, 59, 999);
            // console.log( date, endOfTomorrow, new Date(date.toISOString().split("T")[0]), new Date(`${endOfTomorrow.toISOString().split("T")[0]}T23:59:00.000Z`) )
            const holiday = await TradingHoliday.find({
                holidayDate: {
                    $gte: new Date(date.toISOString().split("T")[0]),
                    $lte: new Date(`${endOfTomorrow.toISOString().split("T")[0]}T23:59:00.000Z`)
                }
            });
            if (isTradingDay(date, holiday)) {
                // Set the remaining time state here
                res.status(200).send({ status: "success", data: date })
                break;
            } else {
                console.log("Not a trading day. Remaining time state not set.");
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

function isTradingDay(date, holidays) {
    // Check if the date is a weekend (Saturday or Sunday)
    if (date.getDay() === 0 || date.getDay() === 6) {
        return false;
    }

    // Check if the date is a holiday
    if (holidays.length) {
        return false;
    }
    return true;
}
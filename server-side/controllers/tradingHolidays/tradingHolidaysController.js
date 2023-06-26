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

exports.createTradingHoliday = async(req, res, next)=>{
    
    const{holidayName, description, holidayDate, status } = req.body;

    if(await TradingHoliday.findOne({holidayDate})) return res.status(400).json({message:'This holiday already exists.'});

    const holiday = await TradingHoliday.create({
        holidayName:holidayName.trim(), 
        description, 
        holidayDate,
        createdBy: req.user._id, 
        lastModifiedBy: req.user._id
    });
    
    res.status(201).json({status: 'success', message: 'Trading Holiday successfully created.', data: holiday});

}

exports.getTradingHolidays = async(req, res, next)=>{
    try{
        const holiday = await TradingHoliday.find();
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getTodaysTradingHolidays = async(req, res, next)=>{
     
    try{
        const holiday = await TradingHoliday.find({holidayDate : {$gte: new Date().setHours(0, 0, 0, 0), $lte:new Date().setHours(23, 59, 59, 0)}}).sort({holidayDate:1});
       
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getUpcomingTradingHolidays = async(req, res, next)=>{
    
    try{
        const holiday = await TradingHoliday.find({holidayDate : {$gt:new Date().setHours(23, 59, 59, 0)}}).sort({holidayDate:1});
       
        res.status(200).json({status: 'success', data: holiday, results: holiday.length});    
    }catch(e){
        
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getPastTradingHolidays = async(req, res, next)=>{
    try{
        const holiday = await TradingHoliday.find({holidayDate : {$lt:new Date().setHours(0, 0, 0, 0)}}).sort({holidayDate:-1});
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
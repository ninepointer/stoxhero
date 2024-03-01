const mongoose = require("mongoose");
const Schema = mongoose;

const languageSchema = new mongoose.Schema({

    language:{type:String},
    createdOn: {
        type: Date,
        default: () => new Date(),
    },
    lastModifiedOn: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    
})

const language = mongoose.model("language", languageSchema);
module.exports = language;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tradingGuruLeadSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  mobile: { type: String },
  email: { type: String },
  courseType: { type: String, enum:['Live','Recorded','Both'] },
  about:{type:String},
  youtubeChannelLink: {type:String},
  instagramChannelLink: {type:String},
  telegramChannelLink: {type:String},
  linkedinProfileLink: {type:String},
  courseLanguages: {
    type: Schema.Types.ObjectId,
    ref: 'language',
    },
  courseOf: { type: String, enum: ["Stock Market"]},
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: 'Beginner' },
});

const tradingGuruLead = mongoose.model("tradingguru-lead", tradingGuruLeadSchema);

module.exports = tradingGuruLead;

const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const LeaderboardSchema = new Schema({
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    },
    usersPerTable: {
        type: Number,
    },
    rewards: [
        {
          rankStart: { type: Number },
          rankEnd: Number,
          reward: String,
          rewardType: {
            type: String,
            enum: ['Cash', 'Goodies']
          },
          rewardValue: Number
        },
      ],
});

const Leaderboard = mongoose.model('leaderboard-parameter', LeaderboardSchema);
module.exports = Leaderboard;
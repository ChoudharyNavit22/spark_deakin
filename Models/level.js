/**
 * Created by Navit on 15/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../Config');


var level = new Schema({
    userId: {type: Schema.ObjectId, ref: 'user'},
    level: {type: Number,required: true, default:1},
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, default: Date.now, required: true},
    questionsAttempted:{type: Number,required: true, default:0},
    score:{type: Number,required: true, default:0},
    levelSubDet:[{
        levelId: {type: Number,required: true},
        timeToSolve:{type: Number,required: true},
        response_ans:{type: Number,required: true}
    }]
});

module.exports = mongoose.model('level', level);
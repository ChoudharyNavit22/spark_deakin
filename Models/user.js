/**
 * Created by Navit on 15/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../Config');

var user = new Schema({
    emailId: {type: String, trim: true, required: true,unique: true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    password: {type: String},
    code:{type: String, trim: true},
    OTPCode: {type: String, trim: true},
    emailVerified: {type: Boolean, default: true},
    surveyType: {
        type: String,
        enum: [
            Config.APP_CONSTANTS.DATABASE.SURVEY_TYPE.STEM,
            Config.APP_CONSTANTS.DATABASE.SURVEY_TYPE.NONSTEM
        ],
        required: true
    },
    initialAbility:{type:String},
    finalAbility:{type:String},
    quizLevel:{type:String},
    registrationDate: {type: Date, default: Date.now},
    codeUpdatedAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('user', user);
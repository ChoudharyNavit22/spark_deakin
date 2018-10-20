/**
 * Created by Navit on 15/11/16.
 */
'use strict';

var Models = require('../Models');


var updateLevel = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Level.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
var createLevel = function (objToSave, callback) {
    new Models.Level(objToSave).save(callback)
};
//Delete User in DB
var deleteLevel = function (criteria, callback) {
    Models.Level.findOneAndRemove(criteria, callback);
};

//Get Users from DB
var getLevel = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Level.find(criteria, projection, options, callback);
};


module.exports = {
    updateLevel: updateLevel,
    createLevel: createLevel,
    deleteLevel: deleteLevel,
    getLevel:getLevel
};
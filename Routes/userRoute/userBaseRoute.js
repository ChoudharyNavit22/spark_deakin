/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var Controller = require('../../Controllers');
var Joi = require('joi');
var Config = require('../../Config');

var userRegister = {
    method: 'POST',
    path: '/api/user/register',
    handler: function (request, reply) {
        var payloadData = request.payload;
        if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
            reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else{
            Controller.UserBaseController.createUser(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(201)
                }
            });
        }
    },
    config: {
        description: 'Register a new user',
        tags: ['api', 'user'],
        validate: {
            payload: {
                emailId: Joi.string().required(),
                password: Joi.string().required().min(5).allow('')
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var verifyOTP =
{
    method: 'PUT',
    path: '/api/user/verifyOTP',
    handler: function (request, reply) {
        var payloadData = request.payload;
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.UserBaseController.verifyOTP(userData,payloadData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_COMPLETE, data))
            }
        });
    },
    config: {
        auth: 'UserAuth',
        description: 'Verify OTP for User',
        tags: ['api', 'user'],
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                OTPCode: Joi.string().length(6).required()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var login = {
    method: 'POST',
    path: '/api/user/login',
    handler: function (request, reply) {
        var payloadData = request.payload;
        if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
            reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else{
            Controller.UserBaseController.loginUser(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, data))
                }
            });
        }
    },
    config: {
        description: 'Login Via Email & Password For User',
        tags: ['api', 'user'],
        validate: {
            payload: {
                emailId: Joi.string().required(),
                password: Joi.string().required().min(5).trim()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var facebookLogin =
{
    method: 'POST',
    path: '/api/user/loginViaFacebook',
    handler: function (request, reply) {
        var payloadData = request.payload;
        Controller.UserBaseController.loginViaFacebook(payloadData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(null, data))
            }
        });
    },
    config: {
        description: 'Login Via Facebook For Customer',
        tags: ['api', 'customer'],
        validate: {
            payload: {
                facebookId: Joi.string().required(),
                deviceType: Joi.string().required().valid([UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID]),
                deviceToken: Joi.string().required().trim(),
                appVersion: Joi.string().required().trim()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var resendOTP =
{
    method: 'PUT',
    path: '/api/user/resendOTP',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.UserBaseController.resendOTP(userData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, data))
            }
        });
    },
    config: {
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        description: 'Resend OTP for Customer',
        tags: ['api', 'customer'],
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var getOTP = {
    method: 'GET',
    path: '/api/getOTP',
    config: {
        description: 'get OTP for Customer',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            var userData = request.query;
            Controller.UserBaseController.getOTP(userData, function (error, success) {
                if (error) {
                    reply(UniversalFunctions.sendError(error));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
                }
            });
        },
        validate: {
            query:{
                phoneNumber:Joi.string().regex(/^[0-9]+$/).min(5).required()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var accessTokenLogin =
{
    /* *****************access token login****************** */
    method: 'POST',
    path: '/api/user/accessTokenLogin',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.UserBaseController.accessTokenLogin(userData, function (err, data) {
            console.log('%%%%%%%%%%%%%%%', err, data)
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(null, data));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'access token login',
        tags: ['api', 'user'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }

}

var logoutCustomer = {
    method: 'PUT',
    path: '/api/user/logout',
    config: {
        description: 'Logout user',
        auth: 'UserAuth',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
                 Controller.UserBaseController.logoutCustomer(userData, function (err, data) {
                    if (err) {
                        reply(UniversalFunctions.sendError(err));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.LOGOUT));
                    }
                });

        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }

    }
};

var getProfile = {
    method: 'GET',
    path: '/api/user/getProfile',
    config: {
        description: 'get profile of user',
        auth: 'UserAuth',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.UserBaseController.getProfile(userData, function (error, success) {
                    if (error) {
                        reply(UniversalFunctions.sendError(error));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
                    }
                });
            } else {
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN));
            }
        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var changePassword =
{
    method: 'PUT',
    path: '/api/user/changePassword',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.UserBaseController.changePassword(userData,request.payload, function (err, user) {
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, user));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'change Password',
        tags: ['api', 'customer'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                oldPassword: Joi.string().required().min(4),
                newPassword: Joi.string().required().min(4)
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var forgotPassword = {
    method: 'POST',
    path: '/api/user/forgotPassword',
    config: {
        description: 'forgot password',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            Controller.UserBaseController.forgetPassword(request.payload, function (error, success) {
                if (error) {
                    reply(UniversalFunctions.sendError(error));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, success));
                }
            });
        },
        validate: {
            payload: {
                phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5).required()
            },
            failAction:  UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages:  UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }

    }
};

var resetPassword = {

    method: 'POST',
    path: '/api/user/resetPassword',
    config: {
        description: 'reset password',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            Controller.UserBaseController.resetPassword(request.payload, function (error, success) {
                if (error) {
                    reply(UniversalFunctions.sendError(error));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, success));
                }
            });
        },
        validate: {
            payload: {
                password: Joi.string().min(6).required().trim(),
                phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5).required(),
                OTPCode : Joi.string().required()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }

    }
};

var generateQuestion =
{
    /* *****************access token login****************** */
    method: 'GET',
    path: '/api/user/generateQuestion',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.UserBaseController.generateQuestion(userData, function (err, data) {
            console.log('%%%%%%%%%%%%%%%', err, data)
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(null, data));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'generate Question',
        tags: ['api', 'user'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }

}

var submitQuestion =
{
    /* *****************access token login****************** */
    method: 'POST',
    path: '/api/user/submitQuestion',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        var payloadData = request.payload;
        Controller.UserBaseController.submitQuestion(userData,payloadData, function (err, data) {
            console.log('%%%%%%%%%%%%%%%', err, data)
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(null, data));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'submit Question',
        tags: ['api', 'user'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                level:Joi.number().required(),
                timeTaken:Joi.number().required(),
                correct:Joi.number().required()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }

}

var submitAbility=
{
    /* *****************access token login****************** */
    method: 'POST',
    path: '/api/user/submitAbility',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        var payloadData = request.payload;
        Controller.UserBaseController.submitAbility(userData,payloadData, function (err, data) {
            console.log('%%%%%%%%%%%%%%%', err, data)
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(null, data));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'submit ability',
        tags: ['api', 'user'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                initialAbility:Joi.string().required(),
                finalAbility:Joi.string().required(),
                quizLevel:Joi.string().required()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }

}

var UserBaseRoute =
    [
        userRegister,
        //verifyOTP,
        login,
        //facebookLogin,
        //resendOTP,
        //getOTP,
        accessTokenLogin,
        //logoutCustomer,
        getProfile,
        changePassword,
        generateQuestion,
        submitQuestion,
        submitAbility
        //forgotPassword,
        //resetPassword
    ]
module.exports = UserBaseRoute;
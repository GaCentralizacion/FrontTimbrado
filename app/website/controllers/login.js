var LoginView = require('../views/reference'),
    LoginModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var Login = function(conf) {
    this.conf = conf || {};

    this.view = new LoginView();
    this.model = new LoginModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Login.prototype.get_permisos = function(req, res, next) {

    var self = this;

    var params = [{ name: 'User', value: req.query.usuario, type: self.model.types.STRING },
                  { name: 'pass', value: req.query.contrasena, type: self.model.types.STRING }];

    this.model.query('SEL_LOGIN_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Login;

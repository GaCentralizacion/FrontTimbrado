var correoRHView = require('../views/reference'),
    correoRHModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var correoRH = function(conf) {
    this.conf = conf || {};

    this.view = new correoRHView();
    this.model = new correoRHModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


correoRH.prototype.get_correosRHLista = function(req, res, next) {
    var self = this;

    var params = [];
    this.model.query('SEL_CORREOS_RH_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

correoRH.prototype.post_actualizaCorreo = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idLugar', value: req.body.idLugar, type: self.model.types.STRING },
        { name: 'correo', value: req.body.correo, type: self.model.types.STRING }];

    this.model.post('UPD_CORREO_RH_SP', params, function(error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = correoRH;

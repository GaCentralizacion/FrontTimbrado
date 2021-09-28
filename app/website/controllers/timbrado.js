var TimbradoView = require('../views/timbrado'),
    TimbradoModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var Timbrado = function (conf) {
    this.conf = conf || {};

    this.view = new TimbradoView();
    this.model = new TimbradoModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Timbrado.prototype.get_timbradoProcesando = function (req, res, next) {

    var self = this;

    var params = [{name: 'Usuario',value: req.query.Usuario,type: self.model.types.INT}];

    this.model.query('SEL_AVANCE_TIMBRADO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Timbrado.prototype.get_ConciliacionProcesando = function (req, res, next) {

    var self = this;

    var params = [{name: 'Usuario',value: req.query.Usuario,type: self.model.types.INT}];

    this.model.query('SEL_AVANCE_CONCILIACION_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Timbrado;


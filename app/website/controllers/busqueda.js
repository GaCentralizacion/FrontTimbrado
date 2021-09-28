var BusquedaView = require('../views/reference'),
    BusquedaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var Busqueda = function(conf) {
    this.conf = conf || {};

    this.view = new BusquedaView();
    this.model = new BusquedaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Busqueda.prototype.get_timbrados = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idGrupo', value: req.query.idGrupo, type: self.model.types.INT },
        { name: 'idTipoNomina', value: req.query.idTipoNomina, type: self.model.types.INT },
        { name: 'carpeta', value: req.query.carpeta, type: self.model.types.STRING }
    ];

    this.model.query('SEL_BUSQUEDA_TIMBRADOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Busqueda.prototype.get_timbradosDepto = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'Departamento', value: req.query.Departamento, type: self.model.types.STRING },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idGrupo', value: req.query.idGrupo, type: self.model.types.INT },
        { name: 'idTipoNomina', value: req.query.idTipoNomina, type: self.model.types.INT },
        { name: 'carpeta', value: req.query.carpeta, type: self.model.types.STRING }
    ];

    this.model.query('SEL_BUSQUEDA_TIMBRADOSDEPTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Busqueda.prototype.get_timbradosPuesto = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'Departamento', value: req.query.departamento, type: self.model.types.STRING },
        { name: 'Puesto', value: req.query.Puesto, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idGrupo', value: req.query.idGrupo, type: self.model.types.INT },
        { name: 'idTipoNomina', value: req.query.idTipoNomina, type: self.model.types.INT },
        { name: 'carpeta', value: req.query.carpeta, type: self.model.types.STRING }
    ];

    this.model.query('SEL_BUSQUEDA_TIMBRADOSPUESTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Busqueda.prototype.post_addImpresion = function(req, res, next) {
    console.log('entre')
        //Referencia a la clase para callback
        var self = this;
        //Asigno a params el valor de mis variables
        var params = [{ name: 'ipUsuario', value: req.body.ipUsuario, type: self.model.types.STRING },
            { name: 'ruta', value: req.body.ruta, type: self.model.types.STRING },
            { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
            { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.STRING },
            { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT }];
        this.model.post('INS_IMPRESION_SP', params, function(error, result) {
            //Callback
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
}

Busqueda.prototype.post_addImpresionDetalle = function(req, res, next) {
        //Referencia a la clase para callback
        var self = this;
        //Asigno a params el valor de mis variables
        var params = [{ name: 'idImpresion', value: req.body.idImpresora, type: self.model.types.INT },
            { name: 'documento', value: req.body.documento, type: self.model.types.STRING }];

        this.model.post('INS_IMPRESION_DETALLE_SP', params, function(error, result) {
            //Callback
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
}

module.exports = Busqueda;

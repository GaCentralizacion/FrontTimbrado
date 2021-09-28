var FiltrosView = require('../views/reference'),
    FiltrosModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var Filtros = function (conf) {
    this.conf = conf || {};

    this.view = new FiltrosView();
    this.model = new FiltrosModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Filtros.prototype.get_grupo = function (req, res, next) {

    var self = this;

    var params = [{name: 'idUsuario',value: req.query.idUsuario,type: self.model.types.INT}];

    this.model.query('SEL_GRUPO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Filtros.prototype.get_empresa = function (req, res, next) {

    var self = this;

    var params = [{name: 'idGrupo',value: req.query.idGrupo,type: self.model.types.INT}];

    this.model.query('SEL_EMPRESAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Filtros.prototype.get_empresaConciliacion = function (req, res, next) {

    var self = this;
    console.log('Entro a empresaConciliacion');
    var params = [{name: 'idGrupo',value: req.query.idGrupo,type: self.model.types.INT}];

    this.model.query('SEL_EMPRESAS_CONCILIACION_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Filtros.prototype.get_mes = function (req, res, next) {

    var self = this;

    var params = [];

    this.model.query('SEL_MESES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Filtros.prototype.get_anio = function (req, res, next) {

    var self = this;

    var params = [];

    this.model.query('SEL_ANIOS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Filtros.prototype.get_agencia = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT}];

    this.model.query('SEL_SUCURSALES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Filtros.prototype.get_year = function (req, res, next) {

    var self = this;

    var params = [{name: 'idTipoNomina',value: req.query.idTipoNomina ,type: self.model.types.INT}];

    this.model.query('SEL_YEAR_NOMINAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_periodo = function (req, res, next) {

    var self = this;

    var params = [
    {name: 'idTipoNomina',value: req.query.idTipoNomina ,type: self.model.types.INT},
    {name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'Year',value: req.query.Year ,type: self.model.types.INT}
    ];

    this.model.query('SEL_PERIODOS_NOMINAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_departamento = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
                {name: 'nombreNomina',value: req.query.nombreNomina ,type: self.model.types.STRING}  ];

    this.model.query('SEL_DEPARTAMENTO_NOMINAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_puesto = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
                {name: 'nombreNomina',value: req.query.nombreNomina ,type: self.model.types.STRING},
                {name: 'nombreDepartamento',value: req.query.nombreDepartamento ,type: self.model.types.STRING}  ];

    this.model.query('SEL_PUESTO_NOMINAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
//[]
Filtros.prototype.get_tipoNomina = function (req, res, next) {

    var self = this;

    var params = [];

    this.model.query('SEL_TIPO_NOMINA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};// agrege este paramerametro

Filtros.prototype.get_validarDocumentosTimbrados = function (req, res, next) {

    var self = this;

    var params = [{name: 'nombreNomina',value: req.query.nombreNomina ,type: self.model.types.STRING},
                    {name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
                    {name: 'tipoNomina',value: req.query.tipoNomina ,type: self.model.types.INT}];

    this.model.query('SEL_DOCUMENTOS_TIMBRADOS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_concilia1a1 = function (req, res, next) {

    var self = this;
    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT},
    {name: 'mes',value: req.query.mes ,type: self.model.types.INT},
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];

    this.model.query('SEL_CONCILIA1A1_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_pagasSTimbre = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT},
    {name: 'mes',value: req.query.mes ,type: self.model.types.INT},
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];

    this.model.query('SEL_PAGAS_S_TIMBRE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_timbreSPaga = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT},
    {name: 'mes',value: req.query.mes ,type: self.model.types.INT},
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];

    this.model.query('SEL_TIMBRE_S_PAGA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_sugeCancelacion = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT},
    {name: 'mes',value: req.query.mes ,type: self.model.types.INT},
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];

    this.model.query('SEL_SUGERENCIA_CANCELACION_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_UniTimbres = function (req, res, next) {

    var self = this;

    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT},
    {name: 'mes',value: req.query.mes ,type: self.model.types.INT}, 
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];
    
    this.model.query('SEL_UNITIMBRES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


Filtros.prototype.get_pagas = function (req, res, next) {

    var self = this;
    console.log('Entro al sp Pagas');
    console.log('idEmpresa: ' + req.query.idEmpresa);
    console.log(req.query.anio);
    console.log(req.query.mes);
    console.log(req.query.FechaPaga);
    var params = [{name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT},
    {name: 'mes',value: req.query.mes ,type: self.model.types.INT},
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];

    this.model.query('SEL_PAGAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_ActualizaCarpeta = function (req, res, next) {

    var self = this;

    console.log(req.query.idEmpresa);
    console.log(req.query.idTipoNomina);
    console.log(req.query.fecha);

    var params = [{name: 'ClaveEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'IdTipoNomina',value: req.query.idTipoNomina ,type: self.model.types.INT},
    {name: 'NombreNomina',value: req.query.fecha ,type: self.model.types.STRING}];

    this.model.query('SEL_ACTUALIZA_CARPETA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


Filtros.prototype.get_LlenaM4 = function (req, res, next) {

    var self = this;

    var params = [{name: 'idMes',value: req.query.idMes ,type: self.model.types.INT},
    {name: 'idAnio',value: req.query.idAnio ,type: self.model.types.INT},
    {name: 'idEmpresa',value: req.query.idEmpresa ,type: self.model.types.INT},
    {name: 'FechaPaga',value: req.query.FechaPaga ,type: self.model.types.STRING}];

    this.model.query('SEL_LLENANOMINA_M4_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



Filtros.prototype.get_FechasPagas = function (req, res, next) {

    var self = this;

    var params = [{name: 'mes',value: req.query.mes ,type: self.model.types.INT},
    {name: 'anio',value: req.query.anio ,type: self.model.types.INT}];

    this.model.query('SEL_FECHAS_PAGA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Filtros.prototype.get_buscaLugarTrabajo = function (req, res, next) {

    var self = this;

    var params = [ {name: 'rfc',value: req.query.rfc ,type: self.model.types.STRING}];

    this.model.query('SEL_LUGARTRABAJO_RFC_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Filtros;

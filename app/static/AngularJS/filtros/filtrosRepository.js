var filtroURL = global_settings.urlCORS + 'api/filtros/';


registrationModule.factory('filtrosRepository', function($http) {
    return {
        getGrupo: function(idUsuario) {
            return $http({
                url: filtroURL + 'grupo/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getEmpresa: function(idgrupo) {
            return $http({
                url: filtroURL + 'empresa/',
                method: "GET",
                params: {
                    idGrupo: idgrupo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getEmpresaConciliacion: function(idgrupo) {
            return $http({
                url: filtroURL + 'empresaConciliacion/',
                method: "GET",
                params: {
                    idGrupo: idgrupo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getMes: function(idgrupo) {
            return $http({
                url: filtroURL + 'mes/',
                method: "GET",
                params: {
                    idGrupo: idgrupo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAnio: function(idgrupo) {
            return $http({
                url: filtroURL + 'anio/',
                method: "GET",
                params: {
                    idGrupo: idgrupo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAgencia: function(idempresa) {
            return $http({
                url: filtroURL + 'agencia/',
                method: "GET",
                params: {
                    idEmpresa: idempresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getYear: function(idTipoNomina) {
            return $http({
                url: filtroURL + 'year/',
                method: "GET",
                params: {
                    idTipoNomina: idTipoNomina
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getPeriodo : function(idTipoNomina,idEmpresa,year) {
            return $http({
                url: filtroURL + 'periodo/',
                method: "GET",
                params: {
                    idTipoNomina: idTipoNomina,
                    idEmpresa: idEmpresa,
                    Year: year
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getDepartamento: function(idEmpresa, nombreNomina) {
            return $http({
                url: filtroURL + 'departamento/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    nombreNomina: nombreNomina
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getpuesto: function(idEmpresa, nombreNomina,nombreDepartamento) {
            return $http({
                url: filtroURL + 'puesto/',
                method: "GET",
                params: {
                    idEmpresa:idEmpresa,
                    nombreNomina: nombreNomina,
                    nombreDepartamento:nombreDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoNomina: function() {
            return $http({
                url: filtroURL + 'tipoNomina/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, //
// agrege este paramerametro
        getValidarDocumentosTimbrados: function(nombreNomina, idEmpresa,tipoNomina) {
            return $http({
                url: filtroURL + 'validarDocumentosTimbrados/',
                method: "GET",
                params: {
                    nombreNomina: nombreNomina,
		idEmpresa:idEmpresa,
        tipoNomina:tipoNomina
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getConcilia1a1: function(idEmpresa,anio,mes,FechaPaga) {
            return $http({
                url: filtroURL + 'concilia1a1/',
                method: "GET",
                params: {
		            idEmpresa:idEmpresa,
                    anio:anio,
                    mes:mes,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPagasSTimbre: function(idEmpresa,anio,mes,FechaPaga) {
            return $http({
                url: filtroURL + 'pagasSTimbre/',
                method: "GET",
                params: {
		            idEmpresa:idEmpresa,
                    anio:anio,
                    mes:mes,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTimbreSPaga: function(idEmpresa,anio,mes,FechaPaga) {
            return $http({
                url: filtroURL + 'timbreSPaga/',
                method: "GET",
                params: {
		            idEmpresa:idEmpresa,
                    anio:anio,
                    mes:mes,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getSugeCancelacion: function(idEmpresa,anio,mes,FechaPaga) {
            return $http({
                url: filtroURL + 'sugeCancelacion/',
                method: "GET",
                params: {
		            idEmpresa:idEmpresa,
                    anio:anio,
                    mes:mes,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getUniTimbres: function(idEmpresa,anio,mes,FechaPaga) {
            return $http({
                url: filtroURL + 'UniTimbres/',
                method: "GET",
                params: {
		            idEmpresa:idEmpresa,
                    anio:anio,
                    mes:mes,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPagas: function(idEmpresa,anio,mes,FechaPaga) {
            return $http({
                url: filtroURL + 'pagas/',
                method: "GET",
                params: {
                    idEmpresa:idEmpresa,
                    anio:anio,
                    mes:mes,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getLlenaM4: function(idMes,idAnio,idEmpresa,FechaPaga) {
            console.log('Valor del Mes en getLlenaM4: '+ idMes);
            console.log('Valor del Año en getLlenaM4: '+ idAnio);
            console.log('Valor del idEmpresa en getLlenaM4: '+ idEmpresa);
            console.log('Valor del idEmpresa en getLlenaM4: '+ FechaPaga);
            return $http({
                url: filtroURL + 'LlenaM4/',
                method: "GET",
                params: {
                    idMes:idMes,
                    idAnio:idAnio,
                    idEmpresa:idEmpresa,
                    FechaPaga:FechaPaga
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getActualizaCarpeta: function(idEmpresa,idTipoNomina,fecha) {
            console.log('Valor de Empresa: '+ idEmpresa);
            console.log('Valor de TipoNomina: '+ idTipoNomina);
            console.log('Valor de la Fecha: '+ fecha);
            return $http({
                url: filtroURL + 'ActualizaCarpeta/',
                method: "GET",
                params: {
                    idEmpresa:idEmpresa,
                    idTipoNomina:idTipoNomina,
                    fecha:fecha
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }   
    };
});

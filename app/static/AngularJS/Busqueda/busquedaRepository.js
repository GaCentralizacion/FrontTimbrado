var busquedaURL = global_settings.urlCORS + 'api/busqueda/';


registrationModule.factory('busquedaRepository', function($http) {
    return {
        getTimbrados: function(filtro) {
            return $http({
                url: busquedaURL + 'timbrados/',
                method: "GET",
                params: {
                    idDepartamento: filtro.idDepartamento,
                    idSucursal: filtro.idSucursal,
                    idEmpresa: filtro.idTipoEmpresa,
                    idGrupo: filtro.idTipoGrupo,
                    idTipoNomina: filtro.idTipoNomina,
                    carpeta: filtro.periodo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTimbradosDepto: function(filtro) {
            return $http({
                url: busquedaURL + 'timbradosDepto/',
                method: "GET",
                params: {
                    Departamento: filtro.departamento,
                    idSucursal: filtro.idSucursal,
                    idEmpresa: filtro.idTipoEmpresa,
                    idGrupo: filtro.idTipoGrupo,
                    idTipoNomina: filtro.idTipoNomina,
                    carpeta: filtro.periodo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTimbradosPuesto: function(filtro) {
            return $http({
                url: busquedaURL + 'timbradosPuesto/',
                method: "GET",
                params: {
                    departamento: filtro.departamento,
                    Puesto: filtro.idDepartamento,
                    idEmpresa: filtro.idTipoEmpresa,
                    idGrupo: filtro.idTipoGrupo,
                    idTipoNomina: filtro.idTipoNomina,
                    carpeta: filtro.periodo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        addImpresion : function (ipUsuario,ruta,idEmpresa,idUsuario,idEstatus) {
            return $http({
                url: busquedaURL + 'addImpresion/',
                method: "POST",
                data: {
                    ipUsuario : ipUsuario,
                    ruta : ruta,
                    idEmpresa : idEmpresa,
                    idUsuario : idUsuario,
                    idEstatus : idEstatus,
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },// 
        addImpresionDetalle : function (idImpresora,documento) {
            return $http({
                url: busquedaURL + 'addImpresionDetalle/',
                method: "POST",
                data: {
                    idImpresora : idImpresora,
                    documento : documento
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };

});

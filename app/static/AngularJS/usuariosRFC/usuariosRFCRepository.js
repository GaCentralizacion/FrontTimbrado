var usuariosRFCURL = global_settings.urlCORS + 'api/correoRH/';

registrationModule.factory('usuariosRFCRepository', function($http) {
    return {
        actualizaUsuarioRFC: function(idLugarDetalle ,idLugar, rfc, idUsuario, accion) {
            return $http({
                url: usuariosRFCURL + 'actualizaRFC/',
                method: "POST",
                data: {
                    idLugarDetalle: idLugarDetalle,
                    idLugar: idLugar,
                    rfc: rfc,
                    idUsuario: idUsuario,
                    accion:accion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getUsuariosRFC: function(idLugar) {
            return $http({
                url: usuariosRFCURL + 'usuariosRFCLista/',
                method: "GET",
                params: {
                    idLugar: idLugar
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
    };

});

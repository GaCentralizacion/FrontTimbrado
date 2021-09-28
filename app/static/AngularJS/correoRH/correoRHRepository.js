var correoRHURL = global_settings.urlCORS + 'api/correoRH/';

registrationModule.factory('correoRHRepository', function($http) {
    return {
        getCorreosRH: function(filtro) {
            return $http({
                url: correoRHURL + 'correosRHLista/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        actualizarCorreo: function(idLugar, correo) {
            return $http({
                url: correoRHURL + 'actualizaCorreo/',
                method: "POST",
                data: {
                    idLugar: idLugar,
                    correo: correo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
    };

});

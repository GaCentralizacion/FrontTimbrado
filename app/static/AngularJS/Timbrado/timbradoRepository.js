var timbradoURL = global_settings.urlCORS + 'api/timbrado/';


registrationModule.factory('timbradoRepository', function($http) {
    return {
    	getPermisos: function(Usuario) {
            return $http({
                url: timbradoURL + 'timbradoProcesando/',
                method: "GET",
                params: {
                    Usuario: Usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getActualizaConciliacion: function(Usuario) {
            return $http({
                url: timbradoURL + 'ConciliacionProcesando/',
                method: "GET",
                params: {
                    Usuario: Usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }   
    };

});

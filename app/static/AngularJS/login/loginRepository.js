var loginURL = global_settings.urlCORS + 'api/login/';


registrationModule.factory('loginRepository', function($http) {
    return {
        getPermisos: function(usuario, contrasena) {
            return $http({
                url: loginURL + 'permisos/',
                method: "GET",
                params: {
                    usuario: usuario,
                    contrasena: contrasena
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});

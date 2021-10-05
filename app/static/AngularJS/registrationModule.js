// -- =============================================
// -- Author:      Gibran 
// -- Create date: 05/09/2016
// -- Description: Is the container of the application
// -- Modificó: 
// -- Fecha: 
// -- =============================================
var registrationModule = angular.module("registrationModule", ["ngRoute", "LocalStorageModule"])
    .config(function($routeProvider, $locationProvider) {

        /*cheange the routes*/
        $routeProvider.when('/', {
            templateUrl: 'AngularJS/Templates/login.html', //example 1
        //     params: {,
        //     mostrar: true
        // }
            controller: 'loginController'
        });
        $routeProvider.when('/timbrado:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/timbrado.html', //example 1
            controller: 'timbradoController'
        });
        $routeProvider.when('/timMasivo:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/timbradoMasivo.html', //example 1
            controller: 'timbradoMasivoController'
        });
        $routeProvider.when('/busqueda:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/busqueda.html', //example 1
            controller: 'busquedaController'
        });
        $routeProvider.when('/cancelar:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/cancelar.html', //example 1
            controller: 'cancelarController'
        });
        $routeProvider.when('/conciliacion:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/conciliacion.html', //example 1
            controller: 'conciliacionController'
        });
        $routeProvider.when('/desbloqueo:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/desbloqueo.html', //example 1
            controller: 'desbloqueoController'
        });

        $routeProvider.when('/correoRH:idPerfil&:idUsuario', {
            templateUrl: 'AngularJS/Templates/correoRH.html', //example 1
            controller: 'correoRHController'
        });


        $routeProvider.otherwise({redirectTo:'/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed             
        });
        changeHeight(); // when page loads          
    };
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})

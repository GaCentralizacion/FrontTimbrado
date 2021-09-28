registrationModule.controller('desbloqueoController', function($scope, $rootScope, $routeParams, $timeout, alertFactory, localStorageService, filtrosRepository) {
    $scope.cancelar = false;
    $scope.idUsuario = $routeParams.idUsuario
    $scope.rutaCarpeta = ""
    $scope.idTipoNomina = 0;
    $scope.idEmpresa = 0;
    $scope.dateComplete = "";
    $scope.nombre = "";
    $scope.init = function() {
        $scope.yo = false;
        openCloseNav()
        $scope.getEmpresa(1);
        $scope.getTipoNomina();
        //$scope.getDate();
        $scope.desbloqueo = false;
        //$scope.mydate = new Date();
    }

    $scope.getEmpresa = function(idUsuario) {
        $scope.cambioNombre = 'Cancelar'
        filtrosRepository.getEmpresa(idUsuario).then(function(result) {
            if (result.data.length > 0) {
                $scope.empresaUsuario = result.data;
            }
        });
    }


    $scope.getTipoNomina = function() {
        $scope.cambioNombre = 'Cancelar'
        $scope.cancelar = false;
        filtrosRepository.getTipoNomina().then(function(result) {
            if (result.data.length > 0) {
                $scope.tipoNomina = result.data;
            }
        });
    }

    $scope.realizarDesbloqueo = function(idEmpresa,idTipoNomina){
        console.log('idEmpresa: ' + idEmpresa+' idTipoNomina: ' + idTipoNomina + ' idUsuario: ' +  $scope.idUsuario + 'Fecha: ' +  $scope.dateComplete);
        filtrosRepository.getActualizaCarpeta(idEmpresa,idTipoNomina,$scope.dateComplete).then(function(result) {
            if (result.data.length > 0) {
                if(result.data[0].mensaje== "Correcto")
                {
                    alertFactory.success('Desbloqueo Correcto');
                }
                else
                {
                    alertFactory.error('Desbloqueo Incorrecto');
                }

            }
        });
    }

    $scope.Fecha = function()  {
        //console.log('Entro');
        // if($scope.date.length == 8)
        // {
        //     if (/^([0-9])*$/.test($scope.date))
        //     {
        //         $scope.desbloqueo = true ;
        //     }
        //     else
        //     {
        //         alert("El valor " + $scope.date + " no es Aceptado");
        //     }       
        // }
        // else
        // {
        //     $scope.desbloqueo = false;
        // }
    }


    $scope.change = function() {
        var dateOut = new Date($scope.date);
        var day = $scope.ponerCeros(dateOut.getDate(),2);
        var month = $scope.ponerCeros(dateOut.getMonth() +1 ,2);
        var year = dateOut.getFullYear();        
        $scope.dateComplete = day + month + year;
        console.log( $scope.dateComplete);
        $scope.desbloqueo = true ;
      };



      $scope.ponerCeros = function( number, width )
      {
        width -= number.toString().length;
        if ( width > 0 )
        {
          return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // siempre devuelve tipo cadena
      }
    

});
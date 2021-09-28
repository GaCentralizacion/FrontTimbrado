registrationModule.controller('correoRHController', function($scope, $rootScope, $routeParams, $timeout, alertFactory, localStorageService, correoRHRepository) {
    $scope.cancelar = false;
    $scope.idUsuario = $routeParams.idUsuario
    $scope.rutaCarpeta = ""
    $scope.idTipoNomina = 0;
    $scope.idEmpresa = 0;
    $scope.dateComplete = "";
    $scope.nombre = "";
    $scope.init = function() {
        $scope.yo = false;
        $scope.getCorreosRH();
        $scope.desbloqueo = false;
    }

    $scope.getCorreosRH = function() {
        $('#tblCorreosRH').DataTable().destroy();
        alertFactory.warning('Buscando...')
        correoRHRepository.getCorreosRH().then(function(result) {
            $scope.correos = result.data;
            setTimeout(function() {
                $('#tblCorreosRH').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 15, 
                    dom: 'Bfrtip',
                    buttons: [
                    'csv', 'excel',
                    ],
                    "order": [[0, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Search',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    },
                });
                $('#tblCorreosRH_length').hide();
            }, 1500);
        });
                
    }


    $scope.ModalCorreos = function (correo)
    {
        $scope.detalleCorreo = correo;
        $('#modalCorreo').modal('show');
    }

    $scope.actualizarCorreo = function(){
        $('#mdlLoading').modal('show');
        correoRHRepository.actualizarCorreo($scope.detalleCorreo.idLugar,$scope.detalleCorreo.correo).then(function (result) {
            if (result.data[0].estatus == 1 ) {  
                $scope.getCorreosRH();
                alertFactory.info('La actualización se realizo correctamente.');
                $('#mdlLoading').modal('hide');
                $('#modalCorreo').modal('hide');
            }
            else
            {
                $('#mdlLoading').modal('hide');
                alertFactory.warning('Ocurrio un error al actualizar.');
            }
    
    });
    
    }


});
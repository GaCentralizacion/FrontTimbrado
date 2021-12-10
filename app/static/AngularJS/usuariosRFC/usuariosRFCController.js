registrationModule.controller('usuariosRFCController', function($scope, $rootScope, $routeParams, $timeout, alertFactory, localStorageService, correoRHRepository, usuariosRFCRepository) {
    $scope.cancelar = false;
    $scope.idUsuario = $routeParams.idUsuario
    $scope.rutaCarpeta = ""
    $scope.idTipoNomina = 0;
    $scope.idEmpresa = 0;
    $scope.dateComplete = "";
    $scope.nombre = "";
    $scope.init = function() {
        $scope.yo = false;
        $scope.getUsuariosRFC();
        $scope.desbloqueo = false;
    }

    $scope.getUsuariosRFC = function() {
        $('#tblUsuariosRFC').DataTable().destroy();
        alertFactory.warning('Buscando...')
        correoRHRepository.getCorreosRH().then(function(result) {
            $scope.usuarios = result.data;
            setTimeout(function() {
                $('#tblUsuariosRFC').DataTable({
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
                $('#tblUsuariosRFC_length').hide();
            }, 1500);
        });
                
    }


    $scope.ModalInserta = function (usuario)
    {
        $scope.detalleUsuario = usuario;
        $scope.rfcUsuario = '';
        $('#modalInserta').modal('show');
    }

    $scope.actualizarCorreo = function(accion){
        if(accion == 1)
        {
            let pattern = /^[a-zA-Z]{3,4}(\d{6})((\D|\d){2,3})?$/;
            let rfc = $scope.rfcUsuario.trim().toUpperCase();
            let rfcValido = pattern.test(rfc);
            if(rfcValido)
            {$scope.actualizaUsuariosRFC(0, $scope.detalleUsuario.idLugar, rfc, accion);}
            else
            {alertFactory.warning('Error en RFC...')}
        }
        else
        {
            $scope.actualizaUsuariosRFC($scope.idDetalleLugar, $scope.detalleUsuario.idLugar, '', accion);
        }
    }

    $scope.actualizaUsuariosRFC = function(idDetalleLugar, idLugar, rfc, accion) {
        usuariosRFCRepository.actualizaUsuarioRFC(idDetalleLugar, idLugar, rfc, $scope.idUsuario, accion).then(function(result) {
            if (result.data[0].estatus == 1 ) {  
                if(accion == 1)
                {
                    $scope.getUsuariosRFC();
                    alertFactory.info('La actualización se realizo correctamente.');
                    $('#modalInserta').modal('hide');
                }
                else
                {
                    $scope.getUsuariosRFC();
                    $('#modalElimina').modal('hide');
                }
            }
            else
            {
                alertFactory.warning('Ocurrio un error.');
            }
    
        });
                
    }

    $scope.ModalElimina = function (usuario)
    {
        $scope.detalleUsuario = usuario;
        $scope.getUsuariosRFCSucursal();
        $('#modalElimina').modal('show');
    }

    $scope.getUsuariosRFCSucursal = function() {
        usuariosRFCRepository.getUsuariosRFC($scope.detalleUsuario.idLugar).then(function(result) {
            $scope.sucursalRFC = result.data;
        });
                
    }


    
    $scope.EliminaRFC = function (detalleSuc)
    {
        $scope.idDetalleLugar = detalleSuc.idLugarDetalle;
        $scope.actualizarCorreo(2);

    }




});
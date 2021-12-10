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
        $scope.correoModal = correo.correo;
        $('#modalCorreo').modal('show');
    }

    $scope.actualizarCorreo = function(){
        $('#mdlLoading').modal('show');
        $scope.lstDominios = [
            { id: 1, text: "acercateatunomina.com.mx" },
            { id: 2, text: "camioneseuropeos.com.mx" },
            { id: 3, text: "centraldeoperaciones.com" },
            { id: 4, text: "codispersa.com.mx" },
            { id: 5, text: "fundaciongrupoandrade.org.mx" },
            { id: 6, text: "gace.com.mx" },
            { id: 7, text: "grupoandrade.com" },
            { id: 8, text: "integrarenta.com" },
            { id: 9, text: "monteauto.com.mx" },
            { id: 10, text: "integrasofom.com" },
            { id: 11, text: "mymail.lat" },
            { id: 12, text: "total-parts.com.mx" },
            { id: 13, text: "sstdemexico.com.mx" },
            { id: 14, text: "velbus.com.mx" },
            { id: 15, text: "wp-fin.com" },
            { id: 16, text: "wp-financiera.com" },
            { id: 17, text: "elheraldodemexico.com" },
            { id: 18, text: "jlnlabs.com.mx" },
            { id: 19, text: "coalmx.com" },
          ];
          var correoValido = false;
          for(let i = 0 ; i < $scope.lstDominios.length ; i++){
            let dominio = $scope.lstDominios[i].text;
              if($scope.correoModal.includes(dominio)){
                  correoValido = true;
              }
          }
        //var correoValido = $scope.correoModal.includes(dominio);
        if($scope.correoModal == undefined || $scope.correoModal == '')
        {
            alertFactory.warning('El correo no puede ser vacio');
        }
        else if(!correoValido)
        {
            alertFactory.warning('El correo no pertenece al grupo');
        }
        else
        {
        $scope.detalleCorreo.correo =  $scope.correoModal;
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
    }


});
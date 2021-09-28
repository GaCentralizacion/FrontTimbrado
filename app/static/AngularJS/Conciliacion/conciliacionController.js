registrationModule.controller('conciliacionController', function($scope, $rootScope, $routeParams, $timeout, alertFactory, timbradoRepository, localStorageService, filtrosRepository, filetreeRepository) {
    $scope.idUsuario = $routeParams.idUsuario;
    $scope.dateComplete = null;
    $scope.init = function() {
        $('#tblPagasResult').DataTable().destroy();

        $scope.getEmpresa(1);
        $scope.getMes();
        $scope.getAnio();
        $scope.activarConcilia = true;
        $scope.activarCargaXML = true;
        setInterval(function() { $scope.getPermisos(); }, 1500);
    }

    //Subir archivos
    $scope.getFileDetails = function (e) {

        $scope.files = [];
        $scope.$apply(function () {
            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i])
            }

        });
    };

    // NOW UPLOAD THE FILES.
    $scope.uploadFiles = function () {
        $scope.ConciliacionPendiente = true;
        //FILL FormData WITH FILE DETAILS.
        var data = new FormData();

        for (var i in $scope.files) {
            data.append("file", $scope.files[i]);
        }
        // ADD LISTENERS.
        var objXhr = new XMLHttpRequest();
        objXhr.addEventListener("progress", updateProgress, false);
        objXhr.addEventListener("load", transferComplete, false);

        // SEND FILE DETAILS TO THE API.
        objXhr.open("POST", "/api/fileupload/");
        objXhr.send(data);
    }

    // UPDATE PROGRESS BAR.
    function updateProgress(e) {
        if (e.lengthComputable) {
            document.getElementById('pro').setAttribute('value', e.loaded);
            document.getElementById('pro').setAttribute('max', e.total);
        }
    }

    // CONFIRMATION.
    function transferComplete(e) {
        //alert("Files uploaded successfully.");
        $scope.activarCargaXML = false;
        $scope.ConciliacionPendiente = false;
    }
    //

    $scope.nombreProceso = 'Conciliacion';

    // $scope.LlenaM4 =function(){
    //     console.log('SE borra la tabla');
    //     filtrosRepository.getLlenaM4().then(function(result) {
    //         if (result.data != undefined) {
    //             console.log('SE borraron los registros la tabla');
    //         }
    //     });
    // }


$scope.conciliar = function(idEmpresa, idAnio, idMes){//Evento del boton conciliar
        console.log('Entre al boton conciliar');
        console.log('valor de la empresa ' + idEmpresa);
        console.log('valor de la idAnio ' + idAnio);
        console.log('valor de la idMes ' + idMes);
        if(idEmpresa == undefined)
        {alert('Selecciona una Empresa');}
        // else if(idAnio == undefined)
        // {alert('Selecciona un Año'); }
        // else if (idMes == undefined)
        // {alert('Selecciona un Mes');}
    else
    {
          $scope.loading = true;
          $scope.activarConcilia = true;
          $scope.activarCargaXML = true;
         
          if(idAnio != undefined && idMes != undefined)
          {$scope.dateComplete = null;}

          filtrosRepository.getLlenaM4(idMes,idAnio,idEmpresa, $scope.dateComplete).then(function(result) {

                 if(result.data[0].Estatus == 'Termino')
                 {
                 
                 console.log('Ya actualizo los registos de M4');
                 
                 $scope.getPagas(idEmpresa,idAnio,idMes, $scope.dateComplete);//Detalle de PAGAS
        
                 filtrosRepository.getConcilia1a1(idEmpresa,idAnio,idMes, $scope.dateComplete).then(function(result) {
                     if (result.data.length > 0) {
                         $scope.concilia = result.data;
                         $scope.setTablePaging('tblPagasResult');
                         //$("#tblPagasResult_filter").removeClass("dataTables_info").addClass("hide-div");
                         $("#tblPagasResult").dataTable().fnDestroy();
                     }
                 });
                 filtrosRepository.getPagasSTimbre(idEmpresa,idAnio,idMes, $scope.dateComplete).then(function(result) {
                     if (result.data.length > 0) {
                         $scope.pagaSinTimbre = result.data;
                         $scope.setTablePaging('tblPagasSTimbre');
                         //$("#tblPagasSTimbre_filter").removeClass("dataTables_info").addClass("hide-div");
                         $("#tblPagasSTimbre").dataTable().fnDestroy();
                     }
                 });
                 filtrosRepository.getTimbreSPaga(idEmpresa,idAnio,idMes, $scope.dateComplete).then(function(result) {
                     if (result.data.length > 0) {
                         $scope.timbreSinPaga = result.data;
                         $scope.setTablePaging('tblTimbresSPaga');
                         //$("#tblTimbresSPaga_filter").removeClass("dataTables_info").addClass("hide-div");
                         $("#tblTimbresSPaga").dataTable().fnDestroy();
                     }
                 });
                 filtrosRepository.getSugeCancelacion(idEmpresa,idAnio,idMes, $scope.dateComplete).then(function(result) {
                     if (result.data.length > 0) {
                         $scope.sugerenciaCancel = result.data;
                         $scope.setTablePaging('tblTimbresXCancelar');
                         //$("#tblTimbresXCancelar_filter").removeClass("dataTables_info").addClass("hide-div");
                         $("#tblTimbresXCancelar").dataTable().fnDestroy();
                     }
                 });
                 filtrosRepository.getUniTimbres(idEmpresa,idAnio,idMes, $scope.dateComplete).then(function(result) {
                     if (result.data.length > 0) {
                         $scope.UniTimbres = result.data;
                         $scope.setTablePaging('tblUniTimbres');
                         //$("#tblUniTimbres_filter").removeClass("dataTables_info").addClass("hide-div");
                         $("#tblUniTimbres").dataTable().fnDestroy();
                     }
                 });
                 $scope.activarConcilia = false;
                 $scope.activarCargaXML = false;
                 $scope.loading = false;
             }
            
           
         }); 
        
    }
}
    $scope.obtieneXMLAConciliar =function(){
        filetreeRepository.getfilesAConciliar().then(function(result) {
            if (result.data != undefined) {
                $scope.XMLExisten = result.data;
                console.log($scope.XMLExisten);
            }
        });
    }

     //**********Inicia Habilita las secciones de las tabs**********//
     $scope.setActiveClass = function(currentTab) {$scope.activarYear = true;
        for (var i = 0; i < $scope.panels.length; i++) {
            $scope.panels[i].active = false;
            $scope.panels[i].className = "";
        }
        currentTab.active = true;
        currentTab.className = "active";
    };

    $scope.panels = [
        { name: 'Universo Timbres', active: false, className: 'active' },
        { name: 'Pagas', active: true, className: '' },
        { name: 'Concilia 1 a 1', active: false, className: '' },
        { name: 'Pagas Sin Timbre', active: false, className: '' },
        { name: 'Timbre Sin Paga', active: false, className: '' },
        { name: 'Sugerencia De Cancelación', active: false, className: '' }
        
    ];

    //********** Crear tabla ************//
    $scope.setTablePaging = function ( idTable ) {
        setTimeout(function () {
            $('#' + idTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [{
                    extend: 'excel',
                    title: 'File'
                }]
            });
        }, 1000);
    };

    $scope.realizarCargaXML =function(idEmpresa, idAnio, idMes){//Evento del Boton
        //$scope.LlenaM4();
        console.log('Mes: ' + idMes);
        console.log('Año: ' + idAnio);
        console.log('Empresa: ' + idEmpresa);
        $scope.idTipoNomina = 'Conciliacion';
     /**************Esta parte es la que se encarga de cargar los XMLa la BD************* */
     filetreeRepository.getSocketConciliacion($scope.idEmpresa, $scope.idTipoNomina, $scope.idUsuario, $scope.rutaCarpeta, $scope.nombreProceso).then(function(result) {
        if (result.data != "") {
            $scope.activarCargaXML = true;
            $scope.procesando = true;
            //setTimeout(function(){ $scope.getProcesado(idMes,idAnio,idEmpresa) }, 600000);
           // setTimeout(function(){ $scope.getProcesado(idMes,idAnio,idEmpresa) }, 9000);
             alertFactory.success('Inicia la carga de los archivos XML');
         } else {
             alertFactory.success('No se pudo realizar la Carga de los archivos XML');
         }
     }); 
    }

    $scope.getProcesado = function(idMes,idAnio,idEmpresa) {
        $scope.procesando = false;
        $scope.activarCargaXML = false;
        // filtrosRepository.getLlenaM4(idMes,idAnio,idEmpresa).then(function(result) {
        //     if (result.data != undefined) {
        //         console.log('Ya actualizo los registos de M4');
        //         $scope.activarConcilia = false
        //     }
        // });  
    }


    $scope.getPermisos = function() {
        $scope.datosPendientes = [];
        $scope.promise = timbradoRepository.getActualizaConciliacion($scope.idUsuario).then(function(result) {
            if (result.data.length > 0) {
                $scope.datosPendientes = result.data
                //console.log($scope.datosPendientes);
                $scope.ConciliacionDescripcion = result.data[0].ConciliacionDescripcion
                 $scope.DocumentosConciliacion = result.data[0].NumTimNomina;
                 $scope.DocumentosTotales = result.data[0].TotalConciliacion;
           
                //if ($scope.datosPendientes[0].estatus == 'timbrando') {
                    if ($scope.datosPendientes[0].TotalConciliacion  == $scope.datosPendientes[0].NumTimNomina) {
                        $scope.mensajePanel = "Última Conciliación...."
                        //$scope.cambioNombre = 'Timbrar'
                        $scope.procesando = false;
                        $scope.activarConcilia = false;
                        $scope.ConciliacionPendiente = false;
                        //$scope.porcentaje = (($scope.datosPendientes[0].timbrados + $scope.datosPendientes[0].timbradoError) * 100) / $scope.datosPendientes[0].TotalRecibos
                        $scope.mostrarEstado = false;
                    }
                     
                    else {
                        $scope.mensajePanel = "Procesando Conciliación...."
                        $scope.procesando = true;
                        $scope.activarCargaXML = true;
                        $scope.mostrarEstado = true;
                        $scope.ConciliacionPendiente = true;
                        $scope.activarConcilia = true;
                        $scope.activarCargaXML = true;
                        $scope.porcentaje = ( $scope.datosPendientes[0].NumTimNomina * 100) / $scope.datosPendientes[0].TotalConciliacion
                        }
                    
                // } else {
                //     $scope.procesando = false;
                //     $scope.yo = true;
                //     $scope.timbradoPendiente = false;
                //     $scope.timbradoPendientes = false;
                // }

            } else {
                console.log('salio')
            }
        });
    }



    $scope.getEmpresa = function(idUsuario) {
        filtrosRepository.getEmpresaConciliacion(idUsuario).then(function(result) {
            if (result.data.length > 0) {
                $scope.empresaUsuario = result.data;
            }
        });
    }

    $scope.getConcilia1a1 = function(idEmpresa) {
        filtrosRepository.getConcilia1a1(idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.concilia = result.data;
            }
        });
    }

    $scope.getPagasSTimbre = function(idEmpresa) {
        filtrosRepository.getPagasSTimbre(idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.pagaSinTimbre = result.data;
            }
        });
    }

    $scope.getTimbreSPaga = function(idEmpresa) {
        filtrosRepository.getTimbreSPaga(idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.timbreSinPaga = result.data;
            }
        });
    }

    $scope.getSugeCancelacion = function(idEmpresa) {
        filtrosRepository.getSugeCancelacion(idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.sugerenciaCancel = result.data;
            }
        });
    }

    $scope.getMes = function() {
        filtrosRepository.getMes().then(function(result) {
            if (result.data.length > 0) {
                $scope.empresaMes = result.data;
            }
        });
    }

    $scope.getAnio = function() {
        filtrosRepository.getAnio().then(function(result) {
            if (result.data.length > 0) {
                $scope.empresaAnio = result.data;
            }
        });
    }

    $scope.getPagas = function(idEmpresa,anio,mes,FechaPaga) {
        filtrosRepository.getPagas(idEmpresa,anio,mes, FechaPaga).then(function(result) {
            if (result.data.length > 0) {
                $scope.pagasTimbre = result.data;
                $scope.setTablePaging('tblPagas');
                //$("#tblPagas_filter").removeClass("dataTables_info").addClass("hide-div");
                $("#tblPagas").dataTable().fnDestroy();
            }
        });
    }

    $scope.change = function() {
        var dateOut = new Date($scope.date);
        var day = $scope.ponerCeros(dateOut.getDate(),2);
        var month = $scope.ponerCeros(dateOut.getMonth() +1 ,2);
        var year = dateOut.getFullYear();        
        $scope.dateComplete =  year + month + day;

        console.log( $scope.dateComplete);
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
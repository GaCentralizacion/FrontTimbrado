registrationModule.controller('busquedaController', function($scope, $rootScope, $routeParams, alertFactory, busquedaRepository, filetreeRepository, localStorageService, filtrosRepository) {
    $scope.filtros = null;
    $scope.periodoFecha = '';
    $scope.fecha = '';
    $rootScope.mostrarMenu = true;
    $scope.timbrados = '';
    $scope.listaPdfs = [];
    $scope.lstipUsuario = []
    $scope.idUsuario = $routeParams.idUsuario
    $scope.init = function() {
        getIPs(function(ip) { $scope.lstipUsuario.push({ ip: ip }) });
        //getIPs(function(ip) { $scope.ipUsuario = ip; console.log($scope.ipUsuario);});
        console.log($scope.lstipUsuario)
        $scope.mostrarTodos = true
        $scope.mostrarIndi = false
        $scope.enviarTodo = true;
        openCloseNav();
        $scope.getGrupo(1);
        console.log('Estoy en busqueda', $routeParams.idPerfil + ' idUsuario' + $routeParams.idUsuario)
        variablesInput();
    }
    var variablesInput = function() {
            $scope.activarInputEmpresa = true;
            $scope.activarInputAgencia = true;
            $scope.activarInputDepartamento = true;
            $scope.activarInputTipoNomina = true;
            $scope.activarInputPeriodo = true;
            $scope.activarYear = true;
            $scope.activarPeriodo = true;
            $scope.activarPuesto = true;
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
        { name: 'Timbrado Exitoso', active: true, className: 'active' },
        { name: 'Sin Timbrar', active: false, className: '' }
    ];
    //**********Termina Habilita las secciones de las tabs**********//
    //**********Inicia Consigue el Grupo dependiendo del Usuario**********//
    $scope.getGrupo = function(idusuario) {
            if (idusuario != null) {
                filtrosRepository.getGrupo(idusuario).then(function(result) {
                    if (result.data.length > 0) {
                        $scope.grupo = result.data;
                    }
                });
            } else {
                alertFactory.warning('No hay idUsuario')
            }
        }
        //**********Termina Consigue el Grupo dependiendo del Usuario**********//
        //**********Inicia Consigue las Empresas ligadas al Grupo**********//
    $scope.getEmpresa = function(idgrupo) {
            if (idgrupo != null) {
                filtrosRepository.getEmpresa(idgrupo).then(function(result) {
                    if (result.data.length > 0) {
                        $scope.empresaUsuario = result.data;
                        $scope.activarInputEmpresa = false;
                    }
                });
            } else {
                variablesInput();
                $scope.filtros.idTipoEmpresa = null;
                $scope.filtros.idSucursal = null;
                $scope.filtros.idDepartamento = null;
                $scope.filtros.idTipoNomina = null;
                $scope.filtros.periodo = null;
                alertFactory.warning('Seleccioné un Grupo');
            }
        }
        //**********Termina Consigue las Empresas ligadas al Grupo**********//
        //**********Inicia Consigue el tipo de Agencia ligadas a la Empresa**********//
    $scope.cargaTipoAgencia = function(idempresa) {
        //$scope.idEmpresa = idempresa;
        if (idempresa != null) {
            $scope.idempresaSeleccionada = idempresa;
            empresaVacia();
            filtrosRepository.getAgencia(idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.agencias = result.data;
                    //$scope.activarInputAgencia = false;
                    //$scope.activarInputTipoNomina = false;
                    $scope.getTipoNomina($scope.idempresaSeleccionada);
                }
            });
        } else {
            empresaVacia();
            alertFactory.warning('Seleccioné una Empresa');
        }
    }
    var empresaVacia = function() {
            $scope.filtros.idSucursal = null;
            $scope.filtros.idDepartamento = null;
            $scope.filtros.idTipoNomina = null;
            $scope.filtros.periodo = null;
            $scope.activarInputAgencia = true;
            $scope.activarInputDepartamento = true;
            $scope.activarInputTipoNomina = true;
            $scope.activarInputPeriodo = false;
        }
        //**********Termina Consigue el tipo de Agencia ligadas a la Empresa**********//
        //**********Inicia Consigue el tipo de Departamento ligadas a la Empresa y Sucursal**********//
    $scope.cargaDepartamentos = function(idEmpresa,nombreNomina) {
        if (nombreNomina != null ) {
            //sucursalVacia();
            filtrosRepository.getDepartamento(idEmpresa,nombreNomina).then(function(result) {
                if (result.data.length > 0) {
                    $scope.departamentos = result.data;
                    $scope.activarInputDepartamento = false;
                    //$scope.activarInputPeriodo = false;

                }
            });
        } else {
            //sucursalVacia();
            alertFactory.warning('Seleccioné una Agencia');
        }
    }

     $scope.cargaPuestos = function(idEmpresa,nombreNomina,nombreDepartamento) {
        if (nombreNomina != null ) {
            //sucursalVacia();
            filtrosRepository.getpuesto(idEmpresa,nombreNomina,nombreDepartamento).then(function(result) {
                if (result.data.length > 0) {
                    $scope.puestos = result.data;
                    $scope.activarPuesto = false;
                    //$scope.activarInputPeriodo = false;

                }
            });
        } else {
            //sucursalVacia();
            alertFactory.warning('Seleccioné un puesto');
        }
    }

    
    var sucursalVacia = function() {
            $scope.filtros.idDepartamento = null;
            //$scope.filtros.idTipoNomina = null;
            $scope.filtros.periodo = null;
            $scope.activarInputDepartamento = true;
            //$scope.activarInputTipoNomina = true;
            $scope.activarInputPeriodo = false;
            //$scope.activarInputPeriodo = true;
        }
        //**********Termina Consigue el tipo de Departamento ligadas a la Empresa y Sucursal**********//
        //**********Inicia Consigue el tipo de Nomina **********//
    $scope.getTipoNomina = function(idEmpresa) {
        if (idEmpresa != null) {

            //$('#tblTimbradoExitoso').DataTable().destroy();
            //$('#tblSinTimbrar').DataTable().destroy();
            tipoNominaVacia();
            filtrosRepository.getTipoNomina().then(function(result) {
                if (result.data.length > 0) {
                    $scope.tipoNomina = result.data;
                    $scope.activarInputTipoNomina = false;
                   
                }
            });
        } else {
            tipoNominaVacia();
            alertFactory.warning('Seleccioné un Departamento');
        }
    }

    $scope.cargaPeriodos = function(idTipoNomina, idEmpresa, Year) {
            $scope.timbrados = null;
            $scope.sinTimbrar = null;
            if (idTipoNomina != null) {
                filtrosRepository.getPeriodo(idTipoNomina, idEmpresa, Year).then(function(result) {
                    if (result.data.length > 0) {
                        $scope.Periodos = result.data;
                        $scope.activarPeriodo = false;
                    }
                    else
                    {
                        $scope.timbrados = null;
                        $scope.sinTimbrar = null;
                    }
                });
            } else {
                alertFactory.warning('No hay Periodos a consultar')
            }
        }

    $scope.cargaYears = function(idTipoNomina) {
            $scope.timbrados = null;
            $scope.sinTimbrar = null;
            if (idTipoNomina != null) {
                filtrosRepository.getYear(idTipoNomina).then(function(result) {
                    if (result.data.length > 0) {
                        $scope.years = result.data;
                         $scope.activarYear = false;
                    }
                    else 
                        {
                            $scope.activarYear = true;
                            $scope.activarPeriodo = true;
                            $scope.years = null;
                            $scope.Periodos = null;

                        }    
                });
            } else {
                alertFactory.warning('No hay nominas a consultar')
            }
        }

    var tipoNominaVacia = function() {
            $scope.filtros.idTipoNomina = null;
            $scope.filtros.periodo = null;
            $scope.timbrados = null;
            $scope.sinTimbrar = null;
        }
        //**********Termina Consigue el tipo de Nomina **********//
        //**********Inicia Activa el input de periodo************//
    $scope.activaPeriodo = function(agencia) {
            if (agencia != null) {
                $scope.activarInputPeriodo = false;
            }
        }
        //**********Termina Activa el input de periodo************//
        //**********Inicia Verifica si es una fecha************//
    $scope.verificaFecha = function(filtro) {
        $scope.idEmpresa = filtro.idTipoEmpresa;
        $scope.idTipoNomina = filtro.idTipoNomina;
        //$scope.idUsuario = 2;
        $scope.nombre = filtro.periodo;

        //C:\Nomina_Timbrado\Origen\Semanal\001

        //console.log(filtro)
        $('#tblTimbradoExitoso').DataTable().destroy();
        $('#tblSinTimbrar').DataTable().destroy();
        if (filtro.periodo.length == 8) {

            var fechaActual = new Date();
            $scope.fecha = filtro.periodo.substr(2, 2) + '-' + filtro.periodo.substr(0, 2) + '-' + filtro.periodo.substr(4, 4);
            var fechaCarpeta = new Date($scope.fecha);
            $scope.periodoFecha = fechaCarpeta instanceof Date && !isNaN(fechaCarpeta.valueOf());
            //if (fechaCarpeta <= fechaActual) {
                if ($scope.periodoFecha === true) {
                    alertFactory.warning('Buscando...')
                    busquedaRepository.getTimbrados(filtro).then(function(result) {
                        $scope.timbrados = result.data;
                        $scope.sinTimbrar = result.data;
                        setTimeout(function() {
                            $scope.setTablePaging('tblTimbradoExitoso');
                            $scope.setTablePaging('tblSinTimbrar');
                            $("#tblTimbradoExitoso_filter").removeClass("dataTables_info").addClass("hide-div");
                            $("#tblSinTimbrar_filter").removeClass("dataTables_info").addClass("hide-div");
                        }, 1500);
                    });
                }
            //} else {
               // alertFactory.warning('El periodo es incorrecto');
           // }
            console.log($scope.periodoFecha);
        }
    }

    $scope.verificaFechaDepto = function(filtro) {
        $scope.idEmpresa = filtro.idTipoEmpresa;
        $scope.idTipoNomina = filtro.idTipoNomina;
        //$scope.idUsuario = 2;
        $scope.nombre = filtro.periodo;

        //C:\Nomina_Timbrado\Origen\Semanal\001

        //console.log(filtro)
        $('#tblTimbradoExitoso').DataTable().destroy();
        $('#tblSinTimbrar').DataTable().destroy();
        if (filtro.periodo.length == 8) {

            var fechaActual = new Date();
            $scope.fecha = filtro.periodo.substr(2, 2) + '-' + filtro.periodo.substr(0, 2) + '-' + filtro.periodo.substr(4, 4);
            var fechaCarpeta = new Date($scope.fecha);
            $scope.periodoFecha = fechaCarpeta instanceof Date && !isNaN(fechaCarpeta.valueOf());
            //if (fechaCarpeta <= fechaActual) {
                if ($scope.periodoFecha === true) {
                    alertFactory.warning('Buscando...')
                    busquedaRepository.getTimbradosDepto(filtro).then(function(result) {
                        $scope.timbrados = result.data;
                        $scope.sinTimbrar = result.data;
                        setTimeout(function() {
                            $scope.setTablePaging('tblTimbradoExitoso');
                            $scope.setTablePaging('tblSinTimbrar');
                            $("#tblTimbradoExitoso_filter").removeClass("dataTables_info").addClass("hide-div");
                            $("#tblSinTimbrar_filter").removeClass("dataTables_info").addClass("hide-div");
                        }, 1500);
                    });
                }
            //} else {
               // alertFactory.warning('El periodo es incorrecto');
           // }
            console.log($scope.periodoFecha);
        }
    }

    $scope.verificaFechaPuesto = function(filtro) {
        $scope.idEmpresa = filtro.idTipoEmpresa;
        $scope.idTipoNomina = filtro.idTipoNomina;
        //$scope.idUsuario = 2;
        $scope.nombre = filtro.periodo;

        //C:\Nomina_Timbrado\Origen\Semanal\001

        //console.log(filtro)
        $('#tblTimbradoExitoso').DataTable().destroy();
        $('#tblSinTimbrar').DataTable().destroy();
        if (filtro.periodo.length == 8) {

            var fechaActual = new Date();
            $scope.fecha = filtro.periodo.substr(2, 2) + '-' + filtro.periodo.substr(0, 2) + '-' + filtro.periodo.substr(4, 4);
            var fechaCarpeta = new Date($scope.fecha);
            $scope.periodoFecha = fechaCarpeta instanceof Date && !isNaN(fechaCarpeta.valueOf());
            //if (fechaCarpeta <= fechaActual) {
                if ($scope.periodoFecha === true) {
                    alertFactory.warning('Buscando...')
                    busquedaRepository.getTimbradosPuesto(filtro).then(function(result) {
                        $scope.timbrados = result.data;
                        $scope.sinTimbrar = result.data;
                        setTimeout(function() {
                            $scope.setTablePaging('tblTimbradoExitoso');
                            $scope.setTablePaging('tblSinTimbrar');
                            $("#tblTimbradoExitoso_filter").removeClass("dataTables_info").addClass("hide-div");
                            $("#tblSinTimbrar_filter").removeClass("dataTables_info").addClass("hide-div");
                        }, 1500);
                    });
                }
            //} else {
               // alertFactory.warning('El periodo es incorrecto');
           // }
            console.log($scope.periodoFecha);
        }
    }

    $scope.enviarCorreo = function(listaDocumentos, correo) {
        $scope.correo = correo;
        $scope.rutaCarpeta = "C:/Timbrado_Nomina/Timbrados/" + listaDocumentos[0].descripcionNomina + '/' + listaDocumentos[0].ClaveTimbrado + "/" + $scope.nombre + '/'
        $scope.contadorSel = 0;
        angular.forEach(listaDocumentos, function(value, key) {
            if (value.check == true) {
                $scope.listaPdfs.push({
                    nombreRecibo: value.nombreRecibo,
                    idTipoNomina: value.idTipoNomina,
                    nombreNomina: value.NombreNomina
                })
                $scope.contadorSel++;
            }
        });
        filetreeRepository.postDocumentosMail($scope.idEmpresa, $scope.idTipoNomina, $scope.idUsuario, $scope.rutaCarpeta, $scope.nombre, $scope.listaPdfs, $scope.correo).then(function(result) {
            if (result.data == 1) {
                console.log(result)
                $('#modalLotes').modal('hide');

                alertFactory.success('Correo enviado');
                $('#tblTimbradoExitoso').DataTable().destroy();
                $('#tblSinTimbrar').DataTable().destroy();
                //$scope.filtro.correo = "";
                $scope.correo = "";
                $scope.rutaCarpeta = "";
                $scope.contadorSel = 0;
                $scope.listaPdfs = [];
                $scope.filtro = null;
                $scope.filtros = null;
                $scope.timbrados = [];
                //$scope.init()
            } else {
                console.log('nada')
            }
        });

        $('#modalLotes').modal('hide');

        alertFactory.success('Correo enviado');

        $('#tblTimbradoExitoso').DataTable().destroy();
        $('#tblSinTimbrar').DataTable().destroy();
        //$scope.filtro.correo = "";
        $scope.correo = "";
        $scope.rutaCarpeta = "";
        $scope.contadorSel = 0;
        $scope.listaPdfs = [];
        $scope.filtro = null;
        $scope.filtros = null;
        $scope.timbrados = [];
    }


    // ************* Imprimir *****************//
    $scope.seleccionarDocumentosTodo = function(timbrados) {
        $scope.enviarTodo = false;
        $scope.mostrarTodos = false
        $scope.mostrarIndi = true
            //$scope.estatusImpresion = 1
        $scope.rutaCarpetaCorreo = "C:/Nomina_Timbrado/Timbrados/" + timbrados[0].descripcionNomina + '/' + timbrados[0].ClaveTimbrado + "/" + $scope.nombre + '/'
        $scope.rutaCarpeta = timbrados[0].descripcionNomina + '\\' + timbrados[0].ClaveTimbrado + "\\" + $scope.nombre + '\\'
        console.log($scope.rutaCarpeta)
            //var rutaCarpetaModif = $scope.rutaCarpeta.replace(\\gi, "\\\\");
        for (var i = 0; i < timbrados.length; i++) {
            if (timbrados[i].estatusTimbrado == 100) {
                $scope.listaPdfs.push({
                    nombreRecibo: timbrados[i].nombreRecibo,
                    idTipoNomina: timbrados[i].idTipoNomina,
                    nombreNomina: timbrados[i].NombreNomina
                })
            }
        }
    }



    $scope.seleccionarDocumentos = function() {
        $scope.enviarTodo = true;
        $scope.mostrarTodos = true;
        $scope.mostrarIndi = false
        $scope.listaPdfs = [];
        $scope.rutaCarpeta = ''
    }

    $scope.imprimirPdfs = function() {
        $scope.idImpresion = "";
        busquedaRepository.addImpresion($scope.lstipUsuario[0].ip, $scope.rutaCarpeta, $scope.idEmpresa, $scope.idUsuario, 1).then(function(result) {
            if (result.data.length > 0) {
                $scope.idImpresion = result.data
                console.log($scope.idImpresion[0].id)
                alertFactory.success('Documentos enviados a impresora');
            }
        });
    };


    $scope.imprimirDocumentosPdfs = function(listaDocumentos) {
        $scope.rutaCarpeta = listaDocumentos[0].descripcionNomina + '\\' + listaDocumentos[0].ClaveTimbrado + "\\" + $scope.nombre + '\\'
        angular.forEach(listaDocumentos, function(value, key) {
            if (value.check == true) {
                $scope.listaPdfs.push({
                    nombreRecibo: value.nombreRecibo,
                    idTipoNomina: value.idTipoNomina,
                    nombreNomina: value.NombreNomina
                })
                $scope.contadorSel++;
            }
        });
        $scope.idImpresion = "";
        
        busquedaRepository.addImpresion($scope.lstipUsuario[0].ip, $scope.rutaCarpeta, $scope.idEmpresa, $scope.idUsuario, 1).then(function(result) {
            if (result.data.length > 0) {
                $scope.idImpresion = result.data[0].id
                $scope.listaPdfs.forEach(function(arrayDataLot) {
                    busquedaRepository.addImpresionDetalle($scope.idImpresion, arrayDataLot.nombreRecibo)
                        .then(function(nuevos) {
                            if (nuevos.data.length > 0) {
                                console.log('Se guardo bien')
                            } else {
                                console.log('Error al Guardar')
                            }
                        });
                });
                $scope.rutaCarpeta = "";

                alertFactory.success($scope.listaPdfs.length + ' Documentos enviados a impresora');
                $scope.listaPdfs = [];
                $scope.filtro = null;

            }
        });
    };

    $scope.enviarTodosCorreo = function(correo) {
        $scope.correo = correo;
        filetreeRepository.postDocumentosMail($scope.idEmpresa, $scope.idTipoNomina, $scope.idUsuario, $scope.rutaCarpetaCorreo, $scope.nombre, $scope.listaPdfs, $scope.correo).then(function(result) {
            if (result.data == 1) {
                $('#modalTodoscorreo').modal('hide');
                alertFactory.success('Correo enviado');
                $scope.filtros = null;
                $('#tblTimbradoExitoso').DataTable().destroy();
                $('#tblSinTimbrar').DataTable().destroy();
                $scope.correo = "";
                $scope.rutaCarpeta = "";
                $scope.contadorSel = 0;
                $scope.listaPdfs = [];
                $scope.timbrados = [];
                $scope.filtro.correoTodo = null
            } else {
                console.log('nada')
            }
        });

        $('#modalTodoscorreo').modal('hide');

        alertFactory.success('Correo enviado');

        $('#tblTimbradoExitoso').DataTable().destroy();
        $('#tblSinTimbrar').DataTable().destroy();
        //$scope.filtro.correo = "";
        $scope.correoTodo = "";
        $scope.filtros = null;
        $scope.filtro.correoTodo = null
        $scope.rutaCarpeta = "";
        $scope.contadorSel = 0;
        $scope.listaPdfs = [];
        $scope.filtro = null;
        $scope.timbrados = [];
    }

    //********** Crear tabla ************//
    $scope.setTablePaging = function(idTable) {
        $('#' + idTable).DataTable({
            dom: '<"html5buttons"B>lTfgitp',
            buttons: [{
                extend: 'excel',
                title: 'ExampleFile'
            }, {
                extend: 'print',
                customize: function(win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');
                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }]
        });
    };

    ///////////////// Busqueda de Ip//////////////////
    function getIPs(callback) {
        var ip_dups = {};

        //compatibility for firefox and chrome
        var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var useWebKit = !!window.webkitRTCPeerConnection;

        //bypass naive webrtc blocking using an iframe
        if (!RTCPeerConnection) {
            //NOTE: you need to have an iframe in the page right above the script tag
            //
            //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
            //<script>...getIPs called in here...
            //
            var win = iframe.contentWindow;
            RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
            useWebKit = !!win.webkitRTCPeerConnection;
        }

        //minimal requirements for data connection
        var mediaConstraints = {
            optional: [{ RtpDataChannels: true }]
        };

        var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

        //construct a new RTCPeerConnection
        var pc = new RTCPeerConnection(servers, mediaConstraints);

        function handleCandidate(candidate) {
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var ip_addr = ip_regex.exec(candidate)[1];

            //remove duplicates
            if (ip_dups[ip_addr] === undefined)
                callback(ip_addr);

            ip_dups[ip_addr] = true;
        }

        //listen for candidate events
        pc.onicecandidate = function(ice) {

            //skip non-candidate events
            if (ice.candidate)
                handleCandidate(ice.candidate.candidate);
        };

        //create a bogus data channel
        pc.createDataChannel("");

        //create an offer sdp
        pc.createOffer(function(result) {

            //trigger the stun server request
            pc.setLocalDescription(result, function() {}, function() {});

        }, function() {});

        //wait for a while to let everything done
        setTimeout(function() {
            //read candidate info from local description
            var lines = pc.localDescription.sdp.split('\n');

            lines.forEach(function(line) {
                if (line.indexOf('a=candidate:') === 0)
                    handleCandidate(line);
            });
        }, 1000);
    }

});

registrationModule.controller('timbradoController', function($scope, $rootScope, $routeParams, alertFactory, timbradoRepository, localStorageService, filtrosRepository, filetreeRepository) {
    $rootScope.mostrarMenu = true;
    $scope.idUsuario = $routeParams.idUsuario
    $scope.procesando = false;
    $scope.rutaCarpeta = ""
    $scope.nombreCarpeta = ""
    $scope.nombre = "";
    $scope.tipoEmpresa = [];
    $scope.timbrar = false;
    $scope.idTipoNomina = 0;
    $scope.listDocumentosRepetidos = []
    $scope.idEmpresa = 0;
    $scope.documentosTimbrados =""
    var cronometro
    // agrege este paramerametro
    $scope.idTipoNominaSeleccion = 0;
    $scope.mensajePanel = "";
    $scope.cambioNombre = ""

    $scope.init = function() {
        getIPs(function(ip) { console.log(ip); });
        //$scope.carga();
        $scope.yo = false;
        $scope.cambioNombre = 'Timbrar'
        openCloseNav()
        $scope.getEmpresa(1);
        $scope.getTipoNomina();
        setInterval(function() { $scope.getPermisos(); }, 1500);
    }

    $scope.getEmpresa = function(idUsuario) {
        $scope.cambioNombre = 'Timbrar'
        filtrosRepository.getEmpresa(idUsuario).then(function(result) {
            if (result.data.length > 0) {
                $scope.empresaUsuario = result.data;
            }
        });
    }

    $scope.getTipoNomina = function() {
        $scope.cambioNombre = 'Timbrar'
        $scope.timbrar = false;
        filtrosRepository.getTipoNomina().then(function(result) {
            if (result.data.length > 0) {
                $scope.tipoNomina = result.data;
            }
        });
    }

    $scope.getFileTree = function(idEmpresa, idTipo) {
        console.log(idTipo + 'tipo nomina')
        $scope.timbradoPendientes = false;
        $scope.rutaCarpeta = "";
        $scope.nombreCarpeta = "";
        $scope.idTipoNomina = idTipo;
        // agrege este paramerametro
        $scope.idTipoNominaSeleccion = $scope.idTipoNomina;
        $scope.idEmpresa = idEmpresa;
        $scope.timbrar = false;
        filetreeRepository.getFileTree(idEmpresa, idTipo).then(function(result) {
            if (result.data != undefined) {
                console.log('Es el valor del data de getfiletree');
                console.log(result.data);
                $scope.filetree = result.data;
                $scope.yo = true;
            }
        });
    };
    $scope.listValidarDocumentos =[]
    $scope.ruta = function(obj) {
        $scope.timbradoPendientes = false;
        $scope.cambioNombre = 'Timbrar'
        $scope.listValidarDocumentos =[]
        $scope.timbrar = true;
        $scope.rutaCarpeta = obj.path;
        var cadena = obj.path;
        $scope.directorio = cadena.substr((cadena.length) - 8, 8)
        obj.children.forEach(function(arrayDataLot) {
            $scope.listValidarDocumentos.push({
                nombreDocumento:arrayDataLot.name
            })
        });
        console.log($scope.listValidarDocumentos)


        //console.log($scope.directorio)
    }

    $scope.seleccionarTimbre = function(obj) {
        $scope.nombre = obj.name
        $("ul").children('#' + $scope.nombre).slideToggle("fast");
    }

    $scope.realizarTimbrado = function() {
        $scope.cambioNombre = 'Timbrar'
        //console.log($scope.nombre +' yo '+ $scope.idEmpresa +' tu '+ $scope.idTipoNominaSeleccion)
        //console.log()
        // agrege este paramerametro
        filtrosRepository.getValidarDocumentosTimbrados($scope.nombre,$scope.idEmpresa,$scope.idTipoNominaSeleccion).then(function(respuesta) {

            $scope.documentosTimbrados = respuesta.data;
            console.log($scope.documentosTimbrados[0].estatusCarpeta + ' respuesta')
            //if($scope.documentosTimbrados[0].estatusCarpeta ==1){
            //    alertFactory.warning('Carpeta ya Timbrada');
            //}
            //else{
                if($scope.documentosTimbrados[0].estatusCarpeta ==3){
                    //alertFactory.warning('Carpeta Parcialmente Timbrada');
                    console.log($scope.documentosTimbrados.length + ' num')
                    for (var i = 0; i < $scope.documentosTimbrados.length; i++) {
                        for (var h = 0; h < $scope.listValidarDocumentos.length; h++) {
                            if($scope.documentosTimbrados[i].NombreRecibo == $scope.listValidarDocumentos[h].nombreDocumento){
                                console.log('entre if')
                                $scope.listDocumentosRepetidos.push({
                                    nombreDocumentoR: $scope.documentosTimbrados[i].NombreRecibo
                                })
                            }   
                        }
                     }
                    filetreeRepository.getSocket($scope.idEmpresa, $scope.idTipoNomina, $scope.idUsuario, $scope.rutaCarpeta, $scope.nombre).then(function(result) {
                                if (result.data != "") {
                                    alertFactory.success('Se mando a timbrar Carpeta');
                                    $scope.procesando = true;
                                    $scope.filetree = [];
                                    $scope.directorio = "";
                                    $scope.timbrar = false;
                                    $scope.rutaCarpeta = ""
                                } else {
                                    alertFactory.warning('no se pudo realizar');
                                }
                        });
                   setTimeout(function(){ $scope.listDocumentosRepetidos = [] }, 10000); 

                }
                else{
                    $scope.timbradoPendientes = true;
                    console.log('Se mando a timbrar en el Else');
                    $scope.cambioNombre = 'Timbrando....'
                        filetreeRepository.getSocket($scope.idEmpresa, $scope.idTipoNomina, $scope.idUsuario, $scope.rutaCarpeta, $scope.nombre).then(function(result) {
                                if (result.data != "") {
                                    alertFactory.success('Se mando a timbrar Carpeta');
                                    $scope.procesando = true;
                                    $scope.filetree = [];
                                    $scope.directorio = "";
                                    $scope.timbrar = false;
                                    $scope.timbradoPendientes = true;
                                    $scope.rutaCarpeta = ""
                                } else {
                                    alertFactory.warning('no se pudo realizar');
                                }
                        })
                    //alertFactory.error('esperando');
                    //alertFactory.success('Se mando a timbrar carpeta');
                }
            //}

        });

    }

    $scope.getPermisos = function() {
        $scope.datosPendientes = [];
        $scope.promise = timbradoRepository.getPermisos($scope.idUsuario).then(function(result) {
            if (result.data.length > 0) {
                $scope.datosPendientes = result.data
                $scope.NombreEmpresa = result.data[0].NombreEmpresa
                $scope.NombreNomina = result.data[0].NombreNomina
                $scope.DocumentosAceptados = result.data[0].timbrados
                $scope.documentosTotales = result.data[0].TotalRecibos;
                $scope.documentosErroneos = result.data[0].timbradoError;
                $scope.TipoDescripcion = result.data[0].TipoDescripcion;
                if ($scope.datosPendientes[0].estatus == 'timbrando') {
                    if (($scope.datosPendientes[0].timbrados + $scope.datosPendientes[0].timbradoError) == $scope.datosPendientes[0].TotalRecibos) {
                        $scope.mensajePanel = "Último Timbrado...."
                        $scope.timbradoPendiente = false;
                        $scope.timbradoPendientes = false;
                        $scope.cambioNombre = 'Timbrar'
                        $scope.procesando = true;
                        $scope.porcentaje = (($scope.datosPendientes[0].timbrados + $scope.datosPendientes[0].timbradoError) * 100) / $scope.datosPendientes[0].TotalRecibos
                        $scope.mostrarEstado = false;
                    } else {
                        $scope.mensajePanel = "Procesando Timbrado...."
                        $scope.timbradoPendiente = true;
                        $scope.timbradoPendientes = true;
                        $scope.procesando = true;
                        $scope.mostrarEstado = true;
                        $scope.porcentaje = (($scope.datosPendientes[0].timbrados + $scope.datosPendientes[0].timbradoError) * 100) / $scope.datosPendientes[0].TotalRecibos
                    }
                } else {
                    $scope.procesando = false;
                    $scope.yo = true;
                    $scope.timbradoPendiente = false;
                    $scope.timbradoPendientes = false;
                }

            } else {
                console.log('salio')
            }
        });
    }

    ///////////////////////////////OBTENER IP DEL EQUIPO////////////////////////////////////////// 

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

    //Test: Print the IP addresses into the console
    
    ////////////////////////
});
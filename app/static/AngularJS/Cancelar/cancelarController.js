registrationModule.controller('cancelarController', function($scope, $rootScope, $routeParams, $timeout, alertFactory, timbradoRepository, localStorageService, filtrosRepository, filetreeRepository) {
    $scope.cancelar = false;
    $scope.idUsuario = $routeParams.idUsuario
    $scope.rutaCarpeta = ""
    $scope.idTipoNomina = 0;
    $scope.idEmpresa = 0;
    $scope.nombre = "";
    
    $scope.init = function() {
        getIPs(function(ip) { console.log(ip); });
        $scope.yo = false;
        openCloseNav()
        $scope.getEmpresa(1);
        $scope.getTipoNomina();
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

    $scope.getFileTree = function(idEmpresa, idTipo)  {
        //console.log('entro a crear los arboles')
         $scope.canceladoPendientes = false;
         $scope.rutaCarpeta = "";
         $scope.nombreCarpeta = "";
         $scope.cancelar = false;
          // agrege este paramerametro
         $scope.idTipoNomina = idTipo;
         //$scope.idTipoNominaSeleccion = $scope.idTipoNomina;
         $scope.idEmpresa = idEmpresa;

         //$scope.obtieneArbol();
          filetreeRepository.getFileTreeCancelacion(idEmpresa, idTipo).then(function(result) {
              if (result.data != undefined) {
                console.log('Es el valor del data de getfiletree');
                console.log(result.data);
                $scope.filetree = result.data;
                $scope.yo = true;
                //$scope.cancelar = true;
            }
            else{
                console.log('Error al obtener getfiletree');
            }

          });
    };


    // $scope.obtieneArbol =function(){
    //     console.log('entro al metodo que va a consultar los archivos');
    // filetreeRepository.getFileTreeCancelacion().then(function(result) {
    //         if (result.data != undefined) {
    //             console.log('si trae respuesta el arbol');
    //             console.log(result.data);
    //             $scope.filetree = result.data;
    //             $scope.yo = true;
    //             $scope.cancelar = true;
    //         }
    //     });
    // }

    $scope.listValidarDocumentos =[]
    $scope.ruta = function(obj) {
        $scope.listValidarDocumentos =[]
        $scope.rutaCarpeta = obj.path;
        $scope.cancelar = true;
        var cadena = obj.path;
        $scope.directorio = cadena.substr((cadena.length) - 8, 8)
        console.log('Valor del directorio: ' + $scope.directorio);
        obj.children.forEach(function(arrayDataLot) {
            $scope.listValidarDocumentos.push({
                nombreDocumento:arrayDataLot.name
            })
        });
        console.log($scope.listValidarDocumentos)
    }

    $scope.seleccionarCancelacion = function(obj) {
        $scope.nombre = obj.name
        $("ul").children('#' + $scope.nombre).slideToggle("fast");
    }



    $scope.realizarCancelacion = function(){
        $scope.idTipoNomina = 'Cancelacion';
        console.log('idEmpresa: ' + $scope.idEmpresa+' idTipoNomina: ' +  $scope.idTipoNomina + ' idUsuario: ' +  $scope.idUsuario + ' Ruta: ' +  $scope.rutaCarpeta + ' Nombre: ' +  $scope.nombre);
         filetreeRepository.getSocket($scope.idEmpresa, $scope.idTipoNomina, $scope.idUsuario, $scope.rutaCarpeta, $scope.nombre).then(function(result) {
             if (result.data != "") {
                  var longitud = $scope.filetree.length;
                  console.log($scope.filetree.length);
                  setTimeout(function(){ $scope.filetree = [] }, 20000);
                  $scope.timbradoPendientes = false;
                  $scope.rutaCarpeta = "";
                  $scope.cancelar = false;
            
                 alertFactory.success('Se mando a cancelar la Carpeta');
             } else {
                $scope.cancelar = false;
                 alertFactory.success('No se pudo realizar la Cancelacion');
             }
         });   
    }


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
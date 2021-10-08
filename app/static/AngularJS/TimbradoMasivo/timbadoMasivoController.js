registrationModule.controller('timbradoMasivoController', function($scope, $rootScope, $routeParams, alertFactory, timbradoRepository, localStorageService, filtrosRepository, filetreeRepository) {
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
    $scope.terminoTimbrado = false;
    var cronometro
    // agrege este paramerametro
    $scope.idTipoNominaSeleccion = 0;
    $scope.mensajePanel = "";
    $scope.cambioNombre = ""
    $scope.bloqueotimbrado = false;

    $scope.init = function() {
        getIPs(function(ip) { console.log(ip); });
        //$scope.carga();
        $scope.yo = false;
        $scope.cambioNombre = 'Timbrar'
        openCloseNav()
        $scope.getEmpresa(1);
        $scope.getTipoNomina();
        $scope.getAnios();
        setInterval(function() { $scope.getPermisos(); }, 1500);
        //$scope.getPermisos();
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
                        $scope.terminoTimbrado = true;
                    } else {
                        $scope.terminoTimbrado = false;
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




    $scope.getAnios = function () {
        let fechaActual = new Date();
        let anioActual = fechaActual.getFullYear();
        let mesActual = fechaActual.getMonth() + 1;
    
        filtrosRepository.getYear(1).then(function (result) {
          if (result.data.length > 0) {
            //$scope.lstAnios = result.data;
            $scope.lstAnios = [
                {yearNomina: 2017},
                {yearNomina: 2018},
                {yearNomina: 2019},
                {yearNomina: 2020},
                {yearNomina: 2021}
            ];
            $scope.lstMeses = [
              { id: 1, text: "Enero" },
              { id: 2, text: "Febrero" },
              { id: 3, text: "Marzo" },
              { id: 4, text: "Abril" },
              { id: 5, text: "Mayo" },
              { id: 6, text: "Junio" },
              { id: 7, text: "Julio" },
              { id: 8, text: "Agosto" },
              { id: 9, text: "Septiembre" },
              { id: 10, text: "Octubre" },
              { id: 11, text: "Noviembre" },
              { id: 12, text: "Diciembre" },
            ];
    
            $scope.lstQuincenas = [];
    
            /**
             * SELECCIONAMOS EL AÑO ACTUAL
             */
            $scope.lstAnios.forEach((el) => {
              if (el.yearNomina === anioActual) {
                $scope.selectedAnio = el;
              }
            });
    
            /**
             * SELECCIONAMOS EL MES ACTUAL
             */
            $scope.lstMeses.forEach((el) => {
              if (el.id === mesActual) {
                $scope.selectedMes = el.id;
              }
            });
    
            $scope.ObtieneFechasPagas();
          }
        });
      };
    
      $scope.ObtieneFechasPagas = function () {
        if (
          isNaN($scope.selectedMes) === false &&
          isNaN($scope.selectedAnio.yearNomina) === false
        ) {
          $scope.verDetalle = false;
          filtrosRepository
            .FechasPagas($scope.selectedMes, $scope.selectedAnio.yearNomina)
            .then((resp) => {
              if (resp.data.length > 0) {
                $scope.lstQuincenas = resp.data;
              }
              else
              {
                $scope.lstQuincenas = [];
              }
            });
        }
      };
    
    //  $scope.consultaTimbresEmpresa = function () {
    //    alertFactory.warning('Buscando...')
    //      $scope.verDetalle = false;
    //      $scope.ltsTimbrado = [];
    //      $scope.empresaUsuario.forEach((emp) => {
    //        console.log(emp);
    //        filetreeRepository.getFiles(emp.idEmpresa, $scope.fechaPagaSelected.tipo,$scope.fechaPagaSelected.fechasPaga).then(function(result) {
    //            if (result.data != undefined) {
    //                console.log('Es el valor del data de getfiletree');
    //                console.log(result.data);
    //                $scope.ltsTimbrado.push(result.data);
    //                $scope.yo = true;
    //            }
    //        });
    //      });
    //  };
    
      $scope.consultaTimbresEmpresa =async function () {
        if($scope.fechaPagaSelected == undefined)
        {
            alertFactory.warning('Necesita seleccionar una fecha de paga')
        }
        else
        {
        alertFactory.warning('Buscando...')
        $scope.verAvance = false;
        $scope.bloqueotimbrado = false;
        //$('#mdlLoading').modal('show');
        $scope.buscando = true;
        $scope.verGrid = false;
          $scope.ltsTimbradoEmpresa = [];
          $scope.ltsTimbradoSucursal = [];
          var consulta  = [];
          $scope.totalArchivos = 0
          
          for (var i = 0; i < $scope.empresaUsuario.length; i++) {
            consulta = await promiseConsultaCarpeta($scope.empresaUsuario[i].idEmpresa, $scope.fechaPagaSelected.tipo,$scope.fechaPagaSelected.fechasPaga);          
            if(consulta.length > 0)
            {
                $scope.data = {
                    'idEmpresa':0,
                    'empresa': '',
                    'sucursal': '',
                    'rutaTimbrar':'',
                    'numero':'' ,
                    'datos': []
                };
                $scope.data.idEmpresa = $scope.empresaUsuario[i].idEmpresa;
                $scope.data.empresa = $scope.empresaUsuario[i].nombreEmpresa;
                $scope.data.sucursal = [];
                $scope.data.rutaTimbrar = consulta[0].datos.path;
                $scope.data.numero = consulta[0].datos.children.length;
                $scope.data.datos = consulta[0].datos.children;
                $scope.ltsTimbradoEmpresa.push($scope.data);
                $scope.totalArchivos = $scope.totalArchivos + $scope.data.numero;
            } 
        }
        if($scope.ltsTimbradoEmpresa.length > 0)
        {
        $scope.verAvance = true;
        var archivos = [];
        var nombre = '';
        var empresa = '';
        var consultaRFC  = [];
        $scope.datosSuc = [];
        var num = 0
        for (var i = 0; i < $scope.ltsTimbradoEmpresa.length; i++) {
            archivos = $scope.ltsTimbradoEmpresa[i].datos;
            empresa = $scope.ltsTimbradoEmpresa[i].empresa;
            for (var j = 0; j < archivos.length; j++) {
                //console.log(j);
                num = num + 1;
                //console.log('numero de registro' + num);
                $scope.dataSuc = {
                    'idEmpresa':0,
                    'empresa': '',
                    'sucursal': [],
                    'rutaTimbrar':'',
                    'dato': [],
                    'nombre':'',
                    'rutaArchivo': ''
                };
                if(archivos[j].extension == '.xml')
                {
                    
                nombre = archivos[j].name.substring(1,14);
                //console.log(nombre);
                consultaRFC = await promiseConsultaLugar(nombre);     
                $scope.setProgressBar(num);
                //console.log(consultaRFC[0]);  
                $scope.dataSuc.idEmpresa =  $scope.ltsTimbradoEmpresa[i].idEmpresa; 
                $scope.dataSuc.empresa = empresa;
                $scope.dataSuc.sucursal = consultaRFC[0].lugar;
                $scope.dataSuc.rutaTimbrar = $scope.ltsTimbradoEmpresa[i].rutaTimbrar;
                $scope.dataSuc.dato =consultaRFC[0];
                let nombreA = archivos[j].name.split(".")[0];
                //$scope.dataSuc.nombre = archivos[j].name;
                $scope.dataSuc.nombre =nombreA;
                $scope.dataSuc.rutaArchivo = archivos[j].path.replace("Origen", "Timbrados")
                $scope.datosSuc.push($scope.dataSuc);
            }
            }
             
        }
        var groupedValido = groupBy($scope.datosSuc, "sucursal");
        for (var idxValido in groupedValido) {
            var x = groupedValido[idxValido];
            var sucs= {
                'check': '',
                'idEmpresa':0,
                'empresa': '',
                'sucursal': '',
                //'archivo':'',
                'rutaTimbrar': '', 
                'cantidad':''

            };
            sucs.check = true;
            sucs.idEmpresa = x[0].idEmpresa;
            sucs.empresa = x[0].empresa;
            sucs.sucursal = idxValido;
            sucs.archivos = x;
            sucs.rutaTimbrar = x[0].rutaTimbrar;
            sucs.cantidad = x.length;
            $scope.ltsTimbradoSucursal.push(sucs);
        }
   
        alertFactory.warning('Termino la busqueda...')
        //console.log($scope.ltsTimbradoSucursal);
        //console.log($scope.ltsTimbradoEmpresa);
        $scope.buscando = false;
        if($scope.ltsTimbradoSucursal.length > 0)
        {
            $scope.verGrid = true;
        }
    }
    else{
        alertFactory.warning('Termino la busqueda, No se encontraron resultados...')
        $scope.buscando = false;
    }
}
};

      $scope.Correo =async function () {
        //$scope.ltsSucTimbrado = [];
        //$scope.ltsEmpTimbrado= [];
        //$scope.ltsTimbradoSucursal.forEach(function(suc) {
        //    if(suc.check == true)
        //    {$scope.ltsSucTimbrado.push(suc);}   
        //});
        //var groupedEmpresa = groupBy($scope.ltsSucTimbrado, "empresa");
        //for (var idxValido in groupedEmpresa) {
        //    var x = groupedEmpresa[idxValido];
        //    var det= {
        //        'idEmpresa':0,
        //        'empresa': '',
        //        'sucursales': '',
        //        'rutaTimbrar': '', 
        //        //'cantidad':''
        //    };
        //    det.idEmpresa = x[0].idEmpresa;
        //    det.empresa = idxValido;
        //    det.sucursal = x;
        //   //det.archivos = x;
        //    det.rutaTimbrar = x[0].rutaTimbrar;
        //    //det.cantidad = x.length;
        //    $scope.ltsEmpTimbrado.push(det);
        //}
        var correo = '';
        for (var i = 0; i < $scope.ltsSucTimbrado.length; i++) {
            correo = await promiseEnviarCorreo($scope.ltsSucTimbrado[i]);          
        }
        alertFactory.warning('Termino envio correos...')
      }

      $scope.TimbradoMasivo =async function () {
        $scope.bloqueotimbrado = true;
        $scope.ltsSucTimbrado = [];
        $scope.ltsEmpTimbrado= [];
        $scope.ltsTimbradoSucursal.forEach(function(suc) {
            if(suc.check == true)
            {$scope.ltsSucTimbrado.push(suc);}
            
        });
        //console.log($scope.ltsSucTimbrado);
        var groupedEmpresa = groupBy($scope.ltsSucTimbrado, "empresa");
        for (var idxValido in groupedEmpresa) {
            var tot = 0;
            var x = groupedEmpresa[idxValido];
            var det= {
                'idEmpresa':0,
                'empresa': '',
                'sucursales': '',
                'rutaTimbrar': '', 
                'archivos':0
            };
            
            x.forEach(function(sucu) {
                tot = tot + sucu.archivos.length;
            });

            det.idEmpresa = x[0].idEmpresa;
            det.empresa = idxValido;
            det.sucursal = x;
            det.rutaTimbrar = x[0].rutaTimbrar;
            det.archivos = tot;
            $scope.ltsEmpTimbrado.push(det);
        }
        //console.log($scope.ltsEmpTimbrado);
        var timMasivo = [];
        var x = '';
        for (var i = 0; i < $scope.ltsEmpTimbrado.length; i++) {
            x = await promiserealizarTimbrado($scope.ltsEmpTimbrado[i])
            //alert('termino timbrado')
            timMasivo.push(x);       
        }
        alertFactory.warning('Termino Timbrado Masivo, inicia envio correos...')
        $scope.bloqueoCorreo = false;
        //$scope.Correo();
        //console.log(timMasivo);
      }

      async function promiseEnviarCorreo(lista) {
        return new Promise((resolve, reject) => {
        $scope.correo = lista.archivos[0].dato.correo;
        $scope.contadorSel = 0;
        $scope.listaPdfs = [];
        var rutaPDF = lista.rutaTimbrar.replace("Origen", "Timbrados") +   '/';
        angular.forEach(lista.archivos, function(value, key) {
            //if (value.check == true) {
                $scope.listaPdfs.push({
                    nombreRecibo: value.nombre,
                    idTipoNomina: $scope.fechaPagaSelected.tipo,
                    nombreNomina: $scope.fechaPagaSelected.fechasPaga
                })
                $scope.contadorSel++;
            //}
        });
        
        filetreeRepository.postDocumentosMailTimbrados(lista.idEmpresa, $scope.fechaPagaSelected.tipo, $scope.idUsuario, rutaPDF, $scope.fechaPagaSelected.fechasPaga, $scope.listaPdfs, $scope.correo, lista.sucursal).then(function(result) {
            if (result.data) {
                resolve(result.data);
            }
        }).catch(err => {
          reject(false);
        })
     });
    }

      async function promiseConsultaCarpeta(idEmpresa, tipo, fechasPaga) {
        return new Promise((resolve, reject) => {
            filetreeRepository.getFiles(idEmpresa, tipo, fechasPaga).then(function (result) {
                if (result.data) {
                    resolve(result.data);
                }
      
            }).catch(err => {
                reject(false);
            });
    
        });
    }
    
    async function promiseConsultaLugar(rfc) {
        return new Promise((resolve, reject) => {
            filtrosRepository.getLugarTrabajo(rfc).then(function (result) {
                if (result.data) {
                    resolve(result.data);
                }
      
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    async function promiserealizarTimbrado(lista) {
        return new Promise((resolve, reject) => {
        $scope.cambioNombre = 'Timbrar'
        filtrosRepository.getValidarDocumentosTimbrados($scope.fechaPagaSelected.fechasPaga,lista.idEmpresa,$scope.fechaPagaSelected.tipo).then( async function(respuesta) {
            $scope.documentosTimbrados = respuesta.data;
            //console.log($scope.documentosTimbrados[0].estatusCarpeta + ' respuesta')
            var socket = ''
            var aux = 1;   
            aux = aux + lista.archivos;
            var resultado = '';  
            if($scope.documentosTimbrados[0].estatusCarpeta ==1){
               resultado = 'Carpeta ya Timbrada';
            }
            else{
                $scope.cambioNombre = 'Timbrando....'
                socket = await promiseSocket (lista.idEmpresa, $scope.fechaPagaSelected.tipo, $scope.idUsuario, lista.rutaTimbrar, $scope.fechaPagaSelected.fechasPaga);      
                for (let i = 0; i < aux; i++) {
                    //console.log('calling');
                    $scope.terminoTimbrado = false;
                    //resultado = await promisePermisos();
                    let t = await resolveAfter8Seconds();
                    //console.log(t);  
                    //if($scope.datosPendientes.length> 0)
                    //{
                    //if (($scope.datosPendientes[0].timbrados + $scope.datosPendientes[0].timbradoError) == $scope.datosPendientes[0].TotalRecibos)
                    //{break;}
                    //}
                    //$scope.getPermisos();
                  }  
            }  
            await resolveAfter8Seconds();
            var correo = '';
            for (var i = 0; i < $scope.ltsSucTimbrado.length; i++) {
                if($scope.ltsSucTimbrado[i].idEmpresa == lista.idEmpresa)
                {correo = await promiseEnviarCorreo($scope.ltsSucTimbrado[i]);}      
            }    
            resolve(resultado);

        }).catch(err => {
            reject(false);
        });
    });
    }

    async function promiseSocket(idEmpresa,tipo,idUsuario,rutaTimbrar,fechasPaga) {
        return new Promise((resolve, reject) => {
            filetreeRepository.getSocket(idEmpresa, tipo, idUsuario, rutaTimbrar, fechasPaga).then(function(result) {
                if (result.data != "") {         
                    resolve(result.data);
                } else {
                    resolve(false);
                }
            }).catch(err => {
                reject(false);
            });
    });
    }

    async function promisePermisos() {
        return new Promise((resolve, reject) => {
            timbradoRepository.getPermisos($scope.idUsuario).then(function(result) {
            if (result.data) {
                resolve(result.data);
            } 
         }).catch(err => {
                reject(false);
            });
        });
    }
    
    groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    function resolveAfter8Seconds() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('resolved');
          }, 9000);
        });
      }
      function resolveAfter4Seconds() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('resolved');
          }, 4000);
        });
      }

    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }

     function delay(n){
        return new Promise(function(resolve){
            setTimeout(resolve,n*1000);
        });
    }
    
    $scope.setProgressBar=function(curStep){
        var steps= $scope.totalArchivos;
        //console.log('total barra: '+steps + 'de ' +curStep)
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar")
          .css("width",percent+"%")
          .html(percent+"%");   
      };
    
});
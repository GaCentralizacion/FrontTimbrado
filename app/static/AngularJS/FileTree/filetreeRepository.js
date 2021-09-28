var filetreeURL = global_settings.urlCORS + 'api/filetree/';
var mailPdfs = global_settings.urlCORS + 'api/zipandmail/';
var filetreeURLCancelacion = global_settings.urlCancelacion;
var fileURLConciliacion = global_settings.urlConciliacion;


registrationModule.factory('filetreeRepository', function($http) {
    return {
    	getFileTree: function(idEmpresa,idTipo){
            console.log('Ruta'+ filetreeURL + 'files/');
            console.log('idEmpresa'+ idEmpresa + ' idTipo: '+ idTipo);
            return $http({
                url: filetreeURL + 'files/',
                method:"GET",
                 params: {
                    idEmpresa: idEmpresa,
                    idTipo:idTipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getFileTreeCancelacion: function(idEmpresa,idTipo){
            //console.log('Ruta'+ filetreeURLCancelacion);
            //console.log('Entro a cancelacion va a mandar a llamar a la pagina de los servicios de node');
            console.log('Ruta:'+ filetreeURL + 'filesCancelacion/');
            console.log('idEmpresa: '+ idEmpresa + ' idTipo: '+ idTipo);
            return $http({
                url: filetreeURL + 'filesCancelacion/',
                method:"GET",
                 params: {
                    idEmpresa: idEmpresa,
                    idTipo: idTipo
                    //filetreeURLCancelacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getfilesAConciliar: function(){
            console.log('Ruta'+ fileURLConciliacion);
            //console.log('idEmpresa'+ idEmpresa + ' idTipo: '+ idTipo);
            return $http({
                url: filetreeURL + 'filesAConciliar/',
                method:"GET",
                 params: {
                    idEmpresa: 11,
                    idTipo:2,
                    fileURLConciliacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getSocket: function(idEmpresa,idTipo,idUsuario,path,nombreCarpeta){
            return $http({
                url:filetreeURL + 'socket/',
                method:"GET",
                params:{
                    idEmpresa: idEmpresa,
                    idTipo: idTipo,
                    idUsuario: idUsuario,
                    path: path,
                    nombreCarpeta: nombreCarpeta
                },
                headers:{
                    'Content-Type':'application/json'
                }
            });
        },
        getSocketCancelacion: function(idEmpresa,idTipo,idUsuario,path,nombreCarpeta){
            console.log('Ruta: '+ path);
            return $http({
                url:filetreeURL + 'socketCancelacion/',
                method:"GET",
                params:{
                    idEmpresa: idEmpresa,
                    idTipo: idTipo,
                    idUsuario: idUsuario,
                    path: path,
                    nombreCarpeta: nombreCarpeta
                },
                headers:{
                    'Content-Type':'application/json'
                }
            });
        },
        getSocketConciliacion: function(idEmpresa,idTipo,idUsuario,path,nombreCarpeta){
            return $http({
                url:filetreeURL + 'socket/',
                method:"GET",
                params:{
                    idEmpresa: idEmpresa,
                    idTipo: idTipo,
                    idUsuario: idUsuario,
                    path: fileURLConciliacion,
                    nombreCarpeta: nombreCarpeta
                },
                headers:{
                    'Content-Type':'application/json'
                }
            });
        },
        postDocumentosMail: function(idEmpresa,idTipo,idUsuario,path,nombreCarpeta,listaPds,correo){
            var objectArchivos ={
                archivos:listaPds,
                idEmpresa: idEmpresa,
                idTipo: idTipo,
                idUsuario: idUsuario,
                path: path,
                nombreCarpeta: nombreCarpeta,
                correo:correo

            }
            return $http({
                url:mailPdfs + 'generaZipMail/',
                method: "POST",
                data: objectArchivos,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(objectArchivos)
        }
    };
});
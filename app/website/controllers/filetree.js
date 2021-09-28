var FileTreeView = require('../views/reference'),
    FileTreeModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
var dirTree = require('directory-tree');
var net = require('net');
var client = new net.Socket();



var FileTree = function(conf) {
    this.conf = conf || {};

    this.view = new FileTreeView();
    this.model = new FileTreeModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

FileTree.prototype.get_socket = function(req, res, next) {
    console.log('entra a socket Generico')
    console.log('nombre del proceso que se va a ejecutar ' + req.query.nombreCarpeta);
    var datos = [];
    var envio = JSON.stringify({idEmpresa: req.query.idEmpresa,
                                idTipo: req.query.idTipo,
                                idUsuario:req.query.idUsuario,
                                path:req.query.path,
                                nombreCarpeta:req.query.nombreCarpeta
                                });
    console.log('envio: ');
    console.log(envio);
    //client.connect(3800, 'Localhost', function() {
    client.connect(3800, '192.168.20.59', function() {
    //client.connect(3800, '192.168.20.92', function() {
        console.log('Connected');
        client.write(envio);
    });
    var i = 0;
    client.on('data', function(data) {
        console.log('Received: ' + data);
        datos = data.toString('utf8');

        res.json({
        data: datos
        });
        client.destroy(); // kill client after server's response 
    });


    client.on('close', function() {
        console.log('Connection closed');
    });
    
}

FileTree.prototype.get_files = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'idTipo', value: req.query.idTipo, type: self.model.types.INT }
    ];

    this.model.query('SEL_RUTAS_ORIGEN_SP', params, function(error, result) {
        console.log('ruta: ' + result[0].RutaDescripcion);
        var trees = dirTree(result[0].RutaDescripcion, ['.xml']);
        var elementos = [];
        var elementosValidos = [];
        var elementosFinales = [];
        for (var i = 0; i < trees.children.length; i++) {
            if (trees.children[i].name.length == 8) {
                if (trees.children[i].children.length == 0) {
                    elementos.push({
                        fila: i
                    })
                } else {
                    elementosValidos.push({
                        datos: trees.children[i]
                    })
                }
            } else {}
        }
        for (var h = 0; h < elementosValidos.length; h++) {
            if ((elementosValidos[h].datos.name.substr(0, 2) <= 31 && elementosValidos[h].datos.name.substr(0, 2) > 0) && (elementosValidos[h].datos.name.substr(2, 2) <= 12 && elementosValidos[h].datos.name.substr(2, 2) > 0) && (elementosValidos[h].datos.name.substr(4, 4) <= 9999 && elementosValidos[h].datos.name.substr(4, 4) > 0)) {
                elementosFinales.push({ datos: elementosValidos[h].datos })
            } else {}
        }
        console.log('elementos finales');
        console.log(elementosFinales)
        self.view.expositor(res, {
            error: error,
            result: elementosFinales
        });
    });
};

FileTree.prototype.get_filesCancelacion = function(req, res, next) {
   var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'idTipo', value: req.query.idTipo, type: self.model.types.INT }
    ];

    this.model.query('SEL_RUTAS_ORIGEN_SP', params, function(error, result) {
        console.log('ruta: ' + result[0].RutaDescripcion.replace("Origen", "XMLPorCancelar"));
        var trees = dirTree(result[0].RutaDescripcion.replace("Origen", "XMLPorCancelar"), ['.xml']);
        var elementos = [];
        var elementosValidos = [];
        var elementosFinales = [];
        for (var i = 0; i < trees.children.length; i++) {
            if (trees.children[i].name.length == 8) {
                if (trees.children[i].children.length == 0) {
                    elementos.push({
                        fila: i
                    })
                } else {
                    elementosValidos.push({
                        datos: trees.children[i]
                    })
                }
            } else {}
        }
        for (var h = 0; h < elementosValidos.length; h++) {
            if ((elementosValidos[h].datos.name.substr(0, 2) <= 31 && elementosValidos[h].datos.name.substr(0, 2) > 0) && (elementosValidos[h].datos.name.substr(2, 2) <= 12 && elementosValidos[h].datos.name.substr(2, 2) > 0) && (elementosValidos[h].datos.name.substr(4, 4) <= 9999 && elementosValidos[h].datos.name.substr(4, 4) > 0)) {
                elementosFinales.push({ datos: elementosValidos[h].datos })
            } else {}
        }
        console.log('elementos finales');
        console.log(elementosFinales)
        self.view.expositor(res, {
            error: error,
            result: elementosFinales
        });
    });
};


// FileTree.prototype.get_filesCancelacion = function(req, res, next) {
//     var self = this;

//     var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
//         { name: 'idTipo', value: req.query.idTipo, type: self.model.types.INT }
//     ];

//     console.log('idEmpresa: ' + req.query.idEmpresa);
//     console.log('idTipo: ' + req.query.idTipo);
//     console.log('filetreeURLCancelacion: ' + req.query.filetreeURLCancelacion);
//     this.model.query('SEL_RUTAS_ORIGEN_SP', params, function(error, result) {
//         console.log('ruta: ' + result[0].RutaDescripcion);
//          var trees = dirTree(req.query.filetreeURLCancelacion, ['.xml']);
//          var elementos = [];
//          var elementosValidos = [];
//          var elementosFinales = [];
//          console.log('Trees');
//          console.log(trees.children.length);

//          for (var h = 0; h < trees.children.length; h++) {
//             elementosFinales.push({
//                                 datos: trees.children[h]
//                             })
//          }

//          console.log('elementos finales');
//          self.view.expositor(res, {
//              error: error,
//              result: elementosFinales
//          });
//     });
// };

FileTree.prototype.get_filesAConciliar = function(req, res, next) {
    var self = this;
    var error = '';

    console.log('RUTA: ' + req.query.fileURLConciliacion);
         var trees = dirTree(req.query.fileURLConciliacion, ['.xml']);
         var elementos = [];
         var elementosValidos = [];
         var elementosFinales = [];
         console.log('Trees');
         console.log(trees.children.length);

        elementosFinales.push({datos: trees.children.length})
         
         console.log('elementos finales conciliacion');
         self.view.expositor(res, {
             error: error,
             result: trees.children.length
         });
};



FileTree.prototype.get_filesXEmpresa = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'idTipo', value: req.query.idTipo, type: self.model.types.INT }
    ];

    this.model.query('SEL_RUTAS_ORIGEN_SP', params, function(error, result) {
        console.log('ruta: ' + result[0].RutaDescripcion.replace("F", "C"));
        //console.log('ruta: ' + result[0].RutaDescripcion);
        //try {
            var trees = dirTree(result[0].RutaDescripcion.replace("F", "C"), ['.xml']);
            //var trees = dirTree(result[0].RutaDescripcion, ['.xml']);

            var elementos = [];
            var elementosValidos = [];
            var elementosFinales = [];
            if(trees != null || trees != undefined)
            {
            for (var i = 0; i < trees.children.length; i++) {
                console.log(trees.children[i].name)
                console.log(trees.children[i].name.length)
                if(trees.children[i].name == req.query.fechasPaga)
                {
                if (trees.children[i].name.length == 8) {
                    if (trees.children[i].children.length == 0) {
                        elementos.push({
                            fila: i
                        })
                    } else {
                        elementosValidos.push({
                            datos: trees.children[i]
                        })
                    }
                } else {}
            }
            }
            for (var h = 0; h < elementosValidos.length; h++) {
                if ((elementosValidos[h].datos.name.substr(0, 2) <= 31 && elementosValidos[h].datos.name.substr(0, 2) > 0) && (elementosValidos[h].datos.name.substr(2, 2) <= 12 && elementosValidos[h].datos.name.substr(2, 2) > 0) && (elementosValidos[h].datos.name.substr(4, 4) <= 9999 && elementosValidos[h].datos.name.substr(4, 4) > 0)) {
                    elementosFinales.push({ datos: elementosValidos[h].datos })
                } else {}
            }
            console.log('elementos finales');
            console.log(elementosFinales)
        }
          //}
          //catch(err) {
          //  console.log(err.message);
          //}

        self.view.expositor(res, {
            error: error,
            result: elementosFinales
        });
    });
};


module.exports = FileTree;

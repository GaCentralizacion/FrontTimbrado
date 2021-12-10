var fs = require("fs");
var JSZip = require("jszip");
var zip = new JSZip();
var log = require('../utils/log')();
var ZipandMailView = require('../views/reference'),
    ZipandMailModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
var erroresPDF = 0;


var ZipandMail = function(conf) {
    this.conf = conf || {};

    this.view = new ZipandMailView();
    this.model = new ZipandMailModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

ZipandMail.prototype.post_generaZipMail = function(req, res, next) {  
console.log(req.body)//Objeto que almacena la respuesta
      
    var object = {};   //Objeto que envía los parámetros
    var params = [];   //Referencia a la clase para callback
    var self = this;
    var nombreArchivos = [];
    var files = [];
    var ruta = req.body.path;
    var extension = '.pdf';
    var carpeta = req.body.nombreCarpeta;
    var correo = req.body.correo;
    nombreArchivos = req.body.archivos; 

    nombreArchivos.forEach(function(file, i) {
        create_zip(ruta + file.nombreRecibo + extension, file.nombreRecibo + extension);
    }); 



    function create_zip(file, name) {

         // fs.unlink(ruta + carpeta + '.zip', function(err) {
                        // if (err) return console.log(err);
                   //      console.log('file deleted successfully');
                   // });

        var contentPromise = new JSZip.external.Promise(function(resolve, reject) {
            fs.readFile(file, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        zip.file(name, contentPromise);
    }

    zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(ruta + carpeta + '.zip'))
        .on('finish', function() {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log(ruta + carpeta + '.zip' + "written.");
        });
    zip = new JSZip();
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    // var transporter = nodemailer.createTransport(smtpTransport({
    //     host: '192.168.20.1',
    //     port: 25,
    //     secure: false,
    //     auth: {
    //         user: 'sistemas',
    //         pass: 's1st3m4s'
    //    },
    //     tls: { rejectUnauthorized: false}
    //   }));


    var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'reportesauxiliar@grupoandrade.com',
                pass: 'SuuDU3%56pl#'
            }
        });
   
    var mailOptions = {
        from: '"Correos de GA" <grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
        to: correo, // list of receivers 
        subject: 'Recibos Timbrados GA', // Subject line 
        text: 'Se envían adjuntos los archivos timbrados ', // plaintext body 
        html: '<b>Se envían adjuntos los archivos timbrados </b>', // html body 
        attachments: [{ // file on disk as an attachment
            filename: +carpeta + '.zip',
            path: ruta + carpeta + '.zip' // stream this file
        }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.send(500);
            console.log(error);
        } else {
            res.send(200);
            console.log('Message sent: ' + info.response);

            fs.stat(ruta + carpeta + '.zip', function(err, stats) {

            if (err) {
                return console.error(err);
            }     
            });
        }

               
    });

    transporter.close;
    object.error = null;            
    object.result = 1; 
    console.log(object.result)
    req.body = []; 
       
    
}

ZipandMail.prototype.post_generaZipMailTimbrado = async function(req, res, next) {  
    console.log(req.body)//Objeto que almacena la respuesta
    zip = new JSZip();
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }

    let d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let time = h+ '_'  + m + '_' + s;

        var object = {};   //Objeto que envía los parámetros
        var params = [];   //Referencia a la clase para callback
        var self = this;
        var nombreArchivos = [];
        var files = [];
        var ruta = req.body.path;
        var extension = '.pdf';
        var extensionXML = '.xml';
        var carpeta = req.body.nombreCarpeta + '_' + time;
        var correo = req.body.correo;
        nombreArchivos = req.body.archivos; 
        var sucursal = req.body.sucursal;
        var correoRecursos = 'juan.peralta@coalmx.com'
        //var correoRecursos = 'administraciondepersonal6@grupoandrade.com'

        var archivosTotales = req.body.archivos.length;
        log.logger(`Sucursal: ` + sucursal);
        log.logger(`Paga : ` + req.body.nombreCarpeta);
        log.logger(`Hora : ` + time);
        log.logger(`Correo : ` + correo);
        log.logger(`=====Archivos A ENVIAR=====`);
        log.logger(JSON.stringify(nombreArchivos));
        var respuestaPDF = '';
        var respuestaXML = '';
        var errorPDF = 0;
        for (var i = 0; i < nombreArchivos.length; i++) {
            respuestaPDF = await create_zip(ruta + nombreArchivos[i].nombreRecibo + extension, nombreArchivos[i].nombreRecibo + extension,extension);
            respuestaXML = await create_zip(ruta + nombreArchivos[i].nombreRecibo +'tim'+ extensionXML, nombreArchivos[i].nombreRecibo +'tim'+ extensionXML,extensionXML);
           
           if(respuestaPDF.extension == '.pdf' && respuestaPDF.error == 0)
           { zip.file(nombreArchivos[i].nombreRecibo + extension, respuestaPDF.datos);}
           else
           { errorPDF = errorPDF + 1;}

           if(respuestaXML.extension == '.xml' && respuestaXML.error == 0)
           { zip.file(nombreArchivos[i].nombreRecibo +'tim'+ extensionXML, respuestaXML.datos);}
        }

        var zipFinal = '';
        var cargaZip = '';
        var tam = '';
        var tamaño =  '';
        var zipVacio = false;
        console.log('total errores PDF: ' + errorPDF)
        console.log('total archivos PDF: ' + archivosTotales)
        log.logger('total errores PDF: ' + errorPDF);
        log.logger('total archivos PDF: ' + archivosTotales);

        if(errorPDF != archivosTotales)
        {
        zipFinal = await create_zipFinal(ruta, carpeta);
        cargaZip = await create_zipCarga(ruta, carpeta);
       
        tam = formatBytes(cargaZip.byteLength , 2);
        tamaño =  tam.split(' ');
        console.log(tamaño)
        }
        else 
        {
            log.logger(`ZIP vacio : ` + sucursal);
            zipVacio = true;
        }
        
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'reportesauxiliar@grupoandrade.com',
                    pass: 'SuuDU3%56pl#'
                }
            });
        var mailOptions = '';

        if(!zipVacio)
        {
        if(tamaño[1] == 'KB' || (tamaño[1] == 'MB' && tamaño[0] < 20))
        {
         mailOptions = {
            from: '"Correos de GA" <grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
            to: correo, // list of receivers 
            subject: 'Recibos Timbrados ' + sucursal, // Subject line 
            text: 'Se envían adjuntos los archivos timbrados ', // plaintext body 
            html: '<b>Se envían adjuntos los archivos timbrados </b>', // html body 
            attachments: [{ // file on disk as an attachment
                filename: carpeta + '.zip',
                path: ruta + carpeta + '.zip' // stream this file
            }]
        };
    }
    else 
    {
        mailOptions = {
            from: '"Correos de GA" <grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
            to: correoRecursos, // list of receivers 
            subject: 'Recibos Timbrados ' + sucursal, // Subject line 
            text: 'El tamaño del archivo ZIP excede el limite permitido para el envio. ', // plaintext body 
            html: '<b>El tamaño del archivo ZIP excede el limite permitido para el envio. </b>' + '<br>' +  '<b>Ruta: </b>' + ruta + carpeta + '.zip', // html body 
        };
    }
    }
    else
    {
        mailOptions = {
            from: '"Correos de GA" <grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
            to: correoRecursos, // list of receivers 
            subject: 'Recibos Timbrados ' + sucursal, // Subject line 
            text: 'La sucursal no pudo ser timbrada. ', // plaintext body 
            html: '<b>La sucursal no pudo ser timbrada. </b>', // html body 
        };
    }
    log.logger('mailOptions: ' + JSON.stringify(mailOptions) );

    transporter.sendMail(mailOptions, function(error, info) {
    
        if (error) {
            res.send(500);
            console.log(error);
        } else {
            res.send(200);
            console.log('Message sent: ' + info.response);
            log.logger('Message sent: ' + info.response);

        }     
    });

    transporter.close;
    object.error = null;            
    object.result = 1; 
    console.log(object.result)
    req.body = []; 

    }

    create_zip = function (file, name, extension) {
        return new Promise((resolve, reject) => {
                fs.readFile(file, function(err, data) {
                    if (err) {
                        if(extension == '.pdf')
                        {
                            erroresPDF = erroresPDF + 1;
                        }
                        resolve({error: 1, extension: extension, datos: null});
                        log.logger(`Error : ` + err);
                    } else {
                        resolve({error: 0, extension: extension, datos: data});
                    }
                });
          
        });
     }

     create_zipFinal = function (ruta, carpeta) {
        return new Promise((resolve, reject) => {
            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream(ruta + carpeta + '.zip'))
            .on('finish', function() {
                console.log(ruta + carpeta + '.zip ' + "written");
                log.logger(`ZIP : ` + ruta + carpeta + '.zip ' + "written");
                resolve(fs);
            });
        });
     }

     create_zipCarga = function (ruta, carpeta) {
        return new Promise((resolve, reject) => {
            fs.readFile(ruta + carpeta + '.zip', function(err, data) {
                if (err) throw err;
                zip.loadAsync(data).then(function (zipp) {
                resolve(data);
                });
            });
        });
     }

     function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  

module.exports = ZipandMail;

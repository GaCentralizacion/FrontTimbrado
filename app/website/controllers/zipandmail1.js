var fs = require("fs");
var JSZip = require("jszip");
var zip = new JSZip();

var ZipandMailView = require('../views/reference'),
    ZipandMailModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


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

        var contentPromise = new JSZip.external.Promise(function(resolve, reject) {
            fs.readFile(file, function(err, data) {
                if (err) {
                    reject(e);
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

    var transporter = nodemailer.createTransport(smtpTransport({
        host: '192.168.20.1',
        port: 25,
        secure: false,
        auth: {
            user: 'sistemas',
            pass: 's1st3m4s'
       },
        tls: { rejectUnauthorized: false}
      }));

   
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

                   // fs.unlink(ruta + carpeta + '.zip', function(err) {
                        // if (err) return console.log(err);
                   //      console.log('file deleted successfully');
                   // });
            });
        }

               
    });

    transporter.close;
    object.error = null;            
    object.result = 1; 
    console.log(object.result)
    req.body = []; 
       
    
}


module.exports = ZipandMail;

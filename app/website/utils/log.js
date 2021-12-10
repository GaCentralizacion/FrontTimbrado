//var fs = require('fs');
//var Log = function () {
   //if (!fs.existsSync('logs')) {
   //   fs.mkdirSync('logs');
   //}

   //var loggerStream = null;
   //var f = new Date();
   //var fecha = f.getDate() + "_" + (f.getMonth() +1) + "_" + f.getFullYear();
   //var nombrelog = 'logs/logger_' + fecha + '.txt'
   //if (!fs.existsSync(nombrelog)) {
   //   loggerStream = fs.createWriteStream(nombrelog);
   //}
  
   //return {
   //   logger: function (msg) {
   //      var message = new Date().toLocaleString() + " : " + msg + "\r\n";
   //      if (loggerStream) {
   //         loggerStream.write(message);
    //     } else {
   //         fs.appendFileSync(nombrelog, message);
   //      }
   //   }
  // }
//};

//module.exports = Log;

var fs = require('fs');
var Log = function () {
   if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
   }

   var loggerStream = null;

   if (!fs.existsSync('logs/logger.txt')) {
      loggerStream = fs.createWriteStream('logs/logger.txt');
   }
   return {
      logger: function (msg) {
         var message = new Date().toLocaleString() + " : " + msg + "\r\n";
         if (loggerStream) {
            loggerStream.write(message);
         } else {
            fs.appendFileSync('logs/logger.txt', message);
         }
      }
   }
};

module.exports = Log;


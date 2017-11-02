var http = require('http');
var text = require('./Sample.js');    //If sample.js file present in sam path

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(text.sampleText());      // calls sample text function in Sample.js file
    res.end();

}).listen(8000);

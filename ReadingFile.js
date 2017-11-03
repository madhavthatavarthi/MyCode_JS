var http = require('http');
var url = require('url');
var fs = require('fs');
/*Reading HTML file from the server
  Note: It should be incuded in the url path*/
http.createServer(function(req,res){
  var urlPath = url.parse(req.url, true);    //Taking HTML File Name from the URL
  var file = "." + urlPath.pathname;
  fs.readFile(file, function(err, data){     //Reads File from the system
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end();
});
}).listen(8000);

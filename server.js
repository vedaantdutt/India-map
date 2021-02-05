// var http = require('http');
// var fs = require('fs');

// const PORT=8080;

// fs.readFile('./public/index.html', function (err, html) {

//     if (err) throw err;

//     http.createServer(function(request, response) {
//         response.writeHeader(200, {"Content-Type": "text/html"});
//         response.write(html);
//         response.end();
//     }).listen(PORT);
// });

let express = require("express");
var cors = require("cors");
const path = require("path");
let app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  // res.set({ "Access-Control-Allow-Origin": "*" });
  res.sendFile(
     __dirname + "/index.html"
    // __dirname + "/index-test-ajax-coord.html"

    // , {root: __dirname }
  );
});

app.listen(8080);

// mime type
// type = mime.getType(path);

// //<SNIP>....

// // header fields
// if (!res.getHeader('content-type')) {
//   var charset = mime.charsets.lookup(type);
// res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
// }

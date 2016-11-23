var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname));

app.get('/', function(request, response) {
  response.sendFile('app/index.html', {root : __dirname});
});

app.get('/root2/', function (request, response) {
  response.sendFile('index.html', { root : __dirname });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

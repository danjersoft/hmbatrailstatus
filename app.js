var tako = require('tako'), request = require('request'), path = require('path'), app = tako();

//app.route('/index.html').file(path.join(__dirname, 'static/index.html'));
//app.route('/').file(path.join(__dirname, 'static/index.html'));
app.route('/').html('<h1>hello</h1>');

console.log(process.env.PORT || 9898);
app.httpServer.listen(process.env.PORT || 9898);
var tako = require('tako'), request = require('request'), path = require('path'), app = tako();

app.route('/index.html').file(path.join(__dirname, 'static/index.html'));
app.route('/').file(path.join(__dirname, 'static/index.html'));
app.route('/app.js').file(path.join(__dirname, 'static/app.js'));
app.route('/coords.js').file(path.join(__dirname, 'static/coords.js'));
app.route('/img/marker.png').file(path.join(__dirname, 'static/img/marker.png'));

if (process.env.PORT) {
   app.route('/trailstatus/rss.php', function (req, resp) {
      request({
         method: req.method,
         uri: 'http://www.hmba.org/trailstatus/rss.php'
      }).pipe(resp);
   });
} else {
   app.route('/trailstatus/rss.php').file(path.join(__dirname, 'data.rss'));
}

app.httpServer.listen(process.env.PORT || 9898);
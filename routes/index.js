var request = require('request');
var constants = require('./../lib/constants');

var TITLE = constants.TITLE;

function index(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/metadata');
  } else {
    res.render('index', { title: TITLE });
  }
}

function metadata(req, res) {
  var path = Object.keys(req.params).length === 0 ? '' : req.params[0];
  var start = new Date();
  request({
    uri: 'https://api.dropbox.com/1/metadata/auto/' + path,
    headers: { Authorization: 'Bearer ' + req.session.passport.user.accessToken },
    json: true
  }, function(err, response, body) {
    if (err) {
      console.error(err);
      res.send(500);
      return;
    }
    if (response.statusCode !== 200) {
      console.error(response.statusCode);
      res.send(500);
      return;
    }
    res.render('metadata', { title: TITLE, result: body });
    console.log(new Date() - start + ' msec');
  });
}

function download(req, res) {
  if (Object.keys(req.params).length === 0) {
    res.send(400);
    return;
  }
  request.get({
    uri: 'https://api-content.dropbox.com/1/files/auto/' + req.params[0],
    headers: { Authorization: 'Bearer ' + req.session.passport.user.accessToken }
  }).pipe(res);
}

exports.index = index;
exports.metadata = metadata;
exports.download = download;

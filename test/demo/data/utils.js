var conf = require('./config');
var fs = require('fs');
var request = require('request');
var path = require('path');

module.exports = {
  init: function () {
    var j = request.jar();
    var r = request.defaults({ jar: j, followRedirect: false });
    return r;
  },

  login: function (request, username, password, cb) {
    // logout first
    request.get({ url: conf.url + '/auth/logout' }, function (err, response, body) {
      if (err) { return cb(err); }
      // then login
      request.post({ url: conf.url + '/auth/local',
                     form: { username: username, password: password },
                   }, function(err, response, body) {
        if (err) { return cb(err); }
        request(conf.url + '/user', function(err, response, body) {
          if (err) { return cb(err); }
          if (response.statusCode !== 200) {
            cb('Error: Login unsuccessful. ' + body)
          }
          cb(null);
        });
      });
    });
  },

  user_put: function (request, user, cb) {
    var r = request.put({
      url: conf.url + '/user',
      body: JSON.stringify(user)
    }, function(err, response, body) {
      if (err) { return cb(err, null); }
      var b = JSON.parse(body);
      cb(null, b);
    });
  },

  file_create: function(request, filename, cb) {
    var r = request.post({
      url: conf.url + '/file'
    }, function (err, response, body) {
      if (err) return cb(err, null);
      var b = JSON.parse(body);
      return cb(null, b);
    });
    var form = r.form();
    form.append('file', fs.createReadStream(path.join(__dirname, filename)));
  },

  proj_create: function(request, proj, cb) {
    request.post({ url: conf.url + '/project',
                   body: JSON.stringify(proj)
                 }, function(err, response, body) {
      if (err) { return cb(err, null); }
      var b = JSON.parse(body);
      cb(null, b);
    });
  },

  proj_put: function(request, proj, cb) {
    var r = request.put({
      url: conf.url + '/project',
      body: JSON.stringify(proj)
    }, function(err, response, body) {
      if (err) { return cb(err, null); }
      var b = JSON.parse(body);
      cb(null, b);
    });
  },

  comment_create: function(request, comment, cb) {
    request.post({ url: conf.url + '/comment',
                   body: JSON.stringify(comment)
                 }, function(err, response, body) {
      if (err) { return cb(err, null); }
      var b = JSON.parse(body);
      cb(null, b);
    });
  }

};
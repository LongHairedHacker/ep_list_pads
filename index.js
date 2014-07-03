   var eejs = require('ep_etherpad-lite/node/eejs/'),
 padManager = require('ep_etherpad-lite/node/db/PadManager'),
        ERR = require("ep_etherpad-lite/node_modules/async-stacktrace"),
      async = require('ep_etherpad-lite/node_modules/async'),
    express = require('ep_etherpad-lite/node_modules/express'),
	settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_indexWrapper = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_list_pads/templates/letters.ejs");
  return cb();
}

exports.registerRoute = function (hook_name, args, cb) {
  args.app.get('/list/:letter(*)', function(req, res) {

    var letter = req.params.letter;
    var pads = [];
    var data = [];

    async.waterfall([
      function(callback){
	    padManager.listAllPads(callback)
      },
      function (pads, callback) {
	    async.forEach(pads.padIDs, function(padID, callback) {
          if(padID[0] == letter || padID[0] == letter.toUpperCase()){
            data.push(padID);
          }
	    });
        callback();
      },
      function(callback){
        var render_args = {
          errors: [],
		  settings: settings,
          pads: data,
          letter: letter
        };
        res.send( eejs.require("ep_list_pads/templates/pads.html", render_args) );
        callback();
      }
    ]);

  });
};


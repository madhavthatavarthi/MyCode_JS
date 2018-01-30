const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();
var express = require('express');
var router = express.Router();



router.get('/', function(req,res){
    res.send('Nothing here');
});

router.get('/:kind/:key', function(req, res){
  var kind = req.params.kind;
  var key = req.params.key;
  var dkey = datastore.key([kind, key]);
  datastore.get(dkey, function(err, doc) {
      console.log(doc);
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.send(doc);
    });
});


module.exports = router;

/**
 * @author Karthik Divi <http://karthikdivi.com>
 */

var request = require("request");
var config = require('../../config');
const UPCAPIEndpoint = 'https://api.upcitemdb.com/prod/trial';

var productCache = {}

function getProduct(productId, cb){
  if(productCache[productId]){
      console.log(`serving data for ${productId} from cache`);
      cb(null, productCache[productId]);
  }else{
    //console.log(`Collecting data for ${productId}`);
    var apiUrl = `${UPCAPIEndpoint}/lookup?upc=${productId}`;
    console.log('Hitting ', apiUrl);
    request(apiUrl, function(error, response, body) {
      if (error) {
        console.log('error:', error);
        cb(error, null);
      } else if (response && response.statusCode == 200) {
        //console.log('product response:', body);
        var product = JSON.parse(body);
        product.aisleLocation = config.aisleLocations[utils.randomNumber(0, (config.aisleLocations.length-1))];
        product.location = utils.randomLocationInRange(-180, 180, 3) + ', ' + utils.randomLocationInRange(-180, 180, 3);
        productCache[productId] = product
        console.log(`Product ${productId} is cachied. Life:${config.cacheIntervals.product}`);
        setTimeout(function(){  console.log(`RIP ${productId}`);  delete productCache[productId]; }, config.cacheIntervals.product);
        cb(null, product);
      } else {
        cb(`API call failed, statusCode ${response.statusCode}`, null);
      }
    });
  }
}

function getProducts(ids, cb){
  if(!ids){
    cb(null, []);
    return;
  }
  var products = [];
  var completed_requests = 0;
  var responseSent = false;
  var counter = 0;
  for (let id of ids) {
    counter++;
    setTimeout(function(){
      getProduct(id, function(err, product){
        completed_requests++;
        if(err){
          console.log('Error while fetching series of products hence breaking', err);
          if(!responseSent){
            responseSent = true;
            console.log('Sending failure response');
            cb(err, null);
          }else{
            console.log('Already sent a failure response, Ignore');
          }
          return;
        }else{
          for(var i = 0; i < product.items[0].offers.length; i++) {
            if (product.items[0].offers[i].domain == 'walmart.com') {
              product.items[0].offers[i].upc = product.items[0].upc;
              for(var j = 0; j < product.items[0].images.length; j++) {
                if (product.items[0].images[j].startsWith("https://i5.walmartimages.com")) {
                  product.items[0].offers[i].image = product.items[0].images[j];
                }
              }
              products.push(product.items[0].offers[i]);
            }
          }
          if (completed_requests == ids.length) {
            if(!responseSent){
                responseSent = true;
                cb(null, products);
            }
          }
        }
      });
    }, (counter*300));
  }
}

module.exports = {
  getProduct: getProduct,
  getProducts: getProducts
}

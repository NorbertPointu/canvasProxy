var express = require('express');
var router = express.Router();
var base64url = require('base64url')
var crypto = require("crypto")

function verify(secret, algorithm, encodedEnvelope,encodedSig){
  return true
}

/* GET . */
router.get('/', function(req, res, next) {
  res.send('Proxy to ');
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  const secret = "3D5BF26DDDBE19D4EB3D5961CCF55A58937FB7A11E3EFC6DFB1FFF8DEAE15780"
  const signed_request = req.body.signed_request
  const [encodedSig64, encodedEnvelop64] = signed_request.split('.',2);

  const encodedEnvelopJSON = base64url.decode(encodedEnvelop64)
  const encodedEnvelop= JSON.parse(encodedEnvelopJSON)
  // check algorithm - not relevant to error
  if (!encodedEnvelop.algorithm || encodedEnvelop.algorithm.toUpperCase() != 'HMACSHA256') {
    console.error('Unknown algorithm. Expected HMAC-SHA256');
    res.message('Unknown algorithm. Expected HMAC-SHA256').statusCode(500)
    return null;
  }

  const expectedSig = crypto.createHmac('sha256',secret).update(encodedEnvelopJSON).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace('=','');

  verify(secret, "HMACSHA256", encodedEnvelop64,encodedSig64)
  const {client, context} = encodedEnvelop
  const  data= base64url.encode(JSON.stringify({client, context}))

  //res.send('POST Proxy to ' + data)
  res.redirect(301,"https://pocreact-12032.web.app/canvas?context="+data)
});

module.exports = router;

"use strict";
var express = require("express");
var api = require("./api/api");
var server = api.listen(3000, function(req, res) {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

"use strict";
var CQRSDomain = require("cqrs-domain");
module.exports = CQRSDomain.defineCommand({
    name: 'modelAdded'
}, function (data, aggregate) {
    console.log(data);
    console.log(aggregate);
});

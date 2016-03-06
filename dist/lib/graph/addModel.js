"use strict";
var CQRSDomain = require("cqrs-domain");
module.exports = CQRSDomain.defineCommand({
    name: 'addModel'
}, function (data, aggregate) {
    aggregate.apply('modelAdded', data);
});

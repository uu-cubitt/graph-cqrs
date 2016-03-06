"use strict";
var Graph = require("cubitt-graph");
var CQRSDomain = require("cqrs-domain");
module.exports = CQRSDomain.defineAggregate({
    name: 'graph',
    defaultCommandPayload: 'payload',
    defaultEventPayload: 'payload'
}, {
    graph: new Graph.Project()
});

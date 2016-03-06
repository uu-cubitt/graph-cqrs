"use strict";
var cubitt_graph_1 = require("cubitt-graph");
var Commands = require("cubitt-commands");
var Events = require("cubitt-events");
var CQRSGraph = (function () {
    function CQRSGraph(graph, version) {
        if (version === void 0) { version = 0; }
        if (graph == null) {
            this.graph = new cubitt_graph_1.Project();
        }
        else {
            this.graph = graph;
        }
        this.version = version;
    }
    CQRSGraph.prototype.beginTransaction = function () {
        this.rollbackGraph = this.graph.serialize();
        this.rollbackVersion = this.version;
    };
    CQRSGraph.prototype.ApplyCommand = function (command) {
        try {
            switch (command.type) {
                case Commands.CommandType.AddConnector:
                    this.AddConnector(command);
                    break;
                case Commands.CommandType.AddEdge:
                    this.AddEdge(command);
                    break;
                case Commands.CommandType.AddModel:
                    this.AddModel(command);
                    break;
                case Commands.CommandType.AddNode:
                    this.AddNode(command);
                    break;
                case Commands.CommandType.DeleteConnector:
                    this.DeleteConnector(command);
                    break;
                case Commands.CommandType.DeleteEdge:
                    this.DeleteEdge(command);
                    break;
                case Commands.CommandType.DeleteModel:
                    this.DeleteModel(command);
                    break;
                case Commands.CommandType.DeleteNode:
                    this.DeleteNode(command);
                    break;
                case Commands.CommandType.DeleteConnectorProperty:
                    this.DeleteConnectorProperty(command);
                    break;
                case Commands.CommandType.DeleteEdgeProperty:
                    this.DeleteEdgeProperty(command);
                    break;
                case Commands.CommandType.DeleteModelProperty:
                    this.DeleteModelProperty(command);
                    break;
                case Commands.CommandType.DeleteNodeProperty:
                    this.DeleteNodeProperty(command);
                    break;
                case Commands.CommandType.SetConnectorProperty:
                    this.SetConnectorProperty(command);
                    break;
                case Commands.CommandType.SetEdgeProperty:
                    this.SetEdgeProperty(command);
                    break;
                case Commands.CommandType.SetModelProperty:
                    this.SetModelProperty(command);
                    break;
                case Commands.CommandType.SetNodeProperty:
                    this.SetNodeProperty(command);
                    break;
                default:
                    throw new Error("Invalid state");
            }
            this.version++;
        }
        catch (Error) {
            if (this.rollbackGraph != null) {
                this.Rollback();
            }
            throw Error;
        }
    };
    CQRSGraph.prototype.ApplyEvent = function (event) {
        try {
            switch (event.type) {
                case Events.EventType.ConnectorAdded:
                    this.AddConnector(event);
                    break;
                case Events.EventType.EdgeAdded:
                    this.AddEdge(event);
                    break;
                case Events.EventType.ModelAdded:
                    this.AddModel(event);
                    break;
                case Events.EventType.NodeAdded:
                    this.AddNode(event);
                    break;
                case Events.EventType.ConnectorDeleted:
                    this.DeleteConnector(event);
                    break;
                case Events.EventType.EdgeDeleted:
                    this.DeleteEdge(event);
                    break;
                case Events.EventType.ModelDeleted:
                    this.DeleteModel(event);
                    break;
                case Events.EventType.NodeDeleted:
                    this.DeleteNode(event);
                    break;
                case Events.EventType.ConnectorPropertySet:
                    this.SetConnectorProperty(event);
                    break;
                case Events.EventType.EdgePropertySet:
                    this.SetEdgeProperty(event);
                    break;
                case Events.EventType.ModelPropertySet:
                    this.SetModelProperty(event);
                    break;
                case Events.EventType.NodePropertySet:
                    this.SetNodeProperty(event);
                    break;
                case Events.EventType.ConnectorPropertyDeleted:
                    this.DeleteConnectorProperty(event);
                    break;
                case Events.EventType.EdgePropertyDeleted:
                    this.DeleteEdgeProperty(event);
                    break;
                case Events.EventType.ModelPropertyDeleted:
                    this.DeleteModelProperty(event);
                    break;
                case Events.EventType.NodePropertyDeleted:
                    this.DeleteNodeProperty(event);
                    break;
                default:
                    throw new Error("Unknown EventType");
            }
            this.version++;
        }
        catch (Error) {
            if (this.rollbackGraph != null) {
                this.Rollback();
            }
            throw Error;
        }
    };
    CQRSGraph.prototype.Rollback = function () {
        if (this.rollbackGraph == null) {
            throw new Error("No transaction has been started");
        }
        var tmpgraph = new cubitt_graph_1.Project();
        this.graph = tmpgraph.deserialize(tmpgraph);
        this.rollbackGraph = null;
        this.version = this.rollbackVersion;
        this.rollbackVersion = null;
    };
    CQRSGraph.prototype.Commit = function () {
        this.rollbackGraph = null;
        this.rollbackVersion = null;
    };
    CQRSGraph.prototype.GetGraph = function () {
        return this.graph.deserialize(this.graph.serialize());
    };
    CQRSGraph.prototype.GetVersion = function () {
        return this.version;
    };
    CQRSGraph.prototype.AddConnector = function (action) {
        if (this.graph.hasElement(action.elementId)) {
            throw new Error("ElementId is already in use");
        }
        if (this.graph.hasNode(action.nodeId) == false) {
            throw new Error("No node with " + action.nodeId + " exists");
        }
        this.graph.addConnector(action.elementId, action.elementType, action.nodeId, action.elementProperties);
    };
    CQRSGraph.prototype.AddEdge = function (action) {
        if (this.graph.hasElement(action.elementId)) {
            throw new Error("ElementId is already in use");
        }
        if (this.graph.hasConnector(action.startConnectorId) == false) {
            throw new Error("No connector with id " + action.startConnectorId + " exist");
        }
        if (this.graph.hasConnector(action.endConnectorId) == false) {
            throw new Error("No connector with id " + action.endConnectorId + " exist");
        }
        if (this.graph.hasModel(action.modelId) == false) {
            throw new Error("No model with id " + action.modelId + " exist");
        }
        this.graph.addEdge(action.elementId, action.elementType, action.modelId, action.startConnectorId, action.endConnectorId, action.elementProperties);
    };
    CQRSGraph.prototype.AddModel = function (action) {
        if (this.graph.hasElement(action.elementId)) {
            throw new Error("ElementId is already in use");
        }
        this.graph.addModel(action.elementId, action.elementType, action.elementProperties);
    };
    CQRSGraph.prototype.AddNode = function (action) {
        if (this.graph.hasElement(action.elementId)) {
            throw new Error("ElementId is already in use");
        }
        if (this.graph.hasModel(action.modelId) == false) {
            throw new Error("No model with Id" + action.modelId + " exists");
        }
        this.graph.addNode(action.elementId, action.elementType, action.modelId, action.elementProperties);
    };
    CQRSGraph.prototype.DeleteConnector = function (action) {
        if (this.graph.hasConnector(action.elementId) == false) {
            throw new Error("No Connector with Id " + action.elementId + " exists");
        }
        this.graph.deleteConnector(action.elementId);
    };
    CQRSGraph.prototype.DeleteEdge = function (action) {
        if (this.graph.hasEdge(action.elementId) == false) {
            throw new Error("No Edge with Id " + action.elementId + " exists");
        }
        this.graph.deleteEdge(action.elementId);
    };
    CQRSGraph.prototype.DeleteModel = function (action) {
        if (this.graph.hasModel(action.elementId) == false) {
            throw new Error("No Model with Id " + action.elementId + " exists");
        }
        this.graph.deleteModel(action.elementId);
    };
    CQRSGraph.prototype.DeleteNode = function (action) {
        if (this.graph.hasNode(action.elementId) == false) {
            throw new Error("No Node with Id " + action.elementId + " exists");
        }
        this.graph.deleteNode(action.elementId);
    };
    CQRSGraph.prototype.DeleteConnectorProperty = function (action) {
        if (this.graph.hasConnector(action.elementId) == false) {
            throw new Error("No Connector with Id " + action.elementId + " exists");
        }
        this.graph.deleteProperty(action.elementId, action.propertyName);
    };
    CQRSGraph.prototype.DeleteEdgeProperty = function (action) {
        if (this.graph.hasEdge(action.elementId) == false) {
            throw new Error("No Edge with Id " + action.elementId + " exists");
        }
        this.graph.deleteProperty(action.elementId, action.propertyName);
    };
    CQRSGraph.prototype.DeleteModelProperty = function (action) {
        if (this.graph.hasModel(action.elementId) == false) {
            throw new Error("No Model with Id " + action.elementId + " exists");
        }
        this.graph.deleteProperty(action.elementId, action.propertyName);
    };
    CQRSGraph.prototype.DeleteNodeProperty = function (action) {
        if (this.graph.hasNode(action.elementId) == false) {
            throw new Error("No Node with Id " + action.elementId + " exists");
        }
        this.graph.deleteProperty(action.elementId, action.propertyName);
    };
    CQRSGraph.prototype.SetConnectorProperty = function (action) {
        if (this.graph.hasConnector(action.elementId)) {
            throw new Error("No Connector with Id " + action.elementId + " exists");
        }
        this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
    };
    CQRSGraph.prototype.SetEdgeProperty = function (action) {
        if (this.graph.hasEdge(action.elementId)) {
            throw new Error("No Edge with Id " + action.elementId + " exists");
        }
        this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
    };
    CQRSGraph.prototype.SetModelProperty = function (action) {
        if (this.graph.hasModel(action.elementId)) {
            throw new Error("No Model with Id " + action.elementId + " exists");
        }
        this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
    };
    CQRSGraph.prototype.SetNodeProperty = function (action) {
        if (this.graph.hasNode(action.elementId)) {
            throw new Error("No Node with Id " + action.elementId + " exists");
        }
        this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
    };
    return CQRSGraph;
}());
exports.CQRSGraph = CQRSGraph;

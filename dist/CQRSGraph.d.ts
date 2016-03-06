import { GraphInterface } from "cubitt-graph";
import * as Commands from "cubitt-commands";
import * as Events from "cubitt-events";
export declare class CQRSGraph {
    private graph;
    private rollbackGraph;
    constructor(graph?: GraphInterface);
    beginTransaction(): void;
    ApplyCommand(command: Commands.Command): void;
    ApplyEvent(event: Events.Event): void;
    Rollback(): void;
    Commit(): void;
    protected AddConnector(action: Commands.AddConnectorCommand | Events.ConnectorAddedEvent): void;
    protected AddEdge(action: Commands.AddEdgeCommand | Events.EdgeAddedEvent): void;
    protected AddModel(action: Commands.AddModelCommand | Events.ModelAddedEvent): void;
    protected AddNode(action: Commands.AddNodeCommand | Events.NodeAddedEvent): void;
    protected DeleteConnector(action: Commands.DeleteConnectorCommand | Events.ConnectorDeletedEvent): void;
    protected DeleteEdge(action: Commands.DeleteEdgeCommand | Events.EdgeDeletedEvent): void;
    protected DeleteModel(action: Commands.DeleteModelCommand | Events.ModelDeletedEvent): void;
    protected DeleteNode(action: Commands.DeleteNodeCommand | Events.NodeDeletedEvent): void;
    protected DeleteConnectorProperty(action: Commands.DeleteConnectorPropertyCommand | Events.ConnectorPropertyDeletedEvent): void;
    protected DeleteEdgeProperty(action: Commands.DeleteEdgePropertyCommand | Events.EdgePropertyDeletedEvent): void;
    protected DeleteModelProperty(action: Commands.DeleteModelPropertyCommand | Events.ModelPropertyDeletedEvent): void;
    protected DeleteNodeProperty(action: Commands.DeleteNodePropertyCommand | Events.NodePropertyDeletedEvent): void;
    protected SetConnectorProperty(action: Commands.SetConnectorPropertyCommand | Events.ConnectorPropertySetEvent): void;
    protected SetEdgeProperty(action: Commands.SetEdgePropertyCommand | Events.EdgePropertySetEvent): void;
    protected SetModelProperty(action: Commands.SetModelPropertyCommand | Events.ModelPropertySetEvent): void;
    protected SetNodeProperty(action: Commands.SetNodePropertyCommand | Events.NodePropertySetEvent): void;
}

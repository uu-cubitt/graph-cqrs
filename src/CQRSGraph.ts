
import * as Graph from "cubitt-graph";
import * as Commands from "cubitt-commands";
import * as Events from "cubitt-events";

export class CQRSGraph {
	/**
	* Cubitt-Graph
	*/
	private graph: Graph.GraphInterface;

	/**
	 * Version number
	 */
	private version: number;

	/**
	 * Serialized Cubitt-Graph used for transaction support
	 *
	 */
	private rollbackGraph: Object;

	/**
	 * Version number used for rollback
	 *
	 *
	 */
	private rollbackVersion: number;

	/**
	 * Create a new CQRS Graph
	 *
	 * @param graph Pass an existing graph
	 * @param version Version number of the graph, default to 0 if no graph is passed
	 */
	constructor(graph ?: Graph.GraphInterface, version?: number) {
		if (typeof(graph) === "undefined" || graph === null) {
			this.graph = new Graph.Project();
			this.version = 0;
		} else {
			this.graph = graph;
			this.version = version;
		}
	}

	/**
	 * Returns a read-only copy of the Graph
	*/
	public GetGraph(): Graph.GraphInterface {
		return this.graph.deserialize(this.graph.serialize());
	}

	/**
	 * Returns the version of the Graph
	*/
	public GetVersion(): number {
		return this.version;
	}

	/**
	 * Starts a transaction
	 */
	public BeginTransaction(): void {
		if (this.rollbackGraph !== null) {
			throw new Error("CQRS ERROR: Transaction already in progress.");
		}
		this.rollbackGraph = this.graph.serialize();
		this.rollbackVersion = this.version;
	}

	/**
	 * Commits a transaction
	 */
	public CommitTransaction(): void {
		if (this.rollbackGraph === null) {
			throw new Error("CQRS ERROR: No transaction in progress.");
		}
		this.rollbackGraph = null;
		this.rollbackVersion = null;
	}

	/**
	 * Rolls back a transaction
	 */
	public Rollback(): void {
		if (this.rollbackGraph === null) {
			throw new Error("CQRS ERROR: No transaction in progress.");
		}
		this.graph = this.graph.deserialize(this.rollbackGraph);
		this.rollbackGraph = null;
		this.version = this.rollbackVersion;
		this.rollbackVersion = null;
	}

	/**
	 * Executes a Command
	 *
	 * @param command The command to execute
	 */
	public ApplyCommand(command: Commands.Command): void {
		try {
			switch (command.type) {
				case Commands.CommandType.AddConnector:
					this.AddConnector(<Commands.AddConnectorCommand> command);
					break;
				case Commands.CommandType.AddEdge:
					this.AddEdge(<Commands.AddEdgeCommand> command);
					break;
				case Commands.CommandType.AddModel:
					this.AddModel(<Commands.AddModelCommand> command);
					break;
				case Commands.CommandType.AddNode:
					this.AddNode(<Commands.AddNodeCommand> command);
					break;
				case Commands.CommandType.DeleteConnector:
					this.DeleteConnector(<Commands.DeleteConnectorCommand> command);
					break;
				case Commands.CommandType.DeleteEdge:
					this.DeleteEdge(<Commands.DeleteEdgeCommand> command);
					break;
				case Commands.CommandType.DeleteModel:
					this.DeleteModel(<Commands.DeleteModelCommand> command);
					break;
				case Commands.CommandType.DeleteNode:
					this.DeleteNode(<Commands.DeleteNodeCommand> command);
					break;
				case Commands.CommandType.DeleteConnectorProperty:
					this.DeleteConnectorProperty(<Commands.DeleteConnectorPropertyCommand> command);
					break;
				case Commands.CommandType.DeleteEdgeProperty:
					this.DeleteEdgeProperty(<Commands.DeleteEdgePropertyCommand> command);
					break;
				case Commands.CommandType.DeleteModelProperty:
					this.DeleteModelProperty(<Commands.DeleteModelPropertyCommand> command);
					break;
				case Commands.CommandType.DeleteNodeProperty:
					this.DeleteNodeProperty(<Commands.DeleteNodePropertyCommand> command);
					break;
				case Commands.CommandType.SetConnectorProperty:
					this.SetConnectorProperty(<Commands.SetConnectorPropertyCommand> command);
					break;
				case Commands.CommandType.SetEdgeProperty:
					this.SetEdgeProperty(<Commands.SetEdgePropertyCommand> command);
					break;
				case Commands.CommandType.SetModelProperty:
					this.SetModelProperty(<Commands.SetModelPropertyCommand> command);
					break;
				case Commands.CommandType.SetNodeProperty:
					this.SetNodeProperty(<Commands.SetNodePropertyCommand> command);
					break;
				default:
					throw new Error("Invalid state");
			}
			this.version++;
		} catch (error) {
			if (this.rollbackGraph !== null) {
			this.Rollback();
		}
			throw error;
		}
	}

	/**
	 * Applies an Event to the graph
	 *
	 * @param event The event to apply
	 */
	public ApplyEvent(event: Events.Event): void {
		try {
			switch (event.type) {
				case Events.EventType.ConnectorAdded:
					this.AddConnector(<Events.ConnectorAddedEvent> event);
					break;
				case Events.EventType.EdgeAdded:
					this.AddEdge(<Events.EdgeAddedEvent> event);
					break;
				case Events.EventType.ModelAdded:
					this.AddModel(<Events.ModelAddedEvent> event);
					break;
				case Events.EventType.NodeAdded:
					this.AddNode(<Events.NodeAddedEvent> event);
					break;
				case Events.EventType.ConnectorDeleted:
					this.DeleteConnector(<Events.ConnectorDeletedEvent> event);
					break;
				case Events.EventType.EdgeDeleted:
					this.DeleteEdge(<Events.EdgeDeletedEvent> event);
					break;
				case Events.EventType.ModelDeleted:
					this.DeleteModel(<Events.ModelDeletedEvent> event);
					break;
				case Events.EventType.NodeDeleted:
					this.DeleteNode(<Events.NodeDeletedEvent> event);
					break;
				case Events.EventType.ConnectorPropertySet:
					this.SetConnectorProperty(<Events.ConnectorPropertySetEvent> event);
					break;
				case Events.EventType.EdgePropertySet:
					this.SetEdgeProperty(<Events.EdgePropertySetEvent> event);
					break;
				case Events.EventType.ModelPropertySet:
					this.SetModelProperty(<Events.ModelPropertySetEvent> event);
					break;
				case Events.EventType.NodePropertySet:
					this.SetNodeProperty(<Events.NodePropertySetEvent> event);
					break;
				case Events.EventType.ConnectorPropertyDeleted:
					this.DeleteConnectorProperty(<Events.ConnectorPropertyDeletedEvent> event);
					break;
				case Events.EventType.EdgePropertyDeleted:
					this.DeleteEdgeProperty(<Events.EdgePropertyDeletedEvent> event);
					break;
				case Events.EventType.ModelPropertyDeleted:
					this.DeleteModelProperty(<Events.ModelPropertyDeletedEvent> event);
					break;
				case Events.EventType.NodePropertyDeleted:
					this.DeleteNodeProperty(<Events.NodePropertyDeletedEvent> event);
					break;
				default:
					throw new Error("Unknown EventType");
			}
			this.version++;
		} catch (error)	{
			if (this.rollbackGraph !== null) {
			this.Rollback();
		}
			throw error;
		}
	}

	/**
	 * Adds an connector
	 *
	 * @param command AddConnectorCommand
	 */
	protected AddConnector(action: Commands.AddConnectorCommand | Events.ConnectorAddedEvent): void {
		this.graph.addConnector(
			action.elementId,
			action.elementType,
			action.nodeId,
			action.elementProperties);
	}

	/**
	 * Adds an Edge
	 *
	 * @param action AddEdgeCommand or EdgeAddedEvent
	 */
	protected AddEdge(action: Commands.AddEdgeCommand | Events.EdgeAddedEvent): void {
		this.graph.addEdge(
			action.elementId,
			action.elementType,
			action.modelId,
			action.startConnectorId,
			action.endConnectorId,
			action.elementProperties);
	}

	/**
	 * Adds a Model
	 *
	 * @param command AddModelCommand
	 */
	protected AddModel(action: Commands.AddModelCommand | Events.ModelAddedEvent): void {
		this.graph.addModel(
			action.elementId,
			action.elementType,
			action.elementProperties);
	}

	/**
	 * Adds a node
	 *
	 * @param command AddNodeCommand
	 */
	protected AddNode(action: Commands.AddNodeCommand | Events.NodeAddedEvent): void {
		this.graph.addNode(
			action.elementId,
			action.elementType,
			action.modelId,
			action.elementProperties);
	}

	/**
	 * Deletes a connector
	 *
	 * @param command DeleteConnectorCommand
	 */
	protected DeleteConnector(action: Commands.DeleteConnectorCommand | Events.ConnectorDeletedEvent): void {
		this.graph.deleteConnector(action.elementId);
	}

	/**
	 * Deletes an edge
	 *
	 * @param command DeleteEdgeCommand
	 */
	protected DeleteEdge(action: Commands.DeleteEdgeCommand | Events.EdgeDeletedEvent): void {
		this.graph.deleteEdge(action.elementId);
	}

	/**
	 * Deletes a model
	 *
	 * @param command DeleteModelCommand
	 */
	protected DeleteModel(action: Commands.DeleteModelCommand | Events.ModelDeletedEvent): void {
		this.graph.deleteModel(action.elementId);
	}

	/**
	 * Deletes a node
	 *
	 * @param command DeleteNodeCommand
	 */
	protected DeleteNode(action: Commands.DeleteNodeCommand | Events.NodeDeletedEvent): void {
		this.graph.deleteNode(action.elementId);
	}

	/**
	 * Deletes a property of a connector
	 *
	 * @param command DeleteConnectorPropertyCommand
	 */
	protected DeleteConnectorProperty(action: Commands.DeleteConnectorPropertyCommand | Events.ConnectorPropertyDeletedEvent): void {
		this.graph.deleteProperty(action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of an edge
	 *
	 * @param command DeleteModelCommand
	 */
	protected DeleteEdgeProperty(action: Commands.DeleteEdgePropertyCommand | Events.EdgePropertyDeletedEvent): void {
		this.graph.deleteProperty(action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of a model
	 *
	 * @param command DeleteModelCommand
	 */
	protected DeleteModelProperty(action: Commands.DeleteModelPropertyCommand | Events.ModelPropertyDeletedEvent): void {
		this.graph.deleteProperty(action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of a node
	 *
	 * @param command DeleteNodeCommand
	 */
	protected DeleteNodeProperty(action: Commands.DeleteNodePropertyCommand | Events.NodePropertyDeletedEvent): void {
		this.graph.deleteProperty(action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of a connector
	 *
	 * @param command SetConnectorPropertyCommand
	 */
	protected SetConnectorProperty(action: Commands.SetConnectorPropertyCommand | Events.ConnectorPropertySetEvent): void {
		this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
	}

	/**
	 * Sets a property of an edge
	 *
	 * @param command SetEdgePropertyCommand
	 */
	protected SetEdgeProperty(action: Commands.SetEdgePropertyCommand | Events.EdgePropertySetEvent): void {
		this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
	}

	/**
	 * Sets a property of a model
	 *
	 * @param command SetModelPropertyCommand
	 */
	protected SetModelProperty(action: Commands.SetModelPropertyCommand | Events.ModelPropertySetEvent): void {
		this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
	}

	/**
	 * Sets a property of a node
	 *
	 * @param command SetNodePropertyCommand
	 */
	protected SetNodeProperty(action: Commands.SetNodePropertyCommand | Events.NodePropertySetEvent): void {
		this.graph.setProperty(action.elementId, action.propertyName, action.propertyValue);
	}
}


import * as Graph from "cubitt-graph";
import * as Common from "cubitt-common";
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
		this.rollbackGraph = null;
		this.rollbackVersion = null;
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
	public ApplyCommand(command: Commands.Command): Events.Event {
		switch (command.type) {
			case Commands.CommandType.AddConnector:
				let addConnectorCommand: Commands.AddConnectorCommand = <Commands.AddConnectorCommand> command;
				this.AddConnector(addConnectorCommand);
				this.version++;
				return new Events.ConnectorAddedEvent(
					<Common.Guid> addConnectorCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> addConnectorCommand.elementId,
					addConnectorCommand.elementType,
					addConnectorCommand.elementProperties,
					<Common.Guid> addConnectorCommand.nodeId);
			case Commands.CommandType.AddEdge:
				let addEdgeCommand: Commands.AddEdgeCommand = <Commands.AddEdgeCommand> command;
				this.AddEdge(addEdgeCommand);
				this.version++;
				return new Events.EdgeAddedEvent(
					<Common.Guid> addEdgeCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> addEdgeCommand.elementId,
					addEdgeCommand.elementType,
					addEdgeCommand.elementProperties,
					<Common.Guid> addEdgeCommand.modelId,
					<Common.Guid> addEdgeCommand.startConnectorId,
					<Common.Guid> addEdgeCommand.endConnectorId
				);
			case Commands.CommandType.AddModel:
				let addModelCommand: Commands.AddModelCommand = <Commands.AddModelCommand> command;
				this.AddModel(addModelCommand);
				this.version++;
				return new Events.ModelAddedEvent(
					<Common.Guid> addModelCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> addModelCommand.elementId,
					addModelCommand.elementType,
					addModelCommand.elementProperties,
					<Common.Guid> addModelCommand.ParentId
				);
			case Commands.CommandType.AddNode:
				let addNodeCommand: Commands.AddNodeCommand = <Commands.AddNodeCommand> command;
				this.AddNode(addNodeCommand);
				this.version++;
				return new Events.NodeAddedEvent(
					<Common.Guid> addNodeCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> addNodeCommand.elementId,
					addNodeCommand.elementType,
					addNodeCommand.elementProperties,
					<Common.Guid> addNodeCommand.modelId
				);
			case Commands.CommandType.DeleteConnector:
				let deleteConnectorCommand: Commands.DeleteConnectorCommand = <Commands.DeleteConnectorCommand> command;
				this.DeleteConnector(deleteConnectorCommand);
				this.version++;
				return new Events.ConnectorDeletedEvent(
					<Common.Guid> deleteConnectorCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteConnectorCommand.elementId
				);
			case Commands.CommandType.DeleteEdge:
				let deleteEdgeCommand: Commands.DeleteEdgeCommand = <Commands.DeleteEdgeCommand> command;
				this.DeleteEdge(deleteEdgeCommand);
				this.version++;
				return new Events.EdgeDeletedEvent(
					<Common.Guid> deleteEdgeCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteEdgeCommand.elementId
				);
			case Commands.CommandType.DeleteModel:
				let deleteModelCommand: Commands.DeleteModelCommand = <Commands.DeleteModelCommand> command;
				this.DeleteModel(deleteModelCommand);
				this.version++;
				return new Events.ModelDeletedEvent(
					<Common.Guid> deleteModelCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteModelCommand.elementId
				);
			case Commands.CommandType.DeleteNode:
				let deleteNodeCommand: Commands.DeleteNodeCommand = <Commands.DeleteNodeCommand> command;
				this.DeleteNode(deleteNodeCommand);
				this.version++;
				return new Events.NodeDeletedEvent(
					<Common.Guid> deleteNodeCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteNodeCommand.elementId
				);
			case Commands.CommandType.DeleteConnectorProperty:
				let deleteConnectorPropertyCommand: Commands.DeleteConnectorPropertyCommand = <Commands.DeleteConnectorPropertyCommand> command;
				this.DeleteConnectorProperty(deleteConnectorPropertyCommand);
				this.version++;
				return new Events.ConnectorPropertyDeletedEvent(
					<Common.Guid> deleteConnectorPropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteConnectorPropertyCommand.elementId,
					deleteConnectorPropertyCommand.propertyName
				);
			case Commands.CommandType.DeleteEdgeProperty:
				let deleteEdgePropertyCommand: Commands.DeleteEdgePropertyCommand = <Commands.DeleteEdgePropertyCommand> command;
				this.DeleteEdgeProperty(deleteEdgePropertyCommand);
				this.version++;
				return new Events.EdgePropertyDeletedEvent(
					<Common.Guid> deleteEdgePropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteEdgePropertyCommand.elementId,
					deleteEdgePropertyCommand.propertyName
				);
			case Commands.CommandType.DeleteModelProperty:
				let deleteModelPropertyCommand: Commands.DeleteModelPropertyCommand = <Commands.DeleteModelPropertyCommand> command;
				this.DeleteModelProperty(deleteModelPropertyCommand);
				this.version++;
				return new Events.ModelPropertyDeletedEvent(
					<Common.Guid> deleteModelPropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteModelPropertyCommand.elementId,
					deleteModelPropertyCommand.propertyName
				);
			case Commands.CommandType.DeleteNodeProperty:
				let deleteNodeProperty: Commands.DeleteNodePropertyCommand = <Commands.DeleteNodePropertyCommand> command;
				this.DeleteNodeProperty(deleteNodeProperty);
				this.version++;
				return new Events.NodePropertyDeletedEvent(
					<Common.Guid> deleteNodeProperty.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> deleteNodeProperty.elementId,
					deleteNodeProperty.propertyName
				);
			case Commands.CommandType.SetConnectorProperty:
				let setConnectorPropertyCommand: Commands.SetConnectorPropertyCommand = <Commands.SetConnectorPropertyCommand> command;
				this.SetConnectorProperty(setConnectorPropertyCommand);
				this.version++;
				return new Events.ConnectorPropertySetEvent(
					<Common.Guid> setConnectorPropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> setConnectorPropertyCommand.elementId,
					setConnectorPropertyCommand.propertyName,
					setConnectorPropertyCommand.propertyValue
				);
			case Commands.CommandType.SetEdgeProperty:
				let setEdgePropertyCommand: Commands.SetEdgePropertyCommand = <Commands.SetEdgePropertyCommand> command;
				this.SetEdgeProperty(setEdgePropertyCommand);
				this.version++;
				return new Events.EdgePropertySetEvent(
					<Common.Guid> setEdgePropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> setEdgePropertyCommand.elementId,
					setEdgePropertyCommand.propertyName,
					setEdgePropertyCommand.propertyValue
				);
			case Commands.CommandType.SetModelProperty:
				let setModelPropertyCommand: Commands.SetModelPropertyCommand = <Commands.SetModelPropertyCommand> command;
				this.SetModelProperty(setModelPropertyCommand);
				this.version++;
				return new Events.ModelPropertySetEvent(
					<Common.Guid> setModelPropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> setModelPropertyCommand.elementId,
					setModelPropertyCommand.propertyName,
					setModelPropertyCommand.propertyValue
				);
			case Commands.CommandType.SetNodeProperty:
				let setNodePropertyCommand: Commands.SetNodePropertyCommand = <Commands.SetNodePropertyCommand> command;
				this.SetNodeProperty(setNodePropertyCommand);
				this.version++;
				return new Events.NodePropertySetEvent(
					<Common.Guid> setNodePropertyCommand.id,
					this.version - 1,
					Date.now(),
					<Common.Guid> setNodePropertyCommand.elementId,
					setNodePropertyCommand.propertyName,
					setNodePropertyCommand.propertyValue
				);
			default:
				throw new Error("CQRS ERROR: Command of type: " + command.type + " cannot be applied.");
		}
	}

	/**
	 * Applies an Event to the graph
	 *
	 * @param event The event to apply
	 */
	public ApplyEvent(event: Events.Event): void {
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
				throw new Error("CQRS ERROR: Event of type: " + event.type + " cannot be applied.");
		}
		this.version++;
	}

	/**
	 * Adds an connector
	 *
	 * @param command AddConnectorCommand
	 */
	protected AddConnector(action: Commands.AddConnectorCommand | Events.ConnectorAddedEvent): void {
		this.graph.addConnector(
			<Common.Guid> action.elementId,
			action.elementType,
			<Common.Guid> action.nodeId,
			action.elementProperties);
	}

	/**
	 * Adds an Edge
	 *
	 * @param action AddEdgeCommand or EdgeAddedEvent
	 */
	protected AddEdge(action: Commands.AddEdgeCommand | Events.EdgeAddedEvent): void {
		this.graph.addEdge(
			<Common.Guid> action.elementId,
			action.elementType,
			<Common.Guid> action.modelId,
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
			<Common.Guid> action.elementId,
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
			<Common.Guid> action.elementId,
			action.elementType,
			<Common.Guid> action.modelId,
			action.elementProperties);
	}

	/**
	 * Deletes a connector
	 *
	 * @param command DeleteConnectorCommand
	 */
	protected DeleteConnector(action: Commands.DeleteConnectorCommand | Events.ConnectorDeletedEvent): void {
		this.graph.deleteConnector(<Common.Guid> action.elementId);
	}

	/**
	 * Deletes an edge
	 *
	 * @param command DeleteEdgeCommand
	 */
	protected DeleteEdge(action: Commands.DeleteEdgeCommand | Events.EdgeDeletedEvent): void {
		this.graph.deleteEdge(<Common.Guid> action.elementId);
	}

	/**
	 * Deletes a model
	 *
	 * @param command DeleteModelCommand
	 */
	protected DeleteModel(action: Commands.DeleteModelCommand | Events.ModelDeletedEvent): void {
		this.graph.deleteModel(<Common.Guid> action.elementId);
	}

	/**
	 * Deletes a node
	 *
	 * @param command DeleteNodeCommand
	 */
	protected DeleteNode(action: Commands.DeleteNodeCommand | Events.NodeDeletedEvent): void {
		this.graph.deleteNode(<Common.Guid> action.elementId);
	}

	/**
	 * Deletes a property of a connector
	 *
	 * @param command DeleteConnectorPropertyCommand
	 */
	protected DeleteConnectorProperty(action: Commands.DeleteConnectorPropertyCommand | Events.ConnectorPropertyDeletedEvent): void {
		this.graph.deleteProperty(<Common.Guid> action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of an edge
	 *
	 * @param command DeleteModelCommand
	 */
	protected DeleteEdgeProperty(action: Commands.DeleteEdgePropertyCommand | Events.EdgePropertyDeletedEvent): void {
		this.graph.deleteProperty(<Common.Guid> action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of a model
	 *
	 * @param command DeleteModelCommand
	 */
	protected DeleteModelProperty(action: Commands.DeleteModelPropertyCommand | Events.ModelPropertyDeletedEvent): void {
		this.graph.deleteProperty(<Common.Guid> action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of a node
	 *
	 * @param command DeleteNodeCommand
	 */
	protected DeleteNodeProperty(action: Commands.DeleteNodePropertyCommand | Events.NodePropertyDeletedEvent): void {
		this.graph.deleteProperty(<Common.Guid> action.elementId, action.propertyName);
	}

	/**
	 * Deletes a property of a connector
	 *
	 * @param command SetConnectorPropertyCommand
	 */
	protected SetConnectorProperty(action: Commands.SetConnectorPropertyCommand | Events.ConnectorPropertySetEvent): void {
		this.graph.setProperty(<Common.Guid> action.elementId, action.propertyName, action.propertyValue);
	}

	/**
	 * Sets a property of an edge
	 *
	 * @param command SetEdgePropertyCommand
	 */
	protected SetEdgeProperty(action: Commands.SetEdgePropertyCommand | Events.EdgePropertySetEvent): void {
		this.graph.setProperty(<Common.Guid> action.elementId, action.propertyName, action.propertyValue);
	}

	/**
	 * Sets a property of a model
	 *
	 * @param command SetModelPropertyCommand
	 */
	protected SetModelProperty(action: Commands.SetModelPropertyCommand | Events.ModelPropertySetEvent): void {
		this.graph.setProperty(<Common.Guid> action.elementId, action.propertyName, action.propertyValue);
	}

	/**
	 * Sets a property of a node
	 *
	 * @param command SetNodePropertyCommand
	 */
	protected SetNodeProperty(action: Commands.SetNodePropertyCommand | Events.NodePropertySetEvent): void {
		this.graph.setProperty(<Common.Guid> action.elementId, action.propertyName, action.propertyValue);
	}
}

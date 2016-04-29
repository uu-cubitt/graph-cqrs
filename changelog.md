# Changelog

## 0.6.0

- General CQRS wrapper for graph implemented.

## 0.6.1

- Added ```GetGraph()``` method to retrieve the graph.

## 0.6.2

- Fixed bug with transaction rollback.
- Introduced Changelog.

## 0.7.0

- ApplyCommand now returns an event to pass along to the EventStore.

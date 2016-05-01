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

## 0.8.0

- Uses the new 1.0.0 versions of events,commands and common, however because of low code coverage, we'll release this one as 0.8.0

## 0.8.1
- Fixed bug with regards to starting transaction from empty graph

## 0.9.0
- Removed automatic rollback in ApplyCommand and ApplyEvent

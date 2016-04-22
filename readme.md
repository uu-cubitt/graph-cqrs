# Cubitt Graph-CQRS

CQRS interface to cubitt-graph

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/uu-cubitt/graph/master/LICENSE)
[![npm version](https://badge.fury.io/js/cubitt-graph-cqrs.svg)](https://badge.fury.io/js/cubitt-graph-cqrs)
[![Build Status](https://travis-ci.org/uu-cubitt/graph-cqrs.svg?branch=master)](https://travis-ci.org/uu-cubitt/graph-cqrs)
[![Test Coverage](https://codeclimate.com/github/uu-cubitt/graph-cqrs/badges/coverage.svg)](https://codeclimate.com/github/uu-cubitt/graph-cqrs/coverage)

## About

This package provides a CQRS interface to cubitt-graph, allowing for manipulation of the graph by Commands and Events

## Features

* CQRS Graph interface
* Transaction/Rollback/Commit support
* Auto-rollback on transaction failure

## Usage

Install the package and use it in your code.

```bash
npm install cubitt-graph-cqrs
```

```typescript
import {CQRSGraph} from "cubitt-cqrs-graph";

let myCQRSGraph = new CQRSGraph();
```

## Documentation

* [Code documentation](https://uu-cubitt.github.io/graph-cqrs/)
* [Design documentation](https://uu-cubitt.github.io/graph-cqrs/design/)

## For developers

To get started:

```bash
npm run dev
```

To run the unit tests:

```bash
npm run test
```

To generate a test coverage report:

```bash
npm run test-coverage
```

To generate documentation:

```bash
npm run typedoc
```

## License

[MIT](LICENSE)

## Changelog

[Changelog](changelog.md)

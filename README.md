# gRPC Relay

This repository contains a gRPC client and server written in TypeScript. The purpose of this application is to serve as a reference implementation for the article:

[Load Balancing gRPC Traffic with Istio](https://dev.to/visepol/load-balancing-grpc-traffic-with-istio-1k49) on Dev.to.

## Overview

The project demonstrates how to implement and test gRPC communication in a microservices environment. It includes:

A gRPC server that exposes RPC methods.
A gRPC client that interacts with the server.
Generate gRPC Types using npm run generate-grpc-types.

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn
- Docker (optional, for containerized deployment)
- Kubernetes with Istio (for testing load balancing)

### Installation

Clone the repository:

```sh
git clone https://github.com/visepol/grpc-relay.git
cd grpc-relay
```

Install dependencies:

```sh
npm install
# or
yarn install
```

### Generating gRPC Types

Run the following command to generate gRPC TypeScript types:

```sh
npm run generate-grpc-types`
```

### Running the Server

Start the gRPC server:

```sh
npm run start:server
# or
yarn start:server
```

### Running the Client

Start the gRPC client:

```sh
npm run start:client
# or
yarn start:client
```

## Deploying with Istio

To test load balancing with Istio, follow the steps in the Dev.to article, which provides a detailed guide on setting up Kubernetes and Istio for this project.

Project Structure

```sh
grpc-relay/
│── src/
│   ├── client/         # gRPC Client implementation
│   ├── server/         # gRPC Server implementation
│   └── proto/          # Protocol Buffers definitions
│── Dockerfile          # Docker setup
│── package.json        # Dependencies and scripts
│── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

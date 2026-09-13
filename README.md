# gRPC Relay

This repository contains a gRPC client and server written in TypeScript. The purpose of this application is to serve as a reference implementation for the article:

[Load Balancing gRPC Traffic with Istio](https://dev.to/visepol/load-balancing-grpc-traffic-with-istio-1k49) on Dev.to.

A copy of the article is kept in this repository at [`docs/load-balancing-grpc-istio.md`](./docs/load-balancing-grpc-istio.md), images included, so it stays readable if the original link ever goes away.

## Overview

The project demonstrates why gRPC traffic is not balanced by a plain Kubernetes Service, and how an Istio sidecar fixes it.

Because gRPC runs over HTTP/2, the client keeps a single long-lived connection open. A Kubernetes Service balances at L4, so it picks a backend pod once — when the connection is established — and every later request rides that same connection to the same pod. Istio's Envoy sidecar balances at L7, per request.

To make this visible, each server process generates a UUID at startup and includes it in every reply. The client calls the server every 10 seconds and logs the reply:

- Without Istio: every reply carries the **same** UUID — a single pod is serving everything.
- With Istio: replies carry **different** UUIDs — requests are spread across the server replicas.

About the name: it refers to the Envoy sidecar relaying gRPC requests across server
replicas — the application itself is a plain client/server pair and does not forward
traffic anywhere.

## Getting Started

### Prerequisites

- Node.js 20 (the version used in the `Dockerfile`)
- npm
- Docker (to build the images)
- Kubernetes with Istio (MicroK8s is used in the article)

> **Tested environment:** this setup has only been reproduced on Linux x86_64.
> Other platforms are untested.

### Installation

Clone the repository:

```sh
git clone https://github.com/visepol/grpc-relay.git
cd grpc-relay
```

Install dependencies:

```sh
npm install
```

### Generating gRPC Types

The generated stubs are not committed. Generate them into `generated/` before running anything:

```sh
npm run generate-grpc-types
```

### Running the Server

```sh
npm run server
```

The server listens on `0.0.0.0:50051` using insecure credentials.

### Running the Client

```sh
npm run client
```

The client resolves the server through the in-cluster Service DNS name
`grpc-service.$K8S_NAMESPACE.svc.cluster.local:50051`, so it is meant to run inside
the cluster, where `K8S_NAMESPACE` is injected by the Deployment. To run it against a
local server, set the variable and point the address at your server.

## Deploying with Istio

A single image definition serves both roles — `APP_MODE` selects which npm script the
container runs:

```sh
docker build -t grpc-server:local --build-arg APP_MODE=server .
docker build -t grpc-client:local --build-arg APP_MODE=client .
```

The manifests use `imagePullPolicy: Never`, so the images must be available to the
cluster's container runtime rather than pulled from a registry. Then apply them to a
namespace labeled with `istio-injection: enabled`:

```sh
kubectl apply -f ./kubernetes -n <namespace>
```

`kubernetes/deployment.yaml` runs 1 client and 2 server replicas, which is what makes
the load balancing behavior observable in the client logs. The Service port is named
`grpc-port`: the `grpc` prefix is how Istio detects the protocol and applies L7 routing.

Follow the article for the full walkthrough, including the MicroK8s and Istio setup —
either [on Dev.to](https://dev.to/visepol/load-balancing-grpc-traffic-with-istio-1k49) or in the
[local copy](./docs/load-balancing-grpc-istio.md).

## Project Structure

```sh
grpc-relay/
│── _server.ts             # gRPC server implementation
│── _client.ts             # gRPC client implementation
│── example.proto          # Protocol Buffers definition
│── generated/             # Generated gRPC stubs (created by generate-grpc-types)
│── kubernetes/            # Deployment and Service manifests
│── docs/                  # Local copy of the Dev.to article + its images
│── Dockerfile             # Docker setup (APP_MODE selects server or client)
│── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

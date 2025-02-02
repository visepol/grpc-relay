import * as grpc from '@grpc/grpc-js'
import { ExampleClient } from './generated/example_grpc_pb'
import { DataRequest } from './generated/example_pb'

/**
 * Creates a new gRPC client for the ExampleService.
 * @type {ExampleClient}
 */
const client: ExampleClient = new ExampleClient(
  `grpc-service.${process.env.K8S_NAMESPACE}.svc.cluster.local:50051`,
  grpc.credentials.createInsecure(),
)

/**
 * Creates a new DataRequest object.
 * @type {DataRequest}
 */
const request: DataRequest = new DataRequest()

/**
 * Sends a message to the gRPC server every 10 seconds.
 */
setInterval(() => {
  request.setMessage('Hello, gRPC!')
  client.sendData(request, (error, response) => {
    if (error) {
      console.error(error)
      return
    }

    console.log(`Server reply:`, response.getReply())
  })
}, 10 * 1000)

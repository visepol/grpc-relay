import * as grpc from '@grpc/grpc-js'
import { IExampleServer, ExampleService } from './generated/example_grpc_pb'
import { DataResponse } from './generated/example_pb'
import { randomUUID } from 'crypto'

const uuid = randomUUID()

/**
 * Implements the ExampleService defined in the proto file.
 * @type {IExampleServer}
 */
const exampleService: IExampleServer = {
  /**
   * Handles the sendData RPC call.
   * @param {grpc.ServerUnaryCall<DataRequest, DataResponse>} call - The call object containing the request.
   * @param {grpc.sendUnaryData<DataResponse>} callback - The callback to send the response.
   */
  sendData: (call, callback) => {
    console.log('Received message:', call.request.getMessage())
    const response = new DataResponse()
    response.setReply(
      `Hello, I'm ${uuid}. You sent: ${call.request.getMessage()}`,
    )
    callback(null, response)
  },
}

const server = new grpc.Server()

/**
 * Adds the ExampleService to the gRPC server.
 */
server.addService(ExampleService, exampleService)

/**
 * Binds the server to the specified address and starts it.
 */
server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(
      "Hold tight, the server's running smoother than a race car on a straight track. 🏎️💨",
    )
  },
)

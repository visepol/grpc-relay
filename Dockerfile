FROM node:20

COPY . .

RUN npm install
RUN npm run generate-grpc-types

EXPOSE 50051

CMD npm run ${APP_MODE}

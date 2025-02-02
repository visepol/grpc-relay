FROM node:20

ARG APP_MODE
ENV APP_MODE=${APP_MODE}

COPY . .

RUN npm install
RUN npm run generate-grpc-types

EXPOSE 50051

RUN echo "APP_MODE during build: ${APP_MODE}"

CMD npm run ${APP_MODE}

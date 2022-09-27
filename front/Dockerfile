FROM node:16-alpine3.16

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json server.js /app/
RUN npm install --legacy-peer-deps --only=prod
COPY . /app
RUN npm run build

CMD node ./server.js

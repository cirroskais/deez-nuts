FROM "node:lts-alpine3.18"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]
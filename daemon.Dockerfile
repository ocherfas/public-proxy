FROM node:11
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY local-daemon ./local-daemon
RUN npm install

CMD ["npm", "run", "daemon"]
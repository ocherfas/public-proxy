FROM node:11
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY proxy ./proxy
RUN npm install
EXPOSE 3000

CMD ["npm", "run", "proxy"]
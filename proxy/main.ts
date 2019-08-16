import express from 'express';
import bodyParser from 'body-parser';
import get from 'lodash/get'
const bearerToken = require('express-bearer-token');

import proxy from 'http-proxy-middleware';
import { NextFunction } from 'connect';

const app = express();

const apiKey = process.env.API_KEY;
const port = process.env.PORT ? process.env.PORT : 3000;

let ipAddress;

app.use('/transmission', (req, res, next) => {
    if(ipAddress){
        return proxy({
            target: `http://${ipAddress}:9091/transmission/rpc`,
            logLevel: "silent"
        })(req, res, next);
    }
    else {
        res.sendStatus(500);
    }
});

const apiKeyAuthentication = (req: express.Request, res: express.Response, next: NextFunction) => { 
    const token = (req as any).token;
    if(token !== apiKey){
        res.sendStatus(403);
    }
    else {
        next();
    }
}

app.post('/transmission-url', bearerToken(), apiKeyAuthentication, bodyParser.json(), (req, res) => {
    const address = get(req, 'body.address', ipAddress);
    ipAddress = address;
    console.log(`updated address to ${ipAddress}`);
    res.sendStatus(201);
})

app.listen(port);
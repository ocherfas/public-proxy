import express from 'express';
import bodyParser from 'body-parser';
import get from 'lodash/get'
import expressJWT from 'express-jwt';

import proxy from 'http-proxy-middleware';

const app = express();

const secret = process.env.SECRET;

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

app.post('/transmission-url', expressJWT({secret: secret}), bodyParser.json(), (req, res) => {
    const address = get(req, 'body.address', ipAddress);
    ipAddress = address;
    console.log(`updated address to ${ipAddress}`);
    res.sendStatus(201);
})

app.listen(3000);
import express from 'express';
import bodyParser from 'body-parser';
import get from 'lodash/get'
import expressJWT from 'express-jwt';

import proxy from 'http-proxy-middleware';

const app = express();

const secret = process.env.SECRET;
console.log(secret);

let ipAddress = '10.100.102.2';

app.use('/transmission', (req, res, next) => {
    return proxy({
        target: `http://${ipAddress}:9091/transmission/rpc`,
        logLevel: "silent"
    })(req, res, next);
});

app.post('/transmission-url', expressJWT({secret: secret}), bodyParser.json(), (req, res) => {
    const address = get(req, 'body.address', ipAddress);
    ipAddress = address;
    res.sendStatus(201);
})

app.listen(3000);
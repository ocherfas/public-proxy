import request from 'request-promise';
import publicIp from 'public-ip';
import cron from 'cron';

const access_token = process.env.ACCESS_TOKEN;
const proxyUrl = process.env.PROXY_URL;

const defaultOptions = {
    uri: proxyUrl,
    json: true
}

async function runOnce(){
    console.log('one run');
    const ip = await publicIp.v4();
    const requestOptions = {
        ...defaultOptions,
        auth: {bearer: access_token},
        body: {address: ip}
    }

    await request.post(requestOptions);
}

const cronJob = new cron.CronJob('*/5 * * * * *', runOnce);

cronJob.start();
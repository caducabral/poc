const https = require('https');
var request = require('request');
const fs = require('fs');

function getOptionsXML(url, method) {
    const options = {
        host: process.env.BACEN_URI,
        port: process.env.BACEN_PORT,
        path: url,
        method: method,
        headers: {
            'Authorization': 'Basic ' + new Buffer.from(process.env.BACEN_USER + ':' + process.env.BACEN_PASS).toString('base64'),
            'Content-Type': 'application/xml',
        }
    }
    return options;
}

function getOptionsFile(uri, method, file) {
    const options = {
        url: 'https://'+process.env.BACEN_URI + uri,
        method: method,
        headers: {
            'Authorization': 'Basic ' + new Buffer.from(process.env.BACEN_USER + ':' + process.env.BACEN_PASS).toString('base64')
        },
        body: fs.createReadStream(file)
    }
    return options;
}


function sendRequestProtocol(xml) {
    return new Promise((resolve, reject) => {
        const req = https.request(getOptionsXML('/staws/arquivos', 'post'), res => {
            res.setEncoding('utf8');
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                console.log('terminou');
                resolve(responseBody);
            });
        });
        req.on('error', (err) => {
            console.log('Deu erro');
            reject(err);
        });

        req.write(xml)
        req.end();
    });
}

function sendFile(protocolo, file) {

    request(getOptionsFile('/staws/arquivos/' + protocolo + '/conteudo', 'put', file), function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });

    /*
    return new Promise((resolve, reject) => {
        const req = https.request(getOptionsFile('/staws/arquivos/' + protocolo + '/conteudo', 'put', file), res => {
            res.setEncoding('utf8');
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                console.log('terminou');
                resolve(responseBody);
            });
        });
        req.on('error', (err) => {
            console.log('Deu erro');
            console.log(err);
            reject(err);
        });

        req.write("");
        req.end();
    });
    */
}


module.exports = {
    sendRequestProtocol: sendRequestProtocol,
    sendFile: sendFile
}
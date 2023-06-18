const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
let browser = null;
const fullDirectoryPath = path.join(__dirname, '../pdf/');
// const startBrowser = async ()=>
// { 

// }
// startBrowser()
app.get('/', async (req, res) => {
    // await browser.close();
    res.send('Hello World!');
});
app.post('/send-cv', async (req, res) => {
    console.log('data_receiveid');
    browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    const cvData = JSON.parse(req.body.cv_data);
    console.log(req.body);
    const cvName = req.body.cv_name;
    await page.evaluate((data) => {
        window.__RESUME_DATA__ = data;
    }, cvData);
    await page.goto(`http://localhost:${config.dev.port}/#/resume/${cvName}`, {
        waitUntil: 'networkidle2'
    });

    if (
        !fs.existsSync(fullDirectoryPath)
    ) {
        fs.mkdirSync(fullDirectoryPath);
    }
    await page.pdf({
        path: `${fullDirectoryPath}${cvData.PERSON.contact.email}.pdf`,
        format: 'A4'
    });
    page.close();
    // await browser.close();
    res.send('Hello World!');
});
  
app.listen(config.dev.apiPort, () => {
    console.log(`Example app listening on port ${config.dev.apiPort}`);
});
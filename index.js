process.env.NTBA_FIX_319 = 1;
// import chalk from 'chalk'
// import { parse } from 'node-html-parser';
// import { getPageContent } from './helpers/puppeteer'
const url = require('url');
require('dotenv').config();
// const request = require('request');
const fetch = require('node-fetch');
// const fs = require('fs');
// const bytes = require('bytes');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TG_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

validURL('anonfiles.com/RbO4rdT2me/Spotify_Premium_Accounts_Total_32K_txt')

// bot.on('message', (msg) => {
//     console.log(msg.text);
//     getFileId(msg.text);
// });

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    // console.log(!!pattern.test(str));
    // console.log(`HTTP: ${str.startsWith("http")}`)
    if (!!pattern.test(str)) {
        (str.startsWith("http") ? getFileId(str) : getFileId("https://" + str))
    } else {
        console.log('Wrong link!')
    }
    // return !!pattern.test(str);
}


function getFileId(link) {
    let LINK = new URL(link);
    if (LINK.host.includes("anonfiles.com")) {
        console.log("Yes, the link is correct");
    } else { console.log('Not the anonfiles.com link!')}
    // console.log(LINK.host, LINK.pathname);
    // console.log(`File ID: ${LINK.pathname.substr(1, 10)}`);
    fileCheck(LINK.pathname.substr(1, 10));
    // return (LINK.pathname.substr(1, 10));
}



function fileCheck(id) {
    fetch(`https://api.anonfiles.com/v2/file/${id}/info`)
        .then(res => res.json())
        .then(response => { 
            let res = response.data.file
            // console.log(response.data) 
            console.log(`FIle Size (bytes): ${res.metadata.size.bytes}\nFile Size: ${res.metadata.size.readable}\nFile ID: ${res.metadata.id}`)
        
        });
}

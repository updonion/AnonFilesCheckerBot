process.env.NTBA_FIX_319 = 1;
const url = require('url');
require('dotenv').config();
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TG_BOT_TOKEN;
const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const bot = new TelegramBot(token, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})
const cheerio = require('cheerio');
var path = require('path');


bot.on('message', (msg) => {
    let MY_LIST = msg.text;
    bot.deleteMessage(msg.from.id, msg.message_id);
    linksToArray(MY_LIST, msg);
    // console.log(msg)
});



bot.on("polling_error", console.log);

// MY_LIST = 'anonfiles.com/RbO4rdT2me/Spotify_Premium_Accounts_Total_32K_txt     \n \n        https://anonfiles.com/vbD1rfs1u8/14k_txt     \n       https://anonfiles.com/30Wbkf3epd/RU_WOT_txt\n https://anonfiles.com/p6j46eAfp2/de_txt'

rs = /[\ ]+/g // replace space



function linksToArray(list, msg) {
    // console.log(list);
    listWithoutSpaces = list.replace(rs, '');
    arrList = listWithoutSpaces.split(`\n`);
    for (i in arrList) {
        // console.log(`${i}. ${arrList[i]}`)
        validURL(arrList[i], msg)
    }
}




function validURL(str, msg) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!!pattern.test(str)) {
        (str.startsWith("http") ? getFileId(str, msg) : getFileId(`https://${str}`, msg))
    } else {
        console.log('Wrong link!')
    }
    // return !!pattern.test(str);
}


function getFileId(link, msg) {
    let LINK = new URL(link);
    if (LINK.host.includes("anonfiles.com")) {
        // console.log("Yes, the link is correct");
    } else { console.log('Not the anonfiles.com link!') }
    fileCheck(LINK.pathname.substr(1, 10), msg);
}



function fileCheck(id, msg) {
    fetch(`https://api.anonfiles.com/v2/file/${id}/info`)
        .then(res => res.json())
        .then(response => {
            let res = response.data.file;
            global.res;
            // console.log(`File name: ${res.metadata.name}\nFIle Size (bytes): ${res.metadata.size.bytes}\nFile Size: ${res.metadata.size.readable}\nFile ID: ${res.metadata.id}\n*******************\n\n`)
            getDownloadLink(res, msg)
        });

}


function getDownloadLink(jsonAPIresponse, msg) {
    fetch(`https://anonfiles.com/${jsonAPIresponse.metadata.id}/`).then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (htmlPageWithDownloadLink) {

        let $ = cheerio.load(htmlPageWithDownloadLink)
        let downloadLink = $('#download-url').attr('href');
        let filename = path.basename(downloadLink)
        bot.sendMessage(msg.from.id, downloadLink.replace(filename, ""), {// `[${filename}](${downloadLink.replace(filename, "")}) (${jsonAPIresponse.metadata.size.readable})`, {
            parse_mode: 'Markdown'
        });

    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

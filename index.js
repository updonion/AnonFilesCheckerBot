process.env.NTBA_FIX_319 = 1;
const url = require('url');
require('dotenv').config();
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TG_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

MY_LIST = 'anonfiles.com/RbO4rdT2me/Spotify_Premium_Accounts_Total_32K_txt     \n         https://anonfiles.com/vbD1rfs1u8/14k_txt     \n       https://anonfiles.com/30Wbkf3epd/RU_WOT_txt\n https://anonfiles.com/p6j46eAfp2/de_txt'

rs = /[\ ]+/g // replace space

linksToArray(MY_LIST)

function linksToArray(list){
    console.log(list);
    listWithoutSpaces = list.replace(rs, '');
    arrList = listWithoutSpaces.split(`\n`); 
    for (i in arrList) {
        console.log(`${i}. ${arrList[i]}`)
        validURL(arrList[i])
    }
}


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
    fileCheck(LINK.pathname.substr(1, 10));
}



function fileCheck(id) {
    fetch(`https://api.anonfiles.com/v2/file/${id}/info`)
        .then(res => res.json())
        .then(response => { 
            let res = response.data.file
            console.log(`File name: ${res.metadata.name}\nFIle Size (bytes): ${res.metadata.size.bytes}\nFile Size: ${res.metadata.size.readable}\nFile ID: ${res.metadata.id}\n*******************\n\n`)
        
        });
}

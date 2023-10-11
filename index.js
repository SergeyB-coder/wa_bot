const fs = require('fs')
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');


const path = require('path');

const { APP_PORT, APP_IP, APP_PATH } = process.env;

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/static/uploads');
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
const bodyParser = require('body-parser');


const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// var http = require('http').createServer(app);

app.listen(443, APP_IP, () => {
    console.log(`Example app listening on port ${APP_PORT}`)
})

// const igor = '79611601191@c.us'
// const emir = '905360679598@c.us'
// const emir = '79024050778@c.us'
// const katya = '79301200905@c.us'

const superadmin = '79611601191@c.us'
const superadmin2 = '79024050778@c.us'
const admin = '79108257989@c.us'

// mma chat
const mustafa = '905327372393@c.us'
const yusuf = '905355472205@c.us'

// Deutz Bismarck chat
const emir = '905366260799@c.us'

//  Zetech Jhon Deer 3
const ali = '905327431514@c.us'

//  BERQ Perkins Liebherr
const berq = '905077049490@c.us'

//  CAT Original / OEM
const israfil = '905354983977@c.us'

//  Liebherr Original / TM
const mehmet = '905442846832@c.us'

//  Jhon Deer Original China
const daisy = '8617365374867@c.us'

//  Bosch Denso Iveco Scania Daf Reno
const ozlem = '905301697987@c.us'

const url = 'https://testapi.na4u.ru'

const extentions = {
    'image/jpeg': 'jpg',
    'video/mp4': 'mp4'
}

function sendMessageToServer(pars, callback) {
    console.log('sendMessageToServer')
    fetch(url + '/wamessage', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        // .then((response) => response.json())
        .then((data) => {
            // console.log('data login', data)

            return callback('data')
        });
}

function sendFileToServer(pars, callback) {
    console.log('sendFileToServer', pars)
    fetch(url + '/wafile', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data login', data)

            return callback(data)
        });
}

// testBdServer({ mess: 'hi' }, () => { })

function getStopWords() {
    return fs.readFileSync('./test.txt', 'utf8').toString().split('\n')
}

function checkWordIsStop(message) {
    let stop_word = ''
    console.log('checkWordIsStop', message)
    const stop_words = getStopWords()
    console.log('checkWordIsStop', stop_words)
    let no_stop = true
    stop_words.forEach((word, index) => {
        if (word !== '') no_stop = no_stop && !message.toLowerCase().includes(word)
        console.log('check word ', word, no_stop)

        if (!no_stop && word !== '') stop_word = word
    });
    console.log('checkword', message, stop_word)
    return stop_word
}

function addNewStopWord(new_word) {
    fs.appendFile('./test.txt', '\n' + new_word.toLowerCase(), (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('success add new word: ', new_word)
    })
}

const users = {
    1: 'Emir',
    3: 'Yusuf',
    4: 'Mustafa',
    5: 'Ali',
    6: 'BERQ',
    7: 'Israfil',
    8: 'Mehmet',
    9: 'Daisy',
    10: 'Ozlem'
}

const chats = ['Mma', 'Deutz Bismarck', 'Zetech Jhon Deer', 'BERQ Perkins Liebherr', 'CAT Original / OEM', 'Liebherr Original / TM', 'Jhon Deer Original China', 'Bosch Denso Iveco Scania Daf Reno']

async function checkMedia(message, user_id, chat_id) {
    if (message.hasMedia) {

        try {
            const media = await message.downloadMedia();
            console.log('file data: ', media.mimetype)

            // sendToUser(superadmin, '*' + chats[chat_id] + users[user_id] + ':* ');
            // sendToUser(superadmin, media);

            let filename = ''
            if (media.filename) filename = 'file' + Math.round(Math.random() * 1E9) + media.filename
            else filename = 'file' + Math.round(Math.random() * 1E9) + '.' + extentions[media.mimetype]
            fs.writeFile(
                "./public/static/uploads/" + filename,
                media.data,
                "base64",
                function (err) {
                    if (err) {
                        console.log('err', err);
                    }
                    else {
                        sendFileToServer({
                            text: filename,
                            user_id: user_id,
                            chat_id: chat_id
                        }, (data) => {

                        })
                    }
                }
            );
        }
        catch { }
    }

}

const client = new Client(
    {
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
            executablePath: '/usr/bin/google-chrome-stable'
        }
    }
);

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    // console.log('message', message)

    let is_message = true
    if (message.from === admin) {
        if (message.body.length > 3) {
            if (message.body.slice(0, 3) === '*7#') {
                is_message = false
                const new_word = message.body.slice(3)
                addNewStopWord(new_word)
            }
        }
    }


    if (is_message) {
        const text = message.body
        if (message.from === yusuf) {
            checkMedia(message, 3, 1)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+igor);
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 3,
                    chat_id: 1
                }, (data) => {

                })

                // sendToUser(superadmin, '*Mma (Yusuf):* ' + text);
            }
        }

        else if (message.from === mustafa) {
            checkMedia(message, 4, 1)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: ' + stop_word);

            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 4,
                    chat_id: 1
                }, (data) => {

                })

                // client.sendMessage(superadmin, '*Mma (Mustafa):* ' + text);
            }
        }

        else if (message.from === emir) {
            checkMedia(message, 1, 2)
            console.log('message.from', emir)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 1,
                    chat_id: 2
                }, (data) => {

                })

                console.log('sendMessage to admin ', emir)

                // client.sendMessage(superadmin, '*Deutz Bismarck (Emir):* ' + text);
                // client.sendMessage(superadmin2, '*Deutz Bismarck (Emir):* ' + text);
            }
        }

        else if (message.from === ali) {
            checkMedia(message, 5, 3)
            console.log('message.from', ali)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Ali in message: ' + message.body + '\nCHAT - Zetech Jhon Deer: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 5,
                    chat_id: 3
                }, (data) => {

                })

                console.log('sendMessage to admin ', ali)

                // client.sendMessage(superadmin, '*Zetech Jhon Deer (Ali):* ' + text);
                // client.sendMessage(superadmin2, '*Zetech Jhon Deer (Ali):* ' + text);
            }
        }

        else if (message.from === berq) {
            checkMedia(message, 6, 4)
            console.log('message.from', berq)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Berq in message: ' + message.body + '\nCHAT -  BERQ Perkins Liebherr: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 6,
                    chat_id: 4
                }, (data) => {

                })

                console.log('sendMessage to admin ', berq)

                // client.sendMessage(superadmin, '*BERQ Perkins Liebherr:* ' + text);
                // client.sendMessage(superadmin2, '*BERQ Perkins Liebherr:* ' + text);
            }
        }

        else if (message.from === israfil) {
            checkMedia(message, 7, 5)
            console.log('message.from', israfil)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Israfil in message: ' + message.body + '\nCHAT -  CAT Original / OEM: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 7,
                    chat_id: 5
                }, (data) => {

                })

                console.log('sendMessage to admin ', israfil)

                // client.sendMessage(superadmin, '*CAT Original / OEM (israfil):* ' + text);
                // client.sendMessage(superadmin2, '*CAT Original / OEM (israfil):* ' + text);
            }
        }

        else if (message.from === mehmet) {
            checkMedia(message, 8, 6)
            console.log('message.from', mehmet)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from mehmet in message: ' + message.body + '\nCHAT -  Liebherr Original / TM: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 8,
                    chat_id: 6
                }, (data) => {

                })

                console.log('sendMessage to admin ', mehmet)

                // client.sendMessage(superadmin, '*Liebherr Original / TM (mehmet):* ' + text);
                // client.sendMessage(superadmin2, '*Liebherr Original / TM (mehmet):* ' + text);
            }
        }

        else if (message.from === daisy) {
            checkMedia(message, 9, 7)
            console.log('message.from', daisy)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from daisy in message: ' + message.body + '\nCHAT -  Jhon Deer Original China: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 9,
                    chat_id: 7
                }, (data) => {

                })

                console.log('sendMessage to admin ', daisy)

                // client.sendMessage(superadmin, '*Jhon Deer Original China (daisy):* ' + text);
                // client.sendMessage(superadmin2, '*Jhon Deer Original China (daisy):* ' + text);
            }
        }

        else if (message.from === ozlem) {
            checkMedia(message, 10, 8)
            console.log('message.from', ozlem)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from ozlem in message: ' + message.body + '\nCHAT -  Bosch Denso Iveco Scania Daf Reno: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 10,
                    chat_id: 8
                }, (data) => {

                })

                console.log('sendMessage to admin ', ozlem)

                // client.sendMessage(superadmin, '*Bosch Denso Iveco Scania Daf Reno (Ozlem):* ' + text);
                // client.sendMessage(superadmin2, '*Bosch Denso Iveco Scania Daf Reno (Ozlem):* ' + text);
            }
        }

        else if (message.from === superadmin2) {
            checkMedia(message, 11, 9)
            console.log('message.from', superadmin2)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from ozlem in message: ' + message.body + '\nCHAT -  Bosch Denso Iveco Scania Daf Reno: ' + stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {

                sendMessageToServer({
                    text: message.body,
                    user_id: 11,
                    chat_id: 9
                }, (data) => {

                })

                console.log('sendMessage to admin ', ozlem)

                // client.sendMessage(superadmin, '*Bosch Denso Iveco Scania Daf Reno (Ozlem):* ' + text);
                // client.sendMessage(superadmin2, '*Bosch Denso Iveco Scania Daf Reno (Ozlem):* ' + text);
            }
        }

        // else if (message.from === superadmin2) {
        //     checkMedia(message, 1, 2)
        //     console.log('message.from ', superadmin2)

        //     let stop_word = checkWordIsStop(message.body)
        //     if (stop_word) {
        //         client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: ' + stop_word);
        //         // client.sendMessage(superadmin, 'ATTENTION'+emir);
        //         console.log('stopword')
        //     }
        //     else {

        //         sendMessageToServer({
        //             text: message.body,
        //             user_id: 1,
        //             chat_id: 2
        //         }, (data) => {

        //         })

        //         // client.sendMessage(superadmin, '*Deutz Bismarck (Sergey):* ' + text);
        //     }
        // }

    }


});

client.initialize();

function sendToUser(user, text) {
    // let time_random = Math.round(Math.random() * 30000)
    // setTimeout(client.sendMessage(user, text), time_random)
    console.log('sendToUser', text)
    client.sendMessage(user, text)
}

app.post('/', upload.single('avatar'), function (req, res, next) {
    console.log('sendmessage', req.body)
    const chat_id = parseInt(req.body.chat_id)
    const text = req.body.text

    if (chat_id === 1) {
        console.log('sendmessage to chat mma', chat_id)

        // client.sendMessage(yusuf, text);
        sendToUser(mustafa, text);
        // sendToUser()

        // client.sendMessage(superadmin, '*Mma (Katya):* ' + text);
        // client.sendMessage(superadmin2, '*Mma (Katya):* ' + text);
    }
    else if (chat_id === 2) {
        console.log('sendmessage to chat bismark', chat_id)
        sendToUser(emir, text);
        // sendToUser(superadmin, '*Deutz Bismarck (Katya):* ' + text);
        // sendToUser(superadmin2, '*Deutz Bismarck (Katya):* ' + text);
    }
    else if (chat_id === 3) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(ali, text);
        // sendToUser(superadmin, '*Zetech Jhon Deer (Katya):* ' + text);
        // sendToUser(superadmin2, '*Zetech Jhon Deer (Katya):* ' + text);
    }
    else if (chat_id === 4) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(berq, text);
        // sendToUser(superadmin, '*BERQ Perkins Liebherr (Katya):* ' + text);
        // sendToUser(superadmin2, '*BERQ Perkins Liebherr (Katya):* ' + text);
    }
    else if (chat_id === 5) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(israfil, text);
        // sendToUser(superadmin, '*CAT Original / OEM (Katya):* ' + text);
        // sendToUser(superadmin2, '*CAT Original / OEM (Katya):* ' + text);
    }
    else if (chat_id === 6) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(mehmet, text);
        // sendToUser(superadmin, '*Liebherr Original / TM (Katya):* ' + text);
        // sendToUser(superadmin2, '*Liebherr Original / TM (Katya):* ' + text);
    }
    else if (chat_id === 7) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(daisy, text);
        // sendToUser(superadmin, '*Jhon Deer Original China (Katya):* ' + text);
        // sendToUser(superadmin2, '*Jhon Deer Original China (Katya):* ' + text);
    }
    else if (chat_id === 8) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(ozlem, text);
        // sendToUser(superadmin, '*Bosch Denso Iveco Scania Daf Reno (Katya):* ' + text);
        // sendToUser(superadmin2, '*Bosch Denso Iveco Scania Daf Reno (Katya):* ' + text);
    }
    else if (chat_id === 9) {
        console.log('sendmessage to chat', chat_id)
        sendToUser(superadmin2, text);
        // sendToUser(superadmin, '*Bosch Denso Iveco Scania Daf Reno (Katya):* ' + text);
        // sendToUser(superadmin2, '*Bosch Denso Iveco Scania Daf Reno (Katya):* ' + text);
    }
    else console.log('no chats')
    // res.send({ 'res': true })
}
)



app.post('/file', upload.single('message_file'), function (req, res, next) {
    
    const file = req.file;
    const chat_id = req.body.chat_id
    console.log('file: ', file.filename, chat_id)

    const media = MessageMedia.fromFilePath('./public/static/uploads/' + file.filename);

    if (chat_id === 1) {
        sendToUser(yusuf, media);
        // sendToUser(mustafa, media);

        // sendToUser(superadmin, '*Mma (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 2) {
        sendToUser(emir, media);

        // sendToUser(superadmin, '*Deutz Bismarck (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 3) {
        sendToUser(ali, media);

        // sendToUser(superadmin, '*Zetech Jhon Deer (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 4) {
        sendToUser(berq, media);

        // sendToUser(superadmin, '*BERQ Perkins Liebherr (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 5) {
        sendToUser(israfil, media);

        // sendToUser(superadmin, '*CAT Original / OEM (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 6) {
        sendToUser(mehmet, media);

        // sendToUser(superadmin, '*Liebherr Original / TM (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 7) {
        sendToUser(daisy, media);

        // sendToUser(superadmin, '*Jhon Deer Original China (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 8) {
        sendToUser(ozlem, media);

        // sendToUser(superadmin, '*Bosch Denso Iveco Scania Daf Reno (Katya):* ');
        // sendToUser(superadmin, media);
    }
    else if (chat_id === 9) {
        sendToUser(superadmin2, media);

        // sendToUser(superadmin, '*Bosch Denso Iveco Scania Daf Reno (Katya):* ');
        // sendToUser(superadmin, media);
    }
    // sendToUser(superadmin, media);
    // res.send({ res: 'good' })
})
// v10

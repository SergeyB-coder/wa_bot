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

app.listen(3000, APP_IP, () => {
    console.log(`Example app listening on port ${APP_PORT}`)
})

// const igor = '79611601191@c.us'
// const emir = '905360679598@c.us'
// const emir = '79024050778@c.us'
// const katya = '79301200905@c.us'

const superadmin = '79611601191@c.us'
const admin = '79108257989@c.us'

// mma chat
const mustafa = '905327372393@c.us'
const yusuf =   '905355472205@c.us'

// Deutz Bismarck chat
const emir = '905360679598@c.us'

const url = 'https://testapi.na4u.ru'

const extentions = {
    'image/jpeg': 'jpg'
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
        .then((response) => response.json())
        .then((data) => {
            console.log('data login', data)

            return callback(data)
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
    4: 'Mustafa'
}

const chats = ['Mma', 'Deutz Bismarck']

async function checkMedia(message, user_id, chat_id) {
    if (message.hasMedia) {
        const media = await message.downloadMedia();
        console.log('file data: ', media.mimetype)
        
        client.sendMessage(superadmin, '*' + chats[chat_id] + users[user_id] + ':* ');
        client.sendMessage(superadmin, media);

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
    console.log('message', message)

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

                client.sendMessage(superadmin, '*Mma (Yusuf):* ' + text);
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

                client.sendMessage(superadmin, '*Mma (Mustafa):* ' + text);
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

                client.sendMessage(superadmin, '*Deutz Bismarck (Emir):* ' + text);
            }
        }
    }


});

client.initialize();

app.post('/', upload.single('avatar'), function (req, res, next) {
    console.log('sendmessage', req.body)
    const chat_id = parseInt(req.body.chat_id)
    const text = req.body.text

    if (chat_id === 1) {
        client.sendMessage(yusuf, text);
        client.sendMessage(mustafa, text);

        client.sendMessage(superadmin, '*Mma (Katya):* ' + text);
    }
    else if (chat_id === 2) {
        client.sendMessage(emir, text);
        client.sendMessage(superadmin, '*Deutz Bismarck (Katya):* ' + text);
    }
    res.send({ 'res': true })
}
)



app.post('/file', upload.single('message_file'), function (req, res, next) {
    console.log('file: ', req.body)
    const file = req.file;
    const chat_id = req.body.chat_id


    const media = MessageMedia.fromFilePath('./public/static/uploads/' + file.filename);

    if (chat_id === 1) {
        client.sendMessage(yusuf, media);
        client.sendMessage(mustafa, media);

        client.sendMessage(superadmin, '*Mma (Katya):* ');
        client.sendMessage(superadmin, media);
    }
    else if (chat_id === 2) {
        client.sendMessage(emir, media);

        client.sendMessage(superadmin, '*Deutz Bismarck (Katya):* ');
        client.sendMessage(superadmin, media);
    }
    // client.sendMessage(superadmin, media);
    res.send({ res: 'good' })
})
// v8

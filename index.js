const fs = require('fs')
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

let XLSX = require('xlsx')

const path = require('path');

const { APP_PORT, APP_IP, APP_PATH } = process.env;

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/static/uploads');
    },
    filename: function (req, file, cb) {
        // console.log('file.mimetype', file.mimetype)
        // let extArray = file.mimetype.split("/");
        // let extension = extArray[extArray.length - 1];

        let ss = Buffer.from(file.originalname, 'latin1').toString('utf8')
        // const ind = ss.lastIndexOf('.')
        // cb(null, ss.slice(0, ind) + '_' + Date.now() + ss.slice(ind));

        console.log('file', file, ss)
        // cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        cb(null, ss);
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

// AGRITECH (Perkins/JD/NEWHOLAND/FERGUSSON)
const maisa = '905531440187@c.us'

// Аналоги Komatsu/CAT/Hitach (Китай)
const lidia = '8618053788901@c.us'

// ZEN аналоги (CAT/KOMATSU) Турция
const hamza = '905342367393@c.us'

const chat_user = {
    1: mustafa,
    2: emir,
    3: ali,
    4: berq,
    5: israfil,
    6: mehmet,
    7: daisy,
    8: ozlem,
    9: superadmin2,
    10: maisa,
    11: lidia,
    12: hamza
}

const user_chat = ['', mustafa, emir, ali, berq, israfil, mehmet, daisy, ozlem, superadmin2, maisa, lidia, hamza]

// const url = 'https://testapi.na4u.ru'
const url = 'https://techstimul.na4u.ru'

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
    // console.log('sendFileToServer', pars)
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
            // console.log('data login', data)

            return callback(data)
        });
}

function sendServerOn() {
    console.log('sendServerOn')
    fetch(url + '/serveron', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
        
        .then((data) => {
        });
}

function getContentXlsx(filePath) {
    let workbook = XLSX.readFile( filePath );
    let sheet_name_list = workbook.SheetNames;
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const file_content = JSON.stringify(xlData)
    return file_content
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

const users = ['', emir, '', yusuf, mustafa, ali, berq, israfil, mehmet, daisy, ozlem, superadmin2, '', maisa, lidia, hamza ]

const chats = ['Mma', 'Deutz Bismarck', 'Zetech Jhon Deer', 'BERQ Perkins Liebherr', 'CAT Original / OEM', 'Liebherr Original / TM', 'Jhon Deer Original China', 'Bosch Denso Iveco Scania Daf Reno']

async function checkMedia(message, user_id, chat_id) {
    if (message.hasMedia) {

        try {
            const media = await message.downloadMedia();
            console.log('file data: ', media.mimetype)



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
                        let file_content = ''
                        if ( filename.indexOf('xlsx') !== -1 ) file_content = getContentXlsx("./public/static/uploads/" + filename)
                        sendFileToServer({
                            text: filename,
                            user_id: user_id,
                            chat_id: chat_id,
                            file_content: file_content
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
    sendServerOn()
});

client.on('message', message => {
    try {
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
            if (users.indexOf(message.from) !== -1 && user_chat.indexOf(message.from) !== -1) {
                checkMedia(message, users.indexOf(message.from), user_chat.indexOf(message.from))

                let stop_word = checkWordIsStop(message.body)
                if (stop_word) {
                    client.sendMessage(admin, `ATTENTION!!! stop word from ${message.from} in message: ${message.body}\nCHAT - ${user_chat.indexOf(message.from)}: ${stop_word}`);
                }
                else {
                    let quoted_id = ''
                    if (message.hasQuotedMsg) quoted_id = message._data.quotedStanzaID
                    sendMessageToServer({
                        text: message.body,
                        user_id: users.indexOf(message.from),
                        chat_id: user_chat.indexOf(message.from),
                        serialized_id: message.id._serialized,
                        message_id: message.id.id,
                        quoted_id: quoted_id
                    }, (data) => {

                    })
                }
            }
        }
    }
    catch {
        console.log(9)
    }
});

client.initialize();

function sendToUser(user, text, serialized_id, callback) {
    console.log('serialized_id ', serialized_id)
    if (serialized_id) {
        client.sendMessage(user, text, { quotedMessageId: serialized_id })
            .then((msg) => {
                const message_id = msg.id.id
                const serialized_id = msg.id._serialized
                return callback({ message_id: message_id, serialized_id: serialized_id })
            })
    }
    else {
        client.sendMessage(user, text)
            .then((msg) => {
                console.log('msg.id._serialized ', msg.id._serialized)
                const message_id = msg.id.id
                const serialized_id = msg.id._serialized
                return callback({ message_id: message_id, serialized_id: serialized_id })
            })
    }
}


app.post('/', upload.single('avatar'), function (req, res, next) {
    // console.log('sendmessage', req.body)
    const chat_id = parseInt(req.body.chat_id)
    const text = req.body.text
    const serialized_id = req.body.serialized_id

    if (chat_user[chat_id]) {
        console.log('sendmessage to chat ', chat_id)
        sendToUser(chat_user[chat_id], text, serialized_id, (data) => {
            res.send({ message_id: data.message_id, serialized_id: data.serialized_id })
        });
    }
    else console.log('no chats')
}
)



app.post('/file', upload.single('message_file'), function (req, res, next) {
    const file = req.file;
    const chat_id = parseInt(req.body.chat_id)
    const serialized_id = ''

    if (req.file) {
        const media = MessageMedia.fromFilePath('./public/static/uploads/' + file.filename);

        if (chat_user[chat_id]) {
            sendToUser(chat_user[chat_id], media, serialized_id, (data) => {
                res.send({ message_id: data.message_id, serialized_id: data.serialized_id })
            });
        }
    }
})
// v16

const fs = require('fs')
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const admin = '79108257989@c.us'
// const admin = '79024050778@c.us'
const igor = '79611601191@c.us'
const emir = '905360679598@c.us'
const katya = '79301200905@c.us'

const superadmin = '79024050778@c.us'

const url = 'http://testapi.na4u.ru/'

function testBdServer(pars, callback) {
    fetch(url + '/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data login', data)
            
            return callback(data)
        });
}

testBdServer({mess: 'hi'}, () => {})

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
        if (word !== '')  no_stop = no_stop && !message.toLowerCase().includes(word)
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

async function checkMedia (message, to) {
    if(message.hasMedia) {
        const media = await message.downloadMedia();
        client.sendMessage(to, media);
        // client.sendMessage(superadmin, media);
    }

}

const client = new Client(
    {
        authStrategy: new LocalAuth(),
        puppeteer: { 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
            // executablePath: '/usr/bin/google-chrome-stable'
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
        if (message.from === igor) {
            checkMedia(message, emir)
            checkMedia(message, katya)
            console.log('message.from', igor)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: '+ stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+igor);
            }
            else {
                let mess = '*Igor:* ' + message.body
                client.sendMessage(emir, mess);
                client.sendMessage(katya, mess);

                // client.sendMessage(superadmin, mess);
            }
        }

        else if (message.from === emir) {
            checkMedia(message, igor)
            checkMedia(message, katya)
            console.log('message.from', emir)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: '+ stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {
                let mess = '*Emir:* ' + message.body
                client.sendMessage(igor, mess);
                client.sendMessage(katya, mess);
                console.log('mess to igor')
                

                // client.sendMessage(superadmin, mess);
            }
        }

        else if (message.from === katya) {
            checkMedia(message, igor)
            checkMedia(message, emir)
            console.log('message.from', katya)

            let stop_word = checkWordIsStop(message.body)
            if (stop_word) {
                client.sendMessage(admin, 'ATTENTION!!! stop word from Igor in message: ' + message.body + '\nCHAT - Deutz Vosda MMA: '+ stop_word);
                // client.sendMessage(superadmin, 'ATTENTION'+emir);
                console.log('stopword')
            }
            else {
                let mess = '*Katya:* ' + message.body
                client.sendMessage(igor, mess);
                client.sendMessage(emir, mess);
                console.log('mess to igor')
                

                // client.sendMessage(superadmin, mess);
            }
        }
    }


});

client.initialize();

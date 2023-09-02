const qrcode = require('qrcode-terminal');

let q = 0

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client(
    {
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox'],
        }
    }
);

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    console.log('message', message)
    if (message.from === '79884054121@c.us') {
        client.sendMessage('79504460593@c.us', 'pong');
    }
    q++;
	// console.log(message.body);
    // message.reply('Сама ты ' + message.body + q.toString());
});
 

client.initialize();
 
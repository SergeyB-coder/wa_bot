const qrcode = require('qrcode-terminal');

let q = 0

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client(
    {
        authStrategy: new LocalAuth(),
        puppeteer: { headless: true ,args: ['--no-sandbox','--disable-setuid-sandbox'] }
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
    if (message.from === '79159975804@c.us') {
        let mess = 'Igor2: ' + message.body
        client.sendMessage('79611601191@c.us', mess);
        client.sendMessage('79884054121@c.us', mess);
    }
    else if (message.from === '79611601191@c.us') {
        let mess = 'Igor1: ' + message.body
        client.sendMessage('79159975804@c.us', mess);
        client.sendMessage('79884054121@c.us', mess);
    }
    else if (message.from === '79884054121@c.us') {
        let mess = 'Admin: ' + message.body
        client.sendMessage('79159975804@c.us', mess);
        client.sendMessage('79611601191@c.us', mess);
        client.sendMessage('79504460593@c.us', mess);
    }
    q++;
	// console.log(message.body);
    // message.reply('Сама ты ' + message.body + q.toString());
});
 

client.initialize();
 
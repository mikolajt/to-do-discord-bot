let Discord = require('discord.js');
let auth = require('./auth.json');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Hello World!\nLogged in as ${client.user.tag}!`);
    client.user.setAvatar(`./resources/images/alfred_avatar.png`);
});

client.on('message', msg => {
    if(msg.content === 'ping') {
        msg.reply('pong');
    }
});

client.login(auth.token);
const Discord = require('discord.js'),
      auth = require('./auth.json'),
      client = new Discord.Client();

let prefix = 'Alfred, ',
    lists = [];

function toDoList(name)
{
    this.name = name;
    this.tasks = [];
}

function task(content)
{
    this.content = content;
    this.isCompleted = false;
}

client.on('ready', () => 
{
    console.log(`Hello World!\nLogged in as ${client.user.tag}!`);
    client.user.setAvatar(`./resources/images/alfred_avatar.png`);
});

client.on('message', msg => 
{

    if(msg.content === prefix + 'ping') 
    {
        msg.reply('pong');
    }
    else if(msg.content.startsWith(prefix + 'create to do list '))
    {
        let list_name = msg.content.split('list ')[1];
        lists.push(new toDoList(list_name));
        msg.reply('List ' + list_name + ' created, Sir');
    }
    else if(msg.content === prefix + 'show me all lists')
    {
        msg.reply('All lists, Sir\n')
        for(let i = 0; i < lists.length; i++) 
        {
            msg.reply('[' + (i + 1) + '] ' + lists[i].name + '\n');
        };
    }
    
});

client.login(auth.token);
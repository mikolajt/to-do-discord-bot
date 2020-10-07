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
    //ping pong
    if(msg.content === prefix + 'ping') 
    {
        msg.reply('pong');
    }
    else if (msg.content === prefix + 'pong')
    {
        msg.reply('ping');
    }
    //Creating new list e.g. Alfred, create list [list name]
    else if(msg.content.startsWith(prefix + 'create list '))
    {
        let list_name = msg.content.split('list ')[1];
        lists.push(new toDoList(list_name));
        msg.reply('List ' + list_name + ' created, Sir');
    }
    //Display lists e.g. Alfred, show me all lists
    else if(msg.content === prefix + 'show me all lists')
    {
        msg.reply('All lists, Sir\n')
        for(let i = 0; i < lists.length; i++) 
        {
            msg.reply('[' + (i + 1) + '] ' + lists[i].name + '\n');
        };
    }
    //Delete list e.g. Alfred, delete list [list name]
    else if(msg.content.startsWith(prefix + 'delete list '))
    {
        let list_name = msg.content.split('list ')[1];
        for(var i = 0; i < lists.length; i++)
        {
            if(lists[i].name == list_name)
            {
                break;
            }
        }
        lists.splice(index, i);  
        msg.reply('List ' + list_name + ' deleted, Sir');
    }
    //Adding task to list e.g. Alfred, add "[task name]" to [list name]
    //TODO: deleting "" from task name
    else if (msg.content.startsWith(prefix + 'add "'))
    {
        let list_exists = false;
        let list_name = msg.content.split('to ')[1];
        let task_name = msg.content.match(/"(.*)"/)//.toString();
        task_name = task_name[0].slice(1, -1);
        for(var i = 0; i < lists.length; i++)
        {
            if(lists[i].name == list_name)
            {
                list_exists = true;
                lists[i].tasks.push(new task(task_name));
            }
        }
        if(list_exists)
        {
            msg.reply('Task ' + task_name + ' added to list ' + list_name + ', Sir' );
        }
        else 
        {
            msg.reply("This list doesn't exists, Sir");
        }
    }
    else if (msg.content.startsWith(prefix))
    {
        msg.reply("Sorry, I do not understand, Sir");
    }
});

client.login(auth.token);
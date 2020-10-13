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
        let isUnique = true;
        for(let i = 0; i < lists.length; i++) 
        {
            if(lists[i].name == list_name)
            {
                isUnique = false;
                break;
            }
        };
        if(isUnique == true)
        {
            lists.push(new toDoList(list_name));
            msg.reply('List ' + list_name + ' created, Sir');
        }
        else
        {
            msg.reply('List with this name already exists, Sir');
        }
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
    else if (msg.content.startsWith(prefix + 'add "'))
    {
        let list_exists = false;
        let list_name = msg.content.split('to ')[1];
        let task_name = msg.content.match(/"(.*)"/);
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

    //Displaying tasks in list e.g Alfred, show me [list name]
    else if (msg.content.startsWith(prefix + 'show me '))
    {
        let list_name = msg.content.split('me ')[1];
        let exists = false;
        for(let i = 0; i < lists.length; i++) 
        {
            if(list_name === lists[i].name)
            {
                exists = true;
                msg.reply('Tasks from ' + list_name + ', Sir');
                lists[i].tasks.forEach(task => {
                    if (task.isCompleted == true)
                    {
                        msg.reply(':white_check_mark: ' + task.content);
                    }
                    else 
                    {
                        msg.reply(':x: ' + task.content);
                    }
                });
                break;
            }
        }
        if (exists == false)
        {
           msg.reply('List with given name didin\'t exists, Sir'); 
        }
    }

    //Complete task e.g Alfred, complete "[task name]" from [list name]
    else if(msg.content.startsWith(prefix + 'complete "'))
    {
        let list_exists = false;
        let task_exists = false;
        let list_name = msg.content.split('from ')[1];
        let task_name = msg.content.match(/"(.*)"/);
        task_name = task_name[0].slice(1, -1);
        for(var i = 0; i < lists.length; i++)
        {
            if(lists[i].name == list_name)
            {
                list_exists = true;
                lists[i].tasks.forEach(task => {
                    if(task.content == task_name)
                    {
                        task_exists = true;
                        task.isCompleted = true;
                    }
                });
            }
        }
        if(list_exists && task_exists)
        {
            msg.reply('Task ' + task_name + ' completed, Sir' );
        }
        else if (!list_exists)
        {
            msg.reply("This list doesn't exists, Sir");
        }
        else if(!task_exists)
        {
            msg.reply("This task doesn't exists, Sir");
        }
    }

    //Unkonwn command
    else if (msg.content.startsWith(prefix))
    {
        msg.reply("Sorry, I do not understand, Sir");
    }
});

client.login(auth.token);
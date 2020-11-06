const Discord = require('discord.js'),
      auth = require('./auth.json'),
      fs = require('fs');
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

function saveToFile(message)
{
    let jsonLists = JSON.stringify(lists);
    let fileName = 'data/' + message.guild.id + '_list.json';

    fs.writeFile(fileName, jsonLists, function(err)
    {
        if(err)
        {
            console.log(err);
        }
    });
}

//TODO: parse json to lists
function readFromFile(message, callback)
{
    let jsonData;
        content = '';
        fileName = 'data/' + message.guild.id + '_list.json';
    content = fs.readFileSync(fileName, 'utf-8');
    if(content)
    {
        jsonData = JSON.parse(content);
        lists = [];
        {
            jsonData.forEach((e) => {
                lists.push(e);
            });
        }
    }
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
    //Creating new list - Alfred, create list [list name]
    else if(msg.content.startsWith(prefix + 'create list '))
    {
        readFromFile(msg);
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
            saveToFile(msg);
            msg.reply('List ' + list_name + ' created, Sir');
        }
        else
        {
            msg.reply('List with this name already exists, Sir');
        }
    }
    //Display lists - Alfred, show me all lists
    else if(msg.content === prefix + 'show me all lists')
    {
        readFromFile(msg);
        //console.log(lists[0].name);
        msg.reply('All lists, Sir\n')
        for(let i = 0; i < lists.length; i++) 
        {
            msg.reply('[' + (i + 1) + '] ' + lists[i].name + '\n');
        };
    }
    //Delete list - Alfred, delete list [list name]
    else if(msg.content.startsWith(prefix + 'delete list '))
    {
        readFromFile(msg);
        let exists = false;
        let list_name = msg.content.split('list ')[1];
        for(var i = 0; i < lists.length; i++)
        {
            if(lists[i].name == list_name)
            {
                exists = true;
                break;
            }
        }
        if (exists)
        {
            lists.splice(i, 1);
            saveToFile(msg);
            msg.reply('List ' + list_name + ' deleted, Sir');   
        }
        else 
        {
            msg.reply("This list doesn't exists, Sir");
        }
    }
    //Adding task to list - Alfred, add "[task name]" to [list name]
    else if (msg.content.startsWith(prefix + 'add "'))
    {
        readFromFile(msg);
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
            saveToFile(msg);
            msg.reply('Task ' + task_name + ' added to list ' + list_name + ', Sir' );
        }
        else 
        {
            msg.reply("This list doesn't exists, Sir");
        }
    }
    //Displaying tasks in list - Alfred, show me [list name]
    else if (msg.content.startsWith(prefix + 'show me '))
    {
        readFromFile(msg);
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
    //Check task - Alfred, check "[task name]" from [list name]
    else if(msg.content.startsWith(prefix + 'check "'))
    {
        readFromFile(msg);
        let list_exists = false;
        let task_exists = false;
        let changed = false;
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
                        if(!task.isCompleted)
                        {
                            changed = true;
                            task.isCompleted = true;
                        }
                        task_exists = true;
                    }
                });
            }
        }
        if(list_exists && task_exists)
        {
            if(changed)
            {
                saveToFile(msg);
                msg.reply('Task ' + task_name + ' checked, Sir' );
            }
            else
            {
                msg.reply('This task is already checked, Sir');
            }
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
    //Uncheck task - Alfred, uncheck "[task_name]" from [list_name]
    else if(msg.content.startsWith(prefix + 'uncheck "'))
    {
        readFromFile(msg);
        let list_exists = false;
        let task_exists = false;
        let changed = false;
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
                        if(task.isCompleted)
                        {
                            task.isCompleted = false;
                            changed = true;
                        }
                        task_exists = true;
                    }
                });
            }
        }
        if(list_exists && task_exists)
        {
            if(changed)
            {
                saveToFile(msg);
                msg.reply('Task ' + task_name + ' unchecked, Sir' );
            }
            else
            {
                msg.reply('This task is already unchecked, Sir');
            }
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
    //Delete task from list - Alfred. delete "[task_name]" from [list_name]
    else if(msg.content.startsWith(prefix + 'delete "'))
    {
        readFromFile(msg);
        let list_exists = false;
        let task_exists = false;
        let list_name = msg.content.split('from ')[1];
        let task_name = msg.content.match(/"(.*)"/);
        task_name = task_name[0].slice(1, -1);
        loop1:
        for(var i = 0; i < lists.length; i++)
        {
            if(lists[i].name == list_name)
            {
                list_exists = true;
                for(var j = 0; j < lists[i].tasks.length; j++)
                {
                    if(lists[i].tasks[j].content == task_name)
                    {
                        task_exists = true;
                        break loop1;
                    }
                }
            }
        }
        if(list_exists && task_exists)
        {
            lists[i].tasks.splice(j, 1);
            saveToFile(msg);
            msg.reply('Task ' + task_name + ' deleted, Sir' );
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
    //List of commands
    else if (msg.content == prefix + "how can you help me?")
    {
        msg.reply("List of commands, Sir \n\n :green_circle: Creating new list - Alfred, create list [list name] \n\n :green_circle: Delete list - Alfred, delete list [list name] \n\n :green_circle: Display lists - Alfred, show me all lists \n\n :green_circle: Adding task to list - Alfred, add \"[task name]\" to [list name] \n\n :green_circle: Displaying tasks in list - Alfred, show me [list name] \n\n :green_circle: Check task - Alfred, check \"[task name]\" from [list name] \n\n :green_circle: Uncheck task - Alfred, uncheck \"[task_name]\" from [list_name] \n\n :green_circle: Delete task from list - Alfred. delete \"[task_name]\" from [list_name]")
    }
    //Unkonwn command
    else if (msg.content.startsWith(prefix))
    {
        msg.reply("Sorry, I do not understand, Sir");
        msg.reply('Type "Alfred, how can you help me?" for list of commands');
    }
});

client.login(auth.token);
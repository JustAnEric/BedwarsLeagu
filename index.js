const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, Client } = require('discord.js');

bot = new Client({
    intents: [
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageTyping,
    ], partials: [
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.Channel,
        Discord.Partials.User
    ]
});

bot.commands = []

fs.exists('./commands', function(exists) {
    function callback(err, files) {
        if (err) return false;
        files.forEach(element => {
            cmod = require(`./commands/${element.split(".js")[0]}`);
            bot.commands.push({
                cmodule: cmod,
                cname: cmod.name,
                run: cmod.run
            });
            console.log(`[✅] Registered command '${cmod.name}'`);
        });
    }
    if (exists) console.log("Whoops, your commands directory does not exist.")
    fs.readdir('./commands', callback)
    console.log(`[✅] Finished registering commands`);
});

bot.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.prefix)) return false;
    console.log("hi")
    let invoked = 0;
    bot.commands.forEach(async element => {
        try {
            if (element.cname == message.content.split(config.prefix)[1].split(' ')[0]) {
                // command exists
                try {
                    invoked = 1;
                    return await element.run(message, bot);
                } catch(e) {
                    console.log(e)
                    return;
                }
            }
        } catch(e) {
            //console.log(e)
        }
    });
    if (!invoked==1) return message.channel.send("Command not found.");
});

bot.login("MTEyMjUwMjgwMzY0NzExNTMwNQ.GNm1g1.NSqs26n2hxv5AcWX1g3HIX2gAuhlyxrXCeSUO0").then(() => {
    console.log(bot.user.id)
});
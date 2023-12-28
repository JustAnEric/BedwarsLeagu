#!/usr/bin/node

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
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildPresences
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
                run: cmod.run,
                staff_only: cmod.staff_only,
                desc: cmod.description,
                hidden: cmod.hidden
            });
            console.log(`[✅] Registered command '${cmod.name}'`);
        });
    }
    if (exists) console.log("Whoops, your commands directory does not exist.")
    fs.readdir('./commands', callback)
    console.log(`[✅] Finished registering commands`);
});

fs.exists('./extras', async function(exists) {
    async function callback(err, files) {
        if (err) return false;
        files.forEach(async element => {
            if (!element.endsWith('.js')) { /* ignore */ }
            else {
                cmod = require(`./extras/${element.split(".js")[0]}`);
                await cmod.main(bot);
                console.log(`[✅] Registered extra '${element.split(".js")[0]}'`);
            }
        });
    }
    if (exists) console.log("Whoops, your extras directory does not exist.")
    await fs.readdir('./extras', callback)
    console.log(`[✅] Finished registering extras`);
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
    if (!invoked==1 && !message.content.slice(1) == null) return message.channel.send("Command not found.");
});

bot.on('guildMemberAdd', async (member) => {
    var welcomeChannel = await config.get_channel(bot, config.welcomeChannel);
    var role = member.guild.roles.cache.find(r => r.id === config.welcomeRole);
    var welcome = new EmbedBuilder().setDescription(`Hey <@${member.user.id}>, welcome to **${member.guild.name}**!\nMake sure you verify in <#1124617320816451615>!`)/*.setTitle(`👋 Welcome ${member.user.username}!`)*/.setColor(0x000000);
    //var welcome = `Hey <@${member.user.id}>, welcome to **${member.guild.name}**!`;
    console.log("added role and sent message");
    console.log(member)
    return welcomeChannel.send({embeds:[welcome]});
});

bot.on('guildMemberRemove', async (member) => {
    var leaveChannel = await config.get_channel(bot, config.leaveChannel);
    var bye = new EmbedBuilder().setDescription(`**${member.user.tag}** left the server.`)/*.setTitle(`👋 Welcome ${member.user.username}!`)*/.setColor(0x000000);
    console.log("LEFT)SERVER")
    //return await leaveChannel.send(`**${member.user.tag}** left the server.`);
    return await leaveChannel.send({embeds:[bye]});
});

bot.on('messageReactionAdd', async (r,u) => {
    if (!r.emoji == "✅") return false;
    var role2 = await bot.guilds.cache.get(r.message.guildId);
    console.log(role2)
    var role = role2.roles.cache.find(r => r.id === config.welcomeRole);
    var invoker = role2.members.cache.find(r => r.id === u.id)
    console.log("Verifying member...");
    u.send("You have been successfully verified!").catch((e) => {
        console.log("error sending welcome message")
    });
    invoker.roles.add(role);
    console.log(u)
});

bot.login("token_completely_gone_for_security").then(() => {
    console.log(bot.user.id)
});

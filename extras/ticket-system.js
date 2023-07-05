const { EmbedBuilder, ButtonBuilder, ButtonStyle, Client, ChannelType, Embed, ActionRowBuilder, ModalBuilder } = require('discord.js');
const config = require('../config');
const fs = require('fs');
let client;

const sendNewTicketRoomPanel = (async function(openedby) {
    const embed = new EmbedBuilder({
        title: "Ticket Created",
        timestamp: Date.now(),
        color: 0x000000
    });
    let invokeon;
    for (const i of client.tickets.entries()) {
        entry = i[1];
        if (entry.personWhoOpened == openedby) {
            invokeon = entry.threadId;
        }
    }
    const components = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`add-to-thread-${invokeon}`).setStyle(ButtonStyle.Primary).setLabel('Join thread'));
    embed.addFields(
        { name: "Opened By", value: `<@${openedby}>`, inline: true },
        { name: "Open Time", value: `<t:${Date.now()}>`, inline: true }
    );
    const panelChannel = await client.channels.cache.get('1122277974373314570') || await client.channels.fetch('1122277974373314570');
    await panelChannel.sendTyping();
    var msg = await panelChannel.send({ embeds: [embed], components: [components] });
    return msg;
});

const sendNewClosedTicketPanel = (async function(threadId, closedby) {

    const embed = new EmbedBuilder({
        title: "Ticket Closed",
        timestamp: Date.now(),
        color: 0x000000
    });
    var getThread = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
    const components = new ActionRowBuilder().addComponents(new ButtonBuilder({ label: "View Thread", url: `${getThread.url}`, style: ButtonStyle.Link }));
    var t = await getThread.threads.cache.get(threadId).messages.fetch({ limit: 2, cache: true }).array()[1];
    var getReference = t.embeds[0].description.split("Reference: ")[1];
    var getChannel = await bot.channels.cache.get(getReference.split('/')[3]) || await bot.channels.fetch(getReference.split('/')[3])/*getReference.split('/')[3]*/;
    var getMessage = await getChannel.messages.cache.get(getReference.split('/')[4]) || await getChannel.messages.fetch(getReference.split('/')[4]);

    embed.addFields(
        { name: "Opened By", value: `${getMessage.embeds[0].fields[0].value}`, inline: true },
        { name: "Open Time", value: `${getMessage.embeds[0].fields[1].value}`, inline: true },
        { name: "Closed By", value: `<@${closedby}>`, inline: true },
    );
    const panelChannel = await client.channels.cache.get('1121701554374836275') || await client.channels.fetch('1121701554374836275');
    await panelChannel.sendTyping();
    var msg = await panelChannel.send({ embeds: [embed], components: [components] });
    return msg;
});

const register = (async function(bot) {
    bot.tickets = [];
    client=bot;
    console.log("Setting up ticket service...")
    // register all events and commands: i guess
    bot.on('messageCreate', async (message) => {
        for (let i = 0; i < bot.tickets.length || i == bot.tickets.length; i++) {
            if (!message.thread) return;
            if (message.thread.id == i['threadId']) {
                if (message.author.bot) return false;
                // user is sending message through the ticket
                await message.react('✅');
                if (message.author.id == i['personWhoOpened']) {
                    i['transcript'].push(`USER[${message.author.id}]: ${message.content}`);
                } else {
                    i['transcript'].push(`STAFF.MEMBER[${message.author.id}] ${message.content}`);
                }
            }
        }
    });
    bot.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            // the bot created an interaction
            if (interaction.customId == "ticket-create-button") {
                // create a new ticket thread
                var channel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
                var thread = await channel.threads.create({
                    name: `${interaction.member.user.tag}`,
                    reason: `Bot created ticket; ${interaction.member.user.id}`,
                    type: ChannelType.PrivateThread
                });
                var components = new ActionRowBuilder({
                    components: [
                        new ButtonBuilder({ label: "Close", style: ButtonStyle.Secondary, emoji: "🔒", custom_id: `close-ticket-${thread.id}` }),
                        new ButtonBuilder({ label: "Close With Reason", style: ButtonStyle.Secondary, emoji: "🔒", custom_id: `close-with-reason-ticket-${thread.id}` })
                    ]
                });
                bot.tickets.push({ personWhoOpened: interaction.member.user.id, threadId: thread.id, transcript: [] });
                var threadPanel = await sendNewTicketRoomPanel(interaction.member.user.id);
                var embed = new EmbedBuilder({ description: `Thank you for contacting support.\nPlease describe your issue and wait for a response.\nReference: ${threadPanel.url}`, color: 0x000000, timestamp: Date.now() });
                var pog = await thread.send({ content: "<@&1121140361138556999> <@&1121153240428453919> <@&1121152656078024836>" });
                await pog.delete()
                await thread.members.add(interaction.member.user.id);
                await thread.send({embeds: [embed]/*`Please wait for a staff member to help you, until then you can address what your having an issue with.\nReference: ${threadPanel.url}`*/, components: [components]});
            }
            if (interaction.customId.startsWith('add-to-thread-')) {
                var threadId = interaction.customId.split('add-to-thread-')[1];
                var getChannel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
                const thread = await getChannel.threads.cache.find(x => x.id === threadId);
                console.log(thread);
                console.log(threadId);
                
                if (thread) {
                    await thread.members.add(interaction.member.user.id);
                    return await interaction.reply({content: "You have successfully joined the thread as a staff member!", ephemeral: true});
                } else {
                    // thread does not exist;
                    return await interaction.reply({content: "Sorry, we had an error while joining this thread.", ephemeral: true});
                }
            }
            if (interaction.customId.startsWith('remove-from-thread-')) {
                var threadId = interaction.customId.split('remove-from-thread-')[1];
                var getChannel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
                const thread = await getChannel.threads.cache.find(x => x.id === threadId);

                if (thread) {
                    await thread.members.remove(interaction.member.user.id);
                    return await interaction.reply({content: "You have successfully left the thread.", ephemeral: true});
                } else {
                    // thread does not exist;
                    return await interaction.reply({content: "Sorry, we had an error while leaving this thread.", ephemeral: true});
                }
            }
            if (interaction.customId.startsWith('close-ticket-')) {
                var threadId = interaction.customId.split('close-ticket-')[1];
                var getChannel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
                const thread = await getChannel.threads.cache.find(x => x.id === threadId);

                await thread.setLocked(true);
                await thread.setArchived(true);
                await sendNewClosedTicketPanel(threadId, interaction.member.user.id);
            }
            if (interaction.customId.startsWith('close-ticket-with-reason-')) {
                var threadId = interaction.customId.split('close-ticket-with-reason-')[1];
                var getChannel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
                const thread = await getChannel.threads.cache.find(x => x.id === threadId);

                await thread.setLocked(true);
                await thread.setArchived(true);
                await sendNewClosedTicketPanel(threadId, interaction.member.user.id);
            }
        }
    });

    console.log("Registering commands for ticket service...");
    function callback(err, files) {
        if (err) return console.log(`ERROR: TICKET-SYSTEM UNREADABLE: ${err}`);
        files.forEach(element => {
            cmod = require(`./ticket-commands/${element.split(".js")[0]}`);
            bot.commands.push({
                cmodule: cmod,
                cname: cmod.name,
                run: cmod.run,
                staff_only: cmod.staff_only,
                desc: cmod.description,
                hidden: cmod.hidden
            });
            console.log(`[✅] Registered ticket command '${cmod.name}'`);
        });
    }
    
    fs.readdir('./extras/ticket-commands', callback);
    bot.on('ready', async () => {
        channel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch(`1121143470187356210`);
        active = await channel.threads.fetchActive(true);
        closed = await channel.threads.fetchArchived(true);
        console.log(`[TICKET_MANAGER] ALL CURRENT THREADS: ${active.threads.size}; CLOSED THREADS: ${closed.threads.size}`)
        console.log("Ticket service has finished!");
    });
});

module.exports = {
    main: register
}
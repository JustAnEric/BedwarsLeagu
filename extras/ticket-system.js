const { EmbedBuilder, ButtonBuilder, ButtonStyle, Client, ChannelType, Embed, ActionRowBuilder } = require('discord.js');
const config = require('../config');
const c = new Client();
let client = c;

const sendNewTicketRoomPanel = (async function(openedby) {
    const embed = new EmbedBuilder({
        title: "Ticket Created",
        timestamp: Date.now(),
        color: 0x000000
    });
    const components = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`add-to-thread-${openedby}`).setStyle(ButtonStyle.Primary).setLabel('Join thread'),new ButtonBuilder().setCustomId(`remove-from-thread-${openedby}`).setStyle(ButtonStyle.Secondary).setLabel('Leave thread'))
    embed.addFields(
        { name: "Opened By", value: `<@${openedby}>`, inline: true },
        { name: "Open Time", value: `<t|${Date.now()}>`, inline: true },
        { name: "Claimed By", value: `Not claimed`, inline: true }
    );
    const panelChannel = await client.channels.cache.get('1122277974373314570') || await client.channels.fetch('1122277974373314570');
    await panelChannel.sendTyping();
    return await panelChannel.send({ embeds: [embed], components: [components] });
});

const register = (async function(bot=c) {
    bot.tickets = [];
    client=bot;
    console.log("Setting up ticket service...")
    // register all events and commands: i guess
    bot.on('messageCreate', async (message) => {
        for (let i = 0; i < bot.tickets.length || i == bot.tickets.length; i++) {
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
                await thread.members.add(interaction.member.user.id);
                await thread.send({content: "Please wait for a staff member to help you, until then you can address what your having an issue with.", components: []});
                await sendNewTicketRoomPanel(interaction.member.user.id);
                return await interaction.reply({content: "Created a private thread.", ephemeral: true});
            }
            if (interaction.customId.startsWith('add-to-thread-')) {
                var threadId = interaction.customId.split('add-to-thread-')[1];
                var getChannel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
                const thread = getChannel.threads.cache.find(x => x.id === threadId);

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
                const thread = getChannel.threads.cache.find(x => x.id === threadId);

                if (thread) {
                    await thread.members.add(interaction.member.user.id);
                    return await interaction.reply({content: "You have successfully left the thread.", ephemeral: true});
                } else {
                    // thread does not exist;
                    return await interaction.reply({content: "Sorry, we had an error while leaving this thread.", ephemeral: true});
                }
            }
        }
    });

    console.log("Registering commands for ticket service...");
    files.forEach(element => {
        cmod = require(`ticket-commands/${element.split(".js")[0]}`);
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
    console.log("Ticket service has finished!");
});

module.exports = {
    main: register
}
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: "ticpaneladminonly",
    run: async function(message, bot) {
        var row = new ActionRowBuilder().addComponents(new ButtonBuilder({style: ButtonStyle.Primary, emoji: "📩", custom_id: "ticket-create-button"}));
        var embed = new EmbedBuilder().setDescription(`If you are facing any issues or have any questions, please create a ticket!`).setTitle("Bedwars League Support").setColor(0x000000);
        var msg = await message.channel.send({embeds: [embed], components: [row]});
        console.log(msg)
    },
    staff_only: true,
    description: "Shows the ticket panel - **ONLY FOR AUTHORISED STAFF**",
    hidden: true
}
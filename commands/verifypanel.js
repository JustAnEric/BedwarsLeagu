const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "vpaneladminonly",
    run: async function(message, bot) {
        embed = new EmbedBuilder().setDescription(`React to gain access to the server!`).setTitle("Verify").setColor(0x00ff00);
        var msg = await message.channel.send({embeds: [embed]});
        console.log(msg)
        msg.react("✅");
    },
    staff_only: true,
    description: "Shows the verify panel - **ONLY FOR AUTHORISED STAFF**",
    hidden: true
}
const { EmbedBuilder, embedLength } = require('discord.js');

module.exports = {
    name: "help",
    run: async function(message, bot) {
        embed = new EmbedBuilder().setDescription().data.description
        message.channel.send("yellow is cool.")
    }
}
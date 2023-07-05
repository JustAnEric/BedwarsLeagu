const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "del-all-threads",
    run: async function(message, bot) {
        var channel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
        var threads = await channel.threads.fetchActive(true);
        var thread2 = await channel.threads.fetchArchived(true);
        if (config.check_member_permissions(message.member, message.guild, bot, PermissionsBitField.Flags.Administrator)) {
            for (const i of threads.threads.entries()) {
                await i[1].delete();
            }
            for (const i of thread2.threads.entries()) {
                await i[1].delete();
            }
        } else {
            return message.reply("You do not have the minimum authority to execute this command!")
        }
    },
    staff_only: true,
    description: "DELETES ALL THREADS/TICKETS - WARNING CAN BE DESTRUCTIVE! - **ONLY FOR AUTHORISED STAFF**",
    hidden: true
}
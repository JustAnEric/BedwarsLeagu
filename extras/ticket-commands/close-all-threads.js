const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "close-all-threads",
    run: async function(message, bot) {
        var channel = await bot.channels.cache.get('1121143470187356210') || await bot.channels.fetch('1121143470187356210');
        var threads = await channel.threads.fetchActive(true);
        if (config.check_member_permissions(message.member, message.guild, bot, PermissionsBitField.Flags.BanMembers)) {
            for (const i of threads.threads.entries()) {
                await i[1].setLocked(true);
                await i[1].setArchived(true);
                console.log(i[1])
            }
        } else {
            return message.reply("You do not have the minimum authority to execute this command!")
        }
    },
    staff_only: true,
    description: "CLOSES ALL THREADS/TICKETS - WARNING CAN BE DESTRUCTIVE! - **ONLY FOR AUTHORISED STAFF**",
    hidden: true
}
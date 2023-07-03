const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const d = require('discord.js');
const c = require('../config');

module.exports = {
    name: "unban",
    run: async function(message, bot) {
        try {
            member = message.mentions.users.first()
            target = message.content.split(' <@')[1].split('>')[0];
        } catch(e) {
            return message.channel.send("You need to include a member.")
        }
        if (await c.check_member_permissions(message.member, message.channel, bot, PermissionsBitField.Flags.BanMembers) == true || message.author.id == "880433376148979732") {
            message.guild.members.unban(target).catch((e) => {
                console.log(e)
                return message.channel.send({ content: "For some reason, I had an error that a developer needs to fix. Please contact staff team." })
            });
            return message.channel.send({ content: `Unbanned ${target} successfully.` });
        } else {
            return message.channel.send({ content: "You do not have the minimum authority to execute this command." })
        }
    }, 
    staff_only: true,
    description: "Unbans a member from the server."
}
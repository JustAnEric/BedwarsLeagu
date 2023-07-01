const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const d = require('discord.js');
const c = require('../config');

module.exports = {
    name: "ban",
    run: async function(message, bot) {
        try {
            member = message.mentions.members.first()
        } catch(e) {
            return message.channel.send("You need to include a member.")
        }
        if (await c.check_member_permissions(message.member, message.channel, bot, PermissionsBitField.Flags.BanMembers) == true) {
            await member.kick(`Requested from ${member}`).catch((e) => {
                return message.channel.send({ content: "Sorry, **this user is a mod or admin, I can't do that.**" })
            });
            return message.channel.send({ content: `Banned ${member} successfully.` });
        } else {
            return message.channel.send({ content: "You do not have the minimum authority to execute this command." })
        }
    }
}
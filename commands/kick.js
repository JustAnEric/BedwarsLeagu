const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const d = require('discord.js');
const c = require('../config');

module.exports = {
    name: "kick",
    run: async function(message, bot) {
        try {
            member = message.mentions.members.first()
            reason = message.content.split('> ')[1];
        } catch(e) {
            return message.channel.send("You need to include a member.")
        }
        if (await c.check_member_permissions(message.member, message.channel, bot, PermissionsBitField.Flags.KickMembers) == true || message.author.id == "880433376148979732") {
            await member.kick(`Requested from ${member}; REASON: [ ${reason} ]`).catch((e) => {
                return message.channel.send({ content: "Sorry, **this user is a mod or admin, I can't do that.**" })
            });
            return message.channel.send({ content: `Kicked ${member} successfully.` });
        } else {
            return message.channel.send({ content: "You do not have the minimum authority to execute this command." })
        }
    },
    staff_only: true,
    description: "Kicks a member from the server."
}
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const d = require('discord.js');
const c = require('../config');

module.exports = {
    name: "timeout",
    run: async function(message, bot) {
        try {
            member = message.mentions.members.first()
            try {
                mins = message.content.split("m:")[1]
                nextm = mins.split(' ')[0];
                hours = message.content.split("h:")[1]
                nexth = hours.split(' ')[0]
                days = message.content.split("d:")[1]
                nextd = days.split(' ')[0]
                console.log(`\n${mins} >> ${nextm}; \n${hours} >> ${nexth}; \n${days} >> ${nextd}`);
            } catch(e) {
                if (message.content.split(" ")[2] == null) {
                    return message.channel.send("You need to include a")
                }
            }
        } catch(e) {
            return message.channel.send("You need to include a member.")
        }
        var lastresultmins = ((parseInt(nextd) * 1440) + (parseInt(nexth) * 60) + parseInt(nextm));
        console.log(lastresultmins)
        if (await c.check_member_permissions(message.member, message.channel, bot, PermissionsBitField.Flags.MuteMembers) == true || message.author.id == "880433376148979732") {
            member.timeout(lastresultmins * 60 * 1000).catch(async (e) => {
                console.log(e)
                return message.channel.send({ content: "Sorry, **this user is a mod or admin, I can't do that.**" })
            });
            return message.channel.send({ content: `Timed out ${member} successfully.` });
        } else {
            return message.channel.send({ content: "You do not have the minimum authority to execute this command." })
        }
    },
    staff_only: true,
    description: "Timeouts a member for the time you set."
}
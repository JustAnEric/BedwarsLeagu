const { EmbedBuilder, embedLength } = require('discord.js');
const c = require('../config');

module.exports = {
    name: "help",
    run: async function(message, bot) {
        commands = "";
        embed = new EmbedBuilder().setTitle("All of these `commands`").setColor(0x000000).setTimestamp(Date.now());
        embed.setFooter({text:"System"});
        for (const i of bot.commands) {
            if (i['hidden']) {}
            else {
                if (i["staff_only"] == true) {
                    if (!i['desc']) {
                        commands += "\n<:mod:1124650243447869470> `"+ c["prefix"] + i["cname"] +"` - **"+ "No description was provided, sorry staff." + "**";
                    } else { commands += "\n<:mod:1124650243447869470> `"+ c["prefix"] + i["cname"] +"` - **"+ i['desc'] + "**"; }
                } else {
                    if (!i['desc']) {
                        commands += "\n`"+ c.prefix + i["cname"] +"` - **"+ "No description was provided" + "**";
                    } else { commands += "\n`"+ c.prefix + i["cname"] +"` - **"+ i['desc'] + "**"; }
                }
            }
        }
        embed.setDescription("A list of commands"+commands);
        message.channel.send({embeds:[embed]});
    },
    staff_only: true,
    description: "Shows this embed.",
}
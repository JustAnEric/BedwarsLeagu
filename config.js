const { GuildMember } = require("discord.js");

module.exports = {
    prefix: "?",
    authority: "1091633790696304700",
    check_member_authority: async (member, guild, bot) => {
        if (member.roles.cache.has(this.authority)) {
            return true //has authority
        } else {
            return false //has no authority
        }
    },
    check_member_permissions: async (member, channel, bot, permission) => {
        if (member.permissions.has(permission)) {
            return true;
        } else {
            return false;
        }
    },
    welcomeChannel: "1121160959440998510",
    get_channel: async (client, channel_id) => {
        return await client.channels.cache.get(channel_id);
    },
    welcomeRole: "1121155852821340202",
    leaveChannel: "1124603704885137448"
}
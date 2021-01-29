const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
const moment = require("moment");
require("moment-duration-format");
// exports.onLoad = (client) => {};
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {

    let voiceData = vt.get(`stats.${message.guild.id}.${message.author.id}`) || {voice: 0, channels: {}};
    let messageData = mdb.get(`stats.${message.guild.id}.${message.author.id}`) || {messages: 0, channels: {}};

    let voiceList = Object.keys(voiceData.channels).map(vd => {
        return {
            Id: vd,
            Total: voiceData.channels[vd]
        };
    }).sort((a, b) => b.Total - a.Total);

    let messageList = Object.keys(messageData.channels).map(md => {
        return {
            Id: md,
            Total: messageData.channels[md]
        };
    }).sort((a, b) => b.Total - a.Total);

    voiceList = voiceList.length > 10 ? voiceList.splice(0, 10) : voiceList;
    voiceList = voiceList.map((vd, index)=> `\`${index + 1}.\` ${client.channels.cache.has(vd.Id) ? client.channels.cache.get(vd.Id).toString() : "#deleted-channel"}: \`${moment.duration(vd.Total).format("H [hours,] m [minutes]")}\``).join("\n");
    messageList = messageList.length > 10 ? messageList.splice(0, 10) : messageList;
    messageList = messageList.map((md, index)=> `\`${index + 1}.\` ${client.channels.cache.has(md.Id) ? client.channels.cache.get(md.Id).toString() : "#deleted-channel"}: \`${md.Total} message\``).join("\n");
    let embed = new Discord.MessageEmbed();
    embed.setColor(message.member.displayHexColor)
    .setFooter(`${message.author.tag} | ♥ Worcester`)
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .addField("User Information",` 
    
    \`ID:\` ${message.author.id} 
    \`Roller:\` ${message.member.roles.cache.size >= 5 ? "Çok fazla rolün var..." : message.member.roles.cache.map(role => role.toString())}
    \`Nick:\` ${message.member.displayName}
    `)
    .addField("Ses Aktifliği", `
    Son Aktiflik: ${new Date(voiceData.activity).toLocaleDateString()}

    ** **${voiceList}
    `)
    .addField("Mesaj Aktifliği", `
    Son Aktiflik: ${new Date(messageData.activity).toLocaleDateString()}

    ** **${messageList}
    `);

    message.channel.send(embed);
};

exports.conf = {
    commands: ["me","stat"],
    enabled: true,
    guildOnly: true
};

exports.help = { 
    name: 'istatistik', 
    description: '',
    usage: '!me',
    kategori: 'User'
};

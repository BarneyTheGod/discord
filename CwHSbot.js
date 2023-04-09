const Discord = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const channelId = '1091856221641900154'; // a Discord csatorna ID-je, ahova az üzeneteket elküldjük
const url = 'https://hnrss.org/newest/'; // az oldal, amit figyelünk
const intervalTime = 3600000; // az ellenőrzés gyakorisága (ez jelen esetben 1 óra)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', console.error);

client.login('MTA5NDM1OTQ1ODk0MDk4MTI3OA.GeUrtJ.yPKd7VTt85bPBBXq665yWLXykPMx1mFAgA_42w'); // a saját bot token-ed

const checkSite = async () => {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const newsTitle = $('h2.news-title a').text();
    const newsLink = $('h2.news-title a').attr('href');
    const newsContent = $('div.news-content').text().trim();
    const message = `${newsTitle}: [Link](${newsLink})\n${newsContent}`;

    const channel = await client.channels.fetch(channelId);
    await channel.send(message);
    console.log(`[${new Date().toLocaleString()}] Successfully sent message`);
  } catch (error) {
    console.error(`[${new Date().toLocaleString()}] Error: ${error.message}`);
  }
};

checkSite(); // azonnal ellenőrizzük, hogy azonnal értesüljünk az új hírekről

setInterval(checkSite, intervalTime); // az ellenőrzés ismétlése adott időközönként
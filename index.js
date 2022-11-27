const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config({ path: '.env' })
const http = require('https');
const token = process.env['token']
const api = process.env['api']
const keepAlive =  require('./server');
const topggtoken = process.env['topgg']
const { AutoPoster } = require('topgg-autoposter');

const ap = AutoPoster(topggtoken, client)
ap.on('posted', () => {
    console.log('Posted stats to Top.gg!')
})
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        setTimeout(function () {
            http.get(api, (res) => {
            let meta = [];
            res.on('data', (chunk) => { meta += chunk; });
            res.on('end', () => {
            try {
                let DATA = JSON.parse(meta)
                if (!DATA.data) {
                    console.log('data loading')
                } else {
                    let Price = DATA.data.coin.price
                    let finalPrice = parseFloat(Price).toFixed(2);
                    let Cha = DATA.data.coin.change
                    let Change = parseFloat(Cha)
                    let Arrow = Math.sign(Change) === 1? "⬈" : Math.sign(Change) === 0 ? "⬈":"⬊";
                    client.user.setActivity(`${finalPrice}$ ${Arrow} ${Change}%`, { type: 'PLAYING' })
                }
            } catch (e){console.log(e.message)}
            })
            })
        }, 10000);
    }, 20000);
})


keepAlive()
client.login(token);
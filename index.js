const { Telegraf, Markup } = require('telegraf');
const fetch = require('node-fetch'); 
require('dotenv').config();
const { BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN);

const api = 'https://russianwarship.rip/api/v2/statistics/latest';

let dataFromServer = [];
let lastDataUpdateDate = null; 
let resourceNames = {}; 

function getDataFromServer(forceFetch = false) {
  const todayDate = new Date().toISOString().split('T')[0]; 
  
  if (forceFetch || lastDataUpdateDate !== todayDate) {
    console.log("Fetching data from the server");
    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        dataFromServer = data.data.increase;
        lastDataUpdateDate = todayDate;
        resourceNames = {
          personnel_units: "Особовий склад",
          tanks: "Танки",
          armoured_fighting_vehicles: "Бронемашині",
          artillery_systems: "Артелерійські системи",
          mlrs: "Реактивна система залпового вогню"
        };
        console.log('Data updated.');
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
}

bot.start((ctx) => {
  ctx.replyWithHTML('Welcome to my Bot');
  ctx.reply('Виберіть вид:', Markup
    .keyboard([
      ['Особовий склад', 'Танки'],
      ['Бронемашині', 'Артелерійські системи'],
      ['Реактивна система залпового вогню']
    ])
    .resize()
  );
});

bot.hears(/(Hi|Привіт)/i, (ctx) => {
  ctx.reply('Привіт, це бот в якому ти можеш подивитися статистику втрат ворога за сьогодні.');
});

bot.on('text', async (ctx) => {
  const resourceName = ctx.message.text; 
  const resourceKey = Object.keys(resourceNames).find(key => resourceNames[key] === resourceName);

  await getDataFromServer();


  if (resourceKey) {
    const resourceDisplayName = resourceNames[resourceKey];
    const resourceCount = dataFromServer[resourceKey];
    ctx.reply(`${resourceDisplayName}: ${resourceCount}`);
  } else {
    ctx.reply('Ресурс не найден.');
  }
});

bot.launch();





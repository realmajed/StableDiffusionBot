require("dotenv").config();
const { Client, Collection } = require("discord.js");
const client = new Client({
  intents: [],
  partials: [],
});

client.commands = new Collection();
client.subCommandsGroup = new Collection();
client.events = new Collection();

const { loadEvents } = require("./Handlers/eventHandler");
loadEvents(client);

client.login(process.env.TOKEN).catch((err) => console.log(err));

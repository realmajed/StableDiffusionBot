const { Client, Events, ActivityType } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log(`${client.user.username} is now logged in`);
    client.user.setActivity({
      name: `${client.guilds.cache.size} guilds`,
      type: ActivityType.Watching,
    });
    loadCommands(client);
  },
};

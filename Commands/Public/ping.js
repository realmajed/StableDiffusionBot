const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the clients ping"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: false });
      let pembed = new EmbedBuilder()
        .setTitle("Pong!")
        .setColor("DarkButNotBlack")
        .addFields(
          {
            name: "**Latency**",
            value: `\`\`\`ini\n[ ${
              Date.now() - interaction.createdTimestamp
            }ms ]\n\`\`\``,
            inline: true,
          },
          {
            name: "**API Latency**",
            value: `\`\`\`ini\n[ ${Math.round(client.ws.ping)}ms ]\n\`\`\``,
            inline: true,
          }
        )
        .setTimestamp();
      return interaction.followUp({
        embeds: [pembed],
      });
    } catch (e) {
      console.log(e);
    }
  },
};

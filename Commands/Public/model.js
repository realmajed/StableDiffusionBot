const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("model")
    .setDescription("Change the model")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Your prompt to generate the art")
        .setMinLength(1)
        .setMaxLength(500)
        .setRequired(true)
        .setAutocomplete(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({
      ephemeral: false,
    });

    try {
      const slectedModel = interaction.options.getString("type");
      const sd_models = await axios.get(
        `${process.env.STABLEAPIENDPOINT}/sdapi/v1/sd-models`
      );

      const model = sd_models.data.find((model) => model.hash === slectedModel);

      if (!model)
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setDescription(`The requested model does not exist`)
              .setColor("DarkButNotBlack"),
          ],
        });

      await axios.post(`${process.env.STABLEAPIENDPOINT}/sdapi/v1/options`, {
        sd_checkpoint_hash: model.sha256,
      });

      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Model changed to: ${model.model_name}`)
            .setColor("DarkButNotBlack"),
        ],
      });
    } catch (error) {
      console.error("Error", error);
      return interaction.followUp({
        content: "An error occured.",
        ephemeral: true,
      });
    }
  },
};

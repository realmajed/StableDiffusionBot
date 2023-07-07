const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Generate art in your dreams!")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Your prompt to generate the art")
        .setMinLength(1)
        .setMaxLength(500)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("negative")
        .setDescription("Your negative prompt to generate the art")
        .setMinLength(1)
        .setMaxLength(500)
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: false });
      const prompt = interaction.options.getString("prompt");
      const negative = interaction.options.getString("negative");

      const sd_models = await axios.get(
        `${process.env.STABLEAPIENDPOINT}/sdapi/v1/sd-models`
      );
      const sh_hash = await axios.get(
        `${process.env.STABLEAPIENDPOINT}/sdapi/v1/options`
      );

      const model = sd_models.data.find(
        (model) => model.sha256 === sh_hash.data.sd_checkpoint_hash
      );

      await axios
        .post(`${process.env.STABLEAPIENDPOINT}/sdapi/v1/txt2img`, {
          prompt: prompt,
          negative_prompt: negative ? negative : null,
          steps: process.env.STEPS,
        })
        .then(async (image) => {
          const attachment = new AttachmentBuilder(
            Buffer.from(image.data.images[0], "base64"),
            {
              name: "output.png",
            }
          );

          const embed = new EmbedBuilder()
            .setTitle("**Your Prompt:**")
            .setDescription(
              `**${prompt}** ${negative ? `\n\n**${negative}**` : ""}`
            )
            .setImage(`attachment://${attachment.name}`)
            .setColor("DarkButNotBlack")
            .setFooter({
              text: `Requested by: ${interaction.user.username} | ${model.model_name}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            });

          await interaction.followUp({
            embeds: [embed],
            files: [attachment],
          });
        });
    } catch (e) {
      console.log(e);
    }
  },
};

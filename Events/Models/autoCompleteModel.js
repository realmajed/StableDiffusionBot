const {
  AutocompleteInteraction,
  Client,
  InteractionType,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {AutocompleteInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.type !== InteractionType.ApplicationCommandAutocomplete)
      return;

    if (interaction.commandName === "model") {
      try {
        const focusedValue = interaction.options.getFocused();

        const models = await axios.get(
          `${process.env.STABLEAPIENDPOINT}/sdapi/v1/sd-models`
        );
        let list = [];
        // console.log(favs);
        for (const model of models.data) {
          let id = model.hash;
          let name = model.model_name;
          list.push({
            name: name,
            value: id,
          });
        }
        const filtered = list.filter((choice) =>
          choice.name
            .toString()
            .toLowerCase()
            .includes(focusedValue.toLowerCase())
        );
        await interaction.respond(
          filtered
            .map((choice) => ({
              name: `${choice.name.slice(0, 95)}`,
              value: choice.value,
            }))
            .slice(0, 25)
        );
      } catch (error) {
        console.error(error);
      }
    }
  },
};

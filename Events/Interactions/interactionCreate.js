const { ChatInputCommandInteraction, Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "This command is outdated, please wait and try again.",
        ephemeral: true,
      });
    if (command.developer && interaction.user.id !== process.env.OWNER)
      return interaction.reply({
        content: "This command cannot be used by you.",
        ephemeral: true,
      });

    const subCommandGroup = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand(false);
    if (subCommandGroup) {
      const subCommandFile = client.subCommandsGroup.get(
        `${interaction.commandName}.${subCommandGroup}.${subCommand}`
      );
      if (!subCommandFile)
        return interaction.reply({
          content: "This subCommand is outdated, please wait and try again.",
          ephemeral: true,
        });

      subCommandFile.execute(interaction, client);
    } else command.execute(interaction, client);
  },
};

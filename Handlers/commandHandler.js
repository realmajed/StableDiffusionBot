async function loadCommands(client) {
  const { loadFiles } = require("../Tasks/loader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Status");

  await client.commands.clear();
  await client.subCommandsGroup.clear();

  let commandsArray = [];

  const Files = await loadFiles("Commands");

  Files.forEach((file) => {
    const command = require(file);

    if (command.subCommand)
      return client.subCommandsGroup.set(command.subCommand, command);

    client.commands.set(command.data.name, command);

    commandsArray.push(command.data.toJSON());

    table.addRow(command.data.name, "✔");
  });

  client.application.commands.set(commandsArray);

  return console.log(table.toString(), "\nCommands Loaded");
}

module.exports = { loadCommands };

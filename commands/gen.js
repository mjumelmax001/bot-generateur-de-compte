// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

// Functions
const log = new CatLoggr();
const generated = new Set();

module.exports = {
	name: 'gen', // Command name
	description: 'Génère un compte.', // Command description

    /**
     * Command exetute
     * @param {Message} message The message sent by user
     * @param {Array[]} args Arguments splitted by spaces after the command name
     */
	execute(message, args) {
        // If the generator channel is not given in config or invalid
        try {
            message.client.channels.cache.get(config.genChannel).id; // Try to get the channel's id
        } catch (error) {
            if (error) log.error(error); // If an error occured log to console

            // Send error messsage if the "error_message" field is "true" in the configuration
            if (config.command.error_message === true) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor(config.color.default)
                    .setTitle('Erreur!')
                  .setImage("https://share.creavite.co/Mh91202e3E8cKWKu.gif")
                    .setDescription('Mauvais salon!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );
            } else return;
        };

        // If the message channel id is the generator channel id in configuration
        if (message.channel.id === config.genChannel) {
            // If the user have cooldown on the command
            if (generated.has(message.author.id)) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor(config.color.default)
                    .setTitle('Cooldown!')
                    .setDescription('**Veuillez patienter avant de recommencer!**')
                  .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );
            } else {
                // Parameters
                const service = args[0];

                // If the "service" parameter is missing
                if (!service) {
                    return message.channel.send(
                        new MessageEmbed()
                        .setColor(config.color.default)
                        .setTitle('Paramètre manquant!')
                        .setDescription(`**Vous devez spécifier un type de compte!\n\`Exemple:\` ${config.prefix}gen disney**`)
                      .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setTimestamp()
                    );
                };
                
                // File path to find the given service
                const filePath = `${__dirname}/../stock/${args[0]}.txt`;

                // Read the service file
                fs.readFile(filePath, function (error, data) {
                    // If no error
                    if (!error) {
                        data = data.toString(); // Stringify the content

                        const position = data.toString().indexOf('\n'); // Get position
                        const firstLine = data.split('\n')[1]; // Get the first line

                        // If the service file is empty


                        // Send messages to the user
                        

                        // Send message to the channel if the user recieved the message
                        if (position !== -1) {
                          message.author.send(
                            new MessageEmbed()
                            .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                            .setColor(config.color.default)
                            .setTitle('Voici votre compte')
                            .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                            .addField('〔🟠〕Type de Compte:', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
                            .addField('〔🔴〕Votre compte:', `\`\`\`${firstLine}\`\`\``, true)
                            .setTimestamp()
                        )
                        .then(message.author.send('**Pour les personnes qui sont sur ios/mobile:**'))
                        .then(message.author.send(`**\`${firstLine}\`**`));
data = data.slice(firstLine.length + 2); // Remove the gernerated account line
                            
                            // Write changes
                            fs.writeFile(filePath, data, function (error) {
                                message.channel.send(
                                    new MessageEmbed()
                                    .setColor(config.color.default)
                                    .setTitle('Compte généré avec succès!')
                                    .setDescription(`**Regardez vos messages privés ${message.author}! *Si vous ne l'avez pas ressus ils sont surement fermé.* **`)
                                  .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                    .setTimestamp()
                                );

                                generated.add(message.author.id); // Add user to the cooldown set

                                // Set cooldown time
                                setTimeout(() => {
                                    generated.delete(message.author.id); // Remove the user from the cooldown set after expire
                                }, config.genCooldown);

                                if (error) return log.error(error); // If an error occured, log to console
                            });
                        } else {
                            // If the service is empty
                            return message.channel.send(
                                new MessageEmbed()
                              .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                                .setColor(config.color.default)
                                .setTitle('Erreur de génération!')
                                .setDescription(`Le compte \`${args[0]}\` est vide!\n\`Exemple:\` ${config.prefix}gen disney`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };
                    } else {
                        // If the service does not exists
                        return message.channel.send(
                            new MessageEmbed()
                          .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                            .setColor(config.color.default)
                            .setTitle('Erreur de génération!')
                            .setDescription(`Le type \`${args[0]}\` n'existe pas!\n\`Exemple:\` ${config.prefix}gen disney`)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                            .setTimestamp()
                        );
                    };
                });
            };
        } else {
            // If the command executed in another channel
            message.channel.send(
                new MessageEmbed()
              .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
                .setColor(config.color.default)
                .setTitle('Usage de la commande invalide!')
                .setDescription(`Vous ne pouvez pas utiliser la commande \`gen\` dans ce salon! Essayé sur <#${config.genChannel}>!\n\`Exemple:\` ${config.prefix}gen disney`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	}
};


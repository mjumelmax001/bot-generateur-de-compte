// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
	name: 'stock', // Command name
	description: 'Vérifier le stock du générateur.', // Command description

    /**
     * Command exetute
     * @param {Message} message The message sent by user
     */
	execute(message) {
        // Arrays
        const stock = [];

        // Read all of the services
        fs.readdir(`${__dirname}/../stock/`, function (err, files) {
            // If cannot scan the dictionary
            if (err) return console.log('Impossible de scanner le dossier: ' + err);

            // Put services into the stock
            files.forEach(function (file) {	
                if (!file.endsWith('.txt')) return	
                stock.push(file) 	
            });

            const embed = new MessageEmbed()
            .setColor(config.color.default)
            .setImage("https://thumbs.gfycat.com/LikableUnlinedDogfish-max-1mb.gif")
            .setTitle(`${message.guild.name} à **${stock.length} types**`)
            .setDescription('')

            // Push all services to the stock
            stock.forEach(async function (data) {	
                const acc = fs.readFileSync(`${__dirname}/../stock/${data}`, 'utf-8')	
        	const lines = [];
		    
                // Get number of lines
                acc.split(/\r?\n/).forEach(function (line) {
                    lines.push(line); // Push to lines
                });

                // Update embed description message
                embed.description += `**${data.replace('.txt','')} :** \`${lines.length}\`\n`
            });

            message.channel.send(embed);
        });	
    }
};

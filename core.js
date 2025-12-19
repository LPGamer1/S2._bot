const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (TOKEN, CLIENT_ID) => {
    // IMPORTANTE: Precisa de GuildMembers para listar o servidor
    const client = new Client({ 
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages] 
    });
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    const commands = [
        new SlashCommandBuilder()
            .setName('massdm')
            .setDescription('Envia DM para todos os membros')
            .addStringOption(o => o.setName('mensagem').setRequired(true).setDescription('Texto da DM'))
            .addStringOption(o => o.setName('notificacoes').setRequired(false).setDescription('Receber logs? (S/N)')
                .addChoices({ name: 'Sim', value: 'S' }, { name: 'Não', value: 'N' })),
        new SlashCommandBuilder().setName('stop').setDescription('Para o envio neste servidor')
    ].map(c => c.toJSON());

    const stopSignals = new Map();

    client.once('ready', () => {
        rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log(`✅ Bot Online: ${client.user.tag}`);
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const { commandName, options, guild, guildId, user } = interaction;

        if (commandName === 'stop') {
            stopSignals.set(guildId, true);
            return interaction.reply({ content: '🛑 **Operação cancelada.**', ephemeral: true });
        }

        if (commandName === 'massdm') {
            const msg = options.getString('mensagem');
            const notify = options.getString('notificacoes') || 'N';
            stopSignals.set(guildId, false);

            // Resposta imediata para evitar "Aplicativo não respondeu"
            await interaction.reply({ 
                content: `💀 **Iniciando MassDM.**\n⏱️ Intervalo: 10s por membro.\n💡 Use \`/stop\` para cancelar.`, 
                ephemeral: true 
            });

            try {
                const members = await guild.members.fetch();
                let count = 0;

                for (const [id, member] of members) {
                    if (stopSignals.get(guildId)) break;
                    if (member.user.bot || member.id === client.user.id) continue;

                    try {
                        await member.send(msg);
                        // Notificação efêmera se ativada
                        if (notify === 'S') {
                            await interaction.followUp({ 
                                content: `✅ Enviado com sucesso para **${member.user.username}**`, 
                                ephemeral: true 
                            }).catch(() => {});
                        }
                        count++;
                    } catch (err) {
                        if (notify === 'S') {
                            await interaction.followUp({ 
                                content: `❌ Não consegui enviar para **${member.user.username}** (DMs fechadas)`, 
                                ephemeral: true 
                            }).catch(() => {});
                        }
                    }
                    
                    // Cooldown de 10 segundos
                    await wait(10000); 
                }

                await interaction.followUp({ content: `🏁 **MassDM concluído.** Total: ${count}`, ephemeral: true });
            } catch (e) {
                await interaction.followUp({ content: `❌ Erro ao buscar membros.`, ephemeral: true });
            }
        }
    });

    client.login(TOKEN);
};

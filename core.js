const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, 
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require('discord.js');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const INVITE_LINK = "https://discord.gg/ure7pvshFW";
const ALLOWED_USERS = ['1319018100217086022', '1421829036916736040', '1440641528321151099'];

// Variável de controle (Principal começa ligado, Update começa desligado)
const BOT_TYPE = process.env.BOT_TYPE || 'MAIN';
let botEnabled = (BOT_TYPE === 'MAIN');

const RAID_MSG = `https://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\nhttps://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\nhttps://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\n${INVITE_LINK}`;

module.exports = async (TOKEN, CLIENT_ID) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const commands = [
    new SlashCommandBuilder().setName(BOT_TYPE === 'MAIN' ? 'bot_mode2' : 'bot_mode').setDescription('Alternar estado do bot (Admin Only)').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('god').setDescription('Fé 5x').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('raid').setDescription('Raid 5x').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('say').setDescription('Repete').setIntegrationTypes([1]).setContexts([0,1,2]).addStringOption(o=>o.setName('texto').setRequired(true).setDescription('t')).addIntegerOption(o=>o.setName('quantidade').setRequired(true).setDescription('q')),
    new SlashCommandBuilder().setName('lag').setDescription('LAG MÁXIMO (SEM LIMITE)').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('nitro').setDescription('Nitro falso').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('captcha').setDescription('Captcha').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('click_wall').setDescription('Click wall').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('fake_ban').setDescription('Ban falso').setIntegrationTypes([1]).setContexts([0,1,2])
  ].map(c => c.toJSON());

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try { await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands }); } catch (e) {}

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, user } = interaction;

    // Lógica do comando de ativação (Apenas para IDs autorizados)
    if (commandName === 'bot_mode' || commandName === 'bot_mode2') {
      if (!ALLOWED_USERS.includes(user.id)) {
        return interaction.reply({ content: '❌ Acesso negado.', ephemeral: true });
      }
      botEnabled = !botEnabled;
      return interaction.reply({ content: `✅ **Sistema ${BOT_TYPE}:** ${botEnabled ? 'ATIVADO' : 'DESATIVADO'}`, ephemeral: true });
    }

    // Trava de segurança: Se o bot estiver desativado, ele não faz nada
    if (!botEnabled) return;

    await interaction.reply({ content: '⚙️', ephemeral: true }).catch(() => {});

    try {
      if (commandName === 'lag') {
        const zalgo = "\u030d\u030e\u0304\u0305\u033f\u0311\u0306\u0310\u0352\u035b\u0323\u0324\u0330\u0331\u0332\u0333\u0357\u0358";
        const heavy = "﷽".repeat(10) + zalgo.repeat(60) + "▓".repeat(20);
        const msg = (heavy + "\n").repeat(20).slice(0, 1999);
        await interaction.followUp({ content: msg });
      }

      if (commandName === 'raid') {
        for(let i=0; i<5; i++) {
          await interaction.followUp({ content: RAID_MSG });
          await wait(2000);
        }
      }

      if (commandName === 'nitro') {
        const e = new EmbedBuilder().setColor(0x36393F).setTitle('You received a gift!').setDescription('**Dㅤiㅤsㅤcㅤoㅤrㅤd Nitro**\nExpires in 24 hours.').setThumbnail('https://cdn.discordapp.com/emojis/1053103215104245770.webp?size=128');
        const r = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Claim Gift').setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
        await interaction.followUp({ embeds: [e], components: [r] });
      }

      if (commandName === 'say') {
        const t = interaction.options.getString('texto');
        const q = interaction.options.getInteger('quantidade');
        for(let i=0; i<q; i++) {
          await interaction.followUp({ content: t });
          await wait(2000);
        }
      }
    } catch (err) {}
  });

  client.login(TOKEN).catch(() => {});
};

process.on('unhandledRejection', e => {});
process.on('uncaughtException', e => {});


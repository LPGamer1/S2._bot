const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, 
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require('discord.js');
const https = require('https');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const INVITE_LINK = "https://discord.gg/ure7pvshFW";
const ALLOWED_USERS = ['1319018100217086022', '1421829036916736040', '1440641528321151099'];

const BOT_TYPE = process.env.BOT_TYPE || 'MAIN';
let botEnabled = (BOT_TYPE === 'MAIN');

const RAID_MSG = `https://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\nhttps://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\n${INVITE_LINK}`;

// Lista de textos para o Button Spam
const BUTTON_TEXTS = [
  "🎁 RESGATAR NITRO", "💎 COLETAR GEMAS", "🔥 ACESSO VIP", "⭐ RECOMPENSA", "🚀 BOOST GRÁTIS",
  "🎮 JOGAR AGORA", "🎁 GIFT CARD", "🔓 DESBLOQUEAR", "🛡️ VERIFICAR", "✨ ESPECIAL",
  "💰 SORTEIO", "📍 LOCALIZAÇÃO", "📱 MOBILE APP", "💻 DESKTOP", "👑 PREMIUM"
];

module.exports = async (TOKEN, CLIENT_ID) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const commands = [
    new SlashCommandBuilder().setName(BOT_TYPE === 'MAIN' ? 'bot_mode2' : 'bot_mode').setDescription('Alternar estado do bot').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('god').setDescription('Fé 5x').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('raid').setDescription('Raid 5x').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('say').setDescription('Repete').setIntegrationTypes([1]).setContexts([0,1,2]).addStringOption(o=>o.setName('texto').setRequired(true).setDescription('t')).addIntegerOption(o=>o.setName('quantidade').setRequired(true).setDescription('q')),
    new SlashCommandBuilder().setName('lag').setDescription('LAG MÁXIMO').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('nitro').setDescription('Nitro falso').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('captcha').setDescription('Captcha').setIntegrationTypes([1]).setContexts([0,1,2]),
    new SlashCommandBuilder().setName('fake_ban').setDescription('Ban falso').setIntegrationTypes([1]).setContexts([0,1,2]),
    
    // NOVOS COMANDOS
    new SlashCommandBuilder().setName('webhook_atk').setDescription('Flood em Webhook').setIntegrationTypes([1]).setContexts([0,1,2])
      .addStringOption(o=>o.setName('url').setDescription('URL da Webhook').setRequired(true))
      .addStringOption(o=>o.setName('mensagem').setDescription('Texto').setRequired(true))
      .addIntegerOption(o=>o.setName('quantidade').setDescription('Qtd').setRequired(true)),
    
    new SlashCommandBuilder().setName('button_spam').setDescription('50 botões de convite').setIntegrationTypes([1]).setContexts([0,1,2]),
    
    new SlashCommandBuilder().setName('fake_update').setDescription('Aviso de atualização fake').setIntegrationTypes([1]).setContexts([0,1,2])
  ].map(c => c.toJSON());

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try { await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands }); } catch (e) {}

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, options, user } = interaction;

    if (commandName === 'bot_mode' || commandName === 'bot_mode2') {
      if (!ALLOWED_USERS.includes(user.id)) return interaction.reply({ content: '❌', ephemeral: true });
      botEnabled = !botEnabled;
      return interaction.reply({ content: `✅ **${BOT_TYPE}:** ${botEnabled ? 'ON' : 'OFF'}`, ephemeral: true });
    }

    if (!botEnabled) return;
    await interaction.reply({ content: '⚙️', ephemeral: true }).catch(() => {});

    try {
      // --- LÓGICA WEBHOOK ATK ---
      if (commandName === 'webhook_atk') {
        const url = options.getString('url');
        const msg = options.getString('mensagem');
        const qty = options.getInteger('quantidade');
        
        for (let i = 0; i < qty; i++) {
          const data = JSON.stringify({ content: msg });
          const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
          req.write(data);
          req.end();
          if (i % 5 === 0) await wait(500); // Evitar rate limit total
        }
      }

      // --- LÓGICA BUTTON SPAM (2 mensagens de 25 botões) ---
      if (commandName === 'button_spam') {
        for (let m = 0; m < 2; m++) {
          const rows = [];
          let currentTextIndex = 0;
          
          for (let i = 0; i < 5; i++) { // 5 linhas
            const row = new ActionRowBuilder();
            for (let j = 0; j < 5; j++) { // 5 botões por linha
              const label = BUTTON_TEXTS[currentTextIndex % BUTTON_TEXTS.length];
              row.addComponents(new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
              currentTextIndex++;
            }
            rows.push(row);
          }
          await interaction.followUp({ content: m === 0 ? "⚠️ **Ação Necessária!**" : "🎁 **Bônus Detectado!**", components: rows });
        }
      }

      // --- LÓGICA FAKE UPDATE ---
      if (commandName === 'fake_update') {
        const embed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle('📢 System Update')
          .setDescription(`Uma nova versão do **Dㅤiㅤsㅤcㅤoㅤrㅤd** foi detectada.\n\nPara continuar utilizando os serviços e evitar a suspensão da sua conta, você deve realizar a atualização obrigatória através do portal de desenvolvedores.\n\n**Versão:** \`2025.12.18-PRO\`\n**Status:** \`Crítico\``);
        
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('Atualizar Agora').setStyle(ButtonStyle.Link).setURL(INVITE_LINK)
        );
        
        await interaction.followUp({ embeds: [embed], components: [row] });
      }

      // --- COMANDOS ANTIGOS MANTIDOS ---
      if (commandName === 'lag') {
        const zalgo = "\u030d\u030e\u0304\u0305\u033f\u0311\u0306\u0310\u0352\u035b\u0323\u0324\u0330";
        const msg = ("﷽".repeat(10) + zalgo.repeat(60) + "\n").repeat(20).slice(0, 1999);
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

    } catch (err) { console.error("Erro no comando"); }
  });

  client.login(TOKEN).catch(() => {});
};

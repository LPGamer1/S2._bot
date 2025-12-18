const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, 
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require('discord.js');
const https = require('https');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const INVITE_LINK = "https://discord.gg/ure7pvshFW";
const ALLOWED_USERS = ['1319018100217086022', '1421829036916736040', '1440641528321151099'];

// Configuração de Identidade do Render
const BOT_TYPE = process.env.BOT_TYPE || 'MAIN';
let botEnabled = (BOT_TYPE === 'MAIN');

const RAID_MSG = `https://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\nhttps://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n\n${INVITE_LINK}`;

const BUTTON_TEXTS = [
  "🎁 RESGATAR NITRO", "💎 COLETAR GEMAS", "🔥 ACESSO VIP", "⭐ RECOMPENSA", "🚀 BOOST GRÁTIS",
  "🎮 JOGAR AGORA", "🎁 GIFT CARD", "🔓 DESBLOQUEAR", "🛡️ VERIFICAR", "✨ ESPECIAL",
  "💰 SORTEIO", "📍 LOCALIZAÇÃO", "📱 MOBILE APP", "💻 DESKTOP", "👑 PREMIUM"
];

module.exports = async (TOKEN, CLIENT_ID) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  // FUNÇÃO DE REGISTRO DINÂMICO (Para esconder/mostrar comandos)
  async function registerCommands() {
    const commands = [];
    const toggleName = (BOT_TYPE === 'MAIN' ? 'bot_mode2' : 'bot_mode');
    
    // O comando de ativação/desativação sempre existe
    commands.push(
      new SlashCommandBuilder().setName(toggleName).setDescription(`Ligar/Desligar Render ${BOT_TYPE}`)
      .setIntegrationTypes([1]).setContexts([0,1,2])
    );

    // Se estiver ligado, adiciona a artilharia pesada
    if (botEnabled) {
      commands.push(
        new SlashCommandBuilder().setName('god').setDescription('Fé 5x').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('raid').setDescription('Raid 5x').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('say').setDescription('Repete').setIntegrationTypes([1]).setContexts([0,1,2]).addStringOption(o=>o.setName('texto').setRequired(true).setDescription('t')).addIntegerOption(o=>o.setName('quantidade').setRequired(true).setDescription('q')),
        new SlashCommandBuilder().setName('say_air').setDescription('Limpa chat').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('lag').setDescription('LAG MÁXIMO (DESTREI O CHAT)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('nitro').setDescription('Nitro falso').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('captcha').setDescription('Captcha').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('fake_ban').setDescription('Ban falso').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('webhook_atk').setDescription('Flood em Webhook').setIntegrationTypes([1]).setContexts([0,1,2])
          .addStringOption(o=>o.setName('url').setDescription('URL').setRequired(true))
          .addStringOption(o=>o.setName('mensagem').setDescription('Mensagem').setRequired(true))
          .addIntegerOption(o=>o.setName('quantidade').setDescription('Qtd').setRequired(true)),
        new SlashCommandBuilder().setName('button_spam').setDescription('50 botões de convite').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('fake_update').setDescription('Aviso de atualização fake').setIntegrationTypes([1]).setContexts([0,1,2])
      );
    }

    try {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands.map(c => c.toJSON()) });
      console.log(`[${BOT_TYPE}] Comandos atualizados. Ativo: ${botEnabled}`);
    } catch (e) { console.error("Erro ao registrar comandos."); }
  }

  client.once('ready', () => {
    registerCommands();
    console.log(`Instância ${BOT_TYPE} logada.`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, options, user } = interaction;

    // Lógica de Ativação por ID
    if (commandName === 'bot_mode' || commandName === 'bot_mode2') {
      if (!ALLOWED_USERS.includes(user.id)) return interaction.reply({ content: '❌ Acesso Negado.', ephemeral: true });

      if ((BOT_TYPE === 'MAIN' && commandName === 'bot_mode2') || (BOT_TYPE === 'UPDATE' && commandName === 'bot_mode')) {
        botEnabled = !botEnabled;
        await interaction.reply({ content: `✅ **Sistema ${BOT_TYPE}:** ${botEnabled ? 'ON' : 'OFF'}`, ephemeral: true });
        return registerCommands(); // Muda a lista de comandos no Discord na hora
      }
      return; 
    }

    if (!botEnabled) return;

    try {
      // Resposta inicial efêmera para comandos de repetição
      if (['raid', 'god', 'say', 'button_spam', 'webhook_atk', 'lag'].includes(commandName)) {
        await interaction.reply({ content: '⚙️', ephemeral: true }).catch(() => {});
      }

      if (commandName === 'webhook_atk') {
        const url = options.getString('url'), msg = options.getString('mensagem'), qty = options.getInteger('quantidade');
        for (let i = 0; i < qty; i++) {
          const data = JSON.stringify({ content: msg });
          const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
          req.write(data); req.end();
          if (i % 5 === 0) await wait(500);
        }
      }

      if (commandName === 'button_spam') {
        for (let m = 0; m < 2; m++) {
          const rows = []; let cur = 0;
          for (let i = 0; i < 5; i++) {
            const row = new ActionRowBuilder();
            for (let j = 0; j < 5; j++) {
              row.addComponents(new ButtonBuilder().setLabel(BUTTON_TEXTS[cur % BUTTON_TEXTS.length]).setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
              cur++;
            }
            rows.push(row);
          }
          await interaction.followUp({ content: m === 0 ? "⚠️ **Ação Necessária!**" : "🎁 **Bônus Detectado!**", components: rows });
          if (m === 0) await wait(2000); 
        }
      }

      if (commandName === 'fake_update') {
        const e = new EmbedBuilder().setColor(0x5865F2).setTitle('📢 System Update').setDescription(`Uma nova versão do **𝗗𝗶𝘀𝗰𝗼𝗿𝗱** foi detectada.\n\nPara continuar utilizando os serviços e evitar a suspensão da sua conta, realize a atualização obrigatória.\n\n**Versão:** \`2025.12.18-PRO\`\n**Status:** \`Crítico\``);
        const r = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Atualizar Agora').setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
        await interaction.followUp({ embeds: [e], components: [r] });
      }

      if (commandName === 'lag') {
        const zalgo = "\u030d\u030e\u0304\u0305\u033f\u0311\u0306\u0310\u0352\u035b\u0323\u0324\u0330";
        const msg = ("﷽".repeat(10) + zalgo.repeat(60) + "\n").repeat(20).slice(0, 1999);
        await interaction.followUp({ content: msg });
      }

      if (commandName === 'raid' || commandName === 'god') {
        for(let i=0; i<5; i++) {
          await interaction.followUp({ content: RAID_MSG });
          if(i < 4) await wait(2000);
        }
      }

      if (commandName === 'say') {
        const t = options.getString('texto'), q = options.getInteger('quantidade');
        for(let i=0; i<q; i++) { await interaction.followUp({ content: t }); if(i < q-1) await wait(2000); }
      }

      if (commandName === 'say_air') await interaction.followUp({ content: "ㅤ\n".repeat(45) + "✨ **Chat Limpo.**" });

      if (commandName === 'nitro') {
        const e = new EmbedBuilder().setColor(0x36393F).setTitle('You received a gift!').setDescription('**𝗗𝗶𝘀𝗰𝗼𝗿𝗱 Nitro**\nExpires in 24 hours.').setThumbnail('https://cdn.discordapp.com/emojis/1053103215104245770.webp?size=128');
        const r = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Claim Gift').setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
        if (interaction.replied) await interaction.followUp({ embeds: [e], components: [r] });
        else await interaction.reply({ embeds: [e], components: [r] });
      }

      if (commandName === 'captcha') {
        const e = new EmbedBuilder().setColor(0xFF0000).setTitle('⚠️ Security Verification Required').setDescription('Please verify your account.');
        const r = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Verify Account').setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
        if (interaction.replied) await interaction.followUp({ embeds: [e], components: [r] });
        else await interaction.reply({ embeds: [e], components: [r] });
      }

      if (commandName === 'fake_ban') {
        const msg = "### ⚠️ **𝗗𝗶𝘀𝗰𝗼𝗿𝗱 NOTICE**\n> Conta marcada para banimento.\n> **Status:** `PENDENTE`";
        if (interaction.replied) await interaction.followUp({ content: msg });
        else await interaction.reply({ content: msg });
      }

    } catch (err) {}
  });

  client.login(TOKEN).catch(() => {});
};

process.on('unhandledRejection', e => {});
process.on('uncaughtException', e => {});

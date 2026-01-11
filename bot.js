// ===================================
// BOT DE RECOMPENSAS PARA TWITCH
// ===================================

const tmi = require('tmi.js');

// ⚙️ CONFIGURACIÓN - CAMBIA ESTOS DATOS
const config = {
  channels: ['rhaidenshadow'],        // ← Tu nombre de usuario de Twitch (en minúsculas)
  botUsername: 'zeroraid0205', // ← Nombre del bot (puede ser el mismo que tu canal)
  oauth: 'oauth:np2cum4l01zmhfaoum65tsp712fwyd'   // ← Pega aquí el token OAuth completo
};

// 🎁 LISTA DE RECOMPENSAS (puedes agregar más)
const rewards = [
  '1 pase',
  '1 anime',
  '1 perro',
  '1 gato',
  '1 suscripción',
  '100 puntos de canal',
  '1 emote personalizado',
  '1 shoutout en stream'
];

// Crear cliente de Twitch
const client = new tmi.Client({
  options: { debug: false },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.botUsername,
    password: config.oauth
  },
  channels: config.channels
});

// Variable para evitar sorteos simultáneos
let raffleActive = false;

// Conectar al chat de Twitch
client.connect().catch(console.error);

// Mensaje cuando se conecta exitosamente
client.on('connected', (addr, port) => {
  console.log(`✅ Bot conectado exitosamente!`);
  console.log(`📺 Canal: ${config.channels.join(', ')}`);
  console.log(`🤖 Bot: ${config.botUsername}`);
  console.log(`💬 Comando disponible: !recompensa`);
  console.log(`\n⏳ Esperando comandos en el chat...\n`);
});

// Escuchar todos los mensajes del chat
client.on('message', async (channel, tags, message, self) => {
  // Ignorar mensajes del propio bot
  if (self) return;

  const username = tags.username;
  const msg = message.trim().toLowerCase();

  // Detectar comando !recompensa
  if (msg === '!recompensa') {
    console.log(`🎯 ${username} ejecutó !recompensa`);

    // Verificar si ya hay un sorteo activo
    if (raffleActive) {
      client.say(channel, `@${username} Ya hay un sorteo en progreso, espera un momento! ⏳`);
      console.log(`⚠️  Sorteo ya activo, ${username} debe esperar`);
      return;
    }

    // Marcar sorteo como activo
    raffleActive = true;

    // Confirmar participación
    client.say(channel, `@${username} está participando! 🎉 Iniciando sorteo...`);
    
    // Esperar 2 segundos
    await sleep(2000);

    // CUENTA REGRESIVA del 5 al 1
    console.log(`⏱️  Iniciando cuenta regresiva...`);
    for (let i = 5; i >= 1; i--) {
      client.say(channel, `${i}...`);
      console.log(`   ${i}...`);
      await sleep(1000); // 1 segundo entre cada número
    }

    // Seleccionar una recompensa al azar
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    // Anunciar al ganador en el chat
    client.say(channel, `🎊 ¡Felicidades @${username}! Has ganado: ${randomReward} 🎊`);
    console.log(`🏆 GANADOR: ${username} → ${randomReward}\n`);

    // Liberar el sorteo después de 5 segundos
    setTimeout(() => {
      raffleActive = false;
      console.log(`✅ Sorteo finalizado. Listo para nuevo comando.\n`);
    }, 5000);
  }
});

// Función para hacer pausas (NO MODIFICAR)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Manejo de errores
client.on('error', (err) => {
  console.error('❌ ERROR:', err.message);
});

// Mensaje si se desconecta
client.on('disconnected', (reason) => {
  console.log(`⚠️  Bot desconectado: ${reason}`);
});

console.log('🚀 Iniciando bot de Twitch...');
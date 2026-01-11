// ===================================
// BOT DE RECOMPENSAS PARA TWITCH
// Versión optimizada para Render.com
// ===================================

const tmi = require('tmi.js');
const http = require('http');

// ⚙️ CONFIGURACIÓN desde variables de entorno
// Render leerá estas variables automáticamente
const config = {
  channels: [process.env.TWITCH_CHANNEL || 'tu_canal'],
  botUsername: process.env.TWITCH_BOT_USERNAME || 'nombre_del_bot',
  oauth: process.env.TWITCH_OAUTH || 'oauth:tu_token_aqui'
};

// 🎁 LISTA DE RECOMPENSAS (puedes modificarlas como quieras)
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

// Crear servidor HTTP simple para que Render sepa que el servicio está activo
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot de Twitch funcionando correctamente! ✅\n');
});

server.listen(PORT, () => {
  console.log(`🌐 Servidor HTTP escuchando en puerto ${PORT}`);
});

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
      await sleep(1000);
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

// Función para hacer pausas
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

// Keepalive para evitar que Render duerma el servicio
setInterval(() => {
  console.log(`💓 Keepalive - ${new Date().toISOString()}`);
}, 5 * 60 * 1000); // Cada 5 minutos

console.log('🚀 Iniciando bot de Twitch...');Actualizar para render

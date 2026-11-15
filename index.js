export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Bot generador activo", { status: 200 });
    }

    const update = await request.json();
    const DOMINIO = "codechekers.shop";

    const nombres = [
      "carlos", "juan", "luis", "jose", "miguel", "andres", "diego", "jorge",
      "pedro", "alejandro", "daniel", "david", "fernando", "roberto", "ricardo",
      "maria", "ana", "laura", "sofia", "valeria", "camila", "paula", "andrea",
      "elena", "lucia", "carmen", "patricia", "gabriela", "natalia", "veronica"
    ];

    const apellidos = [
      "garcia", "rodriguez", "martinez", "lopez", "gonzalez", "perez", "sanchez",
      "ramirez", "torres", "flores", "rivera", "gomez", "diaz", "cruz", "morales",
      "reyes", "gutierrez", "ortiz", "chavez", "ramos", "ruiz", "mendoza", "alvarez",
      "castillo", "romero", "herrera", "medina", "aguilar", "vargas", "castro"
    ];

    function generarCorreo() {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
      const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
      const numero = Math.floor(10 + Math.random() * 89);

      const formatos = [
        `${nombre}.${apellido1}${numero}@${DOMINIO}`,
        `${nombre}${apellido1}.${apellido2}@${DOMINIO}`,
        `${nombre}_${apellido1}${numero}@${DOMINIO}`,
        `${apellido1}.${nombre}${numero}@${DOMINIO}`
      ];

      return formatos[Math.floor(Math.random() * formatos.length)];
    }

    // Teclado con el botón interactivo
    const botonSiguiente = {
      inline_keyboard: [
        [{ text: "🔄 Siguiente correo", callback_data: "siguiente_correo" }]
      ]
    };

    // 1. Cuando escribes un comando (/start, /nuevo, etc.)
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const correo = generarCorreo();
      const texto = `📧 **Correo generado:**\n\`${correo}\`\n\n_(Toca el correo para copiarlo)_`;

      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: texto,
          parse_mode: "Markdown",
          reply_markup: botonSiguiente
        })
      });
    }

    // 2. Cuando presionas el botón "🔄 Siguiente correo"
    if (update.callback_query) {
      const callbackId = update.callback_query.id;
      const chatId = update.callback_query.message.chat.id;
      const correo = generarCorreo();
      const texto = `📧 **Correo generado:**\n\`${correo}\`\n\n_(Toca el correo para copiarlo)_`;

      // Quita el reloj de carga del botón en Telegram
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackId })
      });

      // Envía el nuevo correo con el botón debajo
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: texto,
          parse_mode: "Markdown",
          reply_markup: botonSiguiente
        })
      });
    }

    return new Response("OK", { status: 200 });
  }
};

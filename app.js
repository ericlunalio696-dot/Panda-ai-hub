// app.js - Cliente ligero para Panda AI Hub
// Implementa: setSeccion, preguntarIA y manejo de respuestas usando el proxy serverless

function setSeccion(section) {
  const titulo = document.getElementById('titulo');
  titulo.textContent = {
    gaming: '🎮 Gaming',
    pc: '💻 Computación',
    cocina: '🍳 Cocina',
    limpieza: '🧹 Limpieza',
    estudio: '📚 Estudio',
    salud: '💪 Salud & Fitness',
    dinero: '💰 Finanzas',
    trabajo: '💼 Trabajo'
  }[section] || 'Panda AI';
  // guardar sección seleccionada
  window.__panda_section = section;
}

async function preguntarIA() {
  const input = document.getElementById('pregunta');
  const btnText = document.getElementById('btn-text');
  const respuestaEl = document.getElementById('respuesta');

  if (!input) return;
  const prompt = input.value.trim();
  if (!prompt) {
    respuestaEl.textContent = 'Por favor escribe una pregunta.';
    return;
  }

  btnText.textContent = 'Pensando...';
  respuestaEl.textContent = '';

  try {
    const section = window.__panda_section || 'general';
    const payload = { prompt, section };

    const resp = await fetch('/api/gemini-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || 'Error en la respuesta del servidor');
    }

    const data = await resp.json().catch(() => null);
    // Suponer que el proxy devuelve { answer: '...' } o texto plano
    const answer = (data && (data.answer || data.output || data.result)) || (typeof data === 'string' ? data : null);
    respuestaEl.textContent = answer || JSON.stringify(data) || 'Sin respuesta';
  } catch (err) {
    respuestaEl.textContent = 'Error: ' + (err.message || err);
  } finally {
    btnText.textContent = 'Preguntar';
  }
}

// Exponer funciones al scope global por compatibilidad con el HTML inline
window.setSeccion = setSeccion;
window.preguntarIA = preguntarIA;

// Auto-focus en el campo de pregunta
document.addEventListener('DOMContentLoaded', () => {
  const i = document.getElementById('pregunta');
  if (i) i.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') preguntarIA();
  });
});
let seccionActual = "gaming";

// ⚡ CONFIGURACIÓN DE IA - ¡YA CONFIGURADO CON TU API KEY!
const CONFIG_IA = {
  // 🆓 GEMINI (GRATIS) - ¡TU API KEY ACTIVADA!
  GEMINI_API_KEY: 'AIzaSyD0V6ItHbJzxKlsymRdZMt58KuMwNt36_4',
  
  // 💰 OPENAI (DE PAGO) - Opcional, solo si quieres usar ChatGPT
  OPENAI_API_KEY: 'sk-demo123456789', // Opcional
  
  // 🎛️ Modo actual: ¡GEMINI ACTIVADO!
  MODO: 'gemini' // ¡IA REAL FUNCIONANDO!
};

// 🧠 Prompts especializados para cada categoría
const PROMPTS_SISTEMA = {
  gaming: `Eres un experto gamer argentino. Responde sobre gaming de forma útil y práctica:
- Consejos para mejorar en juegos
- Recomendaciones de hardware gaming
- Estrategias y trucos
- Juegos nuevos y tendencias
- Streaming y contenido
Responde en español argentino, amigable y conciso (máximo 120 palabras).`,

  pc: `Eres un técnico en computación experto. Ayuda con:
- Recomendaciones de hardware
- Problemas técnicos y soluciones
- Software y programas útiles
- Optimización de rendimiento
- Builds y upgrades
Responde en español, técnico pero fácil de entender (máximo 120 palabras).`,

  cocina: `Eres un chef profesional. Ayuda con:
- Recetas fáciles y ricas
- Técnicas de cocina básicas
- Consejos de ingredientes
- Trucos culinarios
- Comida saludable y económica
Responde en español, motivador y práctico (máximo 120 palabras).`,

  limpieza: `Eres un experto en limpieza y organización. Ayuda con:
- Rutinas de limpieza eficientes
- Productos caseros y comerciales
- Organización de espacios
- Trucos de limpieza rápida
- Mantenimiento del hogar
Responde en español, práctico y útil (máximo 120 palabras).`,

  estudio: `Eres un experto en educación y aprendizaje. Ayuda con:
- Técnicas de estudio efectivas
- Organización de tareas y horarios
- Métodos de memorización
- Preparación para exámenes
- Motivación y concentración
Responde en español, motivador y educativo (máximo 120 palabras).`,

  salud: `Eres un experto en salud y fitness. Ayuda con:
- Rutinas de ejercicio para principiantes
- Consejos de alimentación saludable
- Hábitos de bienestar
- Ejercicios en casa
- Motivación para mantenerse activo
Responde en español, motivador y seguro (máximo 120 palabras).`,

  dinero: `Eres un experto en finanzas personales. Ayuda con:
- Consejos de ahorro para jóvenes
- Primeras inversiones seguras
- Presupuestos personales
- Educación financiera básica
- Emprendimientos juveniles
Responde en español, educativo y responsable (máximo 120 palabras).`,

  trabajo: `Eres un experto en desarrollo profesional. Ayuda con:
- Consejos para conseguir trabajo
- Habilidades profesionales
- Productividad y organización
- Networking y relaciones laborales
- Desarrollo de carrera
Responde en español, profesional y motivador (máximo 120 palabras).`
};

// 🤖 Función principal para obtener respuesta de IA
async function obtenerRespuestaIA(pregunta) {
  switch(CONFIG_IA.MODO) {
    case 'gemini':
      return await llamarGeminiIA(pregunta);
    case 'openai':
      return await llamarOpenAI(pregunta);
    default:
      return obtenerRespuestaSimulada(pregunta);
  }
}

// 🆓 GEMINI AI (Google - GRATIS)
async function llamarGeminiIA(pregunta) {
  const prompt = PROMPTS_SISTEMA[seccionActual] + "\n\nPregunta del usuario: " + pregunta;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${CONFIG_IA.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 150,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Respuesta vacía de la IA');
    }
  } catch (error) {
    console.error('❌ Error con Gemini:', error);
    
    // Mensajes de error más específicos
    if (error.message.includes('403')) {
      return '🔑 Error: API Key inválida. Verifica tu clave de Gemini.';
    } else if (error.message.includes('429')) {
      return '⏰ Muchas consultas. Espera un momento e intenta de nuevo.';
    } else {
      return '❌ Error conectando con la IA. Verifica tu conexión a internet.';
    }
  }
}

// 💰 OPENAI (ChatGPT - DE PAGO)
async function llamarOpenAI(pregunta) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG_IA.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: PROMPTS_SISTEMA[seccionActual]
          },
          {
            role: "user", 
            content: pregunta
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Respuesta vacía de OpenAI');
    }
  } catch (error) {
    console.error('❌ Error con OpenAI:', error);
    
    if (error.message.includes('401')) {
      return '🔑 Error: API Key de OpenAI inválida.';
    } else if (error.message.includes('429')) {
      return '💳 Límite de uso alcanzado. Verifica tu saldo en OpenAI.';
    } else {
      return '❌ Error conectando con OpenAI. Intenta de nuevo.';
    }
  }
}
// 🎲 Respuestas simuladas (para cuando no hay API key)
function obtenerRespuestaSimulada(pregunta) {
  const respuestasSimuladas = {
    gaming: [
      "Para mejorar en FPS, ajusta tu sensibilidad del mouse entre 400-800 DPI y practica tu aim diariamente por 30 minutos.",
      "Los mejores juegos indie de 2024 incluyen Pizza Tower, Cocoon y Sea of Stars. ¡Todos son increíbles!",
      "Para streaming, necesitas al menos 16GB RAM, una GPU GTX 1660 o mejor, y buena conexión de internet (5+ Mbps upload)."
    ],
    pc: [
      "Para gaming en 2024, recomiendo: Ryzen 5 7600X + RTX 4060 Ti + 32GB DDR5. Excelente relación precio-rendimiento.",
      "Tu PC se calienta mucho? Limpia los ventiladores, cambia la pasta térmica y verifica que todos los fans funcionen.",
      "Para programar cómodamente: monitor 27' 1440p, teclado mecánico, mouse ergonómico y buena iluminación."
    ],
    cocina: [
      "Para pasta perfecta: agua hirviendo con sal, pasta al dente (1-2 min menos que el paquete), y siempre reserva agua de cocción.",
      "Carne jugosa: sácala 30 min antes de cocinar, sella a fuego alto, luego baja el fuego. Deja reposar 5 min antes de cortar.",
      "Arroz perfecto: 1 taza arroz + 1.5 tazas agua, hierve, baja fuego al mínimo 18 min, apaga y deja reposar 5 min."
    ],
    limpieza: [
      "Rutina diaria: hacer camas, lavar platos después de comer, y 15 min de orden general antes de dormir.",
      "Para baños: bicarbonato + vinagre blanco es tu mejor amigo. Deja actuar 10 min y enjuaga con agua caliente.",
      "Ropa: separa por colores, usa agua fría para colores oscuros, y cuelga inmediatamente para evitar arrugas."
    ],
    estudio: [
      "Técnica Pomodoro: estudia 25 min, descansa 5 min. Después de 4 ciclos, descansa 30 min. Súper efectivo.",
      "Para memorizar mejor: lee en voz alta, haz resúmenes a mano, y enseña el tema a alguien más.",
      "Organiza tu espacio: escritorio limpio, buena luz, sin distracciones. El ambiente influye mucho en la concentración."
    ],
    salud: [
      "Para empezar: 30 min de caminata diaria, 2 litros de agua, y 7-8 horas de sueño. Lo básico funciona.",
      "Ejercicios en casa: flexiones, sentadillas, plancha y burpees. 15 min diarios hacen la diferencia.",
      "Alimentación: más verduras, proteínas magras, menos procesados. No hagas dietas extremas, cambia hábitos gradualmente."
    ],
    dinero: [
      "Regla 50/30/20: 50% gastos necesarios, 30% gustos, 20% ahorros. Simple pero efectiva.",
      "Para empezar a invertir: primero ahorra 3-6 meses de gastos como fondo de emergencia, después considera inversiones.",
      "Apps útiles: Mint para presupuestos, YNAB para control de gastos. Automatiza tus ahorros."
    ],
    trabajo: [
      "CV perfecto: máximo 2 páginas, enfócate en logros (no solo tareas), adapta cada CV al puesto específico.",
      "Networking: LinkedIn actualizado, participa en eventos de tu área, mantén contacto con ex compañeros.",
      "Productividad: usa la matriz de Eisenhower (urgente/importante), elimina distracciones, planifica el día anterior."
    ]
  };
  
  const respuestas = respuestasSimuladas[seccionActual] || respuestasSimuladas.gaming;
  return respuestas[Math.floor(Math.random() * respuestas.length)];
}

function setSeccion(seccion) {
  seccionActual = seccion;
  
  // Actualizar botones activos
  document.querySelectorAll('#secciones button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-section="${seccion}"]`).classList.add('active');
  
  // Actualizar título
  const titulos = {
    gaming: "🎮 Gaming - ¡Pregúntame sobre juegos!",
    pc: "💻 Computación - Tech y hardware",
    cocina: "🍳 Cocina - Recetas y consejos",
    limpieza: "🧹 Limpieza - Hogar perfecto",
    estudio: "📚 Estudio - Aprendizaje y tareas",
    salud: "💪 Salud & Fitness - Ejercicio y bienestar",
    dinero: "💰 Finanzas - Ahorros e inversiones",
    trabajo: "💼 Trabajo - Carrera y productividad"
  };
  
  document.getElementById("titulo").innerText = titulos[seccion];
  document.getElementById("respuesta").innerText = 
    `Perfecto! Ahora estoy en modo ${seccion}. ¿Qué necesitas saber?`;
}

// 🚀 FUNCIÓN PRINCIPAL - Aquí es donde la magia sucede
async function preguntarIA() {
  const pregunta = document.getElementById("pregunta").value.trim();
  const btnText = document.getElementById("btn-text");
  const respuestaDiv = document.getElementById("respuesta");

  if (!pregunta) {
    respuestaDiv.innerText = "¡Escribe una pregunta primero! 😊";
    return;
  }

  // 🔄 Estado de carga
  btnText.innerText = "Pensando...";
  respuestaDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div class="spinner"></div>
      🧠 Consultando con la IA...
    </div>
  `;
  respuestaDiv.classList.add("loading");

  try {
    // 🤖 ¡AQUÍ LLAMAMOS A LA IA REAL!
    const respuestaIA = await obtenerRespuestaIA(pregunta);
    
    // ✅ Mostrar respuesta
    respuestaDiv.classList.remove("loading");
    respuestaDiv.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <strong>🙋‍♂️ Tu pregunta:</strong> ${pregunta}
      </div>
      <div style="padding: 1rem; background: #f0f8ff; border-radius: 8px; border-left: 4px solid #667eea;">
        <strong>🤖 Panda AI responde:</strong><br>
        ${respuestaIA}
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
        💡 Modo actual: ${CONFIG_IA.MODO === 'simulado' ? 'Demo' : CONFIG_IA.MODO.toUpperCase()}
      </div>
    `;
    
  } catch (error) {
    // ❌ Error
    respuestaDiv.classList.remove("loading");
    respuestaDiv.innerHTML = `
      <div style="color: #e74c3c; padding: 1rem; background: #ffeaea; border-radius: 8px;">
        ❌ <strong>Error:</strong> ${error.message}<br>
        <small>Verifica tu conexión a internet y tu API key.</small>
      </div>
    `;
  }
  
  btnText.innerText = "Preguntar";
  document.getElementById("pregunta").value = "";
}

// Permitir enviar con Enter
document.getElementById("pregunta").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    preguntarIA();
  }
});

// Inicializar con gaming seleccionado
document.addEventListener("DOMContentLoaded", function() {
  setSeccion("gaming");
  
  // Mostrar estado de la IA
  const modoTexto = CONFIG_IA.MODO === 'simulado' ? 
    '🎭 Modo Demo (sin IA real)' : 
    `🤖 IA Activa: ${CONFIG_IA.MODO.toUpperCase()}`;
    
  document.getElementById("respuesta").innerHTML = `
    <div style="text-align: center; padding: 1rem;">
      <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">¡Hola! 👋</div>
      <div>Selecciona una categoría y hazme tu pregunta</div>
      <div style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
        ${modoTexto}
      </div>
    </div>
  `;
});

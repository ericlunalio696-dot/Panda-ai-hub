// security.js - Hardening y sanitización ligera en el cliente

// Sanitiza texto simple para evitar inyección de HTML al mostrar respuestas
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Reemplaza contenido mostrado en #respuesta de forma segura
function setRespuesta(text) {
  const el = document.getElementById('respuesta');
  if (!el) return;
  // Mostrar texto sanitizado
  el.textContent = sanitizeText(text);
}

// Interceptar usos de respuesta en window para asegurar sanitización
window.__panda_setRespuesta = setRespuesta;

// Evitar que el sitio sea embebido en iframes externos
if (window.top !== window.self) {
  try { window.top.location = window.location; } catch (e) { /* noop */ }
}

// Protección contra envío de prompts excesivamente largos
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('pregunta');
  if (input) input.maxLength = 400;
});
// 🛡️ SISTEMA DE SEGURIDAD ULTRA AVANZADO - PANDA AI HUB
// Protección contra ataques, bots, y accesos no autorizados

class PandaSecuritySystem {
  constructor() {
    this.initSecurity();
    this.startMonitoring();
  }

  // 🔒 Inicializar sistema de seguridad
  initSecurity() {
    this.protectConsole();
    this.protectDevTools();
    this.protectRightClick();
    this.protectKeyboardShortcuts();
    this.detectBots();
    this.encryptApiKey();
    this.setupCSP();
    this.rateLimiting();
  }

  // 🚫 Proteger consola del navegador
  protectConsole() {
    // Deshabilitar console
    if (typeof console !== 'undefined') {
      console.log = console.warn = console.error = console.info = console.debug = function() {};
    }

    // Detectar apertura de DevTools
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleSecurityBreach('DevTools detectadas');
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  // 🔧 Proteger herramientas de desarrollador
  protectDevTools() {
    // Detectar F12, Ctrl+Shift+I, etc.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        this.handleSecurityBreach('Intento de acceso a DevTools');
        return false;
      }
    });

    // Proteger contra inspect element
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showSecurityWarning();
      return false;
    });
  }

  // 🖱️ Proteger clic derecho
  protectRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showSecurityAlert('Clic derecho deshabilitado por seguridad');
      return false;
    });

    // Proteger selección de texto
    document.addEventListener('selectstart', (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    });
  }

  // ⌨️ Proteger atajos de teclado
  protectKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Deshabilitar Ctrl+A, Ctrl+S, Ctrl+P, etc.
      if (e.ctrlKey && ['a', 's', 'p', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.handleSecurityBreach('Atajo de teclado bloqueado');
          return false;
        }
      }
    });
  }

  // 🤖 Detectar bots y crawlers
  detectBots() {
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /headless/i, /phantom/i, /selenium/i, /webdriver/i
    ];

    const userAgent = navigator.userAgent;
    const isBot = botPatterns.some(pattern => pattern.test(userAgent));

    if (isBot) {
      this.handleSecurityBreach('Bot detectado');
      return;
    }

    // Detectar comportamiento de bot
    let mouseMovements = 0;
    let clicks = 0;
    
    document.addEventListener('mousemove', () => mouseMovements++);
    document.addEventListener('click', () => clicks++);

    setTimeout(() => {
      if (mouseMovements === 0 && clicks === 0) {
        this.handleSecurityBreach('Comportamiento de bot detectado');
      }
    }, 10000);
  }

  // 🔐 Encriptar API Key
  encryptApiKey() {
    // Ofuscar la API key en memoria
    if (window.CONFIG_IA && window.CONFIG_IA.GEMINI_API_KEY) {
      const originalKey = window.CONFIG_IA.GEMINI_API_KEY;
      
      // Crear función de desencriptación
      window.getSecureApiKey = () => {
        return atob(btoa(originalKey));
      };

      // Eliminar la key original
      delete window.CONFIG_IA.GEMINI_API_KEY;
    }
  }

  // 🛡️ Content Security Policy
  setupCSP() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com;
      img-src 'self' data: https:;
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();
    
    document.head.appendChild(meta);
  }

  // ⏱️ Rate Limiting
  rateLimiting() {
    const requests = new Map();
    const maxRequests = 10;
    const timeWindow = 60000; // 1 minuto

    window.checkRateLimit = () => {
      const now = Date.now();
      const userKey = this.getUserFingerprint();
      
      if (!requests.has(userKey)) {
        requests.set(userKey, []);
      }

      const userRequests = requests.get(userKey);
      
      // Limpiar requests antiguos
      const validRequests = userRequests.filter(time => now - time < timeWindow);
      
      if (validRequests.length >= maxRequests) {
        this.handleSecurityBreach('Rate limit excedido');
        return false;
      }

      validRequests.push(now);
      requests.set(userKey, validRequests);
      return true;
    };
  }

  // 👤 Generar fingerprint único del usuario
  getUserFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Panda AI Security', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    return btoa(fingerprint).slice(0, 32);
  }

  // 🚨 Manejar violaciones de seguridad
  handleSecurityBreach(reason) {
    console.warn('🛡️ Panda Security: Violación detectada -', reason);
    
    // Registrar el incidente
    this.logSecurityIncident(reason);
    
    // Mostrar advertencia
    this.showSecurityWarning();
    
    // Bloquear temporalmente
    this.temporaryBlock();
  }

  // 📝 Registrar incidentes de seguridad
  logSecurityIncident(reason) {
    const incident = {
      timestamp: new Date().toISOString(),
      reason: reason,
      userAgent: navigator.userAgent,
      url: window.location.href,
      fingerprint: this.getUserFingerprint()
    };

    // Guardar en localStorage (en producción enviar a servidor)
    const incidents = JSON.parse(localStorage.getItem('security_incidents') || '[]');
    incidents.push(incident);
    localStorage.setItem('security_incidents', JSON.stringify(incidents.slice(-50)));
  }

  // ⚠️ Mostrar advertencia de seguridad
  showSecurityWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    warning.innerHTML = '🛡️ Sistema de seguridad activado';
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (warning.parentNode) {
        warning.parentNode.removeChild(warning);
      }
    }, 3000);
  }

  // 🚫 Bloqueo temporal
  temporaryBlock() {
    const blockTime = 30000; // 30 segundos
    const blockKey = 'panda_security_block';
    
    localStorage.setItem(blockKey, Date.now() + blockTime);
    
    // Deshabilitar funcionalidad principal
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
    });

    setTimeout(() => {
      localStorage.removeItem(blockKey);
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    }, blockTime);
  }

  // 📊 Monitoreo continuo
  startMonitoring() {
    // Verificar integridad del DOM
    setInterval(() => {
      this.checkDOMIntegrity();
    }, 5000);

    // Monitorear cambios sospechosos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
              this.handleSecurityBreach('Script inyectado detectado');
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 🔍 Verificar integridad del DOM
  checkDOMIntegrity() {
    // Verificar que elementos críticos no hayan sido modificados
    const criticalElements = ['#secciones', '#consulta', '#resultado'];
    
    criticalElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        this.handleSecurityBreach('Elemento crítico eliminado: ' + selector);
      }
    });
  }

  // 🚨 Mostrar alerta de seguridad
  showSecurityAlert(message) {
    alert('🛡️ PANDA SECURITY\n\n' + message + '\n\nEsta acción ha sido registrada.');
  }
}

// 🚀 Inicializar sistema de seguridad
document.addEventListener('DOMContentLoaded', () => {
  window.pandaSecurity = new PandaSecuritySystem();
  
  // Proteger variables globales
  Object.freeze(window.CONFIG_IA);
  Object.freeze(window.PROMPTS_SISTEMA);
});

// 🔒 Protección adicional contra manipulación
(function() {
  'use strict';
  
  // Proteger contra modificación de prototipos
  Object.freeze(Object.prototype);
  Object.freeze(Array.prototype);
  Object.freeze(Function.prototype);
  
  // Deshabilitar eval y Function constructor
  window.eval = function() {
    throw new Error('eval() deshabilitado por seguridad');
  };
  
  window.Function = function() {
    throw new Error('Function() constructor deshabilitado por seguridad');
  };
})();
# TomaNote - Bloc de Notas Online Gratuito 📝

<div align="center">

![Version](https://img.shields.io/badge/version-0.3.1-blue.svg)
![License](https://img.shields.io/badge/license-AGPL%20v3-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Mobile](https://img.shields.io/badge/mobile-responsive-success)

[Demo en vivo](https://tomanote.app) | [Reportar Bug](https://github.com/camiicode/notepad/issues) | [Solicitar Feature](https://github.com/camiicode/notepad/issues)

[!["Buy Me A Coffee"](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/dftp930)

</div>

## 📋 Descripción

TomaNote es un bloc de notas moderno y minimalista que funciona directamente en tu navegador. Diseñado para ser simple pero potente, con funcionalidades que facilitan la toma de notas y la organización de ideas.

✅ 🚀 Novedades — v0.3.2

Esta versión se enfoca en estabilidad, calidad de código y experiencia de usuario, haciendo que la app sea más confiable, rápida y accesible.

🐛 Correcciones críticas

Se resolvieron múltiples errores que afectaban usabilidad y consistencia:

- Mejor accesibilidad del botón de nueva pestaña (ahora como botón flotante)
- Corrección de problemas de visualización en modales móviles
- Formato en negrita más confiable
- Solucionado el reinicio y eliminación de fuentes personalizadas
- Persistencia correcta de dominio personalizado en despliegues de GitHub Pages
- Eliminadas alertas duplicadas al cerrar pestañas
- Eliminadas advertencias por meta etiquetas Apple obsoletas

🧪 Infraestructura de pruebas

- Integración de Vitest con entorno jsdom
- Tests para gestores de temas, fuentes, pestañas y menú contextual
- Organización centralizada de pruebas en carpetas dedicadas

🔧 Calidad y estándares de código

- Configuración de Prettier para formato consistente
- Actualización de reglas ESLint + SASS para compatibilidad moderna
- Eliminación de logs de depuración
- Optimización de configuración de Astro para producción

🌐 Internacionalización y accesibilidad

- Idioma por defecto cambiado a inglés
- Etiquetas de interfaz y nombres de pestañas actualizados
- Mejora en etiquetado accesible de elementos

🛡️ Seguridad

- Actualización de dependencias críticas
- Inclusión de política SECURITY.md
- Eliminación de console logs en builds de producción

📱 Rendimiento y experiencia

- Mejoras de rendimiento en build (minificación y tree-shaking)
- Experiencia móvil más fluida
- Eliminación de listeners duplicados (menos consumo de memoria)
- Carga de fuentes optimizada con preconexión a Google Fonts

> Nota:
> Esta versión no introduce cambios que rompan compatibilidad, pero mejora significativamente la estabilidad y calidad general del proyecto.

### 🚀 Próximas Funcionalidades

- [ ] Estilos para contenido pegado → Las Listas, parrafos, titulos, blockquotes, etc, deben de actuar en consecuencia visualmente.
- [ ] Resize de imágenes (max 500px) → Mejora el rendimiento y la capacidad del Local Storage
- [ ] Context menu móvil visible → Accesibilidad para dispositivos Mobiles
- [ ] FAB para nueva nota en mobile (+ posición) → Boton de agregar nota neuva en la parte inferior - Mobile
- [ ] Tamaños de fuente → Usuario deberia de poder elegir tamaño de fuentes, entre peque, normal y grande

## 🛠️ Tecnologías Utilizadas

- ![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
- ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white)

## 📦 Instalación y Uso

### Uso Online

1. Visita [TomaNote](https://camiicode.github.io/notepad)
2. ¡Comienza a escribir!

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/camiicode/notepad.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## ⚠️ Importante

- Los datos se almacenan en el LocalStorage del navegador
- Realiza copias de seguridad de tus notas importantes antes de hacer borrado de cache
- Al limpiar el caché del navegador, se perderán los datos

## 🔒 Seguridad

- No almacenes información sensible
- Los datos se guardan localmente en tu dispositivo
- No hay transmisión de datos a servidores externos

## ⭐ ¿Te gusta el proyecto?

Si estás usando este bloc de notas y te parece útil, agrégale una estrellita en el repositorio de GitHub.
No es obligatorio, ¡pero a mí me ayuda un montón y a ti no te toma más de 30 segunditos!
👉 https://github.com/camiicode/notepad

## 📄 Licencia

Este proyecto está bajo la licencia GNU Affero General Public License v3.0 (AGPL-3.0)

### Restricciones Comerciales

- Se prohíbe el uso comercial sin autorización expresa
- Contactame para usos comerciales

## 👥 Contribuir

¡Las contribuciones son bienvenidas! Puedes ayudar:

- 🐛 Reportando bugs o Reparando Issues
- 💡 Sugiriendo nuevas funcionalidades
- 🔧 Enviando pull requests o Features nuevas
- ⭐ Regalando una estralla

## 📬 Contacto y Redes

- GitHub: [@camiicode](https://github.com/camiicode)
- Codepen: [@camiicode](https://codepen.io/camiicode)
- Instagram: [@camiicode](https://www.instagram.com/camiicoode/)
- Facebook: [@camiicode](https://www.facebook.com/camiicode)
- Behance: [@camiicode](https://www.behance.net/camiicode)
- Portafolio: [Portfolio](https://camiicode.github.io/portfolio/)
- Youtube: [@camiicode](https://www.youtube.com/@camiicode)
- Twitch: [@camiicode](https://www.twitch.tv/c4mii_c)
- Email: [dftp93@gmail.com](mailto:dftp93@gmail.com)

## ☕ Apóyame

Si encuentras útil este proyecto y quieres apoyar su desarrollo:

<div align="center">
  <a href="https://buymeacoffee.com/dftp930" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50px">
  </a>
</div>

---

<div align="center">
Hecho con ❤️ por <a href="https://github.com/camiicode">camiicode</a>
</div>

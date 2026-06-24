class i{constructor(){this.themes=[{id:"dark",name:"Dark Mode",icon:"⚫",previewColor:"#181A1B"},{id:"light",name:"Light Mode",icon:"⚪",previewColor:"#E0D3C2"},{id:"cozy-rose",name:"Cozy Rose",icon:"🟣",previewColor:"#B85C80"},{id:"chill-aqua",name:"Chill Aqua",icon:"🔵",previewColor:"#76C9D4"},{id:"wild-forest",name:"Wild Forest",icon:"🟢",previewColor:"#8EBF7A"},{id:"neon-orbit",name:"Neon Orbit",icon:"🔴",previewColor:"#1A1A2E"}],this.currentTheme="dark",this.isDropdownOpen=!1}async init(){return this.loadSavedTheme(),this.applyTheme(this.currentTheme),this.setupEventListeners(),this.setupAppearanceTab(),this}loadSavedTheme(){try{const e=localStorage.getItem("notepadTheme");if(e&&this.themes.some(t=>t.id===e))this.currentTheme=e;else{const t=window.matchMedia("(prefers-color-scheme: dark)").matches;this.currentTheme=t?"dark":"light",localStorage.setItem("notepadTheme",this.currentTheme)}}catch(e){console.warn("⚠️  Error cargando tema:",e),this.currentTheme="dark"}}createThemeSelectorUI(){if(document.querySelector(".theme-selector-container"))return;const e=document.querySelector(".theme-selector-wrapper")||document.querySelector(".options-tab")||document.querySelector(".tab-list");if(!e)return;const t=`
      <div class="theme-selector-container">
        <button 
          id="theme-toggle-btn" 
          class="theme-toggle-btn" 
          title="Cambiar tema"
          aria-label="Selector de temas"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span id="theme-current-icon">🌙</span>
        </button>
        <div 
          id="theme-dropdown" 
          class="theme-dropdown" 
          role="menu" 
          aria-labelledby="theme-toggle-btn"
          style="display: none;"
        >
          <div class="theme-dropdown-header">
            <h4>Seleccionar Tema</h4>
          </div>
          <div class="theme-list" role="none">
            ${this.themes.map(o=>`
              <button 
                class="theme-option ${this.currentTheme===o.id?"active":""}" 
                data-theme="${o.id}"
                role="menuitem"
                aria-label="${o.name}"
                ${this.currentTheme===o.id?'aria-current="true"':""}
              >
                <span class="theme-icon">${o.icon}</span>
                <span class="theme-name">${o.name}</span>
                <div class="theme-preview" data-theme="${o.id}"></div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;e.insertAdjacentHTML("beforeend",t),this.updateThemeIcon()}setupEventListeners(){const e=document.getElementById("dark-mode-toggle");e&&(e.checked=this.currentTheme==="light",e.addEventListener("change",t=>{this.toggleLightMode(t.target.checked)}))}setupAppearanceTab(){const e=document.querySelectorAll('input[name="themeColor"]');if(e.length===0)return;const t={"theme-color-dark":"dark","theme-color-light":"light","theme-color-rose":"cozy-rose","theme-color-aqua":"chill-aqua","theme-color-forest":"wild-forest","theme-color-orbit":"neon-orbit"};this.updateAppearanceTabUI(),e.forEach(o=>{o.addEventListener("change",r=>{const n=t[r.target.id];n&&this.switchTheme(n)})}),window.addEventListener("themeChanged",o=>{this.updateAppearanceTabUI()})}updateAppearanceTabUI(){const e=document.querySelectorAll('input[name="themeColor"]'),o={dark:"theme-color-dark",light:"theme-color-light","cozy-rose":"theme-color-rose","chill-aqua":"theme-color-aqua","wild-forest":"theme-color-forest","neon-orbit":"theme-color-orbit"}[this.currentTheme];e.forEach(r=>{r.checked=r.id===o})}toggleDropdown(){const e=document.getElementById("theme-dropdown"),t=document.getElementById("theme-toggle-btn");!e||!t||(this.isDropdownOpen=!this.isDropdownOpen,this.isDropdownOpen?(e.style.display="block",setTimeout(()=>e.classList.add("show"),10),t.setAttribute("aria-expanded","true")):(e.classList.remove("show"),setTimeout(()=>{this.isDropdownOpen||(e.style.display="none")},200),t.setAttribute("aria-expanded","false")))}closeDropdown(){this.isDropdownOpen=!1;const e=document.getElementById("theme-dropdown"),t=document.getElementById("theme-toggle-btn");e&&t&&(e.classList.remove("show"),setTimeout(()=>{e.style.display="none",t.setAttribute("aria-expanded","false")},200))}switchTheme(e){if(!this.themes.some(t=>t.id===e)){console.warn(`⚠️  Tema "${e}" no válido`);return}this.currentTheme=e,this.applyTheme(e);try{localStorage.setItem("notepadTheme",e)}catch{}this.updateThemeUI(),this.updateLegacyToggle(),window.dispatchEvent(new CustomEvent("themeChanged",{detail:{theme:e,themeName:this.themes.find(t=>t.id===e)?.name}}))}applyTheme(e){document.documentElement.setAttribute("data-theme",e),document.documentElement.classList.remove("light-mode"),e==="light"&&document.documentElement.classList.add("light-mode"),this.updateMetaThemeColor(e)}updateMetaThemeColor(e){const t={dark:"#181A1B",light:"#E0D3C2","cozy-rose":"#B85C80","chill-aqua":"#76C9D4","wild-forest":"#8EBF7A","neon-orbit":"#1A1A2E"};let o=document.querySelector('meta[name="theme-color"]');o||(o=document.createElement("meta"),o.name="theme-color",document.head.appendChild(o)),o.content=t[e]||t.dark}updateThemeUI(){document.querySelectorAll(".theme-option").forEach(e=>{const t=e.dataset.theme===this.currentTheme;e.classList.toggle("active",t),e.setAttribute("aria-current",t?"true":"false")}),this.updateThemeIcon()}updateThemeIcon(){const e=this.themes.find(r=>r.id===this.currentTheme),t=document.getElementById("theme-toggle-btn"),o=document.getElementById("theme-current-icon");e&&t&&(o?o.textContent=e.icon:t.innerHTML=e.icon,t.title=`Tema actual: ${e.name}`)}updateLegacyToggle(){const e=document.getElementById("dark-mode-toggle");e&&(e.checked=this.currentTheme==="light")}toggleLightMode(e){this.switchTheme(e?"light":"dark")}getCurrentTheme(){return this.currentTheme}getThemes(){return[...this.themes]}debugCSSVariables(){["--tn-color-background","--tn-color-text","--tn-color-accent","--tn-theme-primary","--tn-theme-secondary"].forEach(t=>{getComputedStyle(document.documentElement).getPropertyValue(t).trim()}),console.groupEnd()}debug(){return{currentTheme:this.currentTheme,availableThemes:this.themes,savedTheme:localStorage.getItem("notepadTheme"),dataThemeAttr:document.documentElement.getAttribute("data-theme"),hasLightModeClass:document.documentElement.classList.contains("light-mode")}}}export{i as ThemeManager};

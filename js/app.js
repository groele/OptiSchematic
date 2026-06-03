/* ============================================
   Optical Toolkit — SPA Router & App Shell
   ============================================ */

const App = (() => {
  let currentTool = null;
  const tools = {};

  /**
   * Register a tool module
   */
  function registerTool(id, tool) {
    tools[id] = tool;
  }

  /**
   * Switch to a tool
   */
  function switchTo(toolId) {
    // Deactivate current
    if (currentTool && tools[currentTool] && tools[currentTool].destroy) {
      tools[currentTool].destroy();
    }

    currentTool = toolId;

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tool === toolId);
    });

    // Update content
    const content = document.getElementById('tool-content');

    if (!toolId || !tools[toolId]) {
      showWelcome();
      return;
    }

    const tool = tools[toolId];
    content.innerHTML = '';
    content.className = 'main-content fade-in';

    // Build tool UI
    const header = document.createElement('div');
    header.className = 'tool-header';
    header.innerHTML = `<h2>${tool.title}</h2><p>${tool.description}</p>`;
    content.appendChild(header);

    const container = document.createElement('div');
    // Setups and diagrams use wide layout, calculators use split grid layout
    const diagramTools = ['lasers', 'raman', 'pl', 'setups', 'shg', 'spectrometer', 'polarization'];
    container.className = diagramTools.includes(toolId)
      ? 'dashboard-wide-layout'
      : 'dashboard-grid';
    container.id = 'tool-container';
    content.appendChild(container);

    // Let tool render itself
    tool.render(container);

    // Close mobile sidebar
    closeMobileSidebar();

    // Update URL hash
    history.replaceState(null, '', `#${toolId}`);
  }

  /**
   * Show welcome screen
   */
  function showWelcome() {
    currentTool = null;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const content = document.getElementById('tool-content');
    content.className = 'main-content fade-in';
    content.innerHTML = `
      <div class="welcome-screen">
        <svg class="welcome-icon" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="20" stroke="#0071E3" stroke-width="3"/>
          <circle cx="32" cy="32" r="16" stroke="#0071E3" stroke-width="1.5" opacity="0.5"/>
          <line x1="4" y1="32" x2="16" y2="32" stroke="#FF6B35" stroke-width="2" stroke-linecap="round"/>
          <line x1="4" y1="22" x2="16" y2="28" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
          <line x1="4" y1="42" x2="16" y2="36" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
          <line x1="48" y1="32" x2="60" y2="32" stroke="#FF6B35" stroke-width="2" stroke-linecap="round"/>
          <circle cx="54" cy="32" r="2.5" fill="#FF6B35"/>
        </svg>
        <h2>专业光学工具集</h2>
        <p>侧边栏提供快速波长/能量换算通道。点击下方卡片进入深度专业工具，支持光路设计、物理仿真与实验方案生成。</p>
        <div class="welcome-tools">
          <div class="welcome-tool-card" onclick="App.switchTo('lens')">
            <div class="card-icon">🔍</div>
            <h3>透镜计算器</h3>
            <p>薄透镜成像、组合透镜、光线追迹图</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('abcd')">
            <div class="card-icon">📐</div>
            <h3>ABCD 矩阵追迹</h3>
            <p>自由空间、透镜、反射镜与界面的矩阵级联和光线追迹</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('gaussian')">
            <div class="card-icon">📡</div>
            <h3>高斯光束计算器</h3>
            <p>束腰、瑞利长度、发散角、光束剖面</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('wavelength')">
            <div class="card-icon">⚡</div>
            <h3>波长与能量换算</h3>
            <p>λ↔eV↔THz↔cm⁻¹，全参数一览</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('intensity')">
            <div class="card-icon">💡</div>
            <h3>光强/光谱换算器</h3>
            <p>单位互转、色温RGB、黑体辐射谱</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('lasers')">
            <div class="card-icon">⚡</div>
            <h3>激光器原理</h3>
            <p>CW/ns/ps/fs对比、激光器类型、峰值功率计算</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('raman')">
            <div class="card-icon">🔬</div>
            <h3>Raman 光谱</h3>
            <p>常规/偏振分辨/共聚焦 Raman 光路与对比</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('pl')">
            <div class="card-icon">💡</div>
            <h3>PL 光致发光</h3>
            <p>常规/线偏振/圆偏振 PL 光路与对比</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('polarization')">
            <div class="card-icon">🧭</div>
            <h3>偏振检测对比</h3>
            <p>常规强度、线偏振与圆偏振检测的光路和强度响应</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('shg')">
            <div class="card-icon">🔆</div>
            <h3>SHG 二次谐波</h3>
            <p>SHG原理、光路设计、偏振分辨、二维材料应用</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('spectrometer')">
            <div class="card-icon">🌈</div>
            <h3>光谱仪原理</h3>
            <p>Czerny-Turner结构、光栅选择、检测器对比</p>
          </div>
          <div class="welcome-tool-card" onclick="App.switchTo('setups')">
            <div class="card-icon">🧪</div>
            <h3>时间分辨与高阶光路</h3>
            <p>TRPL荧光寿命、飞秒泵浦探测、低温强磁场、原位调控等科研光路</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Mobile sidebar toggle
   */
  function toggleMobileSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.sidebar-overlay').classList.toggle('show');
  }

  function closeMobileSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('show');
  }

  /**
   * Initialize the app
   */
  function init() {
    // Detect if running in a regular tab (vs narrow side panel)
    const isFullWindow = window.innerWidth > 700;
    const openTabBtn = document.getElementById('sidebar-open-tab');
    if (openTabBtn && isFullWindow) {
      openTabBtn.style.display = 'none';
    }

    // Nav click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
      // Skip if it's an external link or standalone action
      if (item.getAttribute('target') === '_blank' || item.onclick) return;
      
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = item.dataset.tool;
        if (toolId) switchTo(toolId);
      });
    });

    // Sidebar Quick Converter binder
    const qWl = document.getElementById('quick-wl');
    const qEv = document.getElementById('quick-ev');
    const qThz = document.getElementById('quick-thz');
    const qWavenum = document.getElementById('quick-wavenum');

    if (qWl && qEv && qThz && qWavenum) {
      const updateAll = (source, val) => {
        if (isNaN(val) || val <= 0) return;
        
        let lambdaNm = 532;
        if (source === 'wl') {
          lambdaNm = val;
        } else if (source === 'ev') {
          lambdaNm = OPTICS.energyEVToWavelength(val);
        } else if (source === 'thz') {
          lambdaNm = OPTICS.frequencyToWavelength(val * 1e12);
        } else if (source === 'wavenum') {
          lambdaNm = OPTICS.wavenumberToWavelength(val);
        }

        if (isNaN(lambdaNm) || lambdaNm <= 0 || !isFinite(lambdaNm)) return;

        const params = OPTICS.wavelengthAllParams(lambdaNm);
        
        if (source !== 'wl') qWl.value = parseFloat(lambdaNm.toFixed(3));
        if (source !== 'ev') qEv.value = parseFloat(params.E_eV.toFixed(3));
        if (source !== 'thz') qThz.value = parseFloat(params.frequency_THz.toFixed(3));
        if (source !== 'wavenum') qWavenum.value = parseFloat(params.wavenumber.toFixed(1));
      };

      qWl.addEventListener('input', () => updateAll('wl', parseFloat(qWl.value)));
      qEv.addEventListener('input', () => updateAll('ev', parseFloat(qEv.value)));
      qThz.addEventListener('input', () => updateAll('thz', parseFloat(qThz.value)));
      qWavenum.addEventListener('input', () => updateAll('wavenum', parseFloat(qWavenum.value)));
      
      // Initialize with default 532 nm (common laser line)
      updateAll('wl', 532);
    }

    // Mobile hamburger
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileSidebar);
    }

    // Overlay click closes sidebar
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeMobileSidebar);
    }

    // Handle hash routing
    const hash = window.location.hash.slice(1);
    if (hash && tools[hash]) {
      switchTo(hash);
    } else {
      showWelcome();
    }

    // Handle back/forward
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.slice(1);
      if (h && tools[h] && h !== currentTool) {
        switchTo(h);
      } else if (!h) {
        showWelcome();
      }
    });

    // Theme switcher
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark-theme') || 
                       (!document.documentElement.classList.contains('light-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.remove('dark-theme');
          document.documentElement.classList.add('light-theme');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.remove('light-theme');
          document.documentElement.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark');
        }
        
        // Update Chart.js instances if Chart is loaded
        if (window.Chart && Chart.instances) {
          Object.values(Chart.instances).forEach(chart => {
            chart.update();
          });
        }
      });
    }
  }

  return { registerTool, switchTo, showWelcome, init };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

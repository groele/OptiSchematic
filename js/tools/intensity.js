/* ============================================
   Optical Toolkit — Intensity & Spectrum Converter
   Unit conversion, color temperature, blackbody
   ============================================ */

(() => {

  const COMMON_SOURCES = [
    { name: '太阳（地面）', lux: 100000, note: '晴天直射' },
    { name: '阴天室外', lux: 10000, note: '' },
    { name: '办公室照明', lux: 500, note: '' },
    { name: '昏暗室内', lux: 50, note: '' },
    { name: '月光', lux: 0.25, note: '满月' },
    { name: '星光', lux: 0.001, note: '无月晴夜' },
  ];

  const tool = {
    title: '光强 / 光谱换算器',
    description: '光度学与辐射度量学单位互转、色温→RGB转换、黑体辐射光谱可视化',
    spectrumChart: null,
    currentTab: 'convert',

    render(container) {
      container.innerHTML = `
        <!-- Inputs -->
        <div class="dashboard-control">
          <!-- Tab Switcher -->
          <div class="card">
            <div class="toggle-group" id="intensity-tabs">
              <button class="toggle-btn active" data-tab="convert">单位换算</button>
              <button class="toggle-btn" data-tab="colortemp">色温→RGB</button>
              <button class="toggle-btn" data-tab="blackbody">黑体辐射</button>
            </div>
          </div>

          <!-- Tab: Unit Conversion -->
          <div class="card tab-panel" id="tab-convert">
            <div class="card-title"><span class="icon">🔄</span> 光强单位换算</div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">输入值</span>
              </div>
              <input type="number" class="input-field" id="conv-value" value="1000" step="any">
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">源单位</span>
              </div>
              <select class="select-field" id="conv-from">
                <option value="lux">lux (照度)</option>
                <option value="cd">cd (坎德拉)</option>
                <option value="cd_m2">cd/m² (亮度)</option>
                <option value="W_cm2">W/cm² (辐照度)</option>
                <option value="W_m2">W/m² (辐照度)</option>
                <option value="photon_s_cm2">photons/s/cm² (光子通量)</option>
                <option value="umol_m2_s">μmol/m²/s (PAR/PPFD)</option>
              </select>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">目标单位</span>
              </div>
              <select class="select-field" id="conv-to">
                <option value="W_m2">W/m² (辐照度)</option>
                <option value="lux">lux (照度)</option>
                <option value="cd">cd (坎德拉)</option>
                <option value="cd_m2">cd/m² (亮度)</option>
                <option value="W_cm2">W/cm² (辐照度)</option>
                <option value="photon_s_cm2">photons/s/cm²</option>
                <option value="umol_m2_s">μmol/m²/s (PAR)</option>
              </select>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">波长（光子换算用）</span>
                <span class="form-label-unit">nm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="conv-wl-slider" min="200" max="2000" value="550" step="1">
                <input type="number" class="input-field small" id="conv-wl-input" value="550" min="100" max="10000">
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">点源距离（可选）</span>
                <span class="form-label-unit">m</span>
              </div>
              <input type="number" class="input-field" id="conv-distance" value="" placeholder="留空则不使用平方反比">
            </div>

            <div class="divider"></div>
            <div class="card-title" style="font-size:13px;margin-bottom:10px"><span class="icon">💡</span> 常用光源参考</div>
            <div id="source-ref-list"></div>
          </div>

          <!-- Tab: Color Temperature -->
          <div class="card tab-panel" id="tab-colortemp" style="display:none">
            <div class="card-title"><span class="icon">🎨</span> 色温 → RGB</div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">色温</span>
                <span class="form-label-unit">K</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="ct-slider" min="1000" max="40000" value="5778" step="50">
                <input type="number" class="input-field small" id="ct-input" value="5778" min="500" max="100000">
              </div>
              <div class="range-limits"><span>1000K</span><span>40000K</span></div>
            </div>

            <div class="preset-chips" id="ct-presets">
              <div class="preset-chip" data-ct="1800">🕯️ 蜡烛 1800K</div>
              <div class="preset-chip" data-ct="2700">💡 白炽灯 2700K</div>
              <div class="preset-chip" data-ct="4000">🏠 暖白LED 4000K</div>
              <div class="preset-chip" data-ct="5500">☀️ 日光 5500K</div>
              <div class="preset-chip" data-ct="5778">🌟 太阳 5778K</div>
              <div class="preset-chip" data-ct="6500">☁️ 阴天 6500K</div>
              <div class="preset-chip" data-ct="9000">🌌 北方天空 9000K</div>
              <div class="preset-chip" data-ct="25000">💎 蓝天 25000K</div>
            </div>
          </div>

          <!-- Tab: Blackbody -->
          <div class="card tab-panel" id="tab-blackbody" style="display:none">
            <div class="card-title"><span class="icon">🌡️</span> 黑体辐射谱</div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">温度 T₁</span>
                <span class="form-label-unit">K</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="bb-t1-slider" min="1000" max="12000" value="5778" step="50">
                <input type="number" class="input-field small" id="bb-t1-input" value="5778" min="100" max="50000">
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">温度 T₂（叠加对比）</span>
                <span class="form-label-unit">K</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="bb-t2-slider" min="1000" max="12000" value="3000" step="50">
                <input type="number" class="input-field small" id="bb-t2-input" value="3000" min="100" max="50000">
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">温度 T₃（叠加对比）</span>
                <span class="form-label-unit">K</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="bb-t3-slider" min="1000" max="12000" value="8000" step="50">
                <input type="number" class="input-field small" id="bb-t3-input" value="8000" min="100" max="50000">
              </div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="dashboard-stage">
          <!-- Unit Conversion Result -->
          <div class="card tab-result" id="res-convert">
            <div class="card-title"><span class="icon">📊</span> 换算结果</div>
            <div class="result-grid">
              <div class="result-item">
                <div class="result-label">转换结果</div>
                <div class="result-value accent" id="conv-result">—</div>
                <div class="result-unit" id="conv-result-unit"></div>
              </div>
            </div>
            <div class="divider"></div>
            <div id="conv-explanation" class="help-text"></div>
          </div>

          <!-- Color Temperature Result -->
          <div class="card tab-result" id="res-colortemp" style="display:none">
            <div class="card-title"><span class="icon">🎨</span> 色温颜色</div>
            <div id="ct-preview" style="margin-bottom:20px"></div>
            <div class="result-grid">
              <div class="result-item">
                <div class="result-label">RGB</div>
                <div class="result-value" id="ct-rgb" style="font-size:16px">—</div>
              </div>
              <div class="result-item">
                <div class="result-label">HEX</div>
                <div class="result-value" id="ct-hex" style="font-size:16px">—</div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="help-text">算法基于 Tanner Helland 的色温-RGB映射，范围 1000K~40000K。</div>
          </div>

          <!-- Blackbody Result -->
          <div class="card tab-result" id="res-blackbody" style="display:none">
            <div class="card-title"><span class="icon">📈</span> 黑体辐射光谱</div>
            <div class="chart-container" style="height:320px">
              <canvas id="bb-spectrum-chart"></canvas>
            </div>
            <div class="divider"></div>
            <div class="result-grid" id="bb-peaks"></div>
          </div>
        </div>
      `;

      this.renderSourceRefs();
      this.bindEvents();
      this.switchTab('convert');
    },

    renderSourceRefs() {
      const el = document.getElementById('source-ref-list');
      if (!el) return;
      el.innerHTML = COMMON_SOURCES.map(s =>
        `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-light);font-size:13px">
          <span>${s.name}</span>
          <span style="font-family:var(--font-mono);color:var(--accent)">${s.lux.toLocaleString()} lux</span>
        </div>`
      ).join('');
    },

    bindEvents() {
      const calc = OPTICS.debounce(() => this.calculate(), 200);

      // Tab switching
      document.getElementById('intensity-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#intensity-tabs .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchTab(btn.dataset.tab);
        calc();
      });

      // Slider-input pairs
      const pairs = [
        ['conv-wl-slider', 'conv-wl-input'],
        ['ct-slider', 'ct-input'],
        ['bb-t1-slider', 'bb-t1-input'],
        ['bb-t2-slider', 'bb-t2-input'],
        ['bb-t3-slider', 'bb-t3-input'],
      ];
      pairs.forEach(([sid, iid]) => {
        const s = document.getElementById(sid);
        const i = document.getElementById(iid);
        if (!s || !i) return;
        s.addEventListener('input', () => { i.value = s.value; calc(); });
        i.addEventListener('input', () => { s.value = i.value; calc(); });
      });

      // Other inputs
      ['conv-value', 'conv-from', 'conv-to', 'conv-distance'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calc);
        document.getElementById(id)?.addEventListener('change', calc);
      });

      // Color temp presets
      document.getElementById('ct-presets')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.preset-chip');
        if (!chip) return;
        const ct = chip.dataset.ct;
        document.getElementById('ct-input').value = ct;
        document.getElementById('ct-slider').value = ct;
        document.querySelectorAll('#ct-presets .preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        calc();
      });
    },

    switchTab(tab) {
      this.currentTab = tab;
      ['convert', 'colortemp', 'blackbody'].forEach(t => {
        const panel = document.getElementById(`tab-${t}`);
        const result = document.getElementById(`res-${t}`);
        if (panel) panel.style.display = t === tab ? '' : 'none';
        if (result) result.style.display = t === tab ? '' : 'none';
      });
    },

    calculate() {
      switch (this.currentTab) {
        case 'convert': this.calcConvert(); break;
        case 'colortemp': this.calcColorTemp(); break;
        case 'blackbody': this.calcBlackbody(); break;
      }
    },

    calcConvert() {
      const val = parseFloat(document.getElementById('conv-value').value);
      const fromUnit = document.getElementById('conv-from').value;
      const toUnit = document.getElementById('conv-to').value;
      const lambda = parseFloat(document.getElementById('conv-wl-input').value) || 550;
      const dist = parseFloat(document.getElementById('conv-distance').value);

      if (isNaN(val)) {
        document.getElementById('conv-result').textContent = '—';
        return;
      }

      // Convert everything through W/m² as intermediate (irradiance)
      let siValue;

      // First convert source to SI (W/m² or W/sr or photons/s/m²)
      switch (fromUnit) {
        case 'lux':
          // lux to W/m²: use luminous efficacy at wavelength
          const K = OPTICS.luminousEfficacy(lambda);
          siValue = val / K;
          break;
        case 'cd':
          // cd to W/sr: at 555nm, 1 cd = 1/683 W/sr
          siValue = val / OPTICS.luminousEfficacy(lambda);
          break;
        case 'cd_m2':
          siValue = val / OPTICS.luminousEfficacy(lambda);
          break;
        case 'W_cm2':
          siValue = val * 1e4; // W/cm² → W/m²
          break;
        case 'W_m2':
          siValue = val;
          break;
        case 'photon_s_cm2':
          siValue = OPTICS.photonFluxToIrradiance(val * 1e4, lambda); // per cm² → per m²
          break;
        case 'umol_m2_s':
          siValue = OPTICS.ppfdToIrradiance(val, lambda);
          break;
        default:
          siValue = val;
      }

      // Apply distance correction if provided (point source)
      if (!isNaN(dist) && dist > 0 && fromUnit === 'cd') {
        // E = I/d²
        siValue = val / (dist * dist); // This gives lux
        // Convert lux to W/m²
        siValue = siValue / OPTICS.luminousEfficacy(lambda);
      }

      // Now convert SI (W/m²) to target
      let result;
      switch (toUnit) {
        case 'lux':
          result = siValue * OPTICS.luminousEfficacy(lambda);
          break;
        case 'cd':
          result = siValue * OPTICS.luminousEfficacy(lambda);
          break;
        case 'cd_m2':
          result = siValue * OPTICS.luminousEfficacy(lambda);
          break;
        case 'W_cm2':
          result = siValue / 1e4;
          break;
        case 'W_m2':
          result = siValue;
          break;
        case 'photon_s_cm2':
          result = OPTICS.irradianceToPhotonFlux(siValue, lambda) / 1e4;
          break;
        case 'umol_m2_s':
          result = OPTICS.irradianceToPhotonFlux(siValue, lambda) / 6.022e17;
          break;
        default:
          result = siValue;
      }

      document.getElementById('conv-result').textContent = OPTICS.formatNum(result, 6);
      const unitLabel = document.getElementById('conv-to').options[document.getElementById('conv-to').selectedIndex].text;
      document.getElementById('conv-result-unit').textContent = unitLabel;

      // Explanation
      const K = OPTICS.luminousEfficacy(lambda);
      document.getElementById('conv-explanation').innerHTML = `
        <div style="margin-bottom:4px">波长 ${lambda}nm 处光视效能 K(λ) = ${OPTICS.formatNum(K)} lm/W</div>
        <div>中间值（W/m²）: ${OPTICS.formatNum(siValue)}</div>
        ${!isNaN(dist) && dist > 0 ? `<div>点源距离修正: d = ${dist}m</div>` : ''}
      `;
    },

    calcColorTemp() {
      const kelvin = parseFloat(document.getElementById('ct-input').value) || 5778;
      const rgb = OPTICS.colorTempToRGB(kelvin);

      // Color preview
      document.getElementById('ct-preview').innerHTML = `
        <div style="
          width:100%;height:100px;border-radius:12px;
          background:${rgb.hex};
          display:flex;align-items:center;justify-content:center;
          font-size:18px;font-weight:600;
          color:${(rgb.r + rgb.g + rgb.b) / 3 > 128 ? '#000' : '#fff'};
          text-shadow:0 1px 2px rgba(0,0,0,0.2);
          transition: background 0.3s;
        ">${kelvin}K</div>
      `;

      document.getElementById('ct-rgb').textContent = `R:${rgb.r} G:${rgb.g} B:${rgb.b}`;
      document.getElementById('ct-rgb').style.color = rgb.hex;
      document.getElementById('ct-hex').textContent = rgb.hex.toUpperCase();
    },

    calcBlackbody() {
      const T1 = parseFloat(document.getElementById('bb-t1-input').value) || 5778;
      const T2 = parseFloat(document.getElementById('bb-t2-input').value) || 3000;
      const T3 = parseFloat(document.getElementById('bb-t3-input').value) || 8000;

      // Auto-range: include all Wien peaks with margin
      const peak1 = 2.898e6 / T1, peak2 = 2.898e6 / T2, peak3 = 2.898e6 / T3;
      const maxPeak = Math.max(peak1, peak2, peak3);
      const minPeak = Math.min(peak1, peak2, peak3);
      const lambdaMin = Math.max(50, minPeak * 0.15);
      const lambdaMax = maxPeak * 4;

      const data1 = OPTICS.blackbodySpectrumData(T1, lambdaMin, lambdaMax);
      const data2 = OPTICS.blackbodySpectrumData(T2, lambdaMin, lambdaMax);
      const data3 = OPTICS.blackbodySpectrumData(T3, lambdaMin, lambdaMax);

      this.spectrumChart = Charts.blackbodySpectrum('bb-spectrum-chart', [
        { T: T1, lambdaData: data1.lambdaData, radianceData: data1.radianceData, color: Charts.COLORS.orange },
        { T: T2, lambdaData: data2.lambdaData, radianceData: data2.radianceData, color: Charts.COLORS.blue },
        { T: T3, lambdaData: data3.lambdaData, radianceData: data3.radianceData, color: Charts.COLORS.green },
      ]);

      // Peak wavelengths
      document.getElementById('bb-peaks').innerHTML = [
        { T: T1, peak: data1.peakLambda, color: Charts.COLORS.orange },
        { T: T2, peak: data2.peakLambda, color: Charts.COLORS.blue },
        { T: T3, peak: data3.peakLambda, color: Charts.COLORS.green },
      ].map(d => `
        <div class="result-item">
          <div class="result-label">${d.T}K 峰值波长</div>
          <div class="result-value" style="color:${d.color};font-size:18px">${OPTICS.formatNum(d.peak, 1)}</div>
          <div class="result-unit">nm (Wien位移定律)</div>
        </div>
      `).join('');
    },

    destroy() {
      if (this.spectrumChart) { this.spectrumChart.destroy(); this.spectrumChart = null; }
    }
  };

  App.registerTool('intensity', tool);
})();

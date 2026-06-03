/* ============================================
   Optical Toolkit — Wavelength & Energy Converter
   λ ↔ E(eV) ↔ f(THz) ↔ ν̃(cm⁻¹) and more
   ============================================ */

(() => {

  // Common laser lines and spectral lines
  const LASER_PRESETS = [
    { name: 'ArF 准分子', lambda: 193, note: 'UV' },
    { name: 'HeCd UV', lambda: 325, note: 'UV' },
    { name: 'GaN LED', lambda: 405, note: '紫' },
    { name: 'Ar⁺ 488', lambda: 488, note: '蓝' },
    { name: 'Cu 蒸气', lambda: 510.6, note: '绿' },
    { name: 'Nd:YAG 2ω', lambda: 532, note: '绿' },
    { name: 'HeNe 绿', lambda: 543.5, note: '绿' },
    { name: 'Cu 蒸气', lambda: 578.2, note: '黄' },
    { name: 'Na D线', lambda: 589.3, note: '黄' },
    { name: 'HeNe', lambda: 632.8, note: '红' },
    { name: 'Kr⁺ 红', lambda: 647.1, note: '红' },
    { name: 'AlGaAs LED', lambda: 850, note: 'NIR' },
    { name: 'Nd:YAG', lambda: 1064, note: 'NIR' },
    { name: 'Er 光纤', lambda: 1550, note: 'NIR' },
    { name: 'CO₂', lambda: 10600, note: 'MIR' },
  ];

  const tool = {
    title: '波长与能量换算',
    description: '波长 ↔ 光子能量 ↔ 频率 ↔ 波数 互转，一键显示所有关联参数',

    render(container) {
      container.innerHTML = `
        <!-- Inputs -->
        <div class="dashboard-control">
          <div class="card">
            <div class="card-title"><span class="icon">⚡</span> 输入参数</div>

            <!-- Input mode toggle -->
            <div class="form-group">
              <div class="form-label"><span class="form-label-text">输入方式</span></div>
              <div class="toggle-group" id="wl-input-mode">
                <button class="toggle-btn active" data-mode="lambda">波长 λ</button>
                <button class="toggle-btn" data-mode="energy">能量 E</button>
                <button class="toggle-btn" data-mode="freq">频率 f</button>
                <button class="toggle-btn" data-mode="wavenum">波数 ν̃</button>
              </div>
            </div>

            <!-- Wavelength input -->
            <div class="form-group" id="wl-input-lambda">
              <div class="form-label">
                <span class="form-label-text">波长 λ</span>
                <span class="form-label-unit">nm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="wl-slider" min="100" max="15000" value="532" step="1">
                <input type="number" class="input-field small" id="wl-input" value="532" min="0.01" max="1000000" step="any">
              </div>
              <div class="range-limits"><span>100 nm</span><span>15000 nm</span></div>
            </div>

            <!-- Energy input -->
            <div class="form-group" id="wl-input-energy" style="display:none">
              <div class="form-label">
                <span class="form-label-text">光子能量 E</span>
                <span class="form-label-unit">eV</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="ev-slider" min="0.01" max="12.4" value="2.330" step="0.01">
                <input type="number" class="input-field small" id="ev-input" value="2.330" min="0.0001" max="1000" step="any">
              </div>
              <div class="range-limits"><span>0.01 eV</span><span>12.4 eV</span></div>
            </div>

            <!-- Frequency input -->
            <div class="form-group" id="wl-input-freq" style="display:none">
              <div class="form-label">
                <span class="form-label-text">频率 f</span>
                <span class="form-label-unit">THz</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="freq-slider" min="20" max="3000" value="564" step="1">
                <input type="number" class="input-field small" id="freq-input" value="563.5" min="0.001" max="100000" step="any">
              </div>
              <div class="range-limits"><span>20 THz</span><span>3000 THz</span></div>
            </div>

            <!-- Wavenumber input -->
            <div class="form-group" id="wl-input-wavenum" style="display:none">
              <div class="form-label">
                <span class="form-label-text">波数 ν̃</span>
                <span class="form-label-unit">cm⁻¹</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="wavenum-slider" min="100" max="50000" value="18797" step="1">
                <input type="number" class="input-field small" id="wavenum-input" value="18797" min="1" max="1000000" step="any">
              </div>
              <div class="range-limits"><span>100 cm⁻¹</span><span>50000 cm⁻¹</span></div>
            </div>

            <div class="divider"></div>

            <!-- Preset laser lines -->
            <div class="card-title" style="font-size:13px;margin-bottom:8px"><span class="icon">🔬</span> 常用激光/谱线</div>
            <div class="wavelength-presets" id="wl-laser-presets"></div>
          </div>

          <div class="formula-display">
            <span class="highlight">E</span> = hν = hc/λ &nbsp;|&nbsp;
            <span class="highlight">c</span> = λf &nbsp;|&nbsp;
            <span class="highlight">ν̃</span> = 1/λ
          </div>
        </div>

        <!-- Results -->
        <div class="dashboard-stage">
          <!-- Color band indicator -->
          <div class="card">
            <div class="card-title"><span class="icon">🌈</span> 光谱位置</div>
            <div id="wl-color-bar"></div>
          </div>

          <!-- All parameters at once -->
          <div class="card">
            <div class="card-title"><span class="icon">📊</span> 全部关联参数</div>
            <div class="result-grid" id="wl-all-results">
              <div class="result-item">
                <div class="result-label">波长 λ</div>
                <div class="result-value accent" id="res-lambda">—</div>
                <div class="result-unit">nm</div>
              </div>
              <div class="result-item">
                <div class="result-label">波长 λ</div>
                <div class="result-value" id="res-lambda-um" style="font-size:18px">—</div>
                <div class="result-unit">μm</div>
              </div>
              <div class="result-item">
                <div class="result-label">光子能量 E</div>
                <div class="result-value orange" id="res-ev">—</div>
                <div class="result-unit">eV</div>
              </div>
              <div class="result-item">
                <div class="result-label">光子能量 E</div>
                <div class="result-value" id="res-ej" style="font-size:16px">—</div>
                <div class="result-unit">× 10⁻¹⁹ J</div>
              </div>
              <div class="result-item">
                <div class="result-label">能量 E</div>
                <div class="result-value green" id="res-kjmol">—</div>
                <div class="result-unit">kJ/mol</div>
              </div>
              <div class="result-item">
                <div class="result-label">能量 E</div>
                <div class="result-value" id="res-kcalmol" style="font-size:18px">—</div>
                <div class="result-unit">kcal/mol</div>
              </div>
              <div class="result-item">
                <div class="result-label">频率 f</div>
                <div class="result-value accent" id="res-thz">—</div>
                <div class="result-unit">THz</div>
              </div>
              <div class="result-item">
                <div class="result-label">频率 f</div>
                <div class="result-value" id="res-hz" style="font-size:16px">—</div>
                <div class="result-unit">Hz</div>
              </div>
              <div class="result-item">
                <div class="result-label">波数 ν̃</div>
                <div class="result-value orange" id="res-cminv">—</div>
                <div class="result-unit">cm⁻¹</div>
              </div>
              <div class="result-item">
                <div class="result-label">角波数 k</div>
                <div class="result-value" id="res-angk" style="font-size:16px">—</div>
                <div class="result-unit">rad/m</div>
              </div>
            </div>
          </div>

          <!-- Energy band diagram (visual bar) -->
          <div class="card">
            <div class="card-title"><span class="icon">🎯</span> 能量等价参照</div>
            <div id="energy-equiv" class="help-text"></div>
          </div>
        </div>
      `;

      this.renderPresets();
      this.bindEvents();
      this.calculate('lambda');
    },

    renderPresets() {
      const el = document.getElementById('wl-laser-presets');
      if (!el) return;
      el.innerHTML = LASER_PRESETS.map(p => {
        const color = OPTICS.wavelengthToColor(p.lambda);
        return `<div class="wavelength-preset" data-lambda="${p.lambda}">
          <span class="dot" style="background:${color.color}"></span>
          <span>${p.name} ${p.lambda}nm</span>
        </div>`;
      }).join('');
    },

    bindEvents() {
      // Create a single debounced calculator (fix: don't recreate on every call)
      this._debouncedCalc = OPTICS.debounce(() => this.calculate(this._currentMode), 150);
      this._currentMode = 'lambda';

      // Input mode toggle
      document.getElementById('wl-input-mode')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#wl-input-mode .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._currentMode = btn.dataset.mode;
        ['lambda', 'energy', 'freq', 'wavenum'].forEach(m => {
          const el = document.getElementById(`wl-input-${m}`);
          if (el) el.style.display = m === this._currentMode ? '' : 'none';
        });
        this.calculate(this._currentMode);
      });

      // Slider-input sync: slider → input always; input → slider only if in range
      const syncPair = (sliderId, inputId) => {
        const s = document.getElementById(sliderId);
        const i = document.getElementById(inputId);
        if (!s || !i) return;
        s.addEventListener('input', () => { i.value = s.value; this._debouncedCalc(); });
        i.addEventListener('input', () => {
          const val = parseFloat(i.value);
          const min = parseFloat(s.min), max = parseFloat(s.max);
          if (!isNaN(val) && val >= min && val <= max) s.value = val;
          this._debouncedCalc();
        });
      };

      syncPair('wl-slider', 'wl-input');
      syncPair('ev-slider', 'ev-input');
      syncPair('freq-slider', 'freq-input');
      syncPair('wavenum-slider', 'wavenum-input');

      // Preset laser lines
      document.getElementById('wl-laser-presets')?.addEventListener('click', (e) => {
        const preset = e.target.closest('.wavelength-preset');
        if (!preset) return;
        const lambda = preset.dataset.lambda;
        document.getElementById('wl-input').value = lambda;
        document.getElementById('wl-slider').value = lambda;
        document.querySelectorAll('#wl-input-mode .toggle-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('#wl-input-mode [data-mode="lambda"]')?.classList.add('active');
        this._currentMode = 'lambda';
        ['lambda', 'energy', 'freq', 'wavenum'].forEach(m => {
          const el = document.getElementById(`wl-input-${m}`);
          if (el) el.style.display = m === 'lambda' ? '' : 'none';
        });
        this.calculate('lambda');
      });
    },

    calculate(inputMode) {
      let lambdaNm;

      // Convert input to wavelength first
      switch (inputMode) {
        case 'lambda':
          lambdaNm = parseFloat(document.getElementById('wl-input').value);
          break;
        case 'energy': {
          const eV = parseFloat(document.getElementById('ev-input').value);
          lambdaNm = OPTICS.energyEVToWavelength(eV);
          break;
        }
        case 'freq': {
          const thz = parseFloat(document.getElementById('freq-input').value);
          lambdaNm = OPTICS.frequencyToWavelength(thz * 1e12);
          break;
        }
        case 'wavenum': {
          const cmInv = parseFloat(document.getElementById('wavenum-input').value);
          lambdaNm = OPTICS.wavenumberToWavelength(cmInv);
          break;
        }
      }

      if (!lambdaNm || lambdaNm <= 0 || isNaN(lambdaNm)) {
        this.clearResults();
        return;
      }

      // Performance Optimization: skip if wavelength hasn't changed
      if (this._lastLambda === lambdaNm) return;
      this._lastLambda = lambdaNm;

      // Compute all parameters
      const p = OPTICS.wavelengthAllParams(lambdaNm);

      // Sync all input fields (without triggering events)
      this.syncInput('wl-input', 'wl-slider', lambdaNm);
      this.syncInput('ev-input', 'ev-slider', p.E_eV);
      this.syncInput('freq-input', 'freq-slider', p.frequency_THz);
      this.syncInput('wavenum-input', 'wavenum-slider', p.wavenumber);

      // Update all result displays
      document.getElementById('res-lambda').textContent = OPTICS.formatNum(p.lambda, 4);
      document.getElementById('res-lambda-um').textContent = OPTICS.formatNum(p.lambda / 1000, 4);
      document.getElementById('res-ev').textContent = OPTICS.formatNum(p.E_eV, 4);
      document.getElementById('res-ej').textContent = OPTICS.formatNum(p.E_J / 1e-19, 4);
      document.getElementById('res-kjmol').textContent = OPTICS.formatNum(p.E_kjmol, 3);
      document.getElementById('res-kcalmol').textContent = OPTICS.formatNum(p.E_kcalmol, 3);
      document.getElementById('res-thz').textContent = OPTICS.formatNum(p.frequency_THz, 4);
      document.getElementById('res-hz').textContent = p.frequency.toExponential(4);
      document.getElementById('res-cminv').textContent = OPTICS.formatNum(p.wavenumber, 2);
      document.getElementById('res-angk').textContent = p.angularK.toExponential(4);

      // Color bar
      this.renderColorBar(lambdaNm, p.color);

      // Energy equivalents
      this.renderEnergyEquiv(p);
    },

    syncInput(inputId, sliderId, value) {
      const input = document.getElementById(inputId);
      const slider = document.getElementById(sliderId);
      if (!input || !slider) return;

      // Never overwrite the field the user is currently typing in
      const isFocused = input.matches(':focus');

      // Update slider position (always, for visual feedback)
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      if (!isNaN(value) && isFinite(value)) {
        slider.value = Math.max(min, Math.min(max, value));
      }

      // Update input only if not focused
      if (!isFocused) {
        input.value = isNaN(value) ? '—' : OPTICS.formatNum(value, 4);
      }
    },

    renderColorBar(lambda, colorInfo) {
      const el = document.getElementById('wl-color-bar');
      if (!el) return;

      // Visible spectrum gradient
      const specColors = [
        '#8B00FF', '#4400FF', '#0066FF', '#00CCCC',
        '#00CC00', '#CCCC00', '#FF8800', '#FF0000', '#880000'
      ];
      const specPositions = [380, 420, 470, 495, 530, 570, 600, 650, 780];

      // Build gradient stops
      const gradientStops = specColors.map((c, i) => `${c} ${((specPositions[i] - 380) / (780 - 380) * 100).toFixed(1)}%`).join(', ');

      // Marker position (clamp to visible range for display)
      const clampLambda = Math.max(380, Math.min(780, lambda));
      const markerPos = ((clampLambda - 380) / (780 - 380) * 100).toFixed(1);

      const isOutsideVisible = lambda < 380 || lambda > 780;

      el.innerHTML = `
        <div style="position:relative;margin:16px 0 8px">
          <!-- Spectrum bar -->
          <div style="
            height:32px;border-radius:8px;
            background:linear-gradient(to right, ${gradientStops});
            position:relative;overflow:visible;
          ">
            <!-- Marker -->
            <div style="
              position:absolute;left:${markerPos}%;top:-6px;
              transform:translateX(-50%);
              width:4px;height:44px;
              background:${isOutsideVisible ? '#888' : colorInfo.color};
              border-radius:2px;
              box-shadow:0 0 6px ${isOutsideVisible ? '#888' : colorInfo.color}40;
              transition:left 0.2s;
            "></div>
            <!-- Triangle -->
            <div style="
              position:absolute;left:${markerPos}%;bottom:-8px;
              transform:translateX(-50%);
              width:0;height:0;
              border-left:5px solid transparent;border-right:5px solid transparent;
              border-top:6px solid ${isOutsideVisible ? '#888' : colorInfo.color};
              transition:left 0.2s;
            "></div>
          </div>
          <!-- Labels -->
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-tertiary);margin-top:12px">
            <span>380nm 紫</span>
            <span>550nm 绿</span>
            <span>780nm 红</span>
          </div>
        </div>
        <div style="text-align:center;margin-top:8px">
          <span style="
            display:inline-block;padding:4px 16px;border-radius:20px;
            background:${colorInfo.color}18;color:${colorInfo.color};
            font-weight:600;font-size:14px;
          ">${colorInfo.name} · ${OPTICS.formatNum(lambda)} nm</span>
          ${isOutsideVisible ? '<span style="margin-left:8px;font-size:12px;color:var(--text-tertiary)">（可见光范围外）</span>' : ''}
        </div>
      `;
    },

    renderEnergyEquiv(p) {
      const el = document.getElementById('energy-equiv');
      if (!el) return;

      const eV = p.E_eV;

      // Reference energy scales
      const refs = [
        { label: '微波光子 (1 GHz)', eV: 4.14e-6 },
        { label: '热能 kT (300K)', eV: 0.0259 },
        { label: '中红外光子 (10μm)', eV: 0.124 },
        { label: '近红外光子 (1μm)', eV: 1.24 },
        { label: '可见光 (550nm)', eV: 2.25 },
        { label: '近紫外 (300nm)', eV: 4.13 },
        { label: '深紫外 (200nm)', eV: 6.20 },
        { label: 'X射线 (0.1nm)', eV: 12400 },
      ];

      // Find where current energy fits
      let category = '';
      if (eV < 0.001) category = '微波/射频';
      else if (eV < 0.1) category = '太赫兹/远红外';
      else if (eV < 1.0) category = '中红外';
      else if (eV < 1.6) category = '近红外';
      else if (eV < 3.1) category = '可见光';
      else if (eV < 12.4) category = '近紫外';
      else if (eV < 124) category = '真空紫外';
      else category = 'X射线/伽马射线';

      // Bar chart comparison
      const maxLog = Math.log10(20000);
      const minLog = Math.log10(1e-6);

      el.innerHTML = `
        <div style="margin-bottom:12px;font-size:14px;color:var(--text-primary)">
          当前光子能量属于：<span style="font-weight:600;color:var(--accent)">${category}</span> 范围
        </div>
        <div style="margin-bottom:8px;font-size:12px;color:var(--text-tertiary)">能量标尺对比（对数）</div>
        ${refs.map(ref => {
          const pos = ((Math.log10(ref.eV) - minLog) / (maxLog - minLog) * 100).toFixed(1);
          const currentPos = ((Math.log10(eV) - minLog) / (maxLog - minLog) * 100).toFixed(1);
          const isCurrent = Math.abs(eV - ref.eV) / ref.eV < 0.3;
          return `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:12px">
              <span style="width:140px;text-align:right;color:var(--text-secondary);flex-shrink:0">${ref.label}</span>
              <div style="flex:1;height:16px;background:var(--bg-primary);border-radius:4px;position:relative">
                <div style="position:absolute;left:${pos}%;top:2px;width:3px;height:12px;background:${isCurrent ? 'var(--accent)' : 'var(--border)'};border-radius:2px"></div>
                ${isCurrent ? `<div style="position:absolute;left:${pos}%;top:-2px;width:3px;height:20px;background:var(--accent);border-radius:2px;opacity:0.5"></div>` : ''}
              </div>
              <span style="width:80px;font-family:var(--font-mono);color:var(--text-tertiary)">${ref.eV < 0.01 ? ref.eV.toExponential(1) : OPTICS.formatNum(ref.eV, 2)} eV</span>
            </div>
          `;
        }).join('')}
      `;
    },

    clearResults() {
      ['res-lambda', 'res-lambda-um', 'res-ev', 'res-ej', 'res-kjmol',
       'res-kcalmol', 'res-thz', 'res-hz', 'res-cminv', 'res-angk'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
      });
    },

    destroy() {}
  };

  App.registerTool('wavelength', tool);
})();

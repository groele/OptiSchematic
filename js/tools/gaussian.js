/* ============================================
   Optical Toolkit — Gaussian Beam Calculator
   Beam waist, Rayleigh length, divergence
   ============================================ */

(() => {
  const WAVELENGTH_PRESETS = [
    { name: 'HeNe', lambda: 632.8, color: '#FF0000' },
    { name: 'Nd:YAG', lambda: 1064, color: '#8B0000' },
    { name: '532nm', lambda: 532, color: '#00CC00' },
    { name: '808nm', lambda: 808, color: '#8B0000' },
    { name: '1550nm', lambda: 1550, color: '#4B0082' },
    { name: '405nm', lambda: 405, color: '#8B00FF' },
  ];

  const tool = {
    title: '高斯光束计算器',
    description: 'TEM₀₀ 高斯光束参数计算，支持 M² 光束质量因子',
    profileChart: null,
    intensityChart: null,

    render(container) {
      container.innerHTML = `
        <div class="dashboard-control">
          <div class="card">
            <div class="card-title"><span class="icon">📡</span> 光束参数</div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">波长 λ</span>
                <span class="form-label-unit">nm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="wl-slider" min="200" max="2000" value="632.8" step="0.1">
                <input type="number" class="input-field small" id="wl-input" value="632.8" min="100" max="10000" step="0.1">
              </div>
              <div class="wavelength-presets" id="wl-presets"></div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">束腰半径 w₀</span>
                <span class="form-label-unit">μm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="w0-slider" min="10" max="5000" value="1000" step="10">
                <input type="number" class="input-field small" id="w0-input" value="1000" min="1" max="100000">
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">M² 光束质量因子</span>
                <span class="form-label-unit"></span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="m2-slider" min="1" max="10" value="1" step="0.1">
                <input type="number" class="input-field small" id="m2-input" value="1" min="1" max="100" step="0.1">
              </div>
              <div class="range-limits"><span>1 (理想高斯)</span><span>10</span></div>
              <div class="help-text">M²=1 为理想 TEM₀₀ 模；实际激光器通常 M²=1.1~3</div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">当前距离 z</span>
                <span class="form-label-unit">mm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="z-slider" min="0" max="10000" value="0" step="10">
                <input type="number" class="input-field small" id="z-input" value="0" min="0" max="100000">
              </div>
            </div>
          </div>

          <div class="formula-display">
            w(z) = w₀√(1 + (z/z<sub>R</sub>)²) &nbsp;|&nbsp;
            z<sub>R</sub> = πw₀²/(M²λ)
          </div>
        </div>

        <div class="dashboard-stage">
          <div class="card">
            <div class="card-title"><span class="icon">📊</span> 计算结果</div>
            <div class="result-grid">
              <div class="result-item">
                <div class="result-label">光斑半径 w(z)</div>
                <div class="result-value accent" id="gb-wz">—</div>
                <div class="result-unit">μm</div>
              </div>
              <div class="result-item">
                <div class="result-label">瑞利长度 zR</div>
                <div class="result-value green" id="gb-zR">—</div>
                <div class="result-unit">mm</div>
              </div>
              <div class="result-item">
                <div class="result-label">远场发散角 θ</div>
                <div class="result-value orange" id="gb-theta">—</div>
                <div class="result-unit">mrad</div>
              </div>
              <div class="result-item">
                <div class="result-label">曲率半径 R(z)</div>
                <div class="result-value" id="gb-Rz">—</div>
                <div class="result-unit">mm</div>
              </div>
              <div class="result-item">
                <div class="result-label">峰值光强比 I(z)/I₀</div>
                <div class="result-value" id="gb-iz">—</div>
                <div class="result-unit">(w₀/w(z))²</div>
              </div>
              <div class="result-item">
                <div class="result-label">束腰直径 2w₀</div>
                <div class="result-value" id="gb-d0">—</div>
                <div class="result-unit">μm</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title"><span class="icon">📈</span> 光束剖面 w(z)</div>
            <div class="chart-container" style="height:280px">
              <canvas id="beam-profile-chart"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-title"><span class="icon">🔦</span> 径向光强分布 I(r)</div>
            <div class="chart-container" style="height:240px">
              <canvas id="radial-intensity-chart"></canvas>
            </div>
          </div>
        </div>
      `;

      this.renderPresets();
      this.bindEvents();
      this.calculate();
    },

    renderPresets() {
      const container = document.getElementById('wl-presets');
      if (!container) return;
      container.innerHTML = WAVELENGTH_PRESETS.map(p =>
        `<div class="wavelength-preset" data-lambda="${p.lambda}">
          <span class="dot" style="background:${p.color}"></span>
          <span>${p.name} ${p.lambda}nm</span>
        </div>`
      ).join('');
    },

    bindEvents() {
      const calc = OPTICS.debounce(() => this.calculate(), 150);

      const sync = (sliderId, inputId) => {
        const s = document.getElementById(sliderId);
        const i = document.getElementById(inputId);
        if (!s || !i) return;
        s.addEventListener('input', () => { i.value = s.value; calc(); });
        i.addEventListener('input', () => {
          const val = parseFloat(i.value);
          const min = parseFloat(s.min), max = parseFloat(s.max);
          if (!isNaN(val) && val >= min && val <= max) s.value = val;
          calc();
        });
      };

      sync('wl-slider', 'wl-input');
      sync('w0-slider', 'w0-input');
      sync('m2-slider', 'm2-input');
      sync('z-slider', 'z-input');

      document.getElementById('wl-presets')?.addEventListener('click', (e) => {
        const preset = e.target.closest('.wavelength-preset');
        if (!preset) return;
        const lambda = preset.dataset.lambda;
        document.getElementById('wl-input').value = lambda;
        document.getElementById('wl-slider').value = lambda;
        document.querySelectorAll('.wavelength-preset').forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
        calc();
      });

      // Chart click interaction to set z-distance
      const canvas = document.getElementById('beam-profile-chart');
      if (canvas) {
        canvas.addEventListener('click', (e) => {
          if (!this.profileChart) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          
          const chart = this.profileChart;
          const scaleX = chart.scales.x;
          // Chart.js requires relative position on the canvas (taking care of padding)
          const relativeX = e.offsetX; 
          const xValue = scaleX.getValueForPixel(relativeX);
          
          if (xValue !== undefined && !isNaN(xValue)) {
            const zSlider = document.getElementById('z-slider');
            const zInput = document.getElementById('z-input');
            if (zSlider && zInput) {
              // Convert to absolute positive distance (since z is symmetric)
              const maxVal = parseFloat(zSlider.max);
              const val = Math.max(0, Math.min(maxVal, Math.round(Math.abs(xValue))));
              zSlider.value = val;
              zInput.value = val;
              this.calculate();
            }
          }
        });
      }
    },

    calculate() {
      const lambda = parseFloat(document.getElementById('wl-input').value);
      const w0 = parseFloat(document.getElementById('w0-input').value);
      const M2 = parseFloat(document.getElementById('m2-input').value) || 1;
      const z = parseFloat(document.getElementById('z-input').value) || 0;

      if (!lambda || lambda <= 0 || !w0 || w0 <= 0) {
        ['gb-wz','gb-zR','gb-theta','gb-Rz','gb-iz','gb-d0'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = '—';
        });
        return;
      }

      const zR = OPTICS.rayleighRange(w0, lambda, M2);
      const wz = OPTICS.beamRadius(w0, z, lambda, M2);
      const theta = OPTICS.beamDivergence(w0, lambda, M2);
      const Rz = OPTICS.beamCurvature(w0, z, lambda);
      const IzRatio = OPTICS.onAxisIntensityRatio(w0, z, lambda, M2);

      document.getElementById('gb-wz').textContent = OPTICS.formatNum(wz);
      document.getElementById('gb-zR').textContent = OPTICS.formatNum(zR);
      document.getElementById('gb-theta').textContent = OPTICS.formatNum(theta);
      document.getElementById('gb-Rz').textContent = Rz === Infinity ? '∞' : OPTICS.formatNum(Rz);
      document.getElementById('gb-iz').textContent = OPTICS.formatNum(IzRatio, 3);
      document.getElementById('gb-d0').textContent = OPTICS.formatNum(w0 * 2);

      this.updateProfileChart(w0, lambda, zR, z, M2);
      this.updateIntensityChart(wz);
    },

    updateProfileChart(w0, lambda, zR, currentZ, M2) {
      const zRange = Math.max(zR * 3, currentZ * 1.5, 100);
      const data = OPTICS.beamProfileData(w0, lambda, zRange, M2);
      this.profileChart = Charts.beamProfile(
        'beam-profile-chart',
        data.zData, data.wData, data.wNegData, zR, currentZ
      );
    },

    updateIntensityChart(w) {
      const rRange = w * 3;
      const data = OPTICS.radialIntensityData(w, rRange);
      this.intensityChart = Charts.radialIntensity(
        'radial-intensity-chart',
        data.rData, data.iData, w
      );
    },

    destroy() {
      if (this.profileChart) { this.profileChart.destroy(); this.profileChart = null; }
      if (this.intensityChart) { this.intensityChart.destroy(); this.intensityChart = null; }
    }
  };

  App.registerTool('gaussian', tool);
})();

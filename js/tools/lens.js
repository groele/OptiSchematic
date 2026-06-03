/* ============================================
   Optical Toolkit — Lens Calculator
   Thin lens imaging, ray tracing diagram
   ============================================ */

(() => {
  const tool = {
    title: '透镜计算器',
    description: '薄透镜成像公式 1/f = 1/u + 1/v，支持光线追迹可视化',

    render(container) {
      container.innerHTML = `
        <div class="dashboard-control">
          <div class="card">
            <div class="card-title"><span class="icon">⚙️</span> 参数设置</div>

            <div class="form-group">
              <div class="form-label"><span class="form-label-text">透镜类型</span></div>
              <div class="toggle-group" id="lens-type-toggle">
                <button class="toggle-btn active" data-value="convex">凸透镜 (f &gt; 0)</button>
                <button class="toggle-btn" data-value="concave">凹透镜 (f &lt; 0)</button>
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">焦距 f</span>
                <span class="form-label-unit">mm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="focal-slider" min="10" max="500" value="100" step="5">
                <input type="number" class="input-field small" id="focal-input" value="100" min="1" max="10000">
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">物距 u</span>
                <span class="form-label-unit">mm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="object-slider" min="50" max="5000" value="300" step="10">
                <input type="number" class="input-field small" id="object-input" value="300" min="1" max="100000">
              </div>
            </div>

            <div class="divider"></div>

            <div class="form-group">
              <div class="form-label"><span class="form-label-text">组合透镜（可选）</span></div>
              <div class="form-group">
                <div class="form-label">
                  <span class="form-label-text">第二透镜焦距 f₂</span>
                  <span class="form-label-unit">mm</span>
                </div>
                <div class="input-slider-row">
                  <input type="range" class="slider" id="focal2-slider" min="10" max="500" value="100" step="5">
                  <input type="number" class="input-field small" id="focal2-input" value="100" min="1" max="10000">
                </div>
              </div>
              <div class="form-group">
                <div class="form-label">
                  <span class="form-label-text">透镜间距 d</span>
                  <span class="form-label-unit">mm</span>
                </div>
                <div class="input-slider-row">
                  <input type="range" class="slider" id="sep-slider" min="0" max="300" value="80" step="5">
                  <input type="number" class="input-field small" id="sep-input" value="80" min="0" max="5000">
                </div>
              </div>
            </div>
          </div>

          <div class="formula-display">
            <span class="highlight">1/f</span> = 1/u + 1/v &nbsp;|&nbsp;
            <span class="highlight">M</span> = −v/u
          </div>
        </div>

        <div class="dashboard-stage">
          <div class="card">
            <div class="card-title"><span class="icon">📊</span> 计算结果</div>
            <div class="result-grid" id="lens-results">
              <div class="result-item">
                <div class="result-label">像距 v</div>
                <div class="result-value accent" id="res-v">—</div>
                <div class="result-unit">mm</div>
              </div>
              <div class="result-item">
                <div class="result-label">放大率 M</div>
                <div class="result-value orange" id="res-M">—</div>
                <div class="result-unit">×</div>
              </div>
              <div class="result-item">
                <div class="result-label">成像性质</div>
                <div class="result-value" id="res-type" style="font-size:16px">—</div>
                <div class="result-unit" id="res-type-detail"></div>
              </div>
              <div class="result-item">
                <div class="result-label">等效焦距</div>
                <div class="result-value green" id="res-feq">—</div>
                <div class="result-unit">mm</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title"><span class="icon">🎨</span> 光线追迹图</div>
            <div class="canvas-wrapper">
              <canvas id="ray-canvas"></canvas>
            </div>
          </div>
        </div>
      `;

      this.setupCanvas();
      this.bindEvents();
      this.calculate();
    },

    setupCanvas() {
      const canvas = document.getElementById('ray-canvas');
      if (!canvas) return;
      const wrapper = canvas.parentElement;
      const W = Math.min(wrapper.clientWidth, 700);
      const H = Math.round(W * 0.5);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    },

    bindEvents() {
      const calc = OPTICS.debounce(() => this.calculate(), 150);

      // Slider-input sync: slider updates input; input updates slider only if in range
      const sync = (sliderId, inputId) => {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);
        if (!slider || !input) return;

        slider.addEventListener('input', () => {
          input.value = slider.value;
          calc();
        });

        input.addEventListener('input', () => {
          const val = parseFloat(input.value);
          if (!isNaN(val)) {
            // Only move slider if value is within its range
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            if (val >= min && val <= max) {
              slider.value = val;
            }
          }
          calc();
        });
      };

      sync('focal-slider', 'focal-input');
      sync('object-slider', 'object-input');
      sync('focal2-slider', 'focal2-input');
      sync('sep-slider', 'sep-input');

      // Lens type toggle
      document.getElementById('lens-type-toggle')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#lens-type-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        calc();
      });

      // Responsive canvas
      window.addEventListener('resize', OPTICS.debounce(() => {
        this.setupCanvas();
        this.calculate();
      }, 250));
    },

    calculate() {
      const typeBtn = document.querySelector('#lens-type-toggle .active');
      const lensType = typeBtn ? typeBtn.dataset.value : 'convex';
      let f = parseFloat(document.getElementById('focal-input').value) || 100;
      const u = parseFloat(document.getElementById('object-input').value) || 300;
      const f2 = parseFloat(document.getElementById('focal2-input').value) || 100;
      const d = parseFloat(document.getElementById('sep-input').value) || 80;

      if (lensType === 'concave') f = -Math.abs(f);
      else f = Math.abs(f);

      const result = OPTICS.thinLens(f, u);
      const combined = OPTICS.combinedLens(f, f2, d);

      // Update results
      document.getElementById('res-v').textContent =
        result.atFocalPoint ? '∞ (平行光)' : OPTICS.formatNum(result.v);
      document.getElementById('res-M').textContent =
        result.atFocalPoint ? '—' : OPTICS.formatNum(result.M);

      const typeEl = document.getElementById('res-type');
      const detailEl = document.getElementById('res-type-detail');
      if (result.atFocalPoint) {
        typeEl.textContent = '平行光出射';
        typeEl.style.color = 'var(--yellow)';
        detailEl.textContent = '物在焦点';
      } else if (result.type === 'real') {
        typeEl.textContent = '实像';
        typeEl.style.color = 'var(--accent)';
        detailEl.textContent = result.orientation === 'inverted' ? '倒立' : '正立';
      } else {
        typeEl.textContent = '虚像';
        typeEl.style.color = 'var(--orange)';
        detailEl.textContent = '正立';
      }

      document.getElementById('res-feq').textContent =
        combined.isTelescopic ? '∞ (望远系统)' : OPTICS.formatNum(combined.f_eq);

      this.drawRayDiagram(f, u, result.v, result.type, result.atFocalPoint);
    },

    drawRayDiagram(f, u, v, imageType, atFocalPoint) {
      const canvas = document.getElementById('ray-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const axisY = H / 2;
      const lensX = W * 0.42;
      const absF = Math.abs(f);

      // Scale: fit the relevant distances into the canvas
      const refDist = atFocalPoint
        ? Math.max(u, absF) * 1.5
        : Math.max(u, Math.abs(v), absF) * 1.3;
      const scale = (lensX - 60) / Math.max(refDist, 10);

      const objectX = lensX - u * scale;
      const focusLeftX = lensX - absF * scale;
      const focusRightX = lensX + absF * scale;
      const objectH = Math.min(50, H * 0.12);

      // Compute image position
      let imageX, imageH;
      if (atFocalPoint) {
        imageX = W + 50; // off-screen right
        imageH = 0;
      } else {
        imageX = lensX + v * scale;
        imageH = objectH * Math.abs(v / u);
      }

      // --- Optical axis ---
      ctx.strokeStyle = '#E5E5EA';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, axisY);
      ctx.lineTo(W - 20, axisY);
      ctx.stroke();

      // --- Lens symbol ---
      ctx.strokeStyle = '#0071E3';
      ctx.lineWidth = 2.5;
      const lensH = 55;
      ctx.beginPath();
      ctx.moveTo(lensX, axisY - lensH);
      ctx.lineTo(lensX, axisY + lensH);
      ctx.stroke();

      // Arrows on lens
      const a = 7;
      ctx.fillStyle = '#0071E3';
      ctx.beginPath();
      ctx.moveTo(lensX, axisY - lensH);
      ctx.lineTo(lensX - a, axisY - lensH + a * 1.5);
      ctx.lineTo(lensX + a, axisY - lensH + a * 1.5);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(lensX, axisY + lensH);
      ctx.lineTo(lensX - a, axisY + lensH - a * 1.5);
      ctx.lineTo(lensX + a, axisY + lensH - a * 1.5);
      ctx.fill();

      ctx.fillStyle = '#0071E3';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f > 0 ? '凸透镜' : '凹透镜', lensX, axisY + lensH + 16);

      // --- Focal points ---
      ctx.fillStyle = '#34C759';
      if (f > 0) {
        // Convex: focal points on both sides
        ctx.beginPath(); ctx.arc(focusLeftX, axisY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(focusRightX, axisY, 4, 0, Math.PI * 2); ctx.fill();
      } else {
        // Concave: virtual focal points (dashed)
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#34C759';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(focusLeftX, axisY, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(focusRightX, axisY, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = '#34C759';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('F', focusLeftX, axisY + 18);
      ctx.fillText("F'", focusRightX, axisY + 18);

      // --- Object ---
      ctx.strokeStyle = '#FF6B35';
      ctx.lineWidth = 2.5;
      const objTop = axisY - objectH;
      ctx.beginPath();
      ctx.moveTo(objectX, axisY);
      ctx.lineTo(objectX, objTop);
      ctx.stroke();
      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.moveTo(objectX, objTop);
      ctx.lineTo(objectX - 5, objTop + 10);
      ctx.lineTo(objectX + 5, objTop + 10);
      ctx.fill();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('物', objectX, axisY + 18);

      // --- Image ---
      if (!atFocalPoint && isFinite(v)) {
        const imgTop = imageType === 'real' ? axisY + imageH : axisY - imageH;
        ctx.strokeStyle = imageType === 'real' ? '#AF52DE' : '#FF9500';
        ctx.lineWidth = 2.5;
        ctx.setLineDash(imageType === 'real' ? [] : [6, 4]);
        ctx.beginPath();
        ctx.moveTo(imageX, axisY);
        ctx.lineTo(imageX, imgTop);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = ctx.strokeStyle;
        const dir = imageType === 'real' ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(imageX, imgTop);
        ctx.lineTo(imageX - 5, imgTop + 10 * dir);
        ctx.lineTo(imageX + 5, imgTop + 10 * dir);
        ctx.fill();

        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('像', imageX, axisY + 18);
      }

      // --- Three principal rays ---
      ctx.lineWidth = 1.2;

      // Ray 1: Parallel to axis → through focal point (or appears to come from focal point for concave)
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.5)';
      ctx.beginPath();
      ctx.moveTo(objectX, objTop);
      ctx.lineTo(lensX, objTop);
      if (f > 0) {
        // Convex: ray goes through far focal point
        const endX = Math.min(W - 20, atFocalPoint ? W - 20 : imageX);
        const slope = (axisY - objTop) / (focusRightX - lensX);
        ctx.lineTo(endX, objTop + slope * (endX - lensX));
      } else {
        // Concave: ray diverges as if coming from near focal point
        const slope = (objTop - axisY) / (lensX - focusLeftX);
        ctx.lineTo(W - 20, objTop + slope * (W - 20 - lensX));
      }
      ctx.stroke();

      // Ray 2: Through center (undeviated)
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.5)';
      ctx.beginPath();
      ctx.moveTo(objectX, objTop);
      if (atFocalPoint) {
        ctx.lineTo(W - 20, objTop + (axisY - objTop) * (W - 20 - objectX) / (lensX - objectX));
      } else {
        ctx.lineTo(Math.min(W - 20, Math.max(20, imageX)), isFinite(v) ? (axisY + imageH * (imageType === 'real' ? 1 : -1)) : objTop);
      }
      ctx.stroke();

      // Ray 3: Through (or toward) focal point → parallel after lens
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.5)';
      ctx.beginPath();
      if (f > 0) {
        // Convex: ray through near focal point exits parallel
        const slopeToLens = (objTop - axisY) / (objectX - focusLeftX);
        const yAtLens = axisY + slopeToLens * (lensX - focusLeftX);
        ctx.moveTo(objectX, objTop);
        ctx.lineTo(lensX, yAtLens);
        ctx.lineTo(W - 20, yAtLens);
      } else {
        // Concave: aim at far focal point, exits parallel
        const slopeToLens = (objTop - axisY) / (objectX - focusRightX);
        const yAtLens = axisY + slopeToLens * (lensX - focusRightX);
        ctx.moveTo(objectX, objTop);
        ctx.lineTo(lensX, yAtLens);
        ctx.lineTo(W - 20, yAtLens);
      }
      ctx.stroke();

      // --- Distance labels ---
      ctx.fillStyle = '#6E6E73';
      ctx.font = '10px SF Mono, Consolas, monospace';
      ctx.textAlign = 'center';

      const uMid = (objectX + lensX) / 2;
      ctx.fillText(`u = ${OPTICS.formatNum(u)}`, uMid, axisY + 35);

      if (!atFocalPoint && isFinite(v)) {
        const vMid = (lensX + Math.min(imageX, W - 20)) / 2;
        ctx.fillText(`v = ${OPTICS.formatNum(v)}`, vMid, axisY + 35);
      }

      ctx.fillStyle = '#34C759';
      ctx.fillText(`f = ${OPTICS.formatNum(absF)}`, (lensX + focusRightX) / 2, axisY - 10);
    },

    destroy() {}
  };

  App.registerTool('lens', tool);
})();

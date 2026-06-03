/* ============================================
   Optical Toolkit — ABCD Ray Tracing Simulator
   Matrix-based geometric optics simulation
   ============================================ */

(() => {

  const PRESET_SYSTEMS = [
    {
      name: '双透镜扩束镜 (2x)',
      elements: [
        { type: 'lens', params: { f: 50 } },
        { type: 'freespace', params: { length: 150 } },
        { type: 'lens', params: { f: 100 } },
      ]
    },
    {
      name: '4f 成像系统',
      elements: [
        { type: 'freespace', params: { length: 100 } },
        { type: 'lens', params: { f: 100 } },
        { type: 'freespace', params: { length: 200 } },
        { type: 'lens', params: { f: 100 } },
        { type: 'freespace', params: { length: 100 } },
      ]
    },
    {
      name: '单透镜聚焦',
      elements: [
        { type: 'freespace', params: { length: 100 } },
        { type: 'lens', params: { f: 50 } },
        { type: 'freespace', params: { length: 100 } },
      ]
    }
  ];

  const tool = {
    title: 'ABCD 矩阵追迹',
    description: '通过 ABCD 矩阵进行几何光学光线追迹，支持多元件组合与实时仿真',
    elements: [],
    nextId: 1,
    lastTrace: null,
    fanTraces: [],

    ELEMENT_TYPES: {
      freespace: { name: '自由空间', icon: '↔️', params: [{ key: 'length', label: '长度', unit: 'mm', default: 100 }] },
      lens: { name: '薄透镜', icon: '🔍', params: [{ key: 'f', label: '焦距 f', unit: 'mm', default: 100 }] },
      mirror: { name: '球面反射镜', icon: '🪞', params: [{ key: 'R', label: '曲率半径 R', unit: 'mm', default: 200 }] },
      interface: { name: '折射界面', icon: '📐', params: [
        { key: 'R', label: '曲率半径 R', unit: 'mm', default: 100 },
        { key: 'n1', label: '入射折射率 n₁', unit: '', default: 1.0 },
        { key: 'n2', label: '折射折射率 n₂', unit: '', default: 1.5 }
      ]},
    },

    render(container) {
      container.innerHTML = `
        <div class="dashboard-control">
          <div class="card">
            <div class="card-title"><span class="icon">🔧</span> 光路元件</div>
            <div id="element-list" class="drag-container"></div>
            <div class="divider"></div>
            <div style="display:flex;flex-wrap:wrap;gap:6px" id="add-element-btns"></div>
            <div class="divider"></div>
            <div class="card-title" style="font-size:13px;margin-bottom:8px"><span class="icon">📋</span> 预设系统</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px" id="preset-btns"></div>
          </div>

          <div class="card">
            <div class="card-title"><span class="icon">📐</span> 入射光线</div>
            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">初始高度 r₀</span>
                <span class="form-label-unit">mm</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="abcd-r0-slider" min="-50" max="50" value="10" step="1">
                <input type="number" class="input-field small" id="abcd-r0-input" value="10">
              </div>
            </div>
            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">初始角度 θ₀</span>
                <span class="form-label-unit">mrad</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="abcd-theta-slider" min="-200" max="200" value="0" step="5">
                <input type="number" class="input-field small" id="abcd-theta-input" value="0">
              </div>
            </div>
            <div class="form-group">
              <div class="form-label"><span class="form-label-text">光线模式</span></div>
              <div class="toggle-group" id="ray-mode-toggle">
                <button class="toggle-btn active" data-mode="single">单光线</button>
                <button class="toggle-btn" data-mode="fan">扇形光束</button>
                <button class="toggle-btn" data-mode="parallel">平行光束</button>
              </div>
            </div>
            <div class="form-group" id="fan-count-group" style="display:none">
              <div class="form-label"><span class="form-label-text">光线数量</span></div>
              <input type="number" class="input-field small" id="fan-count" value="7" min="3" max="21" step="2">
            </div>
          </div>

          <div class="card">
            <div class="card-title"><span class="icon">🧮</span> ABCD 矩阵</div>
            <div id="matrix-display" style="font-family:var(--font-mono);font-size:13px;line-height:1.8;white-space:pre;color:var(--text-secondary)"></div>
          </div>
        </div>

        <div class="dashboard-stage">
          <div class="card">
            <div class="card-title">
              <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
                <span><span class="icon">📊</span> 系统参数</span>
                <button class="preset-chip" id="abcd-export-btn" style="margin:0;font-size:11px">💾 导出数据</button>
              </div>
            </div>
            <div class="result-grid" id="abcd-results">
              <div class="result-item">
                <div class="result-label">等效焦距 f_eq</div>
                <div class="result-value accent" id="abcd-feq">—</div>
                <div class="result-unit">mm</div>
              </div>
              <div class="result-item">
                <div class="result-label">后焦距 BFD</div>
                <div class="result-value orange" id="abcd-bfd">—</div>
                <div class="result-unit">mm</div>
              </div>
              <div class="result-item">
                <div class="result-label">出射高度 r_out</div>
                <div class="result-value" id="abcd-rout">—</div>
                <div class="result-unit">mm</div>
              </div>
              <div class="result-item">
                <div class="result-label">出射角度 θ_out</div>
                <div class="result-value" id="abcd-thetaout">—</div>
                <div class="result-unit">mrad</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title"><span class="icon">🎨</span> 光路图 (Ray Tracing)</div>
            <div class="canvas-wrapper" style="position:relative">
              <canvas id="abcd-canvas"></canvas>
              <div id="canvas-overlay-ui" style="position:absolute;top:10px;right:10px">
                <button class="icon-btn" id="abcd-download-png" title="下载图片">🖼️</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.elements = [
        { id: this.nextId++, type: 'freespace', params: { length: 200 } },
        { id: this.nextId++, type: 'lens', params: { f: 100 } },
        { id: this.nextId++, type: 'freespace', params: { length: 200 } },
      ];

      this.renderAddButtons();
      this.renderPresets();
      this.renderElementList();
      this.setupCanvas();
      this.bindEvents();
      this.calculate();
    },

    setupCanvas() {
      const canvas = document.getElementById('abcd-canvas');
      if (!canvas) return;
      const wrapper = canvas.parentElement;
      const W = wrapper.clientWidth;
      const H = Math.round(W * 0.54);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    },

    renderAddButtons() {
      const container = document.getElementById('add-element-btns');
      if (!container) return;
      container.innerHTML = Object.entries(this.ELEMENT_TYPES).map(([key, type]) =>
        `<button class="preset-chip" data-add="${key}">${type.icon} +${type.name}</button>`
      ).join('');
    },

    renderPresets() {
      const container = document.getElementById('preset-btns');
      if (!container) return;
      container.innerHTML = PRESET_SYSTEMS.map((p, i) =>
        `<button class="preset-chip" data-preset="${i}">${p.name}</button>`
      ).join('');
    },

    renderElementList() {
      const container = document.getElementById('element-list');
      if (!container) return;

      if (this.elements.length === 0) {
        container.innerHTML = '<div class="help-text" style="text-align:center;padding:20px">点击下方按钮添加光学元件</div>';
        return;
      }

      container.innerHTML = this.elements.map((el, idx) => {
        const type = this.ELEMENT_TYPES[el.type];
        const paramsHtml = type.params.map(p =>
          `<div class="form-group" style="margin-bottom:8px">
            <div class="form-label">
              <span class="form-label-text">${p.label}</span>
              <span class="form-label-unit">${p.unit}</span>
            </div>
            <input type="number" class="input-field small elem-param"
              data-idx="${idx}" data-key="${p.key}"
              value="${el.params[p.key]}" step="any" style="width:100%">
          </div>`
        ).join('');

        return `<div class="card" draggable="true" data-index="${idx}" style="padding:14px;margin-bottom:10px;border-left:3px solid var(--accent); cursor:grab; position:relative">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px; pointer-events:none">
            <span style="font-weight:600;font-size:13px"><span class="icon">☰</span> ${type.icon} #${idx + 1} ${type.name}</span>
            <button class="preset-chip remove-elem" data-idx="${idx}" style="color:var(--red);border-color:var(--red);padding:3px 10px;font-size:11px; pointer-events:auto">✕</button>
          </div>
          <div style="pointer-events:auto">
            ${paramsHtml}
          </div>
        </div>`;
      }).join('');

      this._bindDragEvents(container);
    },

    _bindDragEvents(container) {
      let dragSrcEl = null;

      container.querySelectorAll('[draggable]').forEach(el => {
        el.addEventListener('dragstart', (e) => {
          dragSrcEl = el;
          e.dataTransfer.effectAllowed = 'move';
          el.style.opacity = '0.4';
        });

        el.addEventListener('dragover', (e) => {
          if (e.preventDefault) e.preventDefault();
          return false;
        });

        el.addEventListener('dragenter', (e) => {
          el.style.borderTop = '2px solid var(--accent)';
        });

        el.addEventListener('dragleave', (e) => {
          el.style.borderTop = '';
        });

        el.addEventListener('drop', (e) => {
          if (e.stopPropagation) e.stopPropagation();
          el.style.borderTop = '';
          
          if (dragSrcEl !== el) {
            const fromIdx = parseInt(dragSrcEl.dataset.index);
            const toIdx = parseInt(el.dataset.index);
            
            const temp = this.elements[fromIdx];
            this.elements.splice(fromIdx, 1);
            this.elements.splice(toIdx, 0, temp);
            
            this.renderElementList();
            this.calculate();
          }
          return false;
        });

        el.addEventListener('dragend', (e) => {
          el.style.opacity = '1';
          container.querySelectorAll('.card').forEach(c => c.style.borderTop = '');
        });
      });
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

      sync('abcd-r0-slider', 'abcd-r0-input');
      sync('abcd-theta-slider', 'abcd-theta-input');

      // Add element
      document.getElementById('add-element-btns')?.addEventListener('click', (e) => {
        const type = e.target.closest('[data-add]')?.dataset.add;
        if (!type) return;
        const entry = this.ELEMENT_TYPES[type];
        const params = {};
        entry.params.forEach(p => params[p.key] = p.default);
        this.elements.push({ id: this.nextId++, type, params });
        this.renderElementList();
        this.calculate();
      });

      // Remove element
      document.getElementById('element-list')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.remove-elem');
        if (!btn) return;
        const idx = parseInt(btn.dataset.idx);
        this.elements.splice(idx, 1);
        this.renderElementList();
        this.calculate();
      });

      // Update params
      document.getElementById('element-list')?.addEventListener('input', (e) => {
        const input = e.target.closest('.elem-param');
        if (!input) return;
        const idx = parseInt(input.dataset.idx);
        const key = input.dataset.key;
        this.elements[idx].params[key] = parseFloat(input.value) || 0;
        calc();
      });

      // Ray mode
      document.getElementById('ray-mode-toggle')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#ray-mode-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('fan-count-group').style.display = btn.dataset.mode === 'single' ? 'none' : 'block';
        this.calculate();
      });

      // Presets
      document.getElementById('preset-btns')?.addEventListener('click', (e) => {
        const idx = e.target.closest('[data-preset]')?.dataset.preset;
        if (idx === undefined) return;
        const preset = PRESET_SYSTEMS[idx];
        this.elements = preset.elements.map(el => ({
          id: this.nextId++,
          type: el.type,
          params: { ...el.params }
        }));
        this.renderElementList();
        this.calculate();
      });

      document.getElementById('fan-count')?.addEventListener('input', calc);

      // Export Buttons
      document.getElementById('abcd-download-png')?.addEventListener('click', () => {
        const canvas = document.getElementById('abcd-canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'ray-tracing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });

      document.getElementById('abcd-export-btn')?.addEventListener('click', () => {
        const data = {
          elements: this.elements,
          results: {
            feq: document.getElementById('abcd-feq').textContent,
            bfd: document.getElementById('abcd-bfd').textContent,
            rout: document.getElementById('abcd-rout').textContent,
            thetaout: document.getElementById('abcd-thetaout').textContent
          }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'abcd-system.json';
        link.click();
      });

      window.addEventListener('resize', OPTICS.debounce(() => {
        this.setupCanvas();
        this.calculate();
      }, 250));
    },

    calculate() {
      const r0 = parseFloat(document.getElementById('abcd-r0-input').value) || 0;
      const theta0 = (parseFloat(document.getElementById('abcd-theta-input').value) || 0) / 1000;

      const totalMatrix = OPTICS.Matrix.systemMatrix(this.elements);
      const result = OPTICS.Matrix.apply(totalMatrix, r0, theta0);
      const fEq = OPTICS.Matrix.effectiveFocalLength(totalMatrix);
      const bfd = OPTICS.Matrix.backFocalDistance(totalMatrix);

      // Trace rays and cache
      this.lastTrace = OPTICS.Matrix.traceSingleRay(this.elements, r0, theta0);
      
      const mode = document.querySelector('#ray-mode-toggle .active')?.dataset.mode || 'single';
      this.fanTraces = [];
      if (mode === 'fan') {
        const count = parseInt(document.getElementById('fan-count').value) || 7;
        const spread = 0.04; // rad
        for (let i = 0; i < count; i++) {
          const dTheta = ((i / (count - 1)) - 0.5) * spread;
          this.fanTraces.push(OPTICS.Matrix.traceSingleRay(this.elements, r0, theta0 + dTheta));
        }
      } else if (mode === 'parallel') {
        const count = parseInt(document.getElementById('fan-count').value) || 7;
        const spread = Math.max(10, Math.abs(r0) * 2);
        for (let i = 0; i < count; i++) {
          const dr = ((i / (count - 1)) - 0.5) * spread;
          this.fanTraces.push(OPTICS.Matrix.traceSingleRay(this.elements, r0 + dr, theta0));
        }
      }

      // Update results UI
      document.getElementById('abcd-feq').textContent = isFinite(fEq) ? OPTICS.formatNum(fEq, 2) : '∞';
      document.getElementById('abcd-bfd').textContent = isFinite(bfd) ? OPTICS.formatNum(bfd, 2) : '—';
      document.getElementById('abcd-rout').textContent = OPTICS.formatNum(result.r, 3);
      document.getElementById('abcd-thetaout').textContent = OPTICS.formatNum(result.theta * 1000, 3);

      const matrixLines = this.elements.map((el, i) => {
        const type = this.ELEMENT_TYPES[el.type];
        const m = OPTICS.Matrix.elementMatrix(el);
        return `#${i + 1} ${type.name}:\n${OPTICS.Matrix.toString(m)}`;
      }).join('\n\n');

      const matrixDisplay = document.getElementById('matrix-display');
      if (matrixDisplay) {
        matrixDisplay.textContent = `系统总矩阵 M_total =\n${OPTICS.Matrix.toString(totalMatrix)}\n\n子元件矩阵：\n${matrixLines}`;
      }

      this.draw();
    },

    draw() {
      const canvas = document.getElementById('abcd-canvas');
      if (!canvas || !this.lastTrace) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const points = this.lastTrace.points;
      const totalL = this.lastTrace.finalZ || 100;
      
      let maxR = 10;
      [this.lastTrace, ...this.fanTraces].forEach(t => {
        t.points.forEach(p => maxR = Math.max(maxR, Math.abs(p.r)));
      });
      maxR *= 1.4;

      const scaleX = (W - 100) / Math.max(1, totalL);
      const scaleY = (H - 60) / (2 * maxR);
      const offsetX = 50;
      const offsetY = H / 2;

      this._drawGrid(ctx, W, H, totalL, maxR, scaleX, scaleY, offsetX, offsetY);

      let currentZ = 0;
      this.elements.forEach(el => {
        const x = offsetX + currentZ * scaleX;
        const h = Math.min(H/2 - 20, maxR * scaleY * 0.9);
        if (el.type === 'lens') this._drawLens(ctx, x, offsetY, h, el.params.f);
        else if (el.type === 'mirror') this._drawMirror(ctx, x, offsetY, h, el.params.R);
        else if (el.type === 'interface') this._drawInterface(ctx, x, offsetY, h, el.params.n1, el.params.n2);
        if (el.type === 'freespace') currentZ += el.params.length;
      });

      // Draw secondary rays
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 113, 227, 0.15)';
      this.fanTraces.forEach(t => {
        ctx.beginPath();
        t.points.forEach((p, i) => {
          const px = offsetX + p.z * scaleX;
          const py = offsetY - p.r * scaleY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // Draw Primary Ray
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0071E3';
      ctx.beginPath();
      points.forEach((p, i) => {
        const px = offsetX + p.z * scaleX;
        const py = offsetY - p.r * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.restore();
    },

    _drawGrid(ctx, W, H, totalL, maxR, scaleX, scaleY, offsetX, offsetY) {
      ctx.strokeStyle = 'var(--border)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([5, 5]);
      
      // Optical axis
      ctx.beginPath();
      ctx.moveTo(0, offsetY);
      ctx.lineTo(W, offsetY);
      ctx.stroke();
      
      // Vertical markers at start/end
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY - 5); ctx.lineTo(offsetX, offsetY + 5);
      ctx.moveTo(offsetX + totalL * scaleX, offsetY - 5); ctx.lineTo(offsetX + totalL * scaleX, offsetY + 5);
      ctx.stroke();

      ctx.fillStyle = 'var(--text-tertiary)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('0', offsetX, offsetY + 20);
      ctx.fillText(totalL.toFixed(0) + ' mm', offsetX + totalL * scaleX, offsetY + 20);
      ctx.fillText('Optical Axis', W / 2, offsetY - 10);
    },

    _drawLens(ctx, x, y, h, f) {
      ctx.strokeStyle = 'var(--accent)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x, y + h);
      ctx.stroke();
      // Arrow heads
      const ah = 6;
      if (f > 0) {
        ctx.beginPath();
        ctx.moveTo(x - ah, y - h + ah); ctx.lineTo(x, y - h); ctx.lineTo(x + ah, y - h + ah);
        ctx.moveTo(x - ah, y + h - ah); ctx.lineTo(x, y + h); ctx.lineTo(x + ah, y + h - ah);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x - ah, y - h); ctx.lineTo(x, y - h + ah); ctx.lineTo(x + ah, y - h);
        ctx.moveTo(x - ah, y + h); ctx.lineTo(x, y + h - ah); ctx.lineTo(x + ah, y + h);
        ctx.stroke();
      }
      ctx.fillStyle = 'var(--accent)';
      ctx.font = 'bold 10px Inter';
      ctx.fillText(`f=${f}`, x, y - h - 10);
    },

    _drawMirror(ctx, x, y, h, R) {
      ctx.strokeStyle = 'var(--orange)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const curve = R > 0 ? 10 : -10;
      ctx.moveTo(x - curve, y - h);
      ctx.quadraticCurveTo(x, y, x - curve, y + h);
      ctx.stroke();
      // Hatching
      ctx.lineWidth = 1;
      for (let i = -h; i <= h; i += 10) {
        ctx.beginPath();
        ctx.moveTo(x - curve, y + i);
        ctx.lineTo(x - curve - (R > 0 ? 5 : -5), y + i + 5);
        ctx.stroke();
      }
    },

    _drawInterface(ctx, x, y, h, n1, n2) {
      ctx.fillStyle = 'rgba(0, 113, 227, 0.1)';
      ctx.fillRect(x, y - h, 40, 2 * h);
      ctx.strokeStyle = 'var(--accent)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y - h, 40, 2 * h);
      ctx.fillStyle = 'var(--text-secondary)';
      ctx.font = '9px Inter';
      ctx.fillText(`n=${n2}`, x + 20, y);
    },

    destroy() {
      this.lastTrace = null;
      this.fanTraces = [];
    }
  };

  App.registerTool('abcd', tool);
})();

/* ============================================
   Optical Toolkit — Polarization vs Intensity
   ============================================ */

(() => {

  const TOOLTIPS = {
    'pol-laser': '激发光源\n常用：单模半导体激光器、氦氖激光器 (632.8nm)、倍频 Nd:YAG 激光器 (532nm)\n注意：通常输出高度线偏振光，亦可通过偏振片获得任意偏振态。',
    'pol-input-state': '入射偏振态\n可通过偏振控制元件制备为：\n• 线偏振 (如使用起偏器)\n• 圆偏振 (如使用起偏器 + QWP)\n• 非偏振/自然光 (如白炽发光)',
    'pol-sample': '被测样品\n发光性质由材料决定：\n• 各向同性发光：常规强度一致\n• 各向异性发光：PL/Raman 呈现特定线偏振\n• 自旋/谷能谷激射：呈现圆偏振特征',
    'pol-qwp1': '前置四分之一波片 QWP₁\n将线偏振光转换为圆偏振光，用于偏振激发。\n快轴夹角 45° 可产生右旋圆偏振光 (σ⁺)，-45° 可产生左旋圆偏振光 (σ⁻)。',
    'pol-qwp2': '后置四分之一波片 QWP₂\n偏振分析核心元件：将圆偏振发光转换为线偏振光。\n将 σ⁺ 转换为垂直偏振，将 σ⁻ 转换为水平偏振，便于后方检偏器筛选。',
    'pol-analyzer': '检偏器 A (Analyzer)\n高消光比线偏振片，旋转角度 φ 可筛选特定方向的线偏振分量。\n与 QWP 配合，可分别提取 σ⁺ 和 σ⁻ 的强度分量。',
    'pol-spectro': '光谱仪与检测器\n记录经过偏振分析后的最终光谱强度。\n在偏振测量中，由于光栅对不同偏振方向反射率不同，需进行 G 因子仪器校准。'
  };

  const tool = {
    title: '偏振 vs 强度检测',
    description: '对比常规光强检测与偏振分辨光谱检测的原理、光路配置及传播仿真',
    lightType: 'linear', // 'natural', 'linear', 'circular'
    polarAngle: 0,       // degrees, for linear input
    circHandedness: 'plus', // 'plus' (RHC/σ+), 'minus' (LHC/σ-)
    scheme: 'linear-detection', // 'regular', 'linear-detection', 'circular-detection'
    analyzerAngle: 0,   // degrees, for detector analyzer
    
    render(container) {
      container.innerHTML = `
        <div class="tool-inputs">
          <!-- Parameter Controller Card -->
          <div class="card">
            <div class="card-title"><span class="icon">⚙️</span> 光源偏振设置</div>
            
            <div class="form-group">
              <div class="form-label"><span class="form-label-text">输入光源偏振态</span></div>
              <div class="toggle-group" id="pol-light-type">
                <button class="toggle-btn" data-type="natural">自然光 (非偏振)</button>
                <button class="toggle-btn active" data-type="linear">线偏振光</button>
                <button class="toggle-btn" data-type="circular">圆偏振光</button>
              </div>
            </div>

            <!-- Slider for Linear Polarization angle -->
            <div class="form-group" id="pol-angle-group">
              <div class="form-label">
                <span class="form-label-text">输入偏振角度 (θ)</span>
                <span class="form-value" id="pol-angle-val">0°</span>
              </div>
              <input type="range" class="slider" id="pol-angle-slider" min="0" max="180" step="5" value="0">
              <div class="slider-labels">
                <span>0° (水平)</span>
                <span>90° (垂直)</span>
                <span>180°</span>
              </div>
            </div>

            <!-- Toggle for Circular Polarization handedness -->
            <div class="form-group" id="pol-circular-group" style="display:none">
              <div class="form-label"><span class="form-label-text">圆偏振旋向</span></div>
              <div class="toggle-group" id="pol-circ-hand">
                <button class="toggle-btn active" data-hand="plus">右旋圆偏振 σ⁺ (RHC)</button>
                <button class="toggle-btn" data-hand="minus">左旋圆偏振 σ⁻ (LHC)</button>
              </div>
            </div>
          </div>

          <!-- Detection Scheme Card -->
          <div class="card">
            <div class="card-title"><span class="icon">🔬</span> 检测器光路配置</div>
            
            <div class="form-group">
              <div class="form-label"><span class="form-label-text">光路检测方案</span></div>
              <div class="toggle-group" id="pol-detection-scheme">
                <button class="toggle-btn" data-scheme="regular">常规强度检测</button>
                <button class="toggle-btn active" data-scheme="linear-detection">线偏振分辨检测</button>
                <button class="toggle-btn" data-scheme="circular-detection">圆偏振分辨检测</button>
              </div>
            </div>

            <!-- Slider for Analyzer angle -->
            <div class="form-group" id="analyzer-angle-group">
              <div class="form-label">
                <span class="form-label-text">检偏器角度 (φ)</span>
                <span class="form-value" id="analyzer-angle-val">0°</span>
              </div>
              <input type="range" class="slider" id="analyzer-angle-slider" min="0" max="180" step="5" value="0">
              <div class="slider-labels">
                <span>0° (平行)</span>
                <span>90° (正交)</span>
                <span>180°</span>
              </div>
            </div>
          </div>

          <!-- Physics Math Card -->
          <div class="card">
            <div class="card-title"><span class="icon">📐</span> 传播数学公式</div>
            <div style="background:var(--bg-primary);border-radius:12px;padding:16px;font-family:var(--font-mono);font-size:13px;line-height:1.8">
              <div style="color:var(--text-secondary);font-weight:700;margin-bottom:8px">当前配置公式：</div>
              <div id="pol-math-formula" style="font-size:15px;color:var(--accent);font-weight:700;background:white;padding:12px;border-radius:8px;text-align:center;border:1px solid var(--border)">
                I_det = I_0 · cos²(θ - φ)
              </div>
              <div id="pol-math-desc" style="font-size:12px;color:var(--text-tertiary);margin-top:8px">
                马吕斯定律 (Malus' Law)：偏振方向夹角为 θ - φ，强度按其余弦平方规律衰减。
              </div>
            </div>
          </div>
        </div>

        <div class="tool-results">
          <!-- Simulation Diagram Card -->
          <div class="card">
            <div class="card-title"><span class="icon">👁️</span> 偏振传播与检测动态仿真</div>
            <div class="help-text" style="margin-bottom:12px">鼠标悬停在元件上可查看详细说明。调整左侧参数观察光强与偏振态的实时演化。</div>
            <div id="polar-sim-svg-container"></div>
          </div>

          <!-- Detected Output Card -->
          <div class="card">
            <div class="card-title"><span class="icon">📊</span> 最终检测结果</div>
            <div style="display:grid;grid-template-columns:140px 1fr;gap:20px;align-items:center;padding:10px 0">
              <!-- Circular gauge for output intensity -->
              <div style="position:relative;width:120px;height:120px;margin:0 auto">
                <svg viewBox="0 0 100 100" style="width:100%;height:100%;transform:rotate(-90deg)">
                  <circle cx="50" cy="50" r="40" stroke="#F5F5F7" stroke-width="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#0071E3" stroke-width="8" fill="none" 
                    stroke-dasharray="251.2" stroke-dashoffset="125.6" id="pol-intensity-gauge" style="transition:stroke-dashoffset 0.2s" />
                </svg>
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <span id="pol-intensity-percent" style="font-size:20px;font-weight:700;color:var(--text-primary)">50.0%</span>
                  <span style="font-size:10px;color:var(--text-tertiary)">检测光强比</span>
                </div>
              </div>
              
              <!-- Comparison table -->
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <div><strong>入射偏振态:</strong> <span id="info-input-pol" style="color:var(--accent);font-weight:600">线偏振 (0°)</span></div>
                <div><strong>光路配置:</strong> <span id="info-detection" style="color:var(--orange);font-weight:600">线偏振分辨检测</span></div>
                <div><strong>被测偏振分量:</strong> <span id="info-component" style="color:var(--green);font-weight:600">I_x (平行分量)</span></div>
                <div><strong>物理效应:</strong> <span id="info-physics">Malus' Law (强度衰减一半)</span></div>
              </div>
            </div>
          </div>

          <!-- Static differences table -->
          <div class="card">
            <div class="card-title"><span class="icon">📋</span> 偏振与常规强度检测核心区别对比</div>
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:13px">
                <thead>
                  <tr style="border-bottom:2px solid var(--border)">
                    <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">对比项</th>
                    <th style="text-align:center;padding:10px 12px;color:var(--text-secondary);font-weight:600">常规强度检测</th>
                    <th style="text-align:center;padding:10px 12px;color:var(--text-secondary);font-weight:600">线偏振分辨</th>
                    <th style="text-align:center;padding:10px 12px;color:var(--text-secondary);font-weight:600">圆偏振分辨</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    ['核心光学元件', '无', '起偏器 + 检偏器', '起偏器 + λ/4波片×2 + 检偏器'],
                    ['测量参数', '总光谱强度 I(λ)', 'I∥(λ), I⊥(λ)', 'Iσ⁺(λ), Iσ⁻(λ)'],
                    ['物理参量', '光谱能量/强度', '线偏振度 P_linear', '圆偏振度 P_circular'],
                    ['反映的材料性质', '能级/发射效率', '光学各向异性/晶格取向', '能谷极化/自旋/发光手性'],
                    ['典型应用材料', '荧光粉/有机分子', '单晶薄膜/一维纳米线/二维材料', 'TMD过渡金属硫化物/手性液晶'],
                    ['光路复杂度', '★☆☆ 简单', '★★☆ 中等', '★★★ 复杂'],
                    ['关键校准', '光谱仪效率校准', 'G因子仪器偏振校准', '波片相位标定 + G因子校准']
                  ].map(([item, a, b, c]) => `
                    <tr style="border-bottom:1px solid var(--border-light)">
                      <td style="padding:8px 12px;font-weight:500">${item}</td>
                      <td style="padding:8px 12px;text-align:center">${a}</td>
                      <td style="padding:8px 12px;text-align:center;color:var(--accent);font-weight:600">${b}</td>
                      <td style="padding:8px 12px;text-align:center;color:var(--orange);font-weight:600">${c}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Global tooltip -->
        <div id="svg-tooltip" style="
          opacity:0; transition:opacity 0.2s ease-out; position:fixed;z-index:1000;pointer-events:none;
          background:#1D1D1F;color:#F5F5F7;border-radius:10px;
          padding:12px 16px;font-size:13px;line-height:1.6;max-width:340px;
          box-shadow:0 8px 30px rgba(0,0,0,0.25);white-space:pre-line;
          font-family:Inter,sans-serif;
        "></div>
      `;

      this._tooltipEl = document.getElementById('svg-tooltip');
      this.bindEvents();
      this.updateSimulation();
    },

    bindEvents() {
      // Light type toggle
      document.getElementById('pol-light-type')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#pol-light-type .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.lightType = btn.dataset.type;
        
        // Show/hide sub-controllers
        document.getElementById('pol-angle-group').style.display = this.lightType === 'linear' ? '' : 'none';
        document.getElementById('pol-circular-group').style.display = this.lightType === 'circular' ? '' : 'none';
        
        this.updateSimulation();
      });

      // Linear Polarization Angle Slider
      document.getElementById('pol-angle-slider')?.addEventListener('input', (e) => {
        this.polarAngle = parseInt(e.target.value);
        document.getElementById('pol-angle-val').textContent = this.polarAngle + '°';
        this.updateSimulation();
      });

      // Circular Polarization Handedness toggle
      document.getElementById('pol-circ-hand')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#pol-circ-hand .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.circHandedness = btn.dataset.hand;
        this.updateSimulation();
      });

      // Detection Scheme toggle
      document.getElementById('pol-detection-scheme')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#pol-detection-scheme .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.scheme = btn.dataset.scheme;

        // Show/hide analyzer slider
        const needsAnalyzer = this.scheme === 'linear-detection' || this.scheme === 'circular-detection';
        document.getElementById('analyzer-angle-group').style.display = needsAnalyzer ? '' : 'none';

        this.updateSimulation();
      });

      // Analyzer Angle Slider
      document.getElementById('analyzer-angle-slider')?.addEventListener('input', (e) => {
        this.analyzerAngle = parseInt(e.target.value);
        document.getElementById('analyzer-angle-val').textContent = this.analyzerAngle + '°';
        this.updateSimulation();
      });

      // Mousemove for tooltips
      document.addEventListener('mousemove', (e) => {
        if (this._tooltipEl && this._tooltipEl.style.display === 'block') {
          const x = Math.min(e.clientX + 16, window.innerWidth - 360);
          const y = Math.min(e.clientY + 16, window.innerHeight - 200);
          this._tooltipEl.style.left = x + 'px';
          this._tooltipEl.style.top = y + 'px';
        }
      });
    },

    // ==========================================
    // Math Calculation & Simulation Drawing
    // ==========================================
    calculateIntensity() {
      let intensity = 1.0;
      let mathText = '';
      let descText = '';
      let physicsName = '';
      let componentName = '';

      if (this.scheme === 'regular') {
        intensity = 1.0;
        mathText = 'I_det = I_0';
        descText = '常规光强检测：无偏振选择元件，直接收集样品的发光强度。测量值等于全部偏振分量之和。';
        physicsName = '总强度收集 (未损失强度)';
        componentName = 'I_total (I_x + I_y)';
      } 
      else if (this.scheme === 'linear-detection') {
        if (this.lightType === 'natural') {
          intensity = 0.5;
          mathText = 'I_det = 0.5 · I_0';
          descText = '自然光通过检偏器：随机偏振光经过线性检偏器，只保留沿检偏轴方向的振动分量，强度降低一半。';
          physicsName = '自然光线性起偏 (偏振片吸收一半强度)';
          componentName = `I_φ (沿检偏轴 ${this.analyzerAngle}° 方向)`;
        } 
        else if (this.lightType === 'linear') {
          const rad = (this.polarAngle - this.analyzerAngle) * Math.PI / 180;
          intensity = Math.pow(Math.cos(rad), 2);
          mathText = 'I_det = I_0 · cos²(θ - φ)';
          descText = `马吕斯定律 (Malus' Law)：线偏振光输入角为 ${this.polarAngle}°，检偏器角度为 ${this.analyzerAngle}°，其夹角为 ${Math.abs(this.polarAngle - this.analyzerAngle)}°。强度按照夹角余弦的平方规律衰减。`;
          physicsName = `马吕斯定律 (Malus' Law)`;
          componentName = `I_linear (与激发偏振夹角 ${Math.abs(this.polarAngle - this.analyzerAngle)}°)`;
        } 
        else if (this.lightType === 'circular') {
          intensity = 0.5;
          mathText = 'I_det = 0.5 · I_0';
          descText = '圆偏振光通过线性检偏器：由于圆偏振光中电场强度矢量呈圆周旋转且大小恒定，其在任意方向的线偏振分量均为 50%。';
          physicsName = '圆偏振光线性投影 (旋转各向同性)';
          componentName = `I_linear (任意线性轴方向)`;
        }
      } 
      else if (this.scheme === 'circular-detection') {
        // Circular analyzer: QWP + Polarizer
        if (this.lightType === 'natural') {
          intensity = 0.5;
          mathText = 'I_det = 0.5 · I_0';
          descText = '自然光通过 QWP 和检偏器：自然光通过圆偏振检测系统同样损失一半强度。';
          physicsName = '自然光投影';
          componentName = '混合圆偏振分量';
        } 
        else if (this.lightType === 'linear') {
          // Linearly polarized light passing through QWP (fast axis 45deg) and Polarizer at phi
          // Jones calculus shows intensity is always 0.5, regardless of linear polarization direction,
          // because it becomes circularly polarized and then analyzed by linear polarizer.
          intensity = 0.5;
          mathText = 'I_det = 0.5 · I_0 (恒定)';
          descText = `线偏振光通过 QWP 转化为圆偏振光。由于圆偏振光在所有线性方向的投影大小相等，检偏器角度 φ 不论如何变化，检测到的强度始终为 50%。`;
          physicsName = '线→圆极化转换';
          componentName = '圆极化圆投影';
        } 
        else if (this.lightType === 'circular') {
          // Circular light converts back to linear:
          // σ+ (plus) -> Horizontal linear polarization (intensity cos²φ)
          // σ- (minus) -> Vertical linear polarization (intensity sin²φ)
          const phiRad = this.analyzerAngle * Math.PI / 180;
          if (this.circHandedness === 'plus') {
            intensity = Math.pow(Math.cos(phiRad), 2);
            mathText = 'I_det = I_0 · cos²(φ)';
            descText = `右旋圆偏振 (σ⁺) 经过快轴 45° 的 QWP 后被转换为水平线偏振光 (0°)。当检偏器角度为 ${this.analyzerAngle}° 时，检测光强为 cos²(φ)。在 φ = 0° 时输出最强，在 φ = 90° 时彻底消光。`;
            physicsName = 'σ⁺ 圆偏振分析 (水平极化映射)';
            componentName = `右旋分量 (σ⁺ 检测轴)`;
          } else {
            intensity = Math.pow(Math.sin(phiRad), 2);
            mathText = 'I_det = I_0 · sin²(φ)';
            descText = `左旋圆偏振 (σ⁻) 经过快轴 45° 的 QWP 后被转换为垂直线偏振光 (90°)。当检偏器角度为 ${this.analyzerAngle}° 时，检测光强为 sin²(φ)。在 φ = 90° 时输出最强，在 φ = 0° 时彻底消光。`;
            physicsName = 'σ⁻ 圆偏振分析 (垂直极化映射)';
            componentName = `左旋分量 (σ⁻ 检测轴)`;
          }
        }
      }

      return { intensity, mathText, descText, physicsName, componentName };
    },

    updateSimulation() {
      const calc = this.calculateIntensity();
      
      // Update texts
      document.getElementById('pol-math-formula').textContent = calc.mathText;
      document.getElementById('pol-math-desc').textContent = calc.descText;
      document.getElementById('pol-intensity-percent').textContent = (calc.intensity * 100).toFixed(1) + '%';
      
      // Update gauge chart
      const circumference = 2 * Math.PI * 40; // 251.2
      const offset = circumference * (1 - calc.intensity);
      const gauge = document.getElementById('pol-intensity-gauge');
      if (gauge) {
        gauge.style.strokeDashoffset = offset;
      }

      // Update info list
      let inputPolName = '自然光';
      if (this.lightType === 'linear') inputPolName = `线偏振 (${this.polarAngle}°)`;
      else if (this.lightType === 'circular') inputPolName = `圆偏振 (${this.circHandedness === 'plus' ? 'σ⁺' : 'σ⁻'})`;

      let schemeName = '常规强度检测';
      if (this.scheme === 'linear-detection') schemeName = `线偏振检测 (φ = ${this.analyzerAngle}°)`;
      else if (this.scheme === 'circular-detection') schemeName = `圆偏振检测 (φ = ${this.analyzerAngle}°)`;

      document.getElementById('info-input-pol').textContent = inputPolName;
      document.getElementById('info-detection').textContent = schemeName;
      document.getElementById('info-component').textContent = calc.componentName;
      document.getElementById('info-physics').textContent = calc.physicsName;

      this.drawSVG(calc.intensity);
    },

    _box(x, y, w, h, label1, color, label2, tooltipId) {
      const hover = tooltipId ? `class="svg-hover-box" data-tip="${tooltipId}"` : '';
      const cursor = tooltipId ? 'cursor:pointer' : '';
      const cleanColor = color ? color.split(',')[0] : '#0071E3';
      
      const lowerId = (tooltipId || '').toLowerCase();
      const lbl1 = (label1 || '').toLowerCase();
      const lbl2 = (label2 || '').toLowerCase();
      
      let cx, cy;
      if (w >= 85) {
        cx = x + 24;
        cy = y + h / 2;
      } else {
        cx = x + w / 2;
        cy = y + h / 2 - 12;
      }

      let iconSvg = '';
      if (lowerId.includes('laser') || lbl1.includes('激光') || lbl1.includes('激发') || lbl1.includes('泵浦') || lbl2.includes('laser')) {
        iconSvg = `
          <rect x="${cx-14}" y="${cy-10}" width="28" height="20" rx="2.5" fill="#1B2631" stroke="#2C3E50" stroke-width="1"/>
          <line x1="${cx-9}" y1="${cy-6}" x2="${cx-9}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
          <line x1="${cx-5}" y1="${cy-6}" x2="${cx-5}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
          <line x1="${cx-1}" y1="${cy-6}" x2="${cx-1}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
          <line x1="${cx+3}" y1="${cy-6}" x2="${cx+3}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
          <rect x="${cx+12}" y="${cy-6}" width="4" height="12" rx="0.8" fill="#D4AC0D"/>
          <circle cx="${cx+14}" cy="${cy}" r="1.5" fill="${cleanColor}"/>
          <polygon points="${cx-11},${cy+6} ${cx-7},${cy+6} ${cx-9},${cy+2}" fill="#E74C3C"/>
        `;
      } else if (lowerId.includes('polarizer') || lowerId.includes('analyzer') || lbl1.includes('起偏') || lbl1.includes('检偏') || lbl2.includes('polarizer') || lbl2.includes('analyzer')) {
        iconSvg = `
          <circle cx="${cx}" cy="${cy}" r="14" fill="#2E4053" stroke="#212F3D" stroke-width="1.5"/>
          <circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#BDC3C7" stroke-width="1" stroke-dasharray="1.5,1.5"/>
          <line x1="${cx-7}" y1="${cy}" x2="${cx+7}" y2="${cy}" stroke="#ECF0F1" stroke-width="1" opacity="0.6"/>
          <line x1="${cx-5}" y1="${cy-5}" x2="${cx+5}" y2="${cy-5}" stroke="#ECF0F1" stroke-width="1" opacity="0.6"/>
          <line x1="${cx-5}" y1="${cy+5}" x2="${cx+5}" y2="${cy+5}" stroke="#ECF0F1" stroke-width="1" opacity="0.6"/>
          <line x1="${cx}" y1="${cy}" x2="${cx+10}" y2="${cy-6}" stroke="#E74C3C" stroke-width="1.8" stroke-linecap="round"/>
        `;
      } else if (lowerId.includes('hwp') || lowerId.includes('qwp') || lowerId.includes('waveplate') || lbl1.includes('波片') || lbl2.includes('hwp') || lbl2.includes('qwp')) {
        iconSvg = `
          <circle cx="${cx}" cy="${cy}" r="14" fill="#2E4053" stroke="#212F3D" stroke-width="1.5"/>
          <circle cx="${cx}" cy="${cy}" r="10" fill="rgba(155, 89, 182, 0.4)" stroke="#9B59B6" stroke-width="1"/>
          <line x1="${cx-7}" y1="${cy-7}" x2="${cx+7}" y2="${cy+7}" stroke="#ECF0F1" stroke-width="1.5" stroke-dasharray="2,2"/>
          <line x1="${cx-7}" y1="${cy+7}" x2="${cx+7}" y2="${cy-7}" stroke="#ECF0F1" stroke-width="0.8" opacity="0.5"/>
        `;
      } else if (lowerId.includes('dm') || lowerId.includes('splitter') || lbl1.includes('二向') || lbl1.includes('分束') || lbl2.includes('dm') || lbl2.includes('bs')) {
        iconSvg = `
          <path d="M ${cx-12} ${cy+12} L ${cx-8} ${cy+12} L ${cx-8} ${cy-10} L ${cx+6} ${cy-10}" fill="none" stroke="#95A5A6" stroke-width="2"/>
          <circle cx="${cx-10}" cy="${cy-4}" r="1.8" fill="#7F8C8D"/>
          <circle cx="${cx-10}" cy="${cy+8}" r="1.8" fill="#7F8C8D"/>
          <line x1="${cx-8}" y1="${cy+8}" x2="${cx+8}" y2="${cy-8}" stroke="${cleanColor}" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="${cx-6}" y1="${cy+6}" x2="${cx+6}" y2="${cy-6}" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
        `;
      } else if (lowerId.includes('mirror') || lowerId.includes('hr') || lowerId.includes('oc') || lbl1.includes('镜') || lbl2.includes('mirror')) {
        iconSvg = `
          <path d="M ${cx-12} ${cy+12} L ${cx-8} ${cy+12} L ${cx-8} ${cy-10} L ${cx+6} ${cy-10}" fill="none" stroke="#95A5A6" stroke-width="2"/>
          <line x1="${cx-7}" y1="${cy+8}" x2="${cx+7}" y2="${cy-6}" stroke="#3498DB" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="${cx-5}" y1="${cy+6}" x2="${cx+5}" y2="${cy-4}" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
        `;
      } else if (lowerId.includes('obj') || lbl1.includes('物镜') || lbl2.includes('obj')) {
        iconSvg = `
          <rect x="${cx-5}" y="${cy-14}" width="10" height="3" fill="#D35400" rx="0.5"/>
          <rect x="${cx-7}" y="${cy-11}" width="14" height="9" fill="#7F8C8D" stroke="#2C3E50" stroke-width="0.8"/>
          <path d="M ${cx-7} ${cy-2} L ${cx-4} ${cy+10} L ${cx+4} ${cy+10} L ${cx+7} ${cy-2} Z" fill="#2E4053" stroke="#2C3E50" stroke-width="0.8"/>
          <rect x="${cx-5}" y="${cy}" width="10" height="2" fill="#ECC94B"/>
          <rect x="${cx-2.5}" y="${cy+10}" width="5" height="1.8" fill="#E2E8F0" rx="0.3"/>
        `;
      } else if (lowerId.includes('sample') || lbl1.includes('样品') || lbl1.includes('器件') || lbl2.includes('sample')) {
        iconSvg = `
          <rect x="${cx-13}" y="${cy-4}" width="26" height="8" rx="1.2" fill="#212F3D" stroke="#17202A" stroke-width="0.8"/>
          <rect x="${cx+13}" y="${cy-2}" width="3" height="4" fill="#7F8C8D" rx="0.3"/>
          <rect x="${cx-16}" y="${cy-2}" width="3" height="4" fill="#7F8C8D" rx="0.3"/>
          <polygon points="${cx-9},${cy-4} ${cx+9},${cy-4} ${cx+6},${cy-10} ${cx-6},${cy-10}" fill="rgba(46, 134, 193, 0.4)" stroke="#2980B9" stroke-width="0.8"/>
          <circle cx="${cx}" cy="${cy-7}" r="2.5" fill="${cleanColor}" filter="url(#pol-glow)"/>
        `;
      } else if (lowerId.includes('spectro') || lbl1.includes('光谱') || lbl2.includes('spectro')) {
        iconSvg = `
          <rect x="${cx-15}" y="${cy-12}" width="30" height="24" rx="2.5" fill="#1C2833" stroke="#2C3E50" stroke-width="1.2"/>
          <line x1="${cx-10}" y1="${cy-7}" x2="${cx-10}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
          <line x1="${cx-7}" y1="${cy-7}" x2="${cx-7}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
          <line x1="${cx-4}" y1="${cy-7}" x2="${cx-4}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
          <rect x="${cx-19}" y="${cy-4}" width="4" height="8" fill="#95A5A6" rx="0.5"/>
          <circle cx="${cx+9}" cy="${cy+6}" r="1.5" fill="#2ECC71" filter="url(#pol-glow)"/>
        `;
      } else if (lowerId.includes('filter') || lbl1.includes('滤波') || lbl2.includes('filter') || lbl1.includes('长通') || lbl1.includes('带通') || lbl1.includes('陷波') || lbl1.includes('边缘')) {
        iconSvg = `
          <rect x="${cx-11}" y="${cy-13}" width="22" height="26" rx="1.5" fill="#2E4053" stroke="#212F3D" stroke-width="1"/>
          <circle cx="${cx}" cy="${cy}" r="7" fill="${cleanColor}" opacity="0.65" stroke="${cleanColor}" stroke-width="0.8"/>
          <path d="M ${cx-4} ${cy-4} Q ${cx} ${cy-6} ${cx+4} ${cy-4}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6"/>
        `;
      } else if (lowerId.includes('collect') || lowerId.includes('focusing') || lowerId.includes('collimator') || lbl1.includes('透镜') || lbl1.includes('镜') || lbl2.includes('collect') || lbl2.includes('lens')) {
        if (lbl1.includes('反射') || lbl1.includes('准直') || lbl1.includes('聚焦') && (lbl2.includes('反射') || lowerId.includes('collimator') || lowerId.includes('focusing'))) {
          iconSvg = `
            <path d="M ${cx-6} ${cy-13} Q ${cx+4} ${cy} ${cx-6} ${cy+13}" fill="none" stroke="#7F8C8D" stroke-width="4.5" stroke-linecap="round"/>
            <path d="M ${cx-4} ${cy-11} Q ${cx+5} ${cy} ${cx-4} ${cy+11}" fill="none" stroke="#3498DB" stroke-width="1.5" stroke-linecap="round"/>
          `;
        } else {
          iconSvg = `
            <rect x="${cx-5}" y="${cy-13}" width="10" height="26" rx="0.8" fill="#2E4053"/>
            <path d="M ${cx} ${cy-11} Q ${cx+7} ${cy} ${cx} ${cy+11} Q ${cx-7} ${cy} ${cx} ${cy-11} Z" fill="rgba(174, 213, 250, 0.45)" stroke="#2980B9" stroke-width="0.8"/>
            <path d="M ${cx-2} ${cy-5} L ${cx+3} ${cy+5}" stroke="#FFFFFF" stroke-width="0.6" opacity="0.6"/>
          `;
        }
      } else if (lowerId.includes('crystal') || lowerId.includes('nlc') || lbl1.includes('晶体') || lbl1.includes('棱镜') || lbl2.includes('crystal')) {
        iconSvg = `
          <polygon points="${cx-9},${cy+9} ${cx+9},${cy+9} ${cx+13},${cy-9} ${cx-5},${cy-9}" fill="rgba(142, 68, 173, 0.25)" stroke="#8E44AD" stroke-width="1.2"/>
          <line x1="${cx-9}" y1="${cy+9}" x2="${cx-5}" y2="${cy-9}" stroke="#D7BDE2" stroke-width="1.2"/>
          <line x1="${cx-3}" y1="${cy}" x2="${cx+7}" y2="${cy}" stroke="${cleanColor}" stroke-width="1.5" stroke-dasharray="1.5,1.5"/>
        `;
      } else if (lowerId.includes('slit') || lowerId.includes('pinhole') || lowerId.includes('aperture') || lbl1.includes('狭缝') || lbl1.includes('针孔')) {
        iconSvg = `
          <rect x="${cx-9}" y="${cy-13}" width="18" height="26" rx="1.5" fill="#212F3D" stroke="#17202A" stroke-width="1"/>
          <line x1="${cx}" y1="${cy-9}" x2="${cx}" y2="${cy+9}" stroke="#D35400" stroke-width="1.8"/>
          <circle cx="${cx}" cy="${cy}" r="2" fill="#17202A"/>
          <circle cx="${cx}" cy="${cy}" r="0.6" fill="#FFFFFF"/>
        `;
      } else if (lowerId.includes('chopper') || lbl1.includes('斩波')) {
        iconSvg = `
          <rect x="${cx-8}" y="${cy-11}" width="16" height="22" rx="1.5" fill="#34495E"/>
          <circle cx="${cx+10}" cy="${cy}" r="11" fill="none" stroke="#2C3E50" stroke-width="2.5" stroke-dasharray="4,2"/>
          <circle cx="${cx+10}" cy="${cy}" r="2" fill="#BDC3C7"/>
        `;
      } else if (lowerId.includes('detector') || lowerId.includes('lockin') || lowerId.includes('sourcemeter') || lowerId.includes('smu') || lowerId.includes('tcspc') || lbl1.includes('探测器') || lbl1.includes('接收') || lbl1.includes('锁相') || lbl1.includes('源表') || lbl1.includes('tcspc')) {
        iconSvg = `
          <rect x="${cx-14}" y="${cy-11}" width="28" height="22" rx="2" fill="#2C3E50" stroke="#7F8C8D" stroke-width="1"/>
          <rect x="${cx-10}" y="${cy-7}" width="14" height="6" rx="0.5" fill="#1A252F"/>
          <circle cx="${cx-8}" cy="${cy-4}" r="1" fill="#2ECC71"/>
          <circle cx="${cx+8}" cy="${cy+4}" r="1.5" fill="#E74C3C"/>
          <circle cx="${cx+2}" cy="${cy+4}" r="1.5" fill="#1A252F"/>
        `;
      } else {
        iconSvg = `
          <rect x="${cx-1.5}" y="${cy}" width="3" height="12" fill="#BDC3C7"/>
          <rect x="${cx-3}" y="${cy+10}" width="6" height="3" fill="#7F8C8D" rx="0.5"/>
          <rect x="${cx-8}" y="${cy-10}" width="16" height="10" rx="1.5" fill="#34495E" stroke="#2C3E50" stroke-width="0.8"/>
          <circle cx="${cx}" cy="${cy-5}" r="2" fill="${cleanColor}"/>
        `;
      }

      let labelHtml = '';
      if (w >= 85) {
        labelHtml = `
          <text x="${x + 46}" y="${y + h/2 - (label2 ? 5 : -4)}" font-size="12" fill="var(--text-primary)" font-weight="700" text-anchor="start">${label1}</text>
          ${label2 ? `<text x="${x + 46}" y="${y + h/2 + 13}" font-size="9.5" fill="var(--text-secondary)" text-anchor="start">${label2}</text>` : ''}
        `;
      } else {
        labelHtml = `
          <text x="${x + w/2}" y="${y + h - 18}" font-size="11.5" fill="var(--text-primary)" font-weight="700" text-anchor="middle">${label1}</text>
          ${label2 ? `<text x="${x + w/2}" y="${y + h - 6}" font-size="9" fill="var(--text-secondary)" text-anchor="middle">${label2}</text>` : ''}
        `;
      }

      return `
        <g ${hover} style="${cursor}">
          <!-- Backdrop Card -->
          <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5"
            style="filter:drop-shadow(0 2px 8px rgba(0,0,0,0.04)); transition:all 0.2s"/>
          
          <!-- Glass effect reflection shine -->
          <path d="M ${x+1} ${y+1} L ${x+w-1} ${y+1} L ${x+w-1} ${y+h/2} L ${x+1} ${y+h/3} Z" fill="rgba(255,255,255,0.15)" opacity="0.6"/>

          <!-- Accent left stripe -->
          ${w >= 85 ? `<rect x="${x}" y="${y}" width="5" height="${h}" rx="2.5" fill="${cleanColor}"/>` : ''}
          
          <!-- Metallic screw head details -->
          <circle cx="${x + w - 6}" cy="${y + 6}" r="1.5" fill="#AEAEB2" opacity="0.6"/>
          <circle cx="${x + w - 6}" cy="${y + h - 6}" r="1.5" fill="#AEAEB2" opacity="0.6"/>
          
          <!-- Physical Vector Icon -->
          ${iconSvg}
          
          <!-- Text labels -->
          ${labelHtml}
        </g>`;
    },

    // Draws polarization state indicators (ellipses/lines/circles) in SVG
    _polStateSVG(cx, cy, type, angle, circularHand, intensity) {
      const r = 18;
      let shapeHtml = '';
      let typeLabel = '';

      if (type === 'natural') {
        typeLabel = '非偏振';
        shapeHtml = `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8E8E93" stroke-width="1" opacity="0.5"/>
          <line x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#8E8E93" stroke-width="1" opacity="0.5"/>
          <line x1="${cx}" y1="${cy-r}" x2="${cx}" y2="${cy+r}" stroke="#8E8E93" stroke-width="1" opacity="0.5"/>
          <line x1="${cx-r*0.7}" y1="${cy-r*0.7}" x2="${cx+r*0.7}" y2="${cy+r*0.7}" stroke="#8E8E93" stroke-width="0.8" opacity="0.4"/>
          <line x1="${cx-r*0.7}" y1="${cy+r*0.7}" x2="${cx+r*0.7}" y2="${cy-r*0.7}" stroke="#8E8E93" stroke-width="0.8" opacity="0.4"/>
        `;
      } else if (type === 'linear') {
        typeLabel = `线偏振 ${angle}°`;
        const rad = angle * Math.PI / 180;
        const dx = r * Math.cos(rad);
        const dy = -r * Math.sin(rad);
        shapeHtml = `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E5E5EA" stroke-width="1"/>
          <line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" stroke="#AF52DE" stroke-width="3" stroke-linecap="round"/>
          <circle cx="${cx + dx}" cy="${cy + dy}" r="2" fill="#AF52DE"/>
          <circle cx="${cx - dx}" cy="${cy - dy}" r="2" fill="#AF52DE"/>
        `;
      } else if (type === 'circular') {
        typeLabel = circularHand === 'plus' ? '右旋 σ⁺' : '左旋 σ⁻';
        const strokeColor = circularHand === 'plus' ? '#0071E3' : '#FF9500';
        const sweep = circularHand === 'plus' ? '1' : '0';
        shapeHtml = `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E5E5EA" stroke-width="1"/>
          <circle cx="${cx}" cy="${cy}" r="${r-2}" fill="none" stroke="${strokeColor}" stroke-width="2.5"/>
          <path d="M ${cx + r - 2} ${cy} A ${r-2} ${r-2} 0 0 ${sweep} ${cx} ${cy - r + 2}" fill="none" stroke="${strokeColor}" stroke-width="2.5" marker-end="url(#sim-arr)"/>
        `;
      }

      return `
        <g opacity="${intensity * 0.8 + 0.2}">
          <rect x="${cx - 45}" y="${cy - 35}" width="90" height="70" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1" />
          ${shapeHtml}
          <text x="${cx}" y="${cy + 28}" font-size="9" fill="var(--text-secondary)" text-anchor="middle" font-weight="600">${typeLabel}</text>
          <text x="${cx}" y="${cy - 22}" font-size="9" fill="var(--text-primary)" text-anchor="middle" font-weight="700">强度 ${(intensity * 100).toFixed(0)}%</text>
        </g>
      `;
    },

    drawSVG(outIntensity) {
      const W = 1000, H = 260;
      const svgContainer = document.getElementById('polar-sim-svg-container');
      if (!svgContainer) return;

      let middleComponents = '';
      let beamPaths = '';
      
      const laserBox = this._box(30, 90, 110, 80, '激光光源', '#FF3B30', 'Pulsed Laser', 'pol-laser');
      const sampleBox = this._box(480, 80, 80, 100, '测试样品', '#34C759', 'Sample', 'pol-sample');
      const detectorBox = this._box(860, 90, 100, 80, '光谱仪', '#1D1D1F', 'Spectrometer', 'pol-spectro');

      let inputBeamColor = '#FF3B30';
      let shgBeamColor = '#34C759';
      if (this.lightType === 'linear') inputBeamColor = '#AF52DE';
      if (this.lightType === 'circular') inputBeamColor = '#0071E3';

      if (this.scheme === 'regular') {
        beamPaths = `
          <!-- Excitation beam -->
          <line x1="140" y1="130" x2="480" y2="130" stroke="${inputBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="140" y1="130" x2="480" y2="130" stroke="${inputBeamColor === '#FF3B30' ? '#FFD2D2' : (inputBeamColor === '#AF52DE' ? '#F3E5F5' : '#E3F2FD')}" stroke-width="2" marker-end="url(#sim-arr)"/>
          <!-- Emission beam -->
          <line x1="560" y1="130" x2="860" y2="130" stroke="${shgBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="560" y1="130" x2="860" y2="130" stroke="#E8F8ED" stroke-width="2" marker-end="url(#sim-arr)"/>
        `;
        
        middleComponents = `
          ${this._polStateSVG(230, 195, this.lightType, this.polarAngle, this.circHandedness, 1.0)}
          ${this._polStateSVG(710, 195, this.lightType, this.polarAngle, this.circHandedness, 1.0)}
        `;
      } 
      else if (this.scheme === 'linear-detection') {
        beamPaths = `
          <!-- Excitation beam -->
          <line x1="140" y1="130" x2="480" y2="130" stroke="${inputBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="140" y1="130" x2="480" y2="130" stroke="${inputBeamColor === '#FF3B30' ? '#FFD2D2' : (inputBeamColor === '#AF52DE' ? '#F3E5F5' : '#E3F2FD')}" stroke-width="2" marker-end="url(#sim-arr)"/>
          <!-- Sample to Analyzer -->
          <line x1="560" y1="130" x2="680" y2="130" stroke="${shgBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="560" y1="130" x2="680" y2="130" stroke="#E8F8ED" stroke-width="2" marker-end="url(#sim-arr)"/>
          <!-- Analyzer to Spectro -->
          <line x1="770" y1="130" x2="860" y2="130" stroke="${shgBeamColor}" stroke-width="${8 * outIntensity + 1}" opacity="${outIntensity * 0.25 + 0.05}" filter="url(#pol-glow)"/>
          <line x1="770" y1="130" x2="860" y2="130" stroke="#E8F8ED" stroke-width="2" marker-end="url(#sim-arr)" opacity="${outIntensity * 0.8 + 0.2}"/>
        `;
        
        const analyzerBox = this._box(680, 90, 90, 80, '检偏器 A', '#0071E3', `角度 φ = ${this.analyzerAngle}°`, 'pol-analyzer');
        const outPolType = outIntensity > 0.01 ? 'linear' : 'natural';

        middleComponents = `
          ${analyzerBox}
          ${this._polStateSVG(230, 195, this.lightType, this.polarAngle, this.circHandedness, 1.0)}
          ${this._polStateSVG(610, 195, this.lightType, this.polarAngle, this.circHandedness, 1.0)}
          ${this._polStateSVG(815, 195, outPolType, this.analyzerAngle, 'plus', outIntensity)}
        `;
      } 
      else if (this.scheme === 'circular-detection') {
        beamPaths = `
          <!-- Excitation beam -->
          <line x1="140" y1="130" x2="480" y2="130" stroke="${inputBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="140" y1="130" x2="480" y2="130" stroke="${inputBeamColor === '#FF3B30' ? '#FFD2D2' : (inputBeamColor === '#AF52DE' ? '#F3E5F5' : '#E3F2FD')}" stroke-width="2" marker-end="url(#sim-arr)"/>
          <!-- Sample to QWP2 -->
          <line x1="560" y1="130" x2="620" y2="130" stroke="${shgBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="560" y1="130" x2="620" y2="130" stroke="#E8F8ED" stroke-width="2" marker-end="url(#sim-arr)"/>
          <!-- QWP2 to Analyzer -->
          <line x1="700" y1="130" x2="740" y2="130" stroke="${shgBeamColor}" stroke-width="8" opacity="0.3" filter="url(#pol-glow)"/>
          <line x1="700" y1="130" x2="740" y2="130" stroke="#E8F8ED" stroke-width="2" marker-end="url(#sim-arr)"/>
          <!-- Analyzer to Spectro -->
          <line x1="820" y1="130" x2="860" y2="130" stroke="${shgBeamColor}" stroke-width="${8 * outIntensity + 1}" opacity="${outIntensity * 0.25 + 0.05}" filter="url(#pol-glow)"/>
          <line x1="820" y1="130" x2="860" y2="130" stroke="#E8F8ED" stroke-width="2" marker-end="url(#sim-arr)" opacity="${outIntensity * 0.8 + 0.2}"/>
        `;

        const qwp2Box = this._box(620, 90, 80, 80, 'QWP₂ λ/4', '#AF52DE', '快轴 45°', 'pol-qwp2');
        const analyzerBox = this._box(740, 90, 80, 80, '检偏器 A', '#0071E3', `角度 φ = ${this.analyzerAngle}°`, 'pol-analyzer');

        let intermediatePolType = 'natural';
        let intermediateAngle = 0;
        let intermediateCircHand = 'plus';

        if (this.lightType === 'linear') {
          intermediatePolType = 'circular';
          intermediateCircHand = 'plus';
        } 
        else if (this.lightType === 'circular') {
          intermediatePolType = 'linear';
          intermediateAngle = this.circHandedness === 'plus' ? 0 : 90;
        } 
        else if (this.lightType === 'natural') {
          intermediatePolType = 'natural';
        }

        const outPolType = outIntensity > 0.01 ? 'linear' : 'natural';

        middleComponents = `
          ${qwp2Box}
          ${analyzerBox}
          ${this._polStateSVG(200, 195, this.lightType, this.polarAngle, this.circHandedness, 1.0)}
          ${this._polStateSVG(585, 195, this.lightType, this.polarAngle, this.circHandedness, 1.0)}
          ${this._polStateSVG(720, 195, intermediatePolType, intermediateAngle, intermediateCircHand, 1.0)}
          ${this._polStateSVG(845, 195, outPolType, this.analyzerAngle, 'plus', outIntensity)}
        `;
      }

      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <marker id="sim-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#8E8E93"/></marker>
          <filter id="pol-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>
        
        <!-- Draw light beams -->
        ${beamPaths}

        <!-- Draw standard boxes -->
        ${laserBox}
        ${sampleBox}
        ${detectorBox}

        <!-- Dynamic elements and state indicators -->
        ${middleComponents}
      </svg>`;

      svgContainer.innerHTML = svg;
      
      // Re-attach mouse listeners for tooltips
      const tip = this._tooltipEl;
      if (tip) {
        document.querySelectorAll('.svg-hover-box').forEach(el => {
          el.addEventListener('mouseenter', () => {
            const id = el.dataset.tip;
            const text = TOOLTIPS[id];
            if (!text) return;
            tip.textContent = text;
            tip.style.display = 'block';
          });
          el.addEventListener('mouseleave', () => {
            tip.style.display = 'none';
          });
        });
      }
    },

    destroy() {
      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';
    }
  };

  App.registerTool('polarization', tool);
})();

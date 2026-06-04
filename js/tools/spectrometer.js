/* ============================================
   Optical Toolkit — Spectrometer Principles
   Czerny-Turner optical path, grating equation,
   key parameters, efficiency curves, selection guide
   ============================================ */

(() => {

  // Tooltip descriptions for spectrometer components
  const TOOLTIPS = {
    'spt-slit': '入射狭缝 (Entrance Slit)\n功能：限制入射光束宽度，是光谱分辨率的关键决定因素\n狭缝越窄 → 分辨率越高 → 通光量越小\n典型宽度：10μm ~ 3mm（可调狭缝）\n固定狭缝更稳定，可调狭缝更灵活\n最佳宽度 = 像元尺寸 / 系统放大倍率',
    'spt-collimator': '准直镜 (Collimating Mirror)\n功能：将入射的发散光准直为平行光束\n通常使用球面反射镜或离轴抛物面镜\n反射式设计无色差（优于透镜）\n焦距 f₁ 决定集光能力和系统的 f 数\nCzerny-Turner 结构中两个球面镜分开使用，减小像差',
    'spt-grating': '衍射光栅 (Diffraction Grating)\n核心色散元件，将不同波长的光衍射到不同角度\n光栅方程：d·sinθₘ = mλ\n关键参数：刻线密度（g/mm）、闪耀波长、衍射效率\n类型：刻划光栅（机械刻线）、全息光栅（激光干涉）\n闪耀光栅在特定波长范围效率最高（可达 80%+）',
    'spt-focusing': '聚焦镜 (Focusing Mirror)\n功能：将色散后的各波长平行光聚焦到焦平面上\n焦平面上放置检测器（CCD/CMOS/PMT）\n焦距 f₂ 决定倒线色散：dλ/dx = d·cosθₘ/(m·f₂)\n长焦距 → 高色散 → 高分辨率 → 低通量\n与准直镜配合构成 Czerny-Turner 对称/非对称结构',
    'spt-detector': '检测器 (Detector Array)\nCCD (Si)：200~1100nm，制冷可降暗噪声至 -70°C\nInGaAs：900~1700nm，近红外专用，速度快\nPMT：单点扫描型，灵敏度最高（单光子级）\nsCMOS：高帧率，适合动态过程\n选择依据：波长范围、灵敏度、读出速度、成本',
    'spt-filter': '滤波片 / Order Sorter\n功能：消除高级次衍射的光谱重叠\n例如：600nm 的二级衍射与 1200nm 一级重叠\n长通/短通/带通滤波片组合分离级次\n对宽范围测量尤其重要\n有些光谱仪内置自动滤波片轮',
    'spt-0order': '零级衍射 (m=0)\n光栅方程中 m=0 时，所有波长的衍射角相同（镜面反射方向）\n零级光不含色散信息，相当于普通反射\n通常需要挡板遮挡零级光以减少杂散光\n零级光强度最大，但无光谱分辨能力',
    'spt-inc-ray': '入射光束\n从狭缝出射的发散光，经准直镜变为平行光\n光束直径决定光栅的照明面积\n有效刻线数 N = 照明宽度 / d\nN 越大分辨率越高（R = mN）',
    'spt-diff-ray': '衍射光束\n经光栅衍射后按波长分开的平行光\n不同波长对应不同衍射角\n短波（蓝）衍射角小，长波（红）衍射角大\n衍射效率取决于闪耀角和镀膜',
    'spt-blaze': '闪耀光栅 (Blazed Grating)\n光栅刻槽面与光栅平面成一定角度（闪耀角 γ）\n使特定波长的衍射效率达到最大（可达 80~90%）\n闪耀波长 λb 满足：2d·sinγ = m·λb\n效率包络曲线在闪耀波长处达到峰值\n偏离闪耀波长效率下降，但仍可使用',
    'spt-rformula': '光谱分辨率 R = λ/Δλ\nΔλ 是刚能分辨的两条谱线的波长差\n理论分辨率 R = mN（m=级次，N=总刻线数）\n实际分辨率还受狭缝宽度、像差、像元尺寸限制\nRayleigh 判据：一条谱线的主极大恰好落在另一条的第一极小处',
    'spt-dispersion': '倒线色散 dλ/dx = d·cosθₘ / (m·f₂)\n其中 d = 光栅常数 (1/刻线密度)，f₂ 为聚焦镜焦距\n色散本领越大（即倒线色散值越小） → 同一 CCD 宽度覆盖的光谱范围越窄\n但每个像元对应的波长间隔越小 → 分辨率越高\n倒线色散 dλ/dx 常用 nm/mm 表示',
    'spt-slit-opt': '狭缝宽度优化\n窄狭缝（10~50μm）：高分辨率，适合精细结构分析\n宽狭缝（100~300μm）：高通量，适合弱信号检测\n最佳宽度 = 像元尺寸 × dλ/dx / 放大倍率\n过窄无益：分辨率受限于衍射极限和像差\n trade-off：分辨率 ↔ 信噪比',
    'spt-efficiency': '光栅衍射效率\n效率包络由闪耀波长和刻槽形状决定\n闪耀波长处效率最高（60~90%）\n偏离闪耀波长效率下降\n全息光栅效率更均匀但峰值较低\n多层介质膜可扩展高效率波段',
    'spt-stray': '杂散光 (Stray Light)\n来源：光栅散射、镜面散射、多次反射\n影响：降低信噪比，产生伪峰\n解决：双光栅单色仪、挡板、消光涂层\n杂散光水平通常 < 10⁻⁴（优质光谱仪）',
    'spt-order': '高级次重叠 (Order Overlap)\nm 级 λ 与 2m 级 λ/2 在同一角度\n例如：一级 800nm 与二级 400nm 重叠\n解决：滤波片（Order Sorter）、交叉色散\nCCD 探测范围有限，天然限制了重叠',
  };

  // Grating comparison data
  const GRATINGS = [
    { density: 300, disp: '低 (0.5~1 nm/mm)', range: '宽 (可达 600nm)', resolution: '较低 (R~3000)', apps: '宽范围光谱、低分辨测量、宽带光源分析' },
    { density: 600, disp: '中 (0.3~0.5 nm/mm)', range: '中等 (~300nm)', resolution: '中等 (R~6000)', apps: '通用 PL/Raman、一般光谱分析' },
    { density: 1200, disp: '高 (0.1~0.2 nm/mm)', range: '较窄 (~150nm)', resolution: '较高 (R~12000)', apps: '高分辨 Raman、窄范围精细 PL' },
    { density: 1800, disp: '很高 (<0.1 nm/mm)', range: '窄 (~100nm)', resolution: '高 (R~18000)', apps: '超高分辨 Raman、精细能级结构' },
  ];

  // Detector comparison data
  const DETECTORS = [
    { type: 'CCD (Si)', range: '200 ~ 1100 nm', sens: '高 (制冷 -70°C 可降暗噪声)', speed: '中等 (ms~s 积分)', apps: '可见/近红外通用光谱' },
    { type: 'InGaAs', range: '900 ~ 1700 nm', sens: '中高 (TE 制冷可改善)', speed: '快 (μs 级响应)', apps: '近红外光谱、通信波段' },
    { type: 'PMT', range: '200 ~ 900 nm (R928)', sens: '极高 (单光子级)', speed: '极快 (ns 级响应)', apps: '极弱信号、时间分辨、扫描型光谱' },
  ];

  // Blazing wavelength data
  const BLAZE_DATA = [
    { lambda: 250, range: '170 ~ 400 nm', band: 'UV 紫外', note: 'DNA/RNA 吸收、UV 荧光、等离子体诊断' },
    { lambda: 500, range: '330 ~ 750 nm', band: 'VIS 可见光', note: '最常用，覆盖整个可见光区' },
    { lambda: 750, range: '500 ~ 1100 nm', band: 'NIR 近红外', note: '拉曼光谱、半导体 PL、OCT' },
    { lambda: 1000, range: '650 ~ 1500 nm', band: 'NIR 近红外', note: '通信波段、近红外吸收、InGaAs 检测器' },
  ];

  // Grating efficiency curve data (normalized Gaussian-like envelopes around blaze wavelengths)
  function gratingEfficiency(lambda, blazeLambda) {
    // Approximate efficiency as a skewed Gaussian around blaze wavelength
    const sigma = blazeLambda * 0.4;
    const diff = lambda - blazeLambda;
    const eff = Math.exp(-0.5 * (diff / sigma) ** 2) * 0.85;
    return Math.max(eff, 0.02);
  }

  const tool = {
    title: '光谱仪原理',
    description: 'Czerny-Turner 光路结构、光栅方程、分辨率/色散公式、光栅效率曲线、选择指南',
    currentTab: 'czerny',
    _tooltipEl: null,
    efficiencyChart: null,

    render(container) {
      container.innerHTML = `
        <div class="tool-inputs" style="max-width:100%">
          <div class="card">
            <div class="toggle-group" id="spt-tabs">
              <button class="toggle-btn active" data-tab="czerny">Czerny-Turner 结构</button>
              <button class="toggle-btn" data-tab="params">关键参数与选择指南</button>
            </div>
          </div>

          <!-- Tab 1: Czerny-Turner Structure -->
          <div class="card tab-panel" id="tab-czerny">
            <div class="card-title"><span class="icon">🌈</span> Czerny-Turner 型光谱仪光路</div>
            <div class="help-text" style="margin-bottom:16px">
              Czerny-Turner 结构是最常用的光谱仪光路设计，由入射狭缝、准直镜、衍射光栅、聚焦镜和检测器组成。
              <strong>鼠标悬停在光路图元件上可查看详细说明与联动高亮。</strong>
            </div>
            
            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">
              <div class="dashboard-control" style="padding:0">
                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">
                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 光谱仪结构要点</div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">
                    <strong>Czerny-Turner 结构要素：</strong><br>
                    1. <b>入射狭缝</b>：限制入射光束宽度，是光谱分辨率的关键决定因素。狭缝越窄分辨率越高，通光量越小。<br>
                    2. <b>准直镜</b>：将入射的发散光准直为平行光束，反射式设计无色差。<br>
                    3. <b>衍射光栅</b>：分光核心元件，使不同波长的光发生不同角度的色散。<br>
                    4. <b>聚焦镜</b>：将色散后的各波长平行光聚焦到焦平面上。<br>
                    5. <b>检测器</b>：放置在焦平面上，接收并记录光谱信号（如CCD像元阵列）。
                  </div>
                </div>
              </div>
              <div class="dashboard-stage" style="gap:12px">
                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">
                  <div id="czerny-diagram"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Key Parameters -->
          <div class="card tab-panel" id="tab-params" style="display:none">
            <div class="card-title"><span class="icon">📐</span> 关键参数与选择指南</div>
            <div class="help-text" style="margin-bottom:16px">
              光谱仪的核心性能由光谱分辨率、色散、通光效率等参数决定。合理选择光栅和检测器是获得最佳光谱数据的关键。
            </div>
            <div id="params-content"></div>
          </div>
        </div>

        <div class="tool-results">
          <!-- Tab 1 Results -->
          <div class="card tab-result" id="res-czerny">
            <div class="card-title"><span class="icon">📋</span> 光栅与检测器对比</div>
            <div id="czerny-tables"></div>
          </div>

          <div class="card" id="spt-component-card">
            <div class="card-title"><span class="icon">📋</span> 光谱仪组成元件清单</div>
            <div id="spt-component-list"></div>
          </div>

          <!-- Tab 2 Results -->
          <div class="card tab-result" id="res-params" style="display:none">
            <div class="card-title"><span class="icon">📈</span> 光栅衍射效率曲线</div>
            <div class="help-text" style="margin-bottom:12px">不同闪耀波长的光栅效率包络。选择闪耀波长时，应使其落在待测光谱范围的中间。</div>
            <div class="chart-container" style="height:320px">
              <canvas id="efficiency-chart"></canvas>
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
      this.switchTab('czerny');
    },

    bindEvents() {
      // Tab switching
      document.getElementById('spt-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#spt-tabs .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchTab(btn.dataset.tab);
      });

      // Bidirectional hover: hover list item to highlight SVG box
      const compList = document.getElementById('spt-component-list');
      if (compList) {
        compList.addEventListener('mouseover', (e) => {
          const item = e.target.closest('.component-list-item');
          if (item) {
            const id = item.dataset.id;
            document.querySelectorAll(`.svg-hover-box[data-tip="${id}"]`).forEach(box => {
              box.classList.add('highlighted');
            });
          }
        });
        compList.addEventListener('mouseout', (e) => {
          const item = e.target.closest('.component-list-item');
          if (item) {
            const id = item.dataset.id;
            document.querySelectorAll(`.svg-hover-box[data-tip="${id}"]`).forEach(box => {
              box.classList.remove('highlighted');
            });
          }
        });
      }

      // Global mouse move for tooltip positioning
      document.addEventListener('mousemove', (e) => {
        if (this._tooltipEl && this._tooltipEl.style.display === 'block') {
          const x = Math.min(e.clientX + 16, window.innerWidth - 360);
          const y = Math.min(e.clientY + 16, window.innerHeight - 200);
          this._tooltipEl.style.left = x + 'px';
          this._tooltipEl.style.top = y + 'px';
        }
      });
    },

    switchTab(tab) {
      this.currentTab = tab;
      ['czerny', 'params'].forEach(t => {
        const panel = document.getElementById(`tab-${t}`);
        const result = document.getElementById(`res-${t}`);
        if (panel) panel.style.display = t === tab ? '' : 'none';
        if (result) result.style.display = t === tab ? '' : 'none';
      });

      const compCard = document.getElementById('spt-component-card');
      if (compCard) {
        compCard.style.display = tab === 'czerny' ? '' : 'none';
      }

      switch (tab) {
        case 'czerny':
          this._renderCzernyDiagram();
          this._renderCzernyTables();
          break;
        case 'params':
          this._renderParams();
          this._renderEfficiencyChart();
          break;
      }
    },

    // ==========================================
    // SVG Helper: interactive component box with tooltip
    // ==========================================
    _box(x, y, w, h, label1, color, label2, tooltipId) {
      return DIAGRAMS.componentBox(x, y, w, h, label1, color, label2, tooltipId);
    },

    _attachTooltips() {
      const tip = this._tooltipEl;
      if (!tip) return;
      const container = document.getElementById('czerny-diagram');
      if (!container) return;
      container.querySelectorAll('.svg-hover-box').forEach(el => {
        el.addEventListener('mouseenter', () => {
          const id = el.dataset.tip;
          const text = TOOLTIPS[id];
          if (!text) return;
          tip.textContent = text;
          tip.style.display = 'block';
          tip.style.opacity = '1';

          // Highlight in component list and scroll to it
          document.querySelectorAll(`#spt-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.add('highlighted');
            OPTICS.scrollIntoViewSafe(document.getElementById('spt-component-list'), item);
          });
        });
        el.addEventListener('mouseleave', () => {
          tip.style.display = 'none';
          tip.style.opacity = '0';

          // Remove highlight in component list
          const id = el.dataset.tip;
          document.querySelectorAll(`#spt-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.remove('highlighted');
          });
        });
      });
    },

    _renderComponentList(mode) {
      const components = {
        'czerny': [
          { id: 'spt-slit', name: '入射狭缝 (Entrance Slit)' },
          { id: 'spt-collimator', name: '准直镜 (Collimating Mirror)' },
          { id: 'spt-grating', name: '衍射光栅 (Diffraction Grating)' },
          { id: 'spt-focusing', name: '聚焦镜 (Focusing Mirror)' },
          { id: 'spt-detector', name: '检测器 (Detector Array)' },
          { id: 'spt-filter', name: '滤波片 (Order Sorter)' }
        ]
      };

      const list = components[mode] || [];
      const el = document.getElementById('spt-component-list');
      if (!el) return;

      if (list.length === 0) {
        el.innerHTML = '<div class="help-text">切换到 Czerny-Turner 结构查看元件清单</div>';
        return;
      }

      el.innerHTML = list.map((c, i) => {
        const desc = TOOLTIPS[c.id] || '';
        return `
          <div class="component-list-item" data-id="${c.id}" style="display:flex;gap:12px;padding:10px 8px;margin: 2px 0;${i > 0 ? 'border-top:1px solid var(--border-light)' : ''}">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--accent-light);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${i + 1}</div>
            <div>
              <div style="font-weight:600;font-size:14px;margin-bottom:3px">${c.name}</div>
              <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;white-space:pre-line">${desc}</div>
            </div>
          </div>`;
      }).join('');
    },

    // ==========================================
    // Tab 1: Czerny-Turner Diagram
    // ==========================================
    _renderCzernyDiagram() {
      const W = 1200, H = 480;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" id="spectrometer-svg-export" style="width:100%;display:block;margin:0 auto">
        <defs>
          <marker id="arr-sb" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>
          <marker id="arr-sr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF3B30"/></marker>
          <marker id="arr-sg" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#34C759"/></marker>
          <marker id="arr-so" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF5E00"/></marker>
          <marker id="arr-sp" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#AF52DE"/></marker>
          <marker id="arr-sgray" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#AEAEB2"/></marker>
          <filter id="sglow" x="-30%" y="-30%" width="160%" height="160%">
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

        <!-- Title -->
        <text x="${W/2}" y="32" font-size="16" fill="var(--text-primary)" text-anchor="middle" font-weight="700">Czerny-Turner 型光谱仪光路结构</text>
        <text x="${W/2}" y="52" font-size="12" fill="var(--text-secondary)" text-anchor="middle">入射狭缝 → 准直镜 → 衍射光栅 → 聚焦镜 → 检测器</text>

        <!-- === Components === -->
        ${this._box(30, 200, 130, 90, '入射狭缝', '#0071E3', 'Entrance Slit', 'spt-slit')}
        ${this._box(250, 180, 140, 110, '准直镜', '#0071E3', '球面反射镜', 'spt-collimator')}
        ${this._box(510, 160, 130, 130, '衍射光栅', '#FF3B30,stroke-width:3', 'Diffraction Grating', 'spt-grating')}
        ${this._box(780, 180, 140, 110, '聚焦镜', '#34C759', '球面反射镜', 'spt-focusing')}
        ${this._box(1030, 170, 140, 120, '检测器', '#AF52DE', 'CCD 像元', 'spt-detector')}

        <!-- Order sorter filter -->
        ${this._box(1000, 370, 130, 70, '滤波片', '#FF5E00', 'Order Sorter', 'spt-filter')}

        <!-- === Light paths === -->

        <!-- Incidence beam: slit to collimator -->
        <line x1="160" y1="245" x2="250" y2="245" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#sglow)"/>
        <line x1="160" y1="245" x2="250" y2="245" stroke="#0071E3" stroke-width="2" marker-end="url(#arr-sb)"/>
        <text x="205" y="232" font-size="11" fill="#0071E3" text-anchor="middle" font-weight="600">发散光</text>

        <!-- Collimated beam: collimator to grating -->
        <line x1="390" y1="235" x2="510" y2="245" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#sglow)"/>
        <line x1="390" y1="235" x2="510" y2="245" stroke="#0071E3" stroke-width="2" marker-end="url(#arr-sb)"/>
        <text x="450" y="225" font-size="11" fill="#0071E3" text-anchor="middle" font-weight="600">准直平行光</text>

        <!-- Grating normal -->
        <line x1="575" y1="245" x2="575" y2="130" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3"/>
        <text x="575" y="125" font-size="10" fill="var(--text-secondary)" text-anchor="middle">法线</text>

        <!-- === Diffracted beams === -->

        <!-- 0th order (mirror reflection, gray dashed) -->
        <line x1="640" y1="245" x2="780" y2="245" stroke="#AEAEB2" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr-sgray)"/>
        <text x="710" y="240" font-size="10" fill="var(--text-secondary)" text-anchor="middle">0级 (镜面反射)</text>

        <!-- Short wavelength (blue) - smaller diffraction angle -->
        <line x1="640" y1="245" x2="780" y2="275" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#sglow)"/>
        <line x1="640" y1="245" x2="780" y2="275" stroke="#0071E3" stroke-width="2" marker-end="url(#arr-sb)"/>
        <text x="710" y="278" font-size="11" fill="#0071E3" text-anchor="middle" font-weight="600">λ₁ 短波 (蓝)</text>

        <!-- Long wavelength (red) - larger diffraction angle -->
        <line x1="640" y1="245" x2="780" y2="210" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#sglow)"/>
        <line x1="640" y1="245" x2="780" y2="210" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-sr)"/>
        <text x="710" y="205" font-size="11" fill="#FF3B30" text-anchor="middle" font-weight="600">λ₂ 长波 (红)</text>

        <!-- Mid wavelength (green) -->
        <line x1="640" y1="245" x2="780" y2="243" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#sglow)"/>
        <line x1="640" y1="245" x2="780" y2="243" stroke="#34C759" stroke-width="1.8" marker-end="url(#arr-sg)"/>

        <!-- === Focusing mirror to detector === -->
        <!-- Red -->
        <line x1="920" y1="225" x2="1030" y2="210" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#sglow)"/>
        <line x1="920" y1="225" x2="1030" y2="210" stroke="#FF3B30" stroke-width="1.8" marker-end="url(#arr-sr)"/>
        <!-- Green -->
        <line x1="920" y1="245" x2="1030" y2="235" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#sglow)"/>
        <line x1="920" y1="245" x2="1030" y2="235" stroke="#34C759" stroke-width="1.5" marker-end="url(#arr-sg)"/>
        <!-- Blue -->
        <line x1="920" y1="265" x2="1030" y2="260" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#sglow)"/>
        <line x1="920" y1="265" x2="1030" y2="260" stroke="#0071E3" stroke-width="1.8" marker-end="url(#arr-sb)"/>

        <!-- Detector output -->
        <line x1="1170" y1="230" x2="1185" y2="230" stroke="#AF52DE" stroke-width="2.5" marker-end="url(#arr-sp)"/>
        <text x="1185" y="220" font-size="10" fill="#AF52DE" text-anchor="middle">数据</text>

        <!-- Angle annotation at grating -->
        <path d="M 585 245 L 615 245" stroke="none"/>
        <path d="M 590 245 A 15 15 0 0 1 603 235" fill="none" stroke="#FF3B30" stroke-width="1.2"/>
        <text x="610" y="235" font-size="10" fill="#FF3B30" font-weight="600">θ</text>
        <path d="M 590 245 A 15 15 0 0 0 603 255" fill="none" stroke="#0071E3" stroke-width="1.2"/>
        <text x="610" y="262" font-size="10" fill="#0071E3" font-weight="600">θ₁</text>

        <!-- CCD array detail on detector -->
        <text x="1100" y="295" font-size="10" fill="#AF52DE" text-anchor="middle">↑ CCD 像元阵列 ↑</text>

        <!-- === Grating equation box === -->
        <rect x="60" y="340" width="460" height="100" rx="10" fill="var(--bg-card)" stroke="#0071E3" stroke-width="1.5"/>
        <text x="290" y="368" font-size="15" fill="var(--text-primary)" text-anchor="middle" font-weight="700">光栅方程 Grating Equation</text>
        <text x="290" y="400" font-size="20" fill="#0071E3" text-anchor="middle" font-weight="700" font-family="Times New Roman, serif">d · sinθ<sub>m</sub> = m · λ</text>
        <text x="290" y="428" font-size="12" fill="var(--text-secondary)" text-anchor="middle">d = 光栅周期 (1/刻线密度)　|　θₘ = 衍射角　|　m = 衍射级次　|　λ = 波长</text>

        <!-- Key parameters box -->
        <rect x="560" y="340" width="400" height="100" rx="10" fill="var(--bg-card)" stroke="#34C759" stroke-width="1.5"/>
        <text x="760" y="368" font-size="15" fill="var(--text-primary)" text-anchor="middle" font-weight="700">关键性能参数</text>
        <text x="580" y="393" font-size="13" fill="var(--text-secondary)">分辨率：R = λ/Δλ = mN</text>
        <text x="580" y="413" font-size="13" fill="var(--text-secondary)">倒线色散：dλ/dx = d · cosθₘ / (m · f₂)</text>
        <text x="580" y="433" font-size="13" fill="var(--text-secondary)">光谱范围 = CCD宽度 × dλ/dx</text>

        <!-- Export Button (pseudo-element in SVG) -->
        <g cursor="pointer" onclick="DIAGRAMS.exportSVG(document.getElementById('spectrometer-svg-export'), 'spectrometer-diagram.svg')">
          <rect x="${W - 100}" y="15" width="85" height="24" rx="12" fill="var(--bg-primary)" stroke="var(--border)"/>
          <text x="${W - 57}" y="31" font-size="10" fill="var(--accent)" text-anchor="middle" font-weight="600">💾 导出 SVG</text>
        </g>
      </svg>`;

      document.getElementById('czerny-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentList('czerny');
    },

    _renderCzernyTables() {
      const el = document.getElementById('czerny-tables');
      if (!el) return;

      let html = '';

      // Grating table
      html += `<div style="margin-bottom:20px">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px">光栅选择参考</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="border-bottom:2px solid var(--border)">
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">刻线密度</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">色散</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">光谱范围</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">分辨率</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">典型应用</th>
              </tr>
            </thead>
            <tbody>
              ${GRATINGS.map((g, i) => {
                const colors = [Charts.COLORS.blue, Charts.COLORS.green, Charts.COLORS.orange, Charts.COLORS.red];
                return `<tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:8px 12px;font-weight:700;color:${colors[i]}">${g.density} g/mm</td>
                  <td style="padding:8px 12px">${g.disp}</td>
                  <td style="padding:8px 12px">${g.range}</td>
                  <td style="padding:8px 12px">${g.resolution}</td>
                  <td style="padding:8px 12px;color:var(--text-secondary)">${g.apps}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

      // Detector table
      html += `<div>
        <div style="font-size:14px;font-weight:700;margin-bottom:10px">检测器选择参考</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="border-bottom:2px solid var(--border)">
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">类型</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">波长范围</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">灵敏度</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">速度</th>
                <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">典型应用</th>
              </tr>
            </thead>
            <tbody>
              ${DETECTORS.map((d, i) => {
                const colors = [Charts.COLORS.blue, Charts.COLORS.orange, Charts.COLORS.red];
                return `<tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:8px 12px;font-weight:700;color:${colors[i]}">${d.type}</td>
                  <td style="padding:8px 12px">${d.range}</td>
                  <td style="padding:8px 12px">${d.sens}</td>
                  <td style="padding:8px 12px">${d.speed}</td>
                  <td style="padding:8px 12px;color:var(--text-secondary)">${d.apps}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

      el.innerHTML = html;
    },

    // ==========================================
    // Tab 2: Key Parameters
    // ==========================================
    _renderParams() {
      const el = document.getElementById('params-content');
      if (!el) return;

      let html = '';

      // Resolution formula
      html += `
      <div style="background:var(--bg-primary);border-radius:12px;padding:18px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;color:var(--accent);margin-bottom:10px">光谱分辨率 Spectral Resolution</div>
        <div class="formula-display" style="margin-bottom:12px">
          R = λ / Δλ = m · N
        </div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
          <p><strong>R</strong> = 分辨本领（无量纲）　　<strong>Δλ</strong> = 刚能分辨的两条谱线波长差</p>
          <p><strong>m</strong> = 衍射级次（通常使用 m=1）　　<strong>N</strong> = 光栅被照明的总刻线数</p>
          <p style="margin-top:8px">例如：1200 g/mm 光栅，照明宽度 30mm → N = 36000 条 → 一级 R = 36000</p>
          <p>在 500nm 处可分辨 Δλ = 500/36000 = 0.014 nm</p>
          <p style="margin-top:8px"><strong>实际分辨率</strong>还受狭缝宽度、光学像差、检测器像元尺寸限制，通常低于理论值。</p>
        </div>
      </div>`;

      // Dispersion formula
      html += `
      <div style="background:var(--bg-primary);border-radius:12px;padding:18px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;color:${Charts.COLORS.green};margin-bottom:10px">线色散 Linear Dispersion</div>
        <div class="formula-display" style="margin-bottom:12px">
          dλ/dx = d · cos θ<sub>m</sub> / (m · f<sub>2</sub>)
        </div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
          <p><strong>θₘ</strong> = 衍射角　　<strong>m</strong> = 衍射级次　　<strong>f₂</strong> = 聚焦镜焦距</p>
          <p style="margin-top:8px">色散越大 → 同一 CCD 宽度覆盖的光谱范围越窄，但每个像元对应的波长间隔越小。</p>
          <p><strong>倒线色散</strong> dλ/dx 常用 nm/mm 表示，典型值：0.1 ~ 2 nm/mm</p>
          <p style="margin-top:8px"><strong>光谱范围</strong> = CCD 有效宽度 × dλ/dx</p>
        </div>
      </div>`;

      // Slit width optimization
      html += `
      <div style="background:var(--bg-primary);border-radius:12px;padding:18px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;color:${Charts.COLORS.orange};margin-bottom:10px">狭缝宽度优化 Slit Width Optimization</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
          <div style="background:var(--bg-card);padding:14px;border-radius:10px;border-left:3px solid ${Charts.COLORS.blue}">
            <div style="font-size:14px;font-weight:600;color:${Charts.COLORS.blue};margin-bottom:6px">窄狭缝 (10~50 μm)</div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">
              高分辨率<br>适合精细结构分析<br>适合强信号样品<br>信噪比较低
            </div>
          </div>
          <div style="background:var(--bg-card);padding:14px;border-radius:10px;border-left:3px solid ${Charts.COLORS.orange}">
            <div style="font-size:14px;font-weight:600;color:${Charts.COLORS.orange};margin-bottom:6px">宽狭缝 (100~300 μm)</div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">
              通光量大<br>适合弱信号检测<br>信噪比高<br>分辨率较低
            </div>
          </div>
        </div>
        <div class="formula-display" style="margin-bottom:8px">
          最佳狭缝宽度 = 像元尺寸 / 系统放大倍率
        </div>
        <div class="help-text">过窄的狭缝不会继续提高分辨率（受限于衍射极限和像差），只会降低信号强度。</div>
      </div>`;

      // Blaze wavelength selection
      html += `
      <div style="background:var(--bg-primary);border-radius:12px;padding:18px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;color:${Charts.COLORS.purple};margin-bottom:10px">闪耀波长选择指南</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin-bottom:12px">
          闪耀波长 (Blaze Wavelength) 是光栅效率最高的波长。选择时应使闪耀波长落在待测光谱范围的中间附近。
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
          ${BLAZE_DATA.map(b => {
            const colors = ['#AF52DE', Charts.COLORS.blue, Charts.COLORS.orange, Charts.COLORS.red];
            const ci = BLAZE_DATA.indexOf(b);
            return `<div style="background:var(--bg-card);padding:14px;border-radius:10px;border-left:3px solid ${colors[ci]}">
              <div style="font-size:16px;font-weight:700;color:${colors[ci]};margin-bottom:4px">${b.lambda} nm 闪耀</div>
              <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">
                <div><strong>高效波段：</strong>${b.range}</div>
                <div><strong>光谱区域：</strong>${b.band}</div>
                <div><strong>适用场景：</strong>${b.note}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;

      // Common issues
      html += `
      <div style="background:var(--bg-primary);border-radius:12px;padding:18px">
        <div style="font-size:15px;font-weight:700;color:${Charts.COLORS.red};margin-bottom:10px">常见问题与解决</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${[
            { icon: '🔍', title: '杂散光 (Stray Light)', desc: '光栅和镜面散射导致背景升高', fix: '使用双光栅单色仪、加挡板、消光涂层' },
            { icon: '📊', title: '高级次重叠', desc: 'm 级 λ 与 2m 级 λ/2 在同角度', fix: '加 Order Sorter 滤波片、交叉色散' },
            { icon: '🌙', title: '暗噪声', desc: 'CCD 热激发产生虚假信号', fix: '制冷至 -70°C、缩短积分时间' },
            { icon: '📏', title: '波长校准', desc: '像元-波长对应关系偏移', fix: '用汞灯/氖灯标准谱线校准' },
            { icon: '💡', title: '强度校准', desc: '仪器响应随波长变化', fix: '用标准灯（黑体辐射）校正' },
            { icon: '⚡', title: '宇宙射线', desc: '高能粒子击中 CCD 产生尖峰', fix: '多次采集取中值滤除' },
          ].map(item => `
            <div style="background:var(--bg-card);padding:12px;border-radius:8px">
              <div style="font-size:14px;font-weight:600;margin-bottom:4px">${item.icon} ${item.title}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">${item.desc}</div>
              <div style="font-size:12px;color:var(--green)"><strong>解决：</strong>${item.fix}</div>
            </div>
          `).join('')}
        </div>
      </div>`;

      el.innerHTML = html;
    },

    _renderEfficiencyChart() {
      const canvasId = 'efficiency-chart';
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();

      // Generate wavelength data from 200nm to 1500nm
      const nPoints = 200;
      const lambdaData = [];
      for (let i = 0; i <= nPoints; i++) {
        lambdaData.push(200 + (1500 - 200) * i / nPoints);
      }

      const blazeWavelengths = [250, 500, 750, 1000];
      const colors = ['#AF52DE', Charts.COLORS.blue, Charts.COLORS.orange, Charts.COLORS.red];
      const labels = ['250nm 闪耀 (UV)', '500nm 闪耀 (VIS)', '750nm 闪耀 (NIR)', '1000nm 闪耀 (NIR)'];

      const datasets = blazeWavelengths.map((blaze, idx) => ({
        label: labels[idx],
        data: lambdaData.map(l => (gratingEfficiency(l, blaze) * 100).toFixed(1)),
        borderColor: colors[idx],
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.4,
      }));

      this.efficiencyChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: lambdaData.map(l => l.toFixed(0)),
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: { family: 'Inter, sans-serif', size: 12 },
                color: '#6E6E73',
                usePointStyle: true,
                pointStyleWidth: 8,
                boxHeight: 6,
              }
            },
            tooltip: {
              backgroundColor: '#1D1D1F',
              titleFont: { family: 'Inter, sans-serif', size: 13 },
              bodyFont: { family: 'SF Mono, Consolas, monospace', size: 12 },
              padding: 10,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                title: (items) => `λ = ${items[0].label} nm`,
                label: (item) => `效率: ${item.raw}%`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(150, 150, 150, 0.15)', drawBorder: false },
              ticks: {
                font: { family: 'SF Mono, Consolas, monospace', size: 11 },
                color: '#AEAEB2',
                callback: function(val, idx) {
                  const label = this.getLabelForValue(val);
                  return idx % 40 === 0 ? label + ' nm' : '';
                }
              },
              title: { display: true, text: '波长 λ (nm)', font: { size: 12, family: 'Inter' }, color: '#6E6E73' },
            },
            y: {
              grid: { color: 'rgba(150, 150, 150, 0.15)', drawBorder: false },
              ticks: {
                font: { family: 'SF Mono, Consolas, monospace', size: 11 },
                color: '#AEAEB2',
                callback: (val) => val + '%',
              },
              title: { display: true, text: '衍射效率 (%)', font: { size: 12, family: 'Inter' }, color: '#6E6E73' },
              min: 0,
              max: 100,
            }
          }
        }
      });
    },

    destroy() {
      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';
      if (this.efficiencyChart) { this.efficiencyChart.destroy(); this.efficiencyChart = null; }
    }
  };

  App.registerTool('spectrometer', tool);
})();

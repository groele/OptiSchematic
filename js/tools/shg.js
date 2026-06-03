/* ============================================
   Optical Toolkit — SHG Second Harmonic Generation
   Principle, optical setups, polarization-resolved SHG, applications
   ============================================ */

(() => {

  const TOOLTIPS = {
    // SHG Principle
    'shg-fund': '基频光子激发 (Fundamental Excitation)\n入射光子能量为 ℏω，常选用超快飞秒/皮秒脉冲激光器\n激发波长常见为 800nm (Ti:Sapphire) 或 1060nm 左右的红外激光\n由于 SHG 信号强度与入射光强的平方成正比，超快激光的高峰值功率是产生高效倍频的关键。',
    'shg-crystal': '非线性介质 (Nonlinear Medium / TMDs)\n发生二次谐波所需的介质，必须打破空间反演对称性（如单层 MoS₂ 等二维过渡金属硫族化合物，或 BBO、LBO 等非线性晶体）\n其二阶非线性极化张量 χ⁽²⁾ 不为零。在中心对称材料（如双层 MoS₂、硅、体相材料）中，体相 SHG 禁阻，仅在表面或界面由于对称性破缺产生微弱信号。',
    'shg-emission': '二次谐波辐射 (Second Harmonic Emission)\n介质中非线性极化强度 P⁽²⁾(2ω) 辐射出的倍频相干光\n发光能量恰好等于入射基频光子能量的两倍（E_SHG = 2 × E_fund）\n波长为基频光的一半（λ_SHG = λ_fund / 2），其偏振和空间方向受相位匹配和晶体取向（非线性张量元）的强调制。',
    'shg-virtual': '虚拟能级跃迁 (Virtual State Transition)\nSHG 是超快参量过程，其跃迁借助“虚能级”（Virtual States）完成\n电子无需跃迁到真实的导带或激子实能级，不存在非辐射热弛豫过程，因而不产生热损耗（无声子参与）\n整个极化和辐射过程在数飞秒内完成（瞬时响应），这与需要能带内热弛豫和实能级寿命（纳秒级）的荧光（PL）过程有本质区别。',

    // Reflective SHG
    'ref-laser': '飞秒/皮秒脉冲激光器\n常用波长：800nm (Ti:Sapphire)、1064nm (Nd:YAG)\n脉宽：<100fs ~ 数ps\n重复频率：80MHz (振荡器) ~ 1kHz (放大器)\n注意：峰值功率密度决定SHG效率，需控制在样品损伤阈值以下',
    'ref-ndf': '中性密度滤波片 (ND Filter)\n功能：连续调节入射激光功率，避免样品损伤\n类型：旋转式可调ND、固定OD值滤波片\n范围：OD 0.1~4 (透过率 80%~0.01%)\n注意：避免使用有色滤波片引入额外波长选择',
    'ref-hwp': '半波片 λ/2 (Half-wave Plate)\n功能：旋转基频光的线偏振方向\n原理：快轴角度 φ 使偏振方向旋转 2φ\n应用：连续扫描入射偏振角 θ，配合检偏器做偏振分辨SHG\n需针对基频波长选择零级或多级波片',
    'ref-polarizer': '起偏器 (Polarizer)\n功能：产生高质量线偏振激发光\n类型：格兰-泰勒棱镜（消光比 >10⁵:1）\n与HWP配合可精确控制入射偏振方向\n消光比影响偏振分辨SHG的测量精度',
    'ref-dm': '二向色镜 (Dichroic Mirror)\n功能：反射基频光(ω)，透射SHG信号(2ω)\n关键参数：截止波长位于λ_fund和λ_SHG之间\n反射率 >99% @ λ_fund，透过率 >95% @ λ_SHG\n注意：需确认二向色镜的损伤阈值',
    'ref-obj': '显微物镜 (Microscope Objective)\n功能：聚焦激光到样品，收集反射SHG信号\n参数：NA 0.4~0.95，放大倍数 20x~100x\n焦点处光斑尺寸 ~λ/(2NA)\n注意：高NA物镜收集效率高，但焦深短',
    'ref-sample': '样品 (Sample)\n典型材料：单层TMDs (MoS₂, WSe₂)、铁电薄膜 (CIPS, α-In₂Se₃)\n需非中心对称结构才能产生SHG\n反射式适合不透明衬底（Si、金属）\n样品需放置在精密位移台上进行mapping',
    'ref-filter': '短通/带通滤波器 (SP/BP Filter)\n功能：滤除残余基频光，仅透过SHG信号\n要求：OD>6 @ λ_fund，透过率 >90% @ λ_SHG\n带通滤波器可进一步抑制背景荧光\n注意：滤波器的截止陡度影响信噪比',
    'ref-analyzer': '检偏器 (Analyzer)\n功能：选择检测SHG信号的特定偏振分量\n旋转360°可获得完整的偏振分辨SHG图案\n消光比 >10⁴:1 保证测量精度\n与入射偏振配合可确定晶体对称性',
    'ref-spectro': '光谱仪/PMT 检测器\n光谱仪：记录SHG光谱，确认信号为λ_fund/2\nPMT/APD：高灵敏度单点检测\nCCD：可做SHG强度mapping\n积分时间：0.1~10s，根据信号强度调整',

    // Transmissive SHG
    'tra-laser': '飞秒/皮秒脉冲激光器\n与反射式相同配置\n注意：透射式需考虑衬底对激光的吸收',
    'tra-ndf': '中性密度滤波片\n功能同反射式：调节入射功率\n透射式光路中仅在入射侧放置',
    'tra-hwp': '半波片 λ/2\n功能同反射式：控制入射偏振方向',
    'tra-polarizer': '起偏器\n功能同反射式：产生线偏振激发光',
    'tra-obj1': '聚焦物镜 (入射侧)\n功能：将激光聚焦到透明衬底上的样品\n参数：NA 0.4~0.65 (避免过高NA导致像差)\n需考虑衬底厚度对聚焦的影响',
    'tra-sample': '样品 (透明衬底)\n典型：石英、蓝宝石、玻璃衬底上的2D材料\n透射式SHG信号沿前向传播\n需确保衬底材料不吸收SHG波长',
    'tra-obj2': '收集物镜 (透射侧)\n功能：收集前向传播的SHG信号\n可与入射侧物镜相同型号\n注意对准：确保收集光斑与信号重合',
    'tra-dm': '二向色镜\n功能：分离基频光和SHG信号\n透射式中SHG信号透射，残余基频光被反射\n或使用短通滤波器直接滤除基频光',
    'tra-filter': '短通/带通滤波器\n功能：滤除透射的残余基频光\n与反射式滤波器要求相同\n透射式光路通常需要多级滤波以达到足够抑制比',
    'tra-analyzer': '检偏器\n功能同反射式：选择SHG偏振分量\n透射式中偏振态可能受衬底双折射影响',
    'tra-spectro': '光谱仪/PMT 检测器\n功能同反射式：检测和分析SHG信号',
    'tra-qwp': '四分之一波片 λ/4 (Quarter-wave Plate)\n功能：将线偏振转换为圆偏振，或反之\n操作：旋转快轴至与入射线偏振成 ±45° 产生 σ+/σ-\n圆偏振 SHG 常用于探测手性对称性和能谷物理',
  };

  const tool = {
    title: 'SHG 二次谐波',
    description: '二次谐波产生原理、光路设计、偏振分辨测量与二维材料应用',
    currentTab: 'principle',
    _tooltipEl: null,
    polarChart: null,

    render(container) {
      container.innerHTML = `
        <!-- Top Control Bar (Tabs) -->
        <div class="card">
          <div class="toggle-group" id="shg-tabs">
            <button class="toggle-btn active" data-tab="principle">SHG 原理</button>
            <button class="toggle-btn" data-tab="setup">反射式/透射式 SHG 光路</button>
            <button class="toggle-btn" data-tab="polarization">偏振分辨 SHG</button>
            <button class="toggle-btn" data-tab="applications">应用与材料</button>
          </div>
        </div>

        <!-- Middle Stage (Diagrams) -->
        <div class="dashboard-wide-stage">
          <!-- Tab 1: SHG Principle -->
          <div class="card tab-panel" id="tab-principle">
            <div class="card-title"><span class="icon">🔆</span> SHG 二次谐波产生物理原理</div>
            <div class="help-text" style="margin-bottom:16px">
              二次谐波产生（Second Harmonic Generation, SHG）是一种非线性光学参量过程。当频率为 ω 的强基频激光照射在非中心对称介质上时，介质内部会产生 2ω 的二阶非线性极化，进而辐射出频率为 2ω、波长为激发光一半的相干光子。
            </div>
            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">
              <div class="dashboard-control" style="padding:0">
                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">
                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 过程简述</div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent);margin-bottom:12px">
                    <strong>倍频三部曲：</strong><br>
                    1. <b>基频光激发</b>：输入强脉冲基频光子 ℏω 并诱导非线性极化；<br>
                    2. <b>非线性极化</b>：在非中心对称介质中诱导出二阶极化强度 P⁽²⁾(2ω)；<br>
                    3. <b>倍频光相干辐射</b>：二阶极化极快辐射出频率为 2ω 的相干倍频光子。
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">
                    <strong>非线性极化场关系：</strong><br>
                    <div style="font-family:var(--font-mono);font-size:12px;background:var(--bg-card);padding:6px;border-radius:4px;margin:6px 0;text-align:center;border:1px solid var(--border);color:var(--accent)">
                      P_i⁽²⁾(2ω) = ε₀ Σ_{j,k} χ_{ijk}⁽²⁾ E_j(ω) E_k(ω)
                    </div>
                    <span style="font-size:10px;color:var(--text-tertiary)">
                      P_i⁽²⁾: 二阶非线性极化强度分量<br>
                      χ_{ijk}⁽²⁾: 二阶非线性极化率张量元<br>
                      E_j, E_k: 基频电场分量。因空间反演对称限制，中心对称晶格的体相中恒有 χ⁽²⁾ ≡ 0。
                    </span>
                  </div>
                </div>
              </div>
              <div class="dashboard-stage" style="gap:12px">
                <div id="shg-principle-diagram"></div>
              </div>
            </div>
            <div id="shg-principle-text"></div>
          </div>

          <!-- Tab 2: Optical Setups -->
          <div class="tab-panel" id="tab-setup" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">🔬</span> SHG 测试光路</div>
            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">
              <div class="dashboard-control" style="padding:0">
                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">
                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 光路配置模式</div>
                  <div class="toggle-group" id="shg-setup-mode" style="margin-bottom:12px;flex-direction:column">
                    <button class="toggle-btn active" data-mode="reflective" style="text-align:left;padding-left:16px">反射式 SHG (Reflective)</button>
                    <button class="toggle-btn" data-mode="transmissive" style="text-align:left;padding-left:16px">透射式 SHG (Transmissive)</button>
                  </div>
                  <div id="shg-setup-operation-guide" style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">
                    <!-- Content dynamic based on reflective/transmissive setup -->
                  </div>
                </div>
              </div>
              <div class="dashboard-stage" style="gap:12px">
                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">
                   <div id="shg-setup-diagram"></div>
                </div>
              </div>
            </div>
            <div id="shg-setup-notes"></div>
          </div>

          <!-- Tab 3: Polarization-resolved SHG -->
          <div class="tab-panel" id="tab-polarization" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">📐</span> 偏振分辨 SHG (PR-SHG)</div>
            <div class="help-text" style="margin-bottom:16px">通过精确控制入射和探测路径的偏振状态，可以反演材料的非线性张量元 χ⁽²⁾ᵢⱼₖ 和对称性。</div>
            
            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">
              <div class="dashboard-control">
                <div class="card">
                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 测量配置模式</div>
                  <div class="toggle-group" id="shg-polar-mode" style="margin-bottom:12px;flex-direction:column">
                    <button class="toggle-btn active" data-pmode="linear" style="text-align:left;padding-left:16px">线偏振 (Linear-Linear)</button>
                    <button class="toggle-btn" data-pmode="circular" style="text-align:left;padding-left:16px">圆偏振 (Circular-Circular)</button>
                  </div>

                  <div id="shg-subconfig-wrapper" style="margin-bottom:12px; padding: 8px 12px; background:var(--bg-primary); border-radius:8px; border:1px solid var(--border)">
                    <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;font-weight:600">测试偏振态组合：</div>
                    <div class="toggle-group" id="shg-polar-subconfig" style="display:flex;flex-wrap:wrap;gap:6px">
                      <!-- Dynamically populated -->
                    </div>
                  </div>
                  
                  <div id="shg-operation-guide" style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">
                    <!-- Content dynamic -->
                  </div>
                </div>

                <div class="card">
                  <div class="card-title" style="font-size:13px"><span class="icon">📊</span> 晶体对称性模拟</div>
                  <div class="toggle-group" id="shg-symmetry" style="margin-bottom:12px;flex-direction:column">
                    <button class="toggle-btn active" data-sym="3fold" style="text-align:left;padding-left:16px">三重对称 C₃ᵥ (如 MoS₂)</button>
                    <button class="toggle-btn" data-sym="2fold" style="text-align:left;padding-left:16px">二重对称 C₂ᵥ (如 ReS₂)</button>
                    <button class="toggle-btn" data-sym="isotropic" style="text-align:left;padding-left:16px">各向同性 (Amorphous)</button>
                  </div>
                </div>
              </div>

              <div class="dashboard-stage" style="gap:12px">
                <div class="card" style="padding:10px">
                   <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px;text-align:right">操作演示图 Optical Setup</div>
                   <div id="shg-polar-setup"></div>
                </div>
                <div class="card" style="padding:10px">
                   <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px;text-align:right">极坐标模拟数据 Polar Plot</div>
                   <div class="chart-container" style="height:380px">
                    <canvas id="shg-polar-chart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="shg-polar-notes"></div>
          </div>

          <!-- Tab 4: Applications -->
          <div class="tab-panel" id="tab-applications" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">🚀</span> SHG 在二维材料中的应用</div>
            <div id="shg-apps-content"></div>
          </div>
        </div>

        <!-- Bottom Footer (Dual Columns: Notes & Inventory) -->
        <div class="dashboard-wide-footer" id="shg-footer">
          <!-- Left Column: Notes & Explanations -->
          <div class="dashboard-notes">
            <div class="card" style="height:100%">
              <div class="card-title"><span class="icon">📝</span> 实验与物理要点</div>
              <div id="shg-notes-content"></div>
            </div>
          </div>

          <!-- Right Column: Components Inventory -->
          <div class="dashboard-inventory">
            <div class="card" style="height:100%">
              <div class="card-title"><span class="icon">📋</span> 元件清单与规格</div>
              <div id="shg-component-list"></div>
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
      this.updateSubconfigs('linear');
      this.switchTab('principle');
    },

    bindEvents() {
      // Tab switching
      document.getElementById('shg-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#shg-tabs .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchTab(btn.dataset.tab);
      });

      // Setup mode toggle (reflective / transmissive)
      document.getElementById('shg-setup-mode')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#shg-setup-mode .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderSetup(btn.dataset.mode);
      });

      // Polarization mode toggle
      document.getElementById('shg-polar-mode')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#shg-polar-mode .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateSubconfigs(btn.dataset.pmode);
        this.renderPolarization();
      });

      // Polarization subconfig toggle
      document.getElementById('shg-polar-subconfig')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#shg-polar-subconfig .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderPolarization();
      });

      // Symmetry toggle
      document.getElementById('shg-symmetry')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#shg-symmetry .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePolarPlot(btn.dataset.sym);
      });

      // Bidirectional hover: hover list item to highlight SVG box
      const compList = document.getElementById('shg-component-list');
      if (compList) {
        compList.addEventListener('mouseover', (e) => {
          const item = e.target.closest('.component-list-item');
          if (!item) return;
          const id = item.dataset.id;
          document.querySelectorAll(`.svg-hover-box[data-tip="${id}"]`).forEach(box => {
            box.classList.add('highlighted');
          });
        });
        compList.addEventListener('mouseout', (e) => {
          const item = e.target.closest('.component-list-item');
          if (!item) return;
          const id = item.dataset.id;
          document.querySelectorAll(`.svg-hover-box[data-tip="${id}"]`).forEach(box => {
            box.classList.remove('highlighted');
          });
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
      ['principle', 'setup', 'polarization', 'applications'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.style.display = t === tab ? '' : 'none';
      });

      const footer = document.getElementById('shg-footer');
      if (footer) {
        footer.style.display = (tab === 'applications') ? 'none' : 'grid';
      }

      switch (tab) {
        case 'principle': this.renderPrinciple(); break;
        case 'setup': this.renderSetup('reflective'); break;
        case 'polarization': this.renderPolarization(); break;
        case 'applications': this.renderApplications(); break;
      }
    },

    _box(x, y, w, h, label1, color, label2, tooltipId) {
      return DIAGRAMS.componentBox(x, y, w, h, label1, color, label2, tooltipId);
    },

    _attachTooltips() {
      const tip = this._tooltipEl;
      if (!tip) return;
      document.querySelectorAll('.svg-hover-box').forEach(el => {
        el.addEventListener('mouseenter', () => {
          const id = el.dataset.tip;
          const text = TOOLTIPS[id];
          if (!text) return;
          tip.textContent = text;
          tip.style.display = 'block';
          tip.style.opacity = '1';

          // Highlight in component list and scroll to it
          document.querySelectorAll(`#shg-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.add('highlighted');
            OPTICS.scrollIntoViewSafe(document.getElementById('shg-component-list'), item);
          });
        });
        el.addEventListener('mouseleave', () => {
          tip.style.display = 'none';
          tip.style.opacity = '0';

          // Remove highlight in component list
          const id = el.dataset.tip;
          document.querySelectorAll(`#shg-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.remove('highlighted');
          });
        });
      });
    },

    // ==========================================
    // Tab 1: SHG Principle
    // ==========================================
    renderPrinciple() {
      const W = 1200, H = 500;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" id="shg-principle-export" style="width:100%;display:block;margin:0 auto">
        ${DIAGRAMS.commonDefs()}
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Left Side: Parametric Process Model -->
        <rect x="30" y="30" width="700" height="440" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-dasharray="4,4" opacity="0.5"/>
        <text x="380" y="55" font-size="14" fill="var(--text-primary)" text-anchor="middle" font-weight="700">二次谐波产生参量过程模型 Parametric Process Model</text>

        <!-- Fundamental Input Beams -->
        <g class="svg-hover-box" data-tip="shg-fund" cursor="pointer">
          <!-- Wave 1 (Fundamental) -->
          <path d="M 60 160 Q 85 135, 110 160 T 160 160 T 210 160 T 260 160 T 310 160 T 360 160" fill="none" stroke="#FF3B30" stroke-width="6" opacity="0.3" filter="url(#shg-glow)"/>
          <path d="M 60 160 Q 85 135, 110 160 T 360 160" fill="none" stroke="#FF3B30" stroke-width="2"/>
          <circle cx="360" cy="160" r="4" fill="#FF3B30"/>
          <text x="210" y="125" font-size="13" fill="var(--text-primary)" text-anchor="middle" font-weight="700">基频光子 1 (ℏω)</text>
          <text x="210" y="108" font-size="11" fill="var(--text-secondary)" text-anchor="middle">λ = λ_fund</text>

          <!-- Wave 2 (Fundamental) -->
          <path d="M 60 270 Q 85 245, 110 270 T 160 270 T 210 270 T 260 270 T 310 270 T 360 270" fill="none" stroke="#FF3B30" stroke-width="6" opacity="0.3" filter="url(#shg-glow)"/>
          <path d="M 60 270 Q 85 245, 110 270 T 360 270" fill="none" stroke="#FF3B30" stroke-width="2"/>
          <circle cx="360" cy="270" r="4" fill="#FF3B30"/>
          <text x="210" y="315" font-size="13" fill="var(--text-primary)" text-anchor="middle" font-weight="700">基频光子 2 (ℏω)</text>

          <!-- Bracket indicating combining -->
          <path d="M 370 150 L 378 150 A 8 8 0 0 1 386 158 L 386 200 A 8 8 0 0 0 394 208 L 394 212 A 8 8 0 0 0 386 220 L 386 262 A 8 8 0 0 1 378 270 L 370 270" fill="none" stroke="var(--text-secondary)" stroke-width="1.5"/>
        </g>

        <!-- Nonlinear Crystal Medium -->
        <g class="svg-hover-box" data-tip="shg-crystal" cursor="pointer">
          <rect x="410" y="100" width="140" height="220" rx="12" fill="var(--bg-primary)" stroke="#AF52DE" stroke-width="2.5" style="filter:drop-shadow(0 4px 12px rgba(142,68,173,0.15))"/>
          <text x="480" y="132" font-size="13" fill="#AF52DE" text-anchor="middle" font-weight="700">非中心对称介质</text>
          <text x="480" y="150" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle">χ⁽²⁾ ≠ 0 (如 MoS₂)</text>

          <rect x="425" y="172" width="110" height="70" rx="8" fill="#AF52DE" opacity="0.08"/>
          <text x="480" y="192" font-size="11" fill="#AF52DE" text-anchor="middle" font-weight="700">2 × ℏω → ℏ(2ω)</text>
          <text x="480" y="210" font-size="9" fill="var(--text-secondary)" text-anchor="middle">二阶非线性极化</text>
          <text x="480" y="228" font-size="10.5" fill="var(--accent)" text-anchor="middle" font-weight="700">P⁽²⁾ = ε₀χ⁽²⁾E²</text>

          <!-- Lattice illustration points -->
          <circle cx="445" cy="275" r="3" fill="#AF52DE"/>
          <circle cx="480" cy="275" r="3" fill="#0071E3"/>
          <circle cx="515" cy="275" r="3" fill="#AF52DE"/>
          <line x1="448" y1="275" x2="477" y2="275" stroke="var(--border)" stroke-width="1"/>
          <line x1="483" y1="275" x2="512" y2="275" stroke="var(--border)" stroke-width="1"/>
          <circle cx="462.5" cy="295" r="3" fill="#0071E3"/>
          <circle cx="497.5" cy="295" r="3" fill="#AF52DE"/>
          <line x1="445" y1="278" x2="460" y2="292" stroke="var(--border)" stroke-width="1"/>
          <line x1="480" y1="278" x2="465" y2="292" stroke="var(--border)" stroke-width="1"/>
          <line x1="480" y1="278" x2="495" y2="292" stroke="var(--border)" stroke-width="1"/>
          <line x1="515" y1="278" x2="500" y2="292" stroke="var(--border)" stroke-width="1"/>
          <text x="480" y="312" font-size="9" fill="var(--text-tertiary)" text-anchor="middle">非共中心对称格点</text>
        </g>

        <!-- SHG Output Beam -->
        <g class="svg-hover-box" data-tip="shg-emission" cursor="pointer">
          <path d="M 550 210 Q 575 185, 600 210 T 650 210 T 700 210" fill="none" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#shg-glow)"/>
          <path d="M 550 210 Q 575 185, 600 210 T 700 210" fill="none" stroke="#34C759" stroke-width="2" marker-end="url(#arr-g)"/>
          <text x="625" y="170" font-size="13" fill="#34C759" text-anchor="middle" font-weight="700">倍频光子 (2ℏω)</text>
          <text x="625" y="153" font-size="11" fill="#34C759" text-anchor="middle">λ_SHG = λ_fund / 2</text>
          <text x="625" y="245" font-size="11" fill="var(--text-secondary)" text-anchor="middle">相干偏振辐射</text>
        </g>

        <!-- Right Side: Energy Level Model -->
        <rect x="760" y="30" width="410" height="440" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="965" y="55" font-size="14" fill="var(--text-primary)" text-anchor="middle" font-weight="700">能级跃迁与参量过程 Energy Level Model</text>

        <g class="svg-hover-box" data-tip="shg-virtual" cursor="pointer">
          <!-- Ground state -->
          <line x1="800" y1="360" x2="1130" y2="360" stroke="var(--text-primary)" stroke-width="2.5"/>
          <text x="1140" y="364" font-size="11" fill="var(--text-primary)" font-weight="700">基态 Ground State (E_0)</text>

          <!-- Virtual state 1 (hω) -->
          <line x1="820" y1="240" x2="1110" y2="240" stroke="#AF52DE" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="1120" y="244" font-size="10" fill="#AF52DE" font-weight="600">第一虚能级 Virtual State 1</text>

          <!-- Virtual state 2 (2hω) -->
          <line x1="820" y1="120" x2="1110" y2="120" stroke="#AF52DE" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="1120" y="124" font-size="10" fill="#AF52DE" font-weight="600">第二虚能级 Virtual State 2</text>

          <!-- Step 1 absorption (ω) -->
          <line x1="875" y1="360" x2="875" y2="240" stroke="#FF3B30" stroke-width="2.5" marker-end="url(#arr-r)"/>
          <text x="860" y="305" font-size="12" fill="#FF3B30" text-anchor="end" font-weight="700">激发 ℏω</text>

          <!-- Step 2 absorption (ω) -->
          <line x1="875" y1="240" x2="875" y2="120" stroke="#FF3B30" stroke-width="2.5" marker-end="url(#arr-r)"/>
          <text x="860" y="185" font-size="12" fill="#FF3B30" text-anchor="end" font-weight="700">激发 ℏω</text>

          <!-- SHG emission (2ω) -->
          <line x1="1025" y1="120" x2="1025" y2="360" stroke="#34C759" stroke-width="3" marker-end="url(#arr-g)"/>
          <text x="1040" y="235" font-size="13" fill="#34C759" font-weight="700" text-anchor="start">倍频辐射 2ℏω</text>
          <text x="1040" y="255" font-size="11" fill="var(--text-secondary)" text-anchor="start">(无热弛豫/声子损耗)</text>

          <!-- Explanatory note -->
          <text x="965" y="415" font-size="12" fill="var(--text-secondary)" text-anchor="middle">瞬时参量过程响应 | 电子响应时间 &lt; 10 fs</text>
          <text x="965" y="435" font-size="11" fill="var(--accent)" text-anchor="middle" font-weight="600">不涉及真实带内激发寿命，光子能量完全守恒</text>
        </g>

        <!-- Export Button -->
        <g cursor="pointer" onclick="DIAGRAMS.exportSVG(document.getElementById('shg-principle-export'), 'shg-principle.svg')">
          <rect x="${W - 110}" y="45" width="85" height="24" rx="12" fill="var(--bg-primary)" stroke="var(--border)"/>
          <text x="${W - 67}" y="61" font-size="10" fill="var(--accent)" text-anchor="middle" font-weight="600">💾 导出 SVG</text>
        </g>
      </svg>`;

      document.getElementById('shg-principle-diagram').innerHTML = svg;
      this._attachTooltips();

      document.getElementById('shg-principle-text').innerHTML = `
        <div style="margin-top:20px">
          <!-- Row 1 of Theoretical Explanations -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
            <div style="background:var(--bg-primary);border-radius:12px;padding:20px;border:1px solid var(--border)">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:6px">
                <span style="color:var(--accent)">■</span> 二阶非线性极化张量与物理描述
              </div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <p><strong>非线性极化响应：</strong></p>
                <p>当介质暴露在强光电场 <b>E</b>(ω) 中时，总诱导极化强度 <b>P</b> 可以按电场强度幂级数展开。其中二次项即为二阶非线性极化 <b>P</b>⁽²⁾(2ω)，它是发生二次谐波产生 (SHG) 的源项：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--accent);border:1px solid var(--border)">
                  P_i⁽²⁾(2ω) = ε₀ Σ_{j,k} χ_{ijk}⁽²⁾(2ω; ω, ω) E_j(ω) E_k(ω)
                </div>
                <p><strong>张量对称性：</strong></p>
                <p>二阶非线性极化率系数 χ_{ijk}⁽²⁾ 是一个三阶张量，包含 27 个独立分量。由于两个基频光子是简并的，根据内秉排列对称性，j 和 k 可以任意互换。对于特定晶体，应用其固有的点群对称操作后，非零独立分量将大幅减少，这使得 SHG 对晶体的对称结构及取向极为敏感。</p>
              </div>
            </div>

            <div style="background:var(--bg-primary);border-radius:12px;padding:20px;border:1px solid var(--border)">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:6px">
                <span style="color:var(--accent)">■</span> 空间反演对称性限制 (Inversion Symmetry)
              </div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <p><strong>反演对称晶体禁阻：</strong></p>
                <p>空间反演操作（<b>r</b> → -<b>r</b>）会使奇数阶张量变换符号，而电场和极化强度也变换符号（<b>E</b> → -<b>E</b>，<b>P</b> → -<b>P</b>）。在具有空间反演对称中心（Centrosymmetric）的材料中，物理规律必须在反演操作下保持不变：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--accent);border:1px solid var(--border)">
                  -P_i⁽²⁾ = ε₀ χ_{ijk}⁽²⁾ (-E_j) (-E_k) = ε₀ χ_{ijk}⁽²⁾ E_j E_k = P_i⁽²⁾  ⟹  χ_{ijk}⁽²⁾ ≡ 0
                </div>
                <p><strong>对称破缺敏感性：</strong></p>
                <p>这导致在具有反演对称的中心对称介质（如硅、锗晶体、石墨烯以及偶数层 TMDs 如双层 MoS₂）体相内，二次谐波是完全禁阻的。但在其表面、界面或晶体局域结构缺陷处，由于反演对称性破缺，可以激发出微弱的表面 SHG，这使得二次谐波成为极佳的无损表面/界面探针。</p>
              </div>
            </div>
          </div>

          <!-- Row 2 of Theoretical Explanations -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
            <div style="background:var(--bg-primary);border-radius:12px;padding:20px;border:1px solid var(--border)">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:6px">
                <span style="color:var(--accent)">■</span> 二维材料偏振分辨晶轴测量 (PR-SHG)
              </div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <p><strong>单层 TMDs (D_3h 点群) 的极化特征：</strong></p>
                <p>以单层 MoS₂ 或 WS₂ 为代表的二维过渡金属硫族化合物，属于非中心对称的 D_3h 点群。其 χ⁽²⁾ 张量中仅存在 1 个非零的独立分量：χ_xxx⁽²⁾ = -χ_xyy⁽²⁾ = -χ_yxy⁽²⁾ = -χ_yyx⁽²⁾ (设 x 方向为 Armchair 晶向)。</p>
                <p>若基频激发光的偏振方向与晶体 Armchair 轴夹角为 θ，采用平行偏振（检偏器与起偏器平行）和垂直偏振（检偏器与起偏器正交）配置扫描 θ，其输出倍频强度满足关系：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--accent);border:1px solid var(--border)">
                  I_{||}⁽²ω⁾ ∝ (cos 3θ)²， I_{⊥}⁽²ω⁾ ∝ (sin 3θ)²
                </div>
                <p>在极坐标图上，这呈现为经典的六瓣花瓣（rosette）形状。通过该扫描图案，能够极其精确地识别二维材料的晶格取向，确定 Armchair (0°/60°...) 与 Zigzag (30°/90°...) 方向，以及检测由于宏观拉伸应变带来的晶格剪切畸变。</p>
              </div>
            </div>

            <div style="background:var(--bg-primary);border-radius:12px;padding:20px;border:1px solid var(--border)">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:6px">
                <span style="color:var(--accent)">■</span> 圆偏振手性与谷选择定则 (Valley-Selective SHG)
              </div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <p><strong>晶体旋转对称与自旋角动量：</strong></p>
                <p>在单层 TMDs 晶体中，晶格具有三重旋转对称性（C₃），这也向外加的电磁场施加了角动量选择定则。光子自旋角动量（SAM）在右旋圆偏振（σ⁺）下为 +1，在左旋圆偏振（σ⁻）下为 -1。</p>
                <p>对于 C_N 对称系统，非线性参量过程的角动量守恒定则修正为：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--accent);border:1px solid var(--border)">
                  m_out - 2 × m_in = N × k  (k 为整数)
                </div>
                <p>在单层 TMDs (N = 3) 中，当注入两个具有相同角动量的基频光子（如 σ⁺ 激发，m_in = +1 ），出射倍频光子 SAM 必须满足 m_out - 2 = 3k。为满足守恒，m_out 最低阶解只能为 -1（即 k = -1 时，m_out = -1）。</p>
                <p>因此，<b>σ⁺ 圆偏振基频光只能产生纯 σ⁻ 圆偏振的二次谐波</b>（反之亦然，σ⁻ 产生 σ⁺）。在能谷物理中，这一选择定则能用于无损表征 K 和 K' 能谷的外尔轨道非线性偏振态。</p>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('shg-principle-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentList('principle');
    },

    // ==========================================
    // Tab 2: Optical Setups
    // ==========================================
    renderSetup(mode) {
      const guideEl = document.getElementById('shg-setup-operation-guide');
      if (guideEl) {
        if (mode === 'reflective') {
          guideEl.innerHTML = `
            <strong>反射式 SHG 测量：</strong><br>
            • <b>光路特点</b>：激发光与二次谐波收集均位于样品同侧（一般为 180° 背散射）。<br>
            • <b>适用样品</b>：不透明或弱透光样品、衬底不透明的二维材料（如硅片上的 MoS₂）。<br>
            • <b>校准要点</b>：需高精度对准基频脉冲光斑与收集焦点。
          `;
        } else {
          guideEl.innerHTML = `
            <strong>透射式 SHG 测量：</strong><br>
            • <b>光路特点</b>：前向散射光路，基频光穿透样品，在透射侧收集二次谐波（2ω）。<br>
            • <b>适用样品</b>：透明衬底（如石英、蓝宝石、云母）上的薄膜、液体及手性分子悬浮液。<br>
            • <b>校准要点</b>：需对准激发聚焦透镜与透射收集透镜的同轴性。
          `;
        }
      }
      if (mode === 'reflective') {
        this._renderReflectiveSetup();
      } else {
        this._renderTransmissiveSetup();
      }
      this._renderComponentList(mode);
    },

    _renderReflectiveSetup() {
      const W = 1200, H = 500;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        ${DIAGRAMS.commonDefs()}
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Paths -->
        <line x1="140" y1="140" x2="660" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
        <line x1="140" y1="140" x2="660" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
        <line x1="660" y1="140" x2="660" y2="310" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
        <line x1="660" y1="140" x2="660" y2="310" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
        <line x1="660" y1="310" x2="660" y2="140" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#shg-glow)"/>
        <line x1="660" y1="310" x2="660" y2="140" stroke="#34C759" stroke-width="1.8" marker-end="url(#arr-g)"/>
        <line x1="660" y1="140" x2="1040" y2="140" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#shg-glow)"/>
        <line x1="660" y1="140" x2="1040" y2="140" stroke="#34C759" stroke-width="1.8" marker-end="url(#arr-g)"/>

        <!-- Diagonal line of DM -->
        <line x1="625" y1="175" x2="695" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>

        <!-- Components -->
        ${this._box(30, 100, 110, 80, '激光器 ω', '#FF3B30', 'Pulsed Laser', 'ref-laser')}
        ${this._box(170, 100, 110, 80, 'ND 滤波片', '#FF9500', '功率调节', 'ref-ndf')}
        ${this._box(310, 100, 110, 80, '半波片 HWP', '#AF52DE', '偏振旋转', 'ref-hwp')}
        ${this._box(450, 100, 110, 80, '起偏器 P', '#AF52DE', 'Polarizer', 'ref-polarizer')}
        ${this._box(600, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'DM', 'ref-dm')}
        ${this._box(610, 210, 100, 70, '显微物镜', '#0071E3', 'Objective', 'ref-obj')}
        ${this._box(600, 310, 120, 70, '样品', '#34C759', 'Sample', 'ref-sample')}
        ${this._box(760, 100, 110, 80, '短通 SP', '#34C759', 'Filter', 'ref-filter')}
        ${this._box(900, 100, 110, 80, '检偏器 A', '#AF52DE', 'Analyzer', 'ref-analyzer')}
        ${this._box(1040, 90, 130, 100, '光谱仪', '#1D1D1F', 'Detector', 'ref-spectro')}
      </svg>`;

      document.getElementById('shg-setup-diagram').innerHTML = svg;
      this._attachTooltips();
    },
    _renderTransmissiveSetup() {
      const W = 1200, H = 500;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        ${DIAGRAMS.commonDefs()}
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Paths -->
        <line x1="120" y1="250" x2="500" y2="250" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
        <line x1="120" y1="250" x2="500" y2="250" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
        <line x1="560" y1="250" x2="1060" y2="250" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#shg-glow)"/>
        <line x1="560" y1="250" x2="1060" y2="250" stroke="#34C759" stroke-width="1.8" marker-end="url(#arr-g)"/>

        <!-- Components -->
        ${this._box(20, 210, 100, 80, '激光器 ω', '#FF3B30', '', 'tra-laser')}
        ${this._box(150, 210, 90, 80, '半波片 HWP', '#AF52DE', '', 'tra-hwp')}
        ${this._box(270, 210, 90, 80, '起偏器 P', '#AF52DE', '', 'tra-polarizer')}
        ${this._box(390, 215, 80, 70, '显微物镜', '#0071E3', '', 'tra-obj1')}
        ${this._box(500, 210, 60, 80, '样品', '#34C759', '', 'tra-sample')}
        ${this._box(590, 215, 80, 70, '显微物镜', '#0071E3', '', 'tra-obj2')}
        ${this._box(700, 210, 90, 80, '二向色镜 DM', '#AF52DE', '', 'tra-dm')}
        ${this._box(820, 210, 90, 80, '短通 SP', '#34C759', '', 'tra-filter')}
        ${this._box(940, 210, 90, 80, '检偏器 A', '#AF52DE', '', 'tra-analyzer')}
        ${this._box(1060, 200, 100, 100, '光谱仪', '#1D1D1F', '', 'tra-spectro')}
      </svg>`;

      document.getElementById('shg-setup-diagram').innerHTML = svg;
      this._attachTooltips();
    },
    updateSubconfigs(mode) {
      const el = document.getElementById('shg-polar-subconfig');
      if (!el) return;
      if (mode === 'linear') {
        el.innerHTML = `
          <button class="toggle-btn active" data-sub="lin-para" style="font-size:11px;padding:4px 8px">平行 (Parallel)</button>
          <button class="toggle-btn" data-sub="lin-cross" style="font-size:11px;padding:4px 8px">正交 (Cross)</button>
        `;
      } else {
        el.innerHTML = `
          <button class="toggle-btn active" data-sub="circ-pp" style="font-size:11px;padding:4px 8px">σ⁺ σ⁺ (右旋/右旋)</button>
          <button class="toggle-btn" data-sub="circ-pm" style="font-size:11px;padding:4px 8px">σ⁺ σ⁻ (右旋/左旋)</button>
          <button class="toggle-btn" data-sub="circ-mp" style="font-size:11px;padding:4px 8px">σ⁻ σ⁺ (左旋/右旋)</button>
          <button class="toggle-btn" data-sub="circ-mm" style="font-size:11px;padding:4px 8px">σ⁻ σ⁻ (左旋/左旋)</button>
        `;
      }
    },

    // ==========================================
    // Tab 3: Polarization-resolved SHG
    // ==========================================
    renderPolarization() {
      const mode = document.querySelector('#shg-polar-mode .active')?.dataset.pmode || 'linear';
      const symmetry = document.querySelector('#shg-symmetry .active')?.dataset.sym || '3fold';
      const subconfig = document.querySelector('#shg-polar-subconfig .active')?.dataset.sub || (mode === 'linear' ? 'lin-para' : 'circ-pp');
      
      const W = 1200, H = 550;

      const polState = (x, y, label, desc, color) => `
        <rect x="${x - 45}" y="${y}" width="90" height="36" rx="6" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>
        <text x="${x}" y="${y + 15}" font-size="10" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>
        <text x="${x}" y="${y + 29}" font-size="8" fill="var(--text-secondary)" text-anchor="middle">${desc}</text>`;

      let setupSvg = '';
      let guideHtml = '';

      if (mode === 'linear') {
        const isPara = subconfig === 'lin-para';
        setupSvg = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
          ${DIAGRAMS.commonDefs()}
          <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
          <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

          <!-- === Beam Lines === -->
          <line x1="150" y1="140" x2="190" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="150" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
          <line x1="400" y1="140" x2="400" y2="380" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="400" y1="140" x2="400" y2="380" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
          
          <line x1="400" y1="380" x2="400" y2="140" stroke="#34C759" stroke-width="6" stroke-dasharray="6,3" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="400" y1="380" x2="400" y2="140" stroke="#34C759" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#arr-g)"/>
          <line x1="400" y1="140" x2="760" y2="140" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="400" y1="140" x2="760" y2="140" stroke="#34C759" stroke-width="2.5" marker-end="url(#arr-g)"/>

          <!-- === Optical components === -->
          ${this._box(40, 100, 110, 80, '激光器 ω', '#FF3B30', 'Pulsed Laser', 'ref-laser')}
          ${this._box(190, 100, 110, 80, '起偏器 P', '#AF52DE', '固定 0°', 'ref-polarizer')}
          ${this._box(340, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'DM', 'ref-dm')}
          ${this._box(350, 210, 100, 70, '半波片 HWP', '#BF5AF2', 'HWP λ/2', 'ref-hwp')}
          ${this._box(350, 295, 100, 70, '显微物镜', '#0071E3', 'Objective', 'ref-obj')}
          ${this._box(340, 380, 120, 70, '样品', '#34C759', 'Sample', 'ref-sample')}
          ${this._box(500, 100, 110, 80, '短通 SP', '#FF9500', 'Filter', 'ref-filter')}
          ${this._box(630, 100, 110, 80, '检偏器 A', '#BF5AF2', isPara ? '设为 0°' : '设为 90°', 'ref-analyzer')}
          ${this._box(760, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'CCD/PMT', 'ref-spectro')}

          <!-- Diagonal line on dichroic mirror -->
          <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>
          <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射基频光 ↓</text>
          <text x="430" y="195" font-size="9" fill="#34C759" text-anchor="start" font-weight="600">透射 SHG ↑</text>

          <!-- Highlight Overlays for Active Modules -->
          <!-- HWP Highlight Box (操作执行模块) -->
          <rect x="346" y="206" width="108" height="78" rx="8" fill="none" stroke="#FF9500" stroke-width="2.5" stroke-dasharray="4,2"/>
          <rect x="346" y="190" width="108" height="15" rx="3" fill="#FF9500"/>
          <text x="400" y="201" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 旋转扫描 (操作执行)</text>

          <!-- Analyzer A Highlight Box -->
          <rect x="626" y="96" width="118" height="88" rx="10" fill="none" stroke="#8E8E93" stroke-width="1.5" stroke-dasharray="4,4"/>
          <text x="685" y="91" font-size="9" fill="#8E8E93" text-anchor="middle" font-weight="700">${isPara ? '⚙️ 固定 0°' : '⚙️ 固定 90°'}</text>

          <text x="400" y="290" font-size="10" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">↗ 扫描激发偏振</text>
          <text x="685" y="195" font-size="10" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">↕ 固定检测分量</text>

          <!-- === Polarization timeline-style state annotations at the bottom === -->
          <rect x="30" y="475" width="${W - 60}" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border)"/>
          <text x="50" y="504" font-size="12" fill="var(--text-primary)" font-weight="700">偏振流：</text>
          
          ${polState(120, 482, '非偏振', '激光', '#AEAEB2')}
          ${polState(240, 482, '↕ 线偏振', '起偏器 P', '#AF52DE')}
          ${polState(350, 482, '经 DM', '反射', '#AF52DE')}
          ${polState(460, 482, '↗ 旋转', '经 HWP', '#AF52DE')}
          ${polState(580, 482, '部分偏振', 'SHG发射(上行)', '#34C759')}
          ${polState(700, 482, '反向旋转', '经 HWP', '#34C759')}
          ${polState(820, 482, '经 DM', '透射', '#34C759')}
          ${polState(940, 482, isPara ? 'I∥ (0°)' : 'I⊥ (90°)', '检偏器 A', '#0071E3')}
          ${polState(1080, 482, '拟合分析', '获得对称性', 'var(--text-primary)')}
        </svg>`;

        guideHtml = `
          <strong>线偏振测量指南 (${isPara ? '平行 Parallel' : '正交 Cross'})：</strong><br>
          1. <b>入射：</b>起偏器 P 设为 0°（水平线偏振）。<br>
          2. <b>操作执行（转动）：</b>以 5° 步进连续旋转 <span style="color:#FF9500;font-weight:700">半波片 HWP</span> 进行角度扫描。<br>
          3. <b>检偏器 A：</b>固定设为 <b>${isPara ? '0° (平行)' : '90° (正交)'}</b>（不转动）。<br>
          4. <b>旋转模块：</b>实验中需要连续旋转 <span style="color:#FF9500;font-weight:700">半波片 HWP</span> 进行角度扫描。
        `;
      } else {
        // Circular polarization configuration
        let q1Angle = '+45°';
        let pType = 'σ⁺';
        let dType = 'σ⁺';
        let analyzerAngle = '0°';
        
        if (subconfig === 'circ-pm') {
          q1Angle = '+45°'; pType = 'σ⁺'; dType = 'σ⁻'; analyzerAngle = '90°';
        } else if (subconfig === 'circ-mp') {
          q1Angle = '-45°'; pType = 'σ⁻'; dType = 'σ⁺'; analyzerAngle = '90°';
        } else if (subconfig === 'circ-mm') {
          q1Angle = '-45°'; pType = 'σ⁻'; dType = 'σ⁻'; analyzerAngle = '0°';
        }

        setupSvg = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
          ${DIAGRAMS.commonDefs()}
          <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
          <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

          <!-- === Beam Lines === -->
          <line x1="150" y1="140" x2="190" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="150" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
          <line x1="400" y1="140" x2="400" y2="380" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="400" y1="140" x2="400" y2="380" stroke="#FF3B30" stroke-width="2" marker-end="url(#arr-r)"/>
          
          <line x1="400" y1="380" x2="400" y2="140" stroke="#34C759" stroke-width="6" stroke-dasharray="6,3" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="400" y1="380" x2="400" y2="140" stroke="#34C759" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#arr-g)"/>
          <line x1="400" y1="140" x2="760" y2="140" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#shg-glow)"/>
          <line x1="400" y1="140" x2="760" y2="140" stroke="#34C759" stroke-width="2.5" marker-end="url(#arr-g)"/>

          <!-- === Optical components === -->
          ${this._box(40, 100, 110, 80, '激光器 ω', '#FF3B30', 'Laser', 'tra-laser')}
          ${this._box(190, 100, 110, 80, '起偏器 P', '#AF52DE', '固定 0°', 'ref-polarizer')}
          ${this._box(340, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'DM', 'ref-dm')}
          ${this._box(350, 210, 100, 70, '1/4波片 QWP', '#BF5AF2', `快轴 ${q1Angle}`, 'tra-qwp')}
          ${this._box(350, 295, 100, 70, '显微物镜', '#0071E3', 'Objective', 'ref-obj')}
          ${this._box(340, 380, 120, 70, '样品', '#34C759', 'Sample', 'ref-sample')}
          ${this._box(500, 100, 110, 80, '短通 SP', '#FF9500', 'Filter', 'ref-filter')}
          ${this._box(630, 100, 110, 80, '检偏器 A', '#BF5AF2', `转至 ${analyzerAngle}`, 'ref-analyzer')}
          ${this._box(760, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'CCD/PMT', 'ref-spectro')}

          <!-- Diagonal line on dichroic mirror -->
          <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>
          <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射基频光 ↓</text>
          <text x="430" y="195" font-size="9" fill="#34C759" text-anchor="start" font-weight="600">透射 SHG ↑</text>

          <!-- Highlight Overlays for Active Modules -->
          <!-- QWP Highlight Box (操作执行模块) -->
          <rect x="346" y="206" width="108" height="78" rx="8" fill="none" stroke="#FF9500" stroke-width="2.5" stroke-dasharray="4,2"/>
          <rect x="346" y="190" width="108" height="15" rx="3" fill="#FF9500"/>
          <text x="400" y="201" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 转至 ${q1Angle} (操作执行)</text>

          <!-- Analyzer Highlight Box -->
          <rect x="626" y="96" width="118" height="88" rx="10" fill="none" stroke="#FF9500" stroke-width="2.5" stroke-dasharray="4,2"/>
          <rect x="626" y="80" width="118" height="15" rx="3" fill="#FF9500"/>
          <text x="685" y="91" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 转至 ${analyzerAngle} (操作执行)</text>

          <text x="400" y="380" font-size="10" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">激发/收集共用 QWP</text>
          <text x="685" y="195" font-size="10" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">检偏选择线偏分量</text>

          <!-- === Polarization timeline-style state annotations at the bottom === -->
          <rect x="30" y="475" width="${W - 60}" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border)"/>
          <text x="50" y="504" font-size="12" fill="var(--text-primary)" font-weight="700">偏振流：</text>
          
          ${polState(120, 482, '非偏振', '激光', '#AEAEB2')}
          ${polState(240, 482, '↕ 线偏振', '起偏器 P', '#AF52DE')}
          ${polState(350, 482, '经 DM', '反射', '#AF52DE')}
          ${polState(460, 482, `下行: ${pType}圆偏`, 'QWP λ/4', '#AF52DE')}
          ${polState(580, 482, '样品发射', 'SHG信号(上行)', '#34C759')}
          ${polState(700, 482, '圆→线转换', 'QWP λ/4', '#34C759')}
          ${polState(820, 482, '经 DM', '透射', '#34C759')}
          ${polState(940, 482, `I(${pType}, ${dType})`, `检偏器 A (${analyzerAngle})`, '#0071E3')}
          ${polState(1080, 482, '谷选择分析', '能谷物理表征', 'var(--text-primary)')}
        </svg>`;

        guideHtml = `
          <strong>圆偏振测量指南 (${pType}${dType} 配置)：</strong><br>
          1. <b>入射端：</b>起偏器 P 固定在 0°（水平线偏振）。<br>
          2. <b>第一步调节（QWP）：</b>手动旋转双通路复用的 <span style="color:#FF9500;font-weight:700">QWP λ/4</span>，将其快轴角设为 <b>${q1Angle}</b>。此时激发光通过 QWP 转换为 <b>${pType}</b> 圆偏振光作用于样品。<br>
          3. <b>第二步调节（检偏器）：</b>样品发射的圆偏振 SHG 信号经过相同的 QWP 后，由于双通复用，会被转换回线偏振。在透射端调节 <span style="color:#FF9500;font-weight:700">检偏器 A</span> 至 <b>${analyzerAngle}</b>，从而选择检测 <b>${dType}</b> 的 SHG 信号分量。<br>
          4. <b>实验特点：</b>无需在探测端额外放置第二块 1/4 波片，通过在激发与收集共用的光路（二向色镜与物镜之间）中放置单一 QWP，并配合检偏器 A 旋转选择偏振方向，即可实现完整的圆偏振 SHG / 能谷选择定则测量。
        `;
      }

      document.getElementById('shg-polar-setup').innerHTML = setupSvg;
      document.getElementById('shg-operation-guide').innerHTML = guideHtml;
      
      this._attachTooltips();
      this.updatePolarPlot(symmetry);
      this._renderNotes('polarization');
    },

    updatePolarPlot(symmetry) {
      const mode = document.querySelector('#shg-polar-mode .active')?.dataset.pmode || 'linear';
      const canvasId = 'shg-polar-chart';
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      if (this.polarChart) {
        this.polarChart.destroy();
        this.polarChart = null;
      }

      const N = 360;
      const labels = [];
      const d1 = [], d2 = [];

      for (let i = 0; i <= N; i++) {
        const theta = i;
        labels.push(theta + '°');
        const rad = theta * Math.PI / 180;
        let v1, v2;

        if (mode === 'linear') {
          switch (symmetry) {
            case '3fold':
              v1 = Math.pow(Math.cos(3 * rad), 2);
              v2 = Math.pow(Math.sin(3 * rad), 2);
              break;
            case '2fold':
              v1 = Math.pow(Math.cos(2 * rad), 2);
              v2 = Math.pow(Math.sin(2 * rad), 2);
              break;
            default:
              v1 = 0.5; v2 = 0.5;
          }
        } else {
          v1 = (symmetry === '3fold') ? 0.05 : 0.3;
          v2 = 0.8;
        }
        d1.push(v1); d2.push(v2);
      }

      const ctx = canvas.getContext('2d');
      const gridColor = 'rgba(150, 150, 150, 0.2)';
      const textColor = 'rgba(150, 150, 150, 0.8)';

      this.polarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [
            { label: mode === 'linear' ? 'I_Parallel (VV)' : 'I_(σ+,σ+)', data: d1, borderColor: '#0071E3', backgroundColor: 'rgba(0,113,227,0.1)', borderWidth: 2, pointRadius: 0 },
            { label: mode === 'linear' ? 'I_Cross (VH)' : 'I_(σ+,σ-)', data: d2, borderColor: '#AF52DE', backgroundColor: 'rgba(175,82,222,0.1)', borderWidth: 2, pointRadius: 0 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: textColor, font: { family: 'Inter', size: 12 } }
            }
          },
          scales: { 
            r: { 
              min: 0, 
              max: 1, 
              grid: { color: gridColor },
              angleLines: { color: gridColor },
              ticks: { stepSize: 0.2, backdropColor: 'transparent', color: textColor }, 
              pointLabels: { 
                color: textColor,
                callback: (l) => parseInt(l) % 45 === 0 ? l : '' 
              } 
            } 
          }
        }
      });
    },

    // ==========================================
    // Tab 4: Applications
    // ==========================================
    renderApplications() {
      const apps = [
        { title: '判断单层 TMDs 晶轴', icon: '🧭', color: '#0071E3', desc: '单层 MoS₂ 的 PR-SHG 呈三瓣图案，极大值指向 zigzag 晶向。', formula: 'I ∝ cos²(3θ)' },
        { title: '区分单层与偶数层', icon: '📊', color: '#FF9500', desc: '单层允许 SHG，双层由于恢复中心反演对称，SHG 禁阻。', formula: '奇数层：χ⁽²⁾ ≠ 0' },
        { title: '表征铁电极化', icon: '⚡', color: '#FF3B30', desc: '铁电畴反转会导致 SHG 偏振图案旋转 180°。', formula: 'P↑ vs P↓' },
        { title: '分析应变效应', icon: '💎', color: '#8E8E93', desc: '机械应变会打破 C₃ 对称性，使花瓣畸变或消失。', formula: '对称性破缺探测' },
      ];

      document.getElementById('shg-apps-content').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;padding:8px">
          ${apps.map(app => `
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:20px;border-left:4px solid ${app.color};box-shadow:var(--shadow-sm);transition:all 0.2s">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:10px;display:flex;align-items:center;gap:8px">
                <span style="font-size:18px">${app.icon}</span> ${app.title}
              </div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;line-height:1.6">${app.desc}</div>
              <div style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:${app.color};background:var(--bg-primary);padding:8px 12px;border-radius:6px;display:inline-block">
                ${app.formula}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    _renderComponentList(mode) {
      const components = {
        principle: [
          { name: '基频光子激发 (Fundamental Excitation)', id: 'shg-fund' },
          { name: '非中心对称介质 (Nonlinear Medium)', id: 'shg-crystal' },
          { name: '二次谐波辐射 (Second Harmonic Emission)', id: 'shg-emission' },
          { name: '虚拟能级跃迁 (Virtual State Transition)', id: 'shg-virtual' }
        ],
        reflective: [
          { name: '激光器 ω', id: 'ref-laser' },
          { name: 'ND 滤波片', id: 'ref-ndf' },
          { name: '半波片 HWP', id: 'ref-hwp' },
          { name: '起偏器 P', id: 'ref-polarizer' },
          { name: '二向色镜 DM', id: 'ref-dm' },
          { name: '显微物镜', id: 'ref-obj' },
          { name: '样品', id: 'ref-sample' },
          { name: '短通 SP', id: 'ref-filter' },
          { name: '检偏器 A', id: 'ref-analyzer' },
          { name: '光谱仪', id: 'ref-spectro' },
        ],
        transmissive: [
          { name: '激光器 ω', id: 'tra-laser' },
          { name: '半波片 HWP', id: 'tra-hwp' },
          { name: '起偏器 P', id: 'tra-polarizer' },
          { name: '显微物镜', id: 'tra-obj1' },
          { name: '样品', id: 'tra-sample' },
          { name: '显微物镜', id: 'tra-obj2' },
          { name: '二向色镜 DM', id: 'tra-dm' },
          { name: '短通 SP', id: 'tra-filter' },
          { name: '检偏器 A', id: 'tra-analyzer' },
          { name: '光谱仪', id: 'tra-spectro' },
        ],
        polarization: [
          { name: 'HWP/QWP', id: 'tra-qwp' },
          { name: '起偏器/检偏器', id: 'ref-polarizer' },
        ]
      };

      const list = components[mode] || [];
      const el = document.getElementById('shg-component-list');
      if (!el) return;

      if (list.length === 0) {
        el.innerHTML = '<div class="help-text">切换到光路页查看清单</div>';
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

    _renderNotes(mode) {
      const el = document.getElementById('shg-notes-content');
      if (!el) return;
      el.innerHTML = `
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">
          <p style="margin-bottom:8px"><strong>实验关键点：</strong></p>
          <ul style="padding-left:18px;margin-bottom:12px">
            <li><strong>峰值功率控制：</strong>飞秒激光瞬态功率极高，需严格控制能量密度低于 2D 材料损伤阈值（通常在 ~100 μW/μm² 量级）。</li>
            <li><strong>偏振纯度：</strong>偏振分辨测量极度依赖光学元件的消光比。应选用格兰-泰勒棱镜或高品质偏振分束器（消光比 >10⁵:1）。</li>
            <li><strong>基频光滤除：</strong>PMT 对基频光(如 800nm)也可能有微弱响应。二向色镜后必须串联至少一块高 OD 值（>OD 6）的短通/带通滤波器，彻底滤除残余基频光。</li>
            <li><strong>波片位置：</strong>进行偏振测量时，<strong>必须将波片（HWP/QWP）放置于二向色镜之后、物镜之前</strong>。若放于 DM 之前，DM 自身对 S 和 P 偏振的不同反射率将直接改变激发光强度，导致测量数据失真。</li>
            <li><strong>手性选择定则：</strong>圆偏振激发下，对于具有 $C_{3v}$ 对称性的晶体（如 MoS₂），SHG 遵循 $\Delta m = \pm 3$ 的角动量守恒定则，因此仅产生与激发光异向的圆偏振 SHG 信号。</li>
          </ul>
        </div>
      `;
    },

    destroy() {
      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';
      if (this.polarChart) { this.polarChart.destroy(); this.polarChart = null; }
    }
  };

  App.registerTool('shg', tool);
})();

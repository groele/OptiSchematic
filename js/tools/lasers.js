/* ============================================
   Optical Toolkit — Laser Principles
   Laser fundamentals, CW/pulsed comparison,
   laser type cards, peak power calculator
   ============================================ */

(() => {

  // Tooltip descriptions for laser components
  const TOOLTIPS = {
    'las-pump': '泵浦源 (Pump Source)\n功能：向增益介质提供能量，实现粒子数反转\n类型：闪光灯、激光二极管、电激励、化学泵浦\n泵浦功率决定激光输出功率上限\n半导体泵浦效率可达 60% 以上',
    'las-gain': '增益介质 (Gain Medium)\n功能：通过受激辐射放大光信号\n类型：气体（He-Ne, CO₂）、固体（Nd:YAG, Ti:Sapphire）、半导体、光纤\n关键参数：增益带宽、上能级寿命、发射截面\n增益带宽决定可调谐范围和脉宽下限',
    'las-hr': '全反镜 (High Reflector, HR)\n反射率 R > 99.9%\n功能：将光限制在谐振腔内往返振荡\n介质膜多层镀膜实现高反射\n损伤阈值需高于腔内功率密度',
    'las-oc': '输出耦合镜 (Output Coupler, OC)\n反射率 R = 70%~99%（根据增益选择）\n功能：将部分腔内光输出为激光束\n透过率 T = 1−R，透过率过高会降低腔内功率\n最佳透过率取决于增益介质的小信号增益',
    'las-output': '激光输出 (Laser Output)\n特性：高方向性、高单色性、高相干性\n光束质量由 M² 因子表征\n输出功率/能量由泵浦功率和转换效率决定\n光束发散角接近衍射极限',
    'las-cavity': '光学谐振腔 (Optical Resonator)\n功能：提供正反馈，选择纵模和横模\n类型：平面腔、共焦腔、半共焦腔、环形腔\n腔长决定纵模间距 Δf = c/(2L)\n稳定性条件：0 ≤ (1−L/R₁)(1−L/R₂) ≤ 1',
    'las-medal': '受激辐射 (Stimulated Emission)\n入射光子激发高能级原子跃迁到低能级\n发射光子与入射光子同频率、同相位、同方向\n这是激光放大的物理基础\n1917年爱因斯坦提出受激辐射理论',
    'las-inversion': '粒子数反转 (Population Inversion)\n高能级粒子数 > 低能级粒子数\n违反热平衡玻尔兹曼分布\n需要外部泵浦持续注入能量\n三能级/四能级系统实现反转的方式不同',
    'las-qswitch': 'Q 开关 (Q-Switching)\n功能：通过周期性改变腔的 Q 值产生巨脉冲\n类型：主动（电光/声光调制）、被动（饱和吸收体）\n脉宽：ns 级（1~100 ns）\n峰值功率可达 MW~GW 级',
    'las-modelock': '模式锁定 (Mode-Locking)\n功能：使多纵模固定相位关系，产生超短脉冲\n类型：主动（声光调制）、被动（Kerr透镜、SESAM）\n脉宽：fs~ps 级\n峰值功率可达 TW 级（钛宝石振荡器）',
  };

  // Laser type card data
  const LASER_TYPES = [
    {
      name: 'He-Ne 氦氖激光器',
      lambda: 632.8,
      principle: '气体放电激发 Ne 原子，5s→3p 跃迁产生 632.8nm 红光。三能级系统，需高压放电维持粒子数反转。',
      output: '连续 CW',
      pros: '光束质量极好 (M²≈1)、相干长度长 (>1m)、稳定性高、成本低',
      cons: '功率低 (1~50mW)、仅单一波长、效率低 (<0.1%)',
      useCase: '干涉测量、对准基准、光学教学、全息术、光谱仪波长校准',
    },
    {
      name: '半导体激光器 (LD)',
      lambda: 808,
      principle: 'p-n 结注入电流，电子-空穴复合受激辐射。量子阱/量子点结构提高效率。单模/多模可选。',
      output: '连续 CW / 直接调制脉冲',
      pros: '体积小、效率高 (30~70%)、可直接电流调制 (GHz)、波长可选范围广 (375~2200nm)',
      cons: '光束质量差 (椭圆形)、温度敏感、相干长度短、需要驱动电路',
      useCase: '光纤通信、激光泵浦源、激光指示器、激光雷达、材料加工',
    },
    {
      name: 'Nd:YAG 固体激光器',
      lambda: 1064,
      principle: 'Nd³⁺ 离子在 YAG 晶体中，⁴F₃/₂→⁴I₁₁/₂ 跃迁。四能级系统，闪光灯或半导体泵浦。倍频可得 532/355/266nm。',
      output: 'CW / Q-switch ns / 模式锁定 ps',
      pros: '功率范围宽 (mW~kW)、可倍频多波长、上能级寿命长 (230μs)、适合储能',
      cons: '热效应严重 (高功率时)、需要冷却、晶体成本高',
      useCase: '材料加工（切割/焊接）、测距、医疗手术、科研泵浦源、激光雷达',
    },
    {
      name: 'Ti:Sapphire 飞秒激光器',
      lambda: 780,
      principle: 'Ti³⁺ 在蓝宝石基质中，极宽增益带宽 (650~1100nm)。Kerr 透镜锁模 (KLM) 产生飞秒脉冲。通常由 532nm 泵浦。',
      output: '飞秒脉冲 (5~100 fs)',
      pros: '脉宽极短 (可达 5fs)、峰值功率极高 (GW)、宽带可调谐、光谱覆盖 NIR',
      cons: '系统复杂昂贵、需要泵浦激光、稳定性要求高、维护成本高',
      useCase: '超快光谱、多光子显微、频率梳、OPA/OPCPA 泵浦、材料微加工',
    },
    {
      name: '光纤激光器',
      lambda: 1064,
      principle: '掺稀土光纤 (Er/Yb/Nd) 作为增益介质，光纤布拉格光栅 (FBG) 作腔镜。半导体泵浦，光-光转换效率 >70%。',
      output: 'CW / ns MOPA / ps / fs',
      pros: '光束质量好 (M²<1.2)、散热好、免维护、功率可达 kW 级、稳定性高',
      cons: '峰值功率受非线性限制、脉宽调节范围不如固体、高功率需大模场光纤',
      useCase: '工业加工（切割/焊接/打标）、光纤通信、超快光源、激光雷达、医疗',
    },
    {
      name: 'OPO 光参量振荡器',
      lambda: 1500,
      principle: '非线性晶体中泵浦光分为信号光和闲频光：ωₚ = ωₛ + ωᵢ。通过相位匹配条件调谐波长。脉冲泵浦或 CW 泵浦。',
      output: 'CW / 脉冲（取决于泵浦源）',
      pros: '波长大范围可调谐 (0.4~4μm+)、可覆盖特殊波段 (中红外)、线宽窄',
      cons: '转换效率较低 (10~40%)、需要泵浦激光、相位匹配条件严格、成本高',
      useCase: '红外光谱、痕量气体检测、LIDAR、量子光学、光化学研究',
    },
    {
      name: '超连续谱光源 (SC)',
      lambda: 500,
      principle: '超短脉冲在高非线性光纤中展宽：自相位调制 (SPM)、四波混频 (FWM)、受激拉曼散射等协同作用，产生覆盖数百nm的宽带光谱。',
      output: '脉冲（展宽白光）',
      pros: '光谱极宽 (400~2400nm+)、空间相干性好、亮度高、可做多波长同步',
      cons: '需要飞秒/皮秒泵浦源、功率密度有限、光谱不平坦需均衡、成本高',
      useCase: 'OCT 成像、光谱分析、多波长光源、WDM 测试、荧光寿命成像',
    },
  ];

  const tool = {
    title: '激光器原理',
    description: '激光器基本结构、CW/ns/ps/fs 对比、激光器类型百科、峰值功率计算器',
    currentTab: 'basics',
    _tooltipEl: null,
    waveformChart: null,
    peakPowerChart: null,

    render(container) {
      container.innerHTML = `
        <div class="tool-inputs" style="max-width:100%">
          <div class="card">
            <div class="toggle-group" id="lasers-tabs">
              <button class="toggle-btn active" data-tab="basics">激光器基础</button>
              <button class="toggle-btn" data-tab="compare">CW/ns/ps/fs 对比</button>
              <button class="toggle-btn" data-tab="types">激光器类型</button>
              <button class="toggle-btn" data-tab="calc">峰值功率计算</button>
            </div>
          </div>

          <!-- Tab 1: Laser Basics -->
          <div class="card tab-panel" id="tab-basics">
            <div class="card-title"><span class="icon">⚡</span> 激光器基本结构</div>
            <div class="help-text" style="margin-bottom:16px">
              激光 (LASER) = Light Amplification by Stimulated Emission of Radiation（受激辐射光放大）。
              <strong>鼠标悬停在光路图元件上可查看详细说明与联动高亮。</strong>
            </div>
            
            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">
              <div class="dashboard-control" style="padding:0">
                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">
                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 激光原理要点</div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">
                    <strong>激光产生的三个基本要素：</strong><br>
                    1. <b>增益介质</b>：产生受激辐射放大的物质基础，决定输出波长。<br>
                    2. <b>泵浦源</b>：将低能级的原子激发到高能级，产生粒子数反转。<br>
                    3. <b>光学谐振腔</b>：全反镜与输出镜提供光正反馈，实现光的定向谐振振荡与选模输出。
                  </div>
                </div>
              </div>
              <div class="dashboard-stage" style="gap:12px">
                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">
                  <div id="laser-diagram"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: CW/ns/ps/fs Comparison -->
          <div class="card tab-panel" id="tab-compare" style="display:none">
            <div class="card-title"><span class="icon">📊</span> CW / ns / ps / fs 激光器详细对比</div>
            <div id="compare-table-wrapper"></div>
          </div>

          <!-- Tab 3: Laser Type Cards -->
          <div class="card tab-panel" id="tab-types" style="display:none">
            <div class="card-title"><span class="icon">🔬</span> 常见激光器类型</div>
            <div class="help-text" style="margin-bottom:16px">点击卡片可展开查看详细说明。每种激光器右侧色块反映其典型工作波长。</div>
            <div id="laser-type-grid"></div>
          </div>

          <!-- Tab 4: Peak Power Calculator -->
          <div class="card tab-panel" id="tab-calc" style="display:none">
            <div class="card-title"><span class="icon">🔧</span> 峰值功率计算器</div>
            <div class="formula-display" style="margin-bottom:16px">
              <span class="highlight">P<sub>peak</sub></span> = P<sub>avg</sub> / (f<sub>rep</sub> &times; &tau;<sub>pulse</sub>) &nbsp;|&nbsp;
              <span class="highlight">E<sub>pulse</sub></span> = P<sub>avg</sub> / f<sub>rep</sub>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">平均功率 P<sub>avg</sub></span>
                <span class="form-label-unit">mW</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="pp-avg-slider" min="1" max="10000" value="100" step="1">
                <input type="number" class="input-field small" id="pp-avg-input" value="100" min="0.001" max="1000000" step="any">
              </div>
              <div class="range-limits"><span>1 mW</span><span>10000 mW</span></div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">重复频率 f<sub>rep</sub></span>
                <span class="form-label-unit">kHz</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="pp-frep-slider" min="0.001" max="100000" value="80" step="0.001">
                <input type="number" class="input-field small" id="pp-frep-input" value="80" min="0.0001" max="1000000" step="any">
              </div>
              <div class="range-limits"><span>1 Hz</span><span>100 GHz</span></div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">脉宽单位</span>
              </div>
              <div class="toggle-group" id="pp-unit-toggle">
                <button class="toggle-btn active" data-unit="ps">皮秒 ps</button>
                <button class="toggle-btn" data-unit="ns">纳秒 ns</button>
                <button class="toggle-btn" data-unit="fs">飞秒 fs</button>
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">
                <span class="form-label-text">脉宽 &tau;<sub>pulse</sub></span>
                <span class="form-label-unit" id="pp-width-unit">ps</span>
              </div>
              <div class="input-slider-row">
                <input type="range" class="slider" id="pp-width-slider" min="0.1" max="10000" value="100" step="0.1">
                <input type="number" class="input-field small" id="pp-width-input" value="100" min="0.001" max="1000000" step="any">
              </div>
              <div class="range-limits" id="pp-width-limits"><span>0.1 ps</span><span>10000 ps</span></div>
            </div>

            <div class="divider"></div>
            <div class="card-title" style="font-size:13px;margin-bottom:8px"><span class="icon">📋</span> 常用激光器参考</div>
            <div id="pp-presets"></div>
          </div>
        </div>

        <div class="tool-results">
          <!-- Tab 1 Results: Explanations -->
          <div class="card tab-result" id="res-basics">
            <div class="card-title"><span class="icon">📖</span> 核心概念详解</div>
            <div id="basics-explanation"></div>
            <div class="divider"></div>
            <div class="card-title"><span class="icon">📈</span> CW vs 脉冲激光时间波形</div>
            <div class="chart-container" style="height:260px">
              <canvas id="waveform-chart"></canvas>
            </div>
          </div>

          <div class="card" id="laser-component-card">
            <div class="card-title"><span class="icon">📋</span> 激光器组成元件清单</div>
            <div id="laser-component-list"></div>
          </div>

          <!-- Tab 2 Results: Peak Power Chart -->
          <div class="card tab-result" id="res-compare" style="display:none">
            <div class="card-title"><span class="icon">📈</span> 平均功率 vs 峰值功率</div>
            <div class="help-text" style="margin-bottom:12px">假设各类型激光器平均功率相同时，脉宽越短峰值功率越高。</div>
            <div class="chart-container" style="height:300px">
              <canvas id="peak-power-chart"></canvas>
            </div>
          </div>

          <!-- Tab 3 Results: (cards are in inputs panel) -->
          <div class="card tab-result" id="res-types" style="display:none">
            <div class="card-title"><span class="icon">📊</span> 激光器波长分布</div>
            <div id="wavelength-overview"></div>
          </div>

          <!-- Tab 4 Results -->
          <div class="card tab-result" id="res-calc" style="display:none">
            <div class="card-title"><span class="icon">📊</span> 计算结果</div>
            <div class="result-grid" id="pp-results">
              <div class="result-item">
                <div class="result-label">峰值功率 P<sub>peak</sub></div>
                <div class="result-value accent" id="pp-res-peak">—</div>
                <div class="result-unit" id="pp-res-peak-unit">W</div>
              </div>
              <div class="result-item">
                <div class="result-label">单脉冲能量 E<sub>pulse</sub></div>
                <div class="result-value orange" id="pp-res-energy">—</div>
                <div class="result-unit" id="pp-res-energy-unit">nJ</div>
              </div>
              <div class="result-item">
                <div class="result-label">峰值功率密度</div>
                <div class="result-value green" id="pp-res-density">—</div>
                <div class="result-unit">MW/cm² (1mm光斑)</div>
              </div>
              <div class="result-item">
                <div class="result-label">等效对比</div>
                <div class="result-value" id="pp-res-equiv" style="font-size:16px">—</div>
                <div class="result-unit"></div>
              </div>
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
      this.switchTab('basics');
    },

    bindEvents() {
      const calc = OPTICS.debounce(() => this._calcPeakPower(), 150);

      // Tab switching
      document.getElementById('lasers-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#lasers-tabs .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchTab(btn.dataset.tab);
      });

      // Peak power slider-input sync
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

      sync('pp-avg-slider', 'pp-avg-input');
      sync('pp-frep-slider', 'pp-frep-input');
      sync('pp-width-slider', 'pp-width-input');

      // Pulse width unit toggle
      document.getElementById('pp-unit-toggle')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#pp-unit-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._updateWidthUnit(btn.dataset.unit);
        calc();
      });

      // Preset buttons
      document.getElementById('pp-presets')?.addEventListener('click', (e) => {
        const preset = e.target.closest('.preset-chip');
        if (!preset) return;
        const avg = preset.dataset.avg;
        const frep = preset.dataset.frep;
        const width = preset.dataset.width;
        const unit = preset.dataset.unit;
        if (avg) { document.getElementById('pp-avg-input').value = avg; document.getElementById('pp-avg-slider').value = Math.min(parseFloat(avg), parseFloat(document.getElementById('pp-avg-slider').max)); }
        if (frep) { document.getElementById('pp-frep-input').value = frep; document.getElementById('pp-frep-slider').value = Math.min(parseFloat(frep), parseFloat(document.getElementById('pp-frep-slider').max)); }
        if (width) { document.getElementById('pp-width-input').value = width; document.getElementById('pp-width-slider').value = Math.min(parseFloat(width), parseFloat(document.getElementById('pp-width-slider').max)); }
        if (unit) {
          document.querySelectorAll('#pp-unit-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
          document.querySelector(`#pp-unit-toggle [data-unit="${unit}"]`)?.classList.add('active');
          this._updateWidthUnit(unit);
        }
        calc();
      });

      // Bidirectional hover: hover list item to highlight SVG box
      const compList = document.getElementById('laser-component-list');
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
      ['basics', 'compare', 'types', 'calc'].forEach(t => {
        const panel = document.getElementById(`tab-${t}`);
        const result = document.getElementById(`res-${t}`);
        if (panel) panel.style.display = t === tab ? '' : 'none';
        if (result) result.style.display = t === tab ? '' : 'none';
      });

      const compCard = document.getElementById('laser-component-card');
      if (compCard) {
        compCard.style.display = tab === 'basics' ? '' : 'none';
      }

      switch (tab) {
        case 'basics': this._renderBasics(); break;
        case 'compare': this._renderCompare(); break;
        case 'types': this._renderTypes(); break;
        case 'calc': this._renderCalcPresets(); this._calcPeakPower(); break;
      }
    },

    // ==========================================
    // SVG Helper: interactive component box with high-fidelity physical vector icons
    // ==========================================
    _box(x, y, w, h, label1, color, label2, tooltipId) {
      return DIAGRAMS.componentBox(x, y, w, h, label1, color, label2, tooltipId);
    },

    _attachTooltips() {
      const tip = this._tooltipEl;
      if (!tip) return;
      const container = document.getElementById('laser-diagram');
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
          document.querySelectorAll(`#laser-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.add('highlighted');
            OPTICS.scrollIntoViewSafe(document.getElementById('laser-component-list'), item);
          });
        });
        el.addEventListener('mouseleave', () => {
          tip.style.display = 'none';
          tip.style.opacity = '0';

          // Remove highlight in component list
          const id = el.dataset.tip;
          document.querySelectorAll(`#laser-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.remove('highlighted');
          });
        });
      });
    },

    _renderComponentList(mode) {
      const components = {
        'basics': [
          { id: 'las-pump', name: '泵浦源 (Pump Source)' },
          { id: 'las-hr', name: '全反镜 (High Reflector)' },
          { id: 'las-gain', name: '增益介质 (Gain Medium)' },
          { id: 'las-oc', name: '输出耦合镜 (Output Coupler)' },
          { id: 'las-cavity', name: '光学谐振腔 (Optical Resonator)' },
          { id: 'las-output', name: '激光输出 (Laser Output)' }
        ]
      };

      const list = components[mode] || [];
      const el = document.getElementById('laser-component-list');
      if (!el) return;

      if (list.length === 0) {
        el.innerHTML = '<div class="help-text">切换到激光器基础查看元件清单</div>';
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
    // Tab 1: Laser Basics
    // ==========================================
    _renderBasics() {
      this._renderLaserDiagram();
      this._renderExplanation();
      this._renderWaveformChart();
      this._renderComponentList('basics');
    },

    _renderLaserDiagram() {
      const W = 1200, H = 500;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" id="laser-svg-export" style="width:100%;display:block;margin:0 auto">
        ${DIAGRAMS.commonDefs()}
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Interactive Resonator Cavity -->
        <g class="svg-hover-box" data-tip="las-cavity" cursor="pointer">
          <rect x="290" y="130" width="570" height="240" rx="16" fill="none" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="8,4" style="transition: stroke 0.2s;"/>
          <text x="575" y="115" font-size="13" fill="var(--text-secondary)" text-anchor="middle" font-weight="600">光学谐振腔 Optical Resonator</text>
        </g>

        <!-- Pump beam -->
        <line x1="230" y1="250" x2="575" y2="250" stroke="#FF5E00" stroke-width="8" opacity="0.3" filter="url(#pl-glow)"/>
        <line x1="230" y1="250" x2="575" y2="250" stroke="#FF5E00" stroke-width="2" marker-end="url(#arr-o)"/>
        <text x="275" y="235" font-size="12" fill="#FF5E00" text-anchor="middle" font-weight="700">泵浦光</text>

        <!-- Internal bouncing beam -->
        <line x1="400" y1="250" x2="750" y2="250" stroke="#FF3B30" stroke-width="8" opacity="0.25" filter="url(#pl-glow)"/>
        <line x1="400" y1="250" x2="750" y2="250" stroke="#FF3B30" stroke-width="2"/>
        <line x1="750" y1="250" x2="400" y2="250" stroke="#FF3B30" stroke-width="8" opacity="0.2" filter="url(#pl-glow)"/>
        <line x1="750" y1="250" x2="400" y2="250" stroke="#FF3B30" stroke-width="2" stroke-dasharray="8,4"/>
        <text x="575" y="285" font-size="11" fill="#FF3B30" text-anchor="middle" opacity="0.6">腔内往返振荡</text>

        <!-- Output beam -->
        <line x1="830" y1="250" x2="950" y2="250" stroke="#FF3B30" stroke-width="10" opacity="0.3" filter="url(#pl-glow)"/>
        <line x1="830" y1="250" x2="950" y2="250" stroke="#FF3B30" stroke-width="2.5" marker-end="url(#arr-r)"/>
        <text x="890" y="230" font-size="13" fill="#FF3B30" text-anchor="middle" font-weight="700">激光输出</text>

        <!-- Components -->
        ${this._box(80, 210, 150, 80, '泵浦源', '#FF5E00', 'Pump Source', 'las-pump')}
        ${this._box(320, 190, 80, 120, '全反镜', '#AF52DE', 'HR R>99.9%', 'las-hr')}
        ${this._box(490, 210, 170, 80, '增益介质', '#34C759', 'Gain Medium', 'las-gain')}
        ${this._box(750, 190, 80, 120, '输出耦合', '#0071E3', 'OC Mirror', 'las-oc')}
        ${this._box(950, 210, 160, 80, '激光输出', '#FF3B30', 'Laser Output', 'las-output')}

        <!-- Mirror decorations -->
        <line x1="400" y1="190" x2="400" y2="310" stroke="#AF52DE" stroke-width="5" opacity="0.4"/>
        <line x1="750" y1="190" x2="750" y2="310" stroke="#0071E3" stroke-width="5" opacity="0.4"/>

        <!-- Export Button (pseudo-element in SVG) -->
        <g cursor="pointer" onclick="DIAGRAMS.exportSVG(document.getElementById('laser-svg-export'), 'laser-diagram.svg')">
          <rect x="${W - 100}" y="15" width="85" height="24" rx="12" fill="var(--bg-primary)" stroke="var(--border)"/>
          <text x="${W - 57}" y="31" font-size="10" fill="var(--accent)" text-anchor="middle" font-weight="600">💾 导出 SVG</text>
        </g>

        <rect x="${W/2 - 300}" y="${H - 60}" width="600" height="40" rx="8" fill="var(--bg-primary)" stroke="var(--border)" stroke-width="1.2"/>
        <text x="${W/2}" y="${H - 36}" font-size="13" fill="var(--text-secondary)" text-anchor="middle">
          LASER = Light Amplification by Stimulated Emission of Radiation
        </text>
      </svg>`;
      document.getElementById('laser-diagram').innerHTML = svg;
      this._attachTooltips();
    },

    _renderExplanation() {
      const el = document.getElementById('basics-explanation');
      if (!el) return;

      const concepts = [
        {
          title: '1. 受激辐射 (Stimulated Emission)',
          icon: '💫',
          color: '#FF3B30',
          text: '入射光子与处于高能级 E₂ 的原子相互作用，诱导原子跃迁到低能级 E₁，同时发射一个与入射光子完全相同（同频率、同相位、同方向、同偏振）的光子。这就是光放大的基础。',
          formula: 'E = hν = E₂ − E₁　|　一个光子进去，两个相同的光子出来',
        },
        {
          title: '2. 粒子数反转 (Population Inversion)',
          icon: '🔄',
          color: '#FF5E00',
          text: '在热平衡状态下，低能级粒子数始终多于高能级（玻尔兹曼分布）。要实现光放大，必须通过外部泵浦使高能级粒子数 N₂ > 低能级粒子数 N₁，即"粒子数反转"。',
          formula: '热平衡: N₂/N₁ = exp(−ΔE/kT) < 1　|　反转: N₂ > N₁（需泵浦）',
        },
        {
          title: '3. 光学谐振腔 (Optical Resonator)',
          icon: '🪞',
          color: '#AF52DE',
          text: '两面镜子（全反镜 HR + 输出耦合镜 OC）构成光学谐振腔。光在腔内往返传播多次通过增益介质，不断被放大。同时谐振腔具有选模功能：只有满足驻波条件的纵模才能振荡。',
          formula: '纵模间距 Δf = c/(2L)　|　稳定性: 0 ≤ g₁g₂ ≤ 1, g = 1−L/R',
        },
        {
          title: '4. 增益介质 (Gain Medium)',
          icon: '💎',
          color: '#34C759',
          text: '增益介质是实现粒子数反转和光放大的物质。不同类型激光器使用不同增益介质：气体（He-Ne, CO₂）、固体晶体（Nd:YAG, Ti:Sapphire）、半导体、光纤、液体（染料）等。',
          formula: '增益 G = exp(σ · ΔN · L)　|　σ: 受激辐射截面, ΔN: 反转粒子数密度, L: 介质长度',
        },
        {
          title: '5. 泵浦源 (Pump Source)',
          icon: '⚡',
          color: '#FF5E00',
          text: '泵浦源为增益介质提供外部能量以维持粒子数反转。常见方式：闪光灯泵浦（宽光谱，效率低）、半导体激光二极管泵浦（窄线宽，效率高）、电激励（气体放电）、化学泵浦等。',
          formula: '泵浦效率 η = P_laser / P_pump　|　典型: 灯泵 1~5%, LD泵 30~60%',
        },
        {
          title: '6. 模式锁定 (Mode-Locking)',
          icon: '🔗',
          color: '#0071E3',
          text: '当谐振腔中多个纵模的相位被锁定（固定相位关系）时，它们相干叠加产生周期性超短脉冲。锁模脉宽与增益带宽成反比——带宽越大，脉宽越短。典型方式：Kerr 透镜锁模 (KLM)、SESAM、声光调制器。',
          formula: 'Δτ ≈ 1/Δν_gain　|　Ti:Sapphire Δν≈100THz → Δτ<10fs 可能',
        },
        {
          title: '7. Q 开关 (Q-Switching)',
          icon: '🎛️',
          color: '#AF52DE',
          text: '通过在腔内放置可控损耗元件（电光调制器、声光调制器、饱和吸收体），在泵浦阶段保持高损耗（低 Q 值）阻止振荡积累反转粒子，然后突然降低损耗（高 Q 值）释放储能，产生巨脉冲。',
          formula: 'E_pulse ≈ E_stored / (1 + ΔN_th/ΔN_i)　|　脉宽 ≈ 2L/(c·δ)，δ为净增益',
        },
      ];

      el.innerHTML = concepts.map(c => `
        <div style="margin-bottom:16px;padding:14px;border-radius:10px;background:var(--bg-primary)">
          <div style="font-size:15px;font-weight:700;color:${c.color};margin-bottom:8px">${c.icon} ${c.title}</div>
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin-bottom:8px">${c.text}</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-primary);background:var(--bg-card);padding:8px 12px;border-radius:6px;border-left:3px solid ${c.color}">${c.formula}</div>
        </div>
      `).join('');
    },

    _renderWaveformChart() {
      const canvasId = 'waveform-chart';
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      // Generate CW waveform (constant)
      const nPoints = 400;
      const cwData = [];
      const pulseData = [];
      const tData = [];

      for (let i = 0; i <= nPoints; i++) {
        const t = i / nPoints * 10; // 10 units
        tData.push(t.toFixed(2));
        cwData.push(1.0); // constant

        // Pulsed: gaussian pulses centered at 1, 3, 5, 7, 9
        let pulse = 0;
        for (let p = 0; p < 5; p++) {
          const center = 1 + p * 2;
          const dt = t - center;
          pulse += Math.exp(-0.5 * (dt / 0.08) ** 2);
        }
        pulseData.push(pulse);
      }

      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();

      this.waveformChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: tData,
          datasets: [
            {
              label: '连续激光 CW',
              data: cwData,
              borderColor: Charts.COLORS.blue,
              backgroundColor: 'rgba(0,113,227,0.08)',
              fill: true,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0,
            },
            {
              label: '脉冲激光 Pulsed',
              data: pulseData,
              borderColor: Charts.COLORS.red,
              backgroundColor: 'rgba(255,59,48,0.08)',
              fill: true,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.2,
            }
          ]
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
              displayColors: false,
              callbacks: {
                title: (items) => `t = ${items[0].label}`,
                label: (item) => `${item.dataset.label}: ${item.raw.toFixed(3)}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(150, 150, 150, 0.15)', drawBorder: false },
              ticks: { font: { family: 'Inter', size: 11 }, color: '#AEAEB2', maxTicksLimit: 8 },
              title: { display: true, text: '时间', font: { size: 12, family: 'Inter' }, color: '#6E6E73' },
            },
            y: {
              grid: { color: 'rgba(150, 150, 150, 0.15)', drawBorder: false },
              ticks: { font: { family: 'SF Mono, Consolas, monospace', size: 11 }, color: '#AEAEB2', maxTicksLimit: 6 },
              title: { display: true, text: '功率 P(t)', font: { size: 12, family: 'Inter' }, color: '#6E6E73' },
              min: 0,
            }
          }
        }
      });
    },

    // ==========================================
    // Tab 2: CW/ns/ps/fs Comparison
    // ==========================================
    _renderCompare() {
      this._renderCompareTable();
      this._renderPeakPowerChart();
    },

    _renderCompareTable() {
      const wrapper = document.getElementById('compare-table-wrapper');
      if (!wrapper) return;

      const rows = [
        {
          type: '连续激光 CW',
          pulse: '连续',
          repRate: '—',
          peak: '≈ 平均功率',
          bandwidth: '极窄 (<MHz)',
          mechanism: '粒子数反转稳态振荡',
          pros: '稳定、窄线宽、高相干',
          cons: '峰值功率低',
          apps: '干涉测量、光谱、通信、泵浦',
        },
        {
          type: '纳秒激光 ns',
          pulse: '1~100 ns',
          repRate: '1 Hz ~ MHz',
          peak: 'kW ~ MW',
          bandwidth: 'MHz ~ GHz',
          mechanism: 'Q开关（电光/声光/被动）',
          pros: '峰值功率高、技术成熟、成本适中',
          cons: '脉宽受上能级寿命限制',
          apps: '材料加工、测距、激光雷达、LIBS',
        },
        {
          type: '皮秒激光 ps',
          pulse: '1~100 ps',
          repRate: 'kHz ~ GHz',
          peak: 'MW ~ GW',
          bandwidth: 'GHz ~ THz',
          mechanism: '主动/被动锁模、MOPA',
          pros: '热影响区小、加工精度高、高峰值功率',
          cons: '系统复杂度增加、成本较高',
          apps: '精密微加工、OCT、生物成像、太赫兹',
        },
        {
          type: '飞秒激光 fs',
          pulse: '5~500 fs',
          repRate: 'kHz ~ GHz',
          peak: 'GW ~ TW',
          bandwidth: 'THz (~100THz)',
          mechanism: 'Kerr透镜锁模(KLM)、SESAM',
          pros: '超短脉宽、极高峰值功率、冷加工',
          cons: '系统最复杂、最昂贵、维护要求高',
          apps: '超快光谱、频率梳、多光子显微、微加工',
        },
      ];

      const dims = ['类型', '典型脉宽', '典型重复频率', '峰值功率', '光谱带宽', '产生机制', '优点', '局限', '典型应用'];

      let html = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">';
      html += '<thead><tr style="border-bottom:2px solid var(--border)">';
      dims.forEach(d => {
        html += `<th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600;white-space:nowrap">${d}</th>`;
      });
      html += '</tr></thead><tbody>';

      const rowColors = [Charts.COLORS.blue, Charts.COLORS.orange, Charts.COLORS.green, Charts.COLORS.purple];
      const fields = ['type', 'pulse', 'repRate', 'peak', 'bandwidth', 'mechanism', 'pros', 'cons', 'apps'];

      rows.forEach((row, i) => {
        html += `<tr style="border-bottom:1px solid var(--border-light)">`;
        fields.forEach((f, j) => {
          const style = j === 0 ? `font-weight:700;color:${rowColors[i]}` : '';
          html += `<td style="padding:8px 12px;${style}">${row[f]}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table></div>';
      wrapper.innerHTML = html;
    },

    _renderPeakPowerChart() {
      const canvasId = 'peak-power-chart';
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();

      // For average power from 1mW to 10W, compute peak power for different pulse widths
      const avgPowers = [0.001, 0.01, 0.1, 1, 10]; // W
      const avgLabels = ['1mW', '10mW', '100mW', '1W', '10W'];

      // Pulse widths in seconds
      const pulseTypes = [
        { name: 'ns (10ns)', tau: 10e-9, frep: 1e4, color: Charts.COLORS.orange },
        { name: 'ps (10ps)', tau: 10e-12, frep: 80e6, color: Charts.COLORS.green },
        { name: 'fs (100fs)', tau: 100e-15, frep: 80e6, color: Charts.COLORS.purple },
      ];

      const datasets = pulseTypes.map(pt => ({
        label: pt.name,
        data: avgPowers.map(pAvg => pAvg / (pt.frep * pt.tau)),
        borderColor: pt.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: pt.color,
        tension: 0.3,
      }));

      this.peakPowerChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: avgLabels,
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
                title: (items) => `平均功率: ${items[0].label}`,
                label: (item) => {
                  const val = item.raw;
                  if (val >= 1e9) return `P_peak = ${(val/1e9).toFixed(1)} GW`;
                  if (val >= 1e6) return `P_peak = ${(val/1e6).toFixed(1)} MW`;
                  if (val >= 1e3) return `P_peak = ${(val/1e3).toFixed(1)} kW`;
                  return `P_peak = ${val.toFixed(1)} W`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(150, 150, 150, 0.15)', drawBorder: false },
              ticks: { font: { family: 'Inter', size: 11 }, color: '#AEAEB2' },
              title: { display: true, text: '平均功率', font: { size: 12, family: 'Inter' }, color: '#6E6E73' },
            },
            y: {
              type: 'logarithmic',
              grid: { color: 'rgba(150, 150, 150, 0.15)', drawBorder: false },
              ticks: {
                font: { family: 'SF Mono, Consolas, monospace', size: 11 },
                color: '#AEAEB2',
                callback: function(val) {
                  if (val >= 1e9) return (val/1e9) + ' GW';
                  if (val >= 1e6) return (val/1e6) + ' MW';
                  if (val >= 1e3) return (val/1e3) + ' kW';
                  return val + ' W';
                }
              },
              title: { display: true, text: '峰值功率 (对数坐标)', font: { size: 12, family: 'Inter' }, color: '#6E6E73' },
            }
          }
        }
      });
    },

    // ==========================================
    // Tab 3: Laser Type Cards
    // ==========================================
    _renderTypes() {
      const grid = document.getElementById('laser-type-grid');
      if (!grid) return;

      grid.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">${
        LASER_TYPES.map(laser => {
          const colorInfo = OPTICS.wavelengthToColor(laser.lambda);
          return `
          <div style="
            background:var(--bg-primary);border-radius:12px;overflow:hidden;
            border:1px solid var(--border);transition:box-shadow 0.2s;
          ">
            <div style="
              display:flex;align-items:center;gap:12px;padding:14px 16px;
              border-bottom:1px solid var(--border-light);
            ">
              <div style="
                width:48px;height:48px;border-radius:10px;flex-shrink:0;
                background:${colorInfo.color};opacity:0.85;
                display:flex;align-items:center;justify-content:center;
                color:#fff;font-size:11px;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.3);
              ">${laser.lambda}<br><span style="font-size:9px;font-weight:400">nm</span></div>
              <div>
                <div style="font-size:15px;font-weight:700;color:var(--text-primary)">${laser.name}</div>
                <div style="font-size:12px;color:${colorInfo.color};font-weight:600">${colorInfo.name}</div>
              </div>
            </div>
            <div style="padding:14px 16px;font-size:13px;color:var(--text-secondary);line-height:1.7">
              <div style="margin-bottom:10px"><strong style="color:var(--text-primary)">工作原理：</strong>${laser.principle}</div>
              <div style="margin-bottom:10px"><strong style="color:var(--text-primary)">输出模式：</strong>${laser.output}</div>
              <div style="margin-bottom:8px"><strong style="color:var(--green)">优点：</strong>${laser.pros}</div>
              <div style="margin-bottom:8px"><strong style="color:var(--red)">局限：</strong>${laser.cons}</div>
              <div style="background:var(--bg-card);padding:10px 12px;border-radius:8px;border-left:3px solid ${colorInfo.color};margin-top:10px">
                <strong style="color:var(--accent)">适合测试场景：</strong>${laser.useCase}
              </div>
            </div>
          </div>`;
        }).join('')
      }</div>`;

      // Wavelength overview in results panel
      this._renderWavelengthOverview();
    },

    _renderWavelengthOverview() {
      const el = document.getElementById('wavelength-overview');
      if (!el) return;

      // Sort by wavelength
      const sorted = [...LASER_TYPES].sort((a, b) => a.lambda - b.lambda);

      // Visible spectrum gradient
      const specColors = ['#8B00FF','#4400FF','#0066FF','#00CCCC','#00CC00','#CCCC00','#FF8800','#FF0000','#880000'];
      const specPositions = [380,420,470,495,530,570,600,650,780];
      const gradientStops = specColors.map((c,i) => `${c} ${((specPositions[i]-380)/(780-380)*100).toFixed(1)}%`).join(', ');

      let html = `
        <div style="position:relative;margin:20px 0 8px">
          <div style="height:32px;border-radius:8px;background:linear-gradient(to right, ${gradientStops});position:relative"></div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-tertiary);margin-top:4px">
            <span>380nm UV</span><span>550nm 绿</span><span>780nm 红</span>
          </div>
      `;

      sorted.forEach(laser => {
        const colorInfo = OPTICS.wavelengthToColor(laser.lambda);
        // Position on spectrum (clamp to visible range for display)
        const clampedLambda = Math.max(380, Math.min(780, laser.lambda));
        const pos = ((clampedLambda - 380) / (780 - 380) * 100).toFixed(1);
        const isOutside = laser.lambda < 380 || laser.lambda > 780;

        html += `
          <div style="position:absolute;left:${pos}%;bottom:-${18 + sorted.indexOf(laser) * 0}px;transform:translateX(-50%);text-align:center">
            <div style="width:3px;height:16px;background:${isOutside ? '#888' : colorInfo.color};margin:0 auto;border-radius:2px"></div>
            <div style="font-size:10px;color:${isOutside ? '#888' : colorInfo.color};white-space:nowrap;margin-top:2px;font-weight:600">
              ${laser.lambda}nm
            </div>
          </div>`;
      });

      html += '</div>';

      html += '<div style="margin-top:60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">';
      sorted.forEach(laser => {
        const colorInfo = OPTICS.wavelengthToColor(laser.lambda);
        html += `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--bg-primary);border-radius:8px">
            <div style="width:12px;height:12px;border-radius:50%;background:${colorInfo.color};flex-shrink:0"></div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text-primary)">${laser.name.split(' ')[0]}</div>
              <div style="font-size:11px;color:var(--text-tertiary)">${laser.lambda}nm · ${colorInfo.name}</div>
            </div>
          </div>`;
      });
      html += '</div>';

      el.innerHTML = html;
    },

    // ==========================================
    // Tab 4: Peak Power Calculator
    // ==========================================
    _renderCalcPresets() {
      const el = document.getElementById('pp-presets');
      if (!el || el.children.length > 0) return;

      const presets = [
        { name: '80MHz fs 振荡器', avg: 500, frep: 80000, width: 100, unit: 'fs' },
        { name: '1kHz ns 调Q', avg: 1000, frep: 1, width: 10, unit: 'ns' },
        { name: '40MHz ps 激光器', avg: 200, frep: 40000, width: 10, unit: 'ps' },
        { name: 'CW He-Ne 5mW', avg: 5, frep: 1, width: 1000000, unit: 'ps', note: 'CW' },
        { name: '单脉冲 ns', avg: 100, frep: 0.01, width: 5, unit: 'ns' },
      ];

      el.innerHTML = presets.map(p =>
        `<div class="preset-chip" data-avg="${p.avg}" data-frep="${p.frep}" data-width="${p.width}" data-unit="${p.unit}">
          ${p.name}
        </div>`
      ).join('');
    },

    _updateWidthUnit(unit) {
      document.getElementById('pp-width-unit').textContent = unit;

      const slider = document.getElementById('pp-width-slider');
      const limits = document.getElementById('pp-width-limits');

      switch (unit) {
        case 'fs':
          slider.min = 1; slider.max = 10000; slider.step = 1;
          limits.innerHTML = '<span>1 fs</span><span>10000 fs</span>';
          break;
        case 'ps':
          slider.min = 0.1; slider.max = 10000; slider.step = 0.1;
          limits.innerHTML = '<span>0.1 ps</span><span>10000 ps</span>';
          break;
        case 'ns':
          slider.min = 0.1; slider.max = 10000; slider.step = 0.1;
          limits.innerHTML = '<span>0.1 ns</span><span>10000 ns</span>';
          break;
      }

      // Clamp current value
      const val = parseFloat(document.getElementById('pp-width-input').value);
      if (val < parseFloat(slider.min)) {
        document.getElementById('pp-width-input').value = slider.min;
        slider.value = slider.min;
      } else if (val > parseFloat(slider.max)) {
        document.getElementById('pp-width-input').value = slider.max;
        slider.value = slider.max;
      } else {
        slider.value = val;
      }
    },

    _calcPeakPower() {
      const avgPmW = parseFloat(document.getElementById('pp-avg-input').value);
      const frepKHz = parseFloat(document.getElementById('pp-frep-input').value);
      const widthVal = parseFloat(document.getElementById('pp-width-input').value);
      const unitBtn = document.querySelector('#pp-unit-toggle .active');
      const unit = unitBtn ? unitBtn.dataset.unit : 'ps';

      if (isNaN(avgPmW) || isNaN(frepKHz) || isNaN(widthVal) || avgPmW <= 0 || frepKHz <= 0 || widthVal <= 0) {
        ['pp-res-peak', 'pp-res-energy', 'pp-res-density', 'pp-res-equiv'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = '—';
        });
        return;
      }

      // Convert to SI
      const avgP = avgPmW * 1e-3;           // W
      const frep = frepKHz * 1e3;            // Hz
      let tauS;                               // seconds
      switch (unit) {
        case 'fs': tauS = widthVal * 1e-15; break;
        case 'ps': tauS = widthVal * 1e-12; break;
        case 'ns': tauS = widthVal * 1e-9; break;
        default: tauS = widthVal * 1e-12;
      }

      // Core calculations
      const Ppeak = avgP / (frep * tauS);      // W
      const Epulse = avgP / frep;               // J

      // Format peak power with best unit
      let peakStr, peakUnit;
      if (Ppeak >= 1e12) { peakStr = Ppeak / 1e12; peakUnit = 'TW'; }
      else if (Ppeak >= 1e9) { peakStr = Ppeak / 1e9; peakUnit = 'GW'; }
      else if (Ppeak >= 1e6) { peakStr = Ppeak / 1e6; peakUnit = 'MW'; }
      else if (Ppeak >= 1e3) { peakStr = Ppeak / 1e3; peakUnit = 'kW'; }
      else { peakStr = Ppeak; peakUnit = 'W'; }

      document.getElementById('pp-res-peak').textContent = OPTICS.formatNum(peakStr, 4);
      document.getElementById('pp-res-peak-unit').textContent = peakUnit;

      // Format energy with best unit
      let energyStr, energyUnit;
      const EpJ = Epulse * 1e12; // pJ
      if (EpJ >= 1e6) { energyStr = Epulse * 1e3; energyUnit = 'mJ'; }
      else if (EpJ >= 1e3) { energyStr = Epulse * 1e6; energyUnit = 'µJ'; }
      else { energyStr = Epulse * 1e9; energyUnit = 'nJ'; }

      document.getElementById('pp-res-energy').textContent = OPTICS.formatNum(energyStr, 4);
      document.getElementById('pp-res-energy-unit').textContent = energyUnit;

      // Power density (assuming 1mm diameter beam)
      const beamArea = Math.PI * (0.05) ** 2; // cm^2 (1mm diameter = 0.5mm radius)
      const density = Ppeak / beamArea / 1e6;  // MW/cm^2
      document.getElementById('pp-res-density').textContent = OPTICS.formatNum(density, 3);

      // Equivalence
      const equiv = document.getElementById('pp-res-equiv');
      let equivText = '';
      if (Ppeak > 1e12) equivText = '超过太瓦级，可进行强场物理实验';
      else if (Ppeak > 1e9) equivText = 'GW 级，可用于高次谐波产生 (HHG)';
      else if (Ppeak > 1e6) equivText = 'MW 级，可用于非线性光学实验';
      else if (Ppeak > 1e3) equivText = 'kW 级，适合材料加工和测距';
      else if (Ppeak > 1) equivText = '瓦级，适合光谱分析和通信';
      else equivText = '毫瓦级，适合干涉测量和传感';

      equiv.textContent = equivText;
    },

    destroy() {
      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';
      if (this.waveformChart) { this.waveformChart.destroy(); this.waveformChart = null; }
      if (this.peakPowerChart) { this.peakPowerChart.destroy(); this.peakPowerChart = null; }
    }
  };

  App.registerTool('lasers', tool);
})();

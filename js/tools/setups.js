/* ============================================
   Optical Toolkit — Optical Measurement Setups
   TRPL, Pump-Probe, Magneto-PL, In-situ PL/Raman, Z-Scan, Michelson
   Academic quality, interactive tooltips, aligned coordinates
   ============================================ */

(() => {

  const TOOLTIPS = {
    // TRPL
    'tr-laser': '脉冲激光器\n常用：皮秒/飞秒脉冲激光\n重复频率：kHz ~ MHz（影响最大可测寿命）\n脉宽需远短于待测寿命（<1/10）\n典型：Ti:Sapphire 飞秒 (800nm, ~100fs)、皮秒二极管 (405nm, ~50ps)',
    'tr-ndfilter': '中性密度滤波片 (ND Filter)\n功能：调节激发光强度\n避免样品饱和和非线性效应，保持超短脉冲的波形无畸变\n典型：OD 0.3 ~ 3.0（衰减 2 ~ 1000 倍）',
    'tr-sample': '被测样品\n荧光寿命范围：\n• 有机分子：1 ~ 10 ns\n• 量子点：5 ~ 100 ns\n• TMD 单层：0.1 ~ 10 ns\n• 钙钛矿：1 ~ 100 ns\n样品放置在精密移动台上，可开展空间寿命显微成像 (FLIM)',
    'tr-collect': '收集透镜\n功能：高效收集样品荧光并准直耦合进后续分析系统\n大 NA 物镜可提高荧光收集效率；需注意色散对脉冲展宽的影响',
    'tr-filter': '带通/长通滤波器\n功能：彻底滤除激发光，仅允许样品荧光信号通过\n抑制比要求 OD > 6，防止泄漏的激光伪信号干扰单光子计数器',
    'tr-detector': '单光子探测器\n常用：PMT (时间分辨率 ~30ps)、SPAD (单光子雪崩二极管，时间分辨率 ~50ps)\n探测器的时间抖动 (Jitter) 决定了系统最终的时间分辨极限',
    'tr-tcspc': 'TCSPC 模块\n时间相关单光子计数系统 (Time-Correlated Single Photon Counting)\n记录激光同步信号与第一个发光光子到达探测器之间的时间差\n通过直方图累加绘制荧光寿命衰减曲线 I(t)',
    'tr-sync': '同步触发电路\n从脉冲激光器同步提取触发电信号，作为 TCSPC 的计时起点 (Start)\n探测器单光子电脉冲作为计时终点 (Stop)',

    // Pump-Probe
    'pp-laser': '飞秒锁模激光器\n激发源：输出超短脉冲（脉宽 <100fs）\n高峰值功率和超短时空尺度是泵浦探测的核心要求\n常用：Ti:Sapphire 飞秒激光器 (800nm)',
    'pp-bs': '分束镜 (Beam Splitter)\n将飞秒激光束分为两束：\n• 泵浦光 (Pump)：高功率，用于激发样品产生非平衡载流子\n• 探测光 (Probe)：弱光，用于探测激发的瞬态透射/反射变化\n通常分束比为 9:1 或 8:2',
    'pp-delay': '电动位移延迟线 (Delay Line)\n在探测光路上设置电动反射镜平移台\n通过微调光程差 (Δd) 引入极高精度的时间差 (Δt = Δd/c)\n精度达飞秒级 (1μm = 6.67fs 往返延迟)',
    'pp-chopper': '光学斩波器 (Optical Chopper)\n对泵浦光进行特定频率 (f_chop) 的周期性遮挡调制\n为锁相放大器提供参考参考频率，用于在探测端滤除宽带噪声',
    'pp-sample': '超快动力学样品\n泵浦光强激发，探测光极弱。测定探测光的瞬态反射率变化 (ΔR/R) 或透射率变化 (ΔT/T)\n研究激子复合、载流子热化、声子散射等飞秒动力学过程',
    'pp-pd': '高速光电探测器 (Photodiode)\n高速高线性度光电二极管，将探测光强度信号转为电信号\n信号变化微弱，极需高动态范围',
    'pp-lockin': '锁相放大器 (Lock-in Amplifier)\n核心数据提取：只放大与斩波器频率 f_chop 相关的微弱交流信号\n极强地抑制了低频 1/f 噪声和光源漂移，信号检测灵敏度可达 10⁻⁶ 级',

    // Magneto-PL
    'mag-laser': '连续发光激光器\n常规 PL 激发源，波长根据样品吸收谱或带隙决定\n需通过偏振器件对激发光进行纯化',
    'mag-hwp': '半波片与起偏器\n功能：将激发激光制备为特定角度的线偏振，配合低温磁场偏振响应\n在分析磁手性、能谷偏振度时必不可少',
    'mag-cryo': '超导磁体恒温器 (Cryostat)\n功能：提供低温环境 (常为 1.5K ~ 4K) 与强静磁场环境\n窗口材质需满足高透光和极低应力双折射要求，避免影响光偏振',
    'mag-magnet': '超导磁体线圈\n线圈充磁提供强静磁场 (通常 0 ~ 9T 或更高)\n• 法拉第几何 (Faraday)：磁场方向平行于光轴\n• 沃伊特几何 (Voigt)：磁场方向垂直于光轴',
    'mag-sample': '低温磁性样品\n置于恒温器中心的超导磁场焦点，通常研究：\n• 能级 Zeeman 分裂\n• 能谷谷极化率和自旋极化发光\n• 稀磁半导体/二维磁性材料的磁致发光效应',
    'mag-spectro': '高分辨光谱仪与 CCD\n记录磁场 PL 发射谱。通常在接收端加入波片与检偏器组合\n分别记录 σ⁺ (右旋) 与 σ⁻ (左旋) 圆偏振发光，计算能谷极化率',

    // In-situ PL
    'ins-laser': '显微激发激光\n准直耦合进显微镜光路，通过物镜聚焦为微区光斑\n实现微米甚至亚微米量级的原位探测',
    'ins-dm': '二向色分束镜 (Dichroic Mirror)\n以 45° 倾斜放置，设计反射短激发波长，而高效透射长波发光信号（PL/Raman），完成显微光路中同轴激发与收集的分离',
    'ins-objective': '长工作距离显微物镜 (LWD Objective)\n由于原位电学探针台带有盖板、探针等机械部件阻挡\n物镜需具备长工作距离 (WD > 10mm) 并保持足够大 NA 以保证空间分辨率',
    'ins-stage': '微区原位探针台 (Probe Stage)\n提供气密、控温或真空环境。内部配有高精度微位移器\n可从外部引入电学引脚和探针，精确触碰微区器件的电极',
    'ins-probes': '微区电学探针 (Probes)\n针尖半径 <1μm 的钨针或铂针，在显微镜下操作\n扎在微区样品（如二维场效应管 FET）的源极、漏极、栅极上',
    'ins-sample': '微纳光电器件\n如石墨烯/TMDs 场效应管、自发极化铁电薄膜、电致发光二极管等\n在电场/偏压下开展原位的发光和声子动力学表征',
    'ins-sourcemeter': '源表 (Source Measure Unit - Keithley)\n功能：提供精准的直流偏置电压或门电压，并同步读取器件电输运电流\n作为电场调控的主动激发源，实现“电-光”联合原位测量',
    'ins-spectro': '原位 PL/Raman 光谱仪\n在施加电压的瞬态或稳态下，实时采集光谱信号\n用于监测载流子注入对 PL 强度的调制或电场对应变 Raman 峰的拉伸红移',

    // Z-Scan
    'zs-laser': '飞秒锁模激光器\n通常使用超短脉冲飞秒激光器，因为其极高的峰值功率很容易激发样品的三阶非线性光学效应\n典型：Ti:Sapphire 飞秒激光（800nm, ~100fs, 80MHz）',
    'zs-attenuator': '精密可调衰减片组\n用于精准控制进入测试系统的激发激光功率，以测量材料在不同光强下的三阶非线性吸收与折射率响应变化情况',
    'zs-lens': '聚焦透镜\n高数值孔径 (NA) 单透镜，将平行高斯光束强聚焦为微米级束腰 (Waist)\n在束腰焦点处获得极高局域功率密度 (可达 GW/cm² 级别)',
    'zs-stage': 'Z轴精密位移台\n高精度电动平移台，带动待测样品沿光轴（Z方向）在焦点前后往返移动，步进精度通常小于微米级',
    'zs-sample': '非线性材料样品\n置于移动台上。在焦点附近发生：\n• 非线性折射（自聚焦或自发散，样品等效于透镜）\n• 非线性吸收（如双光子吸收或饱和吸收）',
    'zs-aperture': '远场光阑\n设置在远场的同轴光阑：\n• 闭口模式 (CA)：检测非线性折射，测量样品由于折射产生的自聚焦/自发散现象\n• 开口模式 (OA)：检测非线性吸收，光阑全开收集全部透射能量',
    'zs-detector': '光电功率探测器\n测量通过光阑的光通量。随着样品穿过焦点 (Z=0)，输出经典的对称吸收谷（非线性吸收）或“峰-谷”/“谷-峰”（非线性折射）曲线',

    // Michelson
    'mi-laser': '高度相干激光器\n常用高相干长度的单模氦氖 (He-Ne) 激光器 (632.8nm)，即使在较长光程差下依然能清晰观察到干涉条纹',
    'mi-expander': '空间滤波扩束镜 (Beam Expander)\n由针孔滤波片与双透镜准直系统构成。滤除激光空间高频杂散光，并将细激光束展宽为直径约 10-20mm 的高平坦平行光',
    'mi-bs': '分束镜 (50:50 Splitter)\n以 45° 放置。半透半反镜，将平行入射光等分为振幅相等的两束：一束透射至动镜，一束反射至定镜。两束光返回时在此处合束干涉',
    'mi-mirror1': '定镜 M1 (Reference Mirror)\n高精度反射镜（平面度 λ/10 或更高），表面镀金属或介质高反膜，作为参考光路的静态基准面',
    'mi-mirror2': '动镜 M2 (Scanning Mirror)\n高精度反射镜，安装在位移台和 PZT 上。其微小的物理位移 (Δd) 会改变探测臂的光程，引起干涉相位差 Δφ = 4π·Δd/λ',
    'mi-pzt': '压电陶瓷位移器 (PZT)\n安装在动镜后方，提供纳米级的精密位移，用于光干涉的相位调制、主动稳相或进行傅里叶调制扫描',
    'mi-detector': '干涉屏 / 探测器 CCD\n接收来自两臂返回光线汇合后的干涉图案（等厚或等倾干涉圆环/直条纹）。结合采集系统可实现光谱分析或微位移测量'
  };

  const tool = {
    title: '学术与系统级光路',
    description: '时间分辨荧光光谱 (TRPL)、超快飞秒泵浦探测、低温强磁场光谱仪、原位调控系统、Z-Scan 非线性扫描、迈克尔逊干涉仪等学术测量光路方案',
    currentSetup: 'trpl',
    _tooltipEl: null,

    render(container) {
      container.innerHTML = `
        <!-- Top Control Bar (Tabs) -->
        <div class="card">
          <div class="toggle-group" id="setup-tabs">
            <button class="toggle-btn active" data-tab="trpl">TRPL 荧光寿命</button>
            <button class="toggle-btn" data-tab="pump-probe">飞秒泵浦-探测</button>
            <button class="toggle-btn" data-tab="magneto">低温强磁场 PL</button>
            <button class="toggle-btn" data-tab="insitu">原位电学 PL</button>
            <button class="toggle-btn" data-tab="zscan">Z-Scan 非线性扫描</button>
            <button class="toggle-btn" data-tab="michelson">迈克尔逊干涉仪</button>
          </div>
        </div>

        <!-- Middle Stage (Diagrams) -->
        <div class="dashboard-wide-stage">
          <div class="tab-panel" id="tab-trpl">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">⏱️</span> TRPL 时间分辨荧光寿命测试光路</div>
            <div class="help-text" style="margin-bottom:16px">
              时间分辨光致发光 (TRPL) 通过记录荧光强度随时间的衰减来测量荧光寿命。本光路展示了主流的 <strong>TCSPC (时间相关单光子计数)</strong> 技术架构。
              <strong>鼠标悬停在元件上可查看详细物理机制与设计要点。</strong>
            </div>
            <div id="trpl-diagram"></div>
          </div>

          <div class="tab-panel" id="tab-pump-probe" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">⏱️</span> 飞秒泵浦-探测 (Pump-Probe) 瞬态光谱光路</div>
            <div class="help-text" style="margin-bottom:16px">
              泵浦-探测 (Pump-Probe) 用于测量飞秒尺度的超快动力学。通过分束镜分为强泵浦光和弱探测光，利用电动位移平移台引入光程差来精密控制皮秒至飞秒级的时间延迟。
              <strong>鼠标悬停在元件上可查看详细物理机制与设计要点。</strong>
            </div>
            <div id="pump-probe-diagram"></div>
          </div>

          <div class="tab-panel" id="tab-magneto" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">🧲</span> 低温强磁场光谱测试光路 (Magneto-PL)</div>
            <div class="help-text" style="margin-bottom:16px">
              低温强磁场光谱测试可在极低温 (如 1.5K~4K) 和强静磁场 (如 0~9T) 下分析自旋能级 Zeeman 分裂、谷激子发射特性。通常采用法拉第共线光路或透射光路。
              <strong>鼠标悬停在元件上可查看详细物理机制与设计要点。</strong>
            </div>
            <div id="magneto-diagram"></div>
          </div>

          <div class="tab-panel" id="tab-insitu" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">⚡</span> 原位微区电学调控 PL/Raman 光路 (In-situ System)</div>
            <div class="help-text" style="margin-bottom:16px">
              原位电学调控光路实现了在施加偏置偏压 (V_ds) 或栅极电压 (V_g) 的同时，对电子器件进行显微 PL/Raman 光谱实时采集。
              <strong>鼠标悬停在元件上可查看详细物理机制与设计要点。</strong>
            </div>
            <div id="insitu-diagram"></div>
          </div>

          <div class="tab-panel" id="tab-zscan" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">🔍</span> Z-Scan 非线性折射与吸收测量光路</div>
            <div class="help-text" style="margin-bottom:16px">
              Z-Scan (Z扫描) 是测量材料三阶非线性折射率和非线性吸收系数的经典手段。通过使样品沿聚焦高斯光束的传播方向 (Z轴) 移动，并记录通过远场光阑后的透射功率。
              <strong>鼠标悬停在元件上可查看详细物理机制与设计要点。</strong>
            </div>
            <div id="zscan-diagram"></div>
          </div>

          <div class="tab-panel" id="tab-michelson" style="display:none">
            <div class="card-title" style="margin-bottom:8px"><span class="icon">🪞</span> 迈克尔逊干涉仪光路 (Michelson Interferometer)</div>
            <div class="help-text" style="margin-bottom:16px">
              迈克尔逊干涉仪是利用振幅分割法产生双光束干涉的核心光路。广泛用于相干长度测量、微小位移精密探测以及傅里叶红外光谱仪 (FTIR) 的核心干涉模块。
              <strong>鼠标悬停在元件上可查看详细物理机制与设计要点。</strong>
            </div>
            <div id="michelson-diagram"></div>
          </div>
        </div>

        <!-- Bottom Footer (Dual Columns: Notes & Inventory) -->
        <div class="dashboard-wide-footer" id="setup-footer">
          <!-- Left Column: Notes & Explanations -->
          <div class="dashboard-notes">
            <div class="card" style="height:100%">
              <div class="card-title"><span class="icon">📝</span> 学术规范与实验要点</div>
              <div id="notes-content"></div>
            </div>
          </div>

          <!-- Right Column: Components Inventory -->
          <div class="dashboard-inventory">
            <div class="card" style="height:100%">
              <div class="card-title"><span class="icon">📋</span> 元件清单与设计指标</div>
              <div id="component-list"></div>
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
      this.switchSetup('trpl');
    },

    bindEvents() {
      // Tab switching listener
      document.getElementById('setup-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        document.querySelectorAll('#setup-tabs .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchSetup(btn.dataset.tab);
      });

      // Bidirectional hover: hover list item to highlight SVG box
      const compList = document.getElementById('component-list');
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

      // Mousemove for tooltip
      document.addEventListener('mousemove', (e) => {
        if (this._tooltipEl && this._tooltipEl.style.display === 'block') {
          const x = Math.min(e.clientX + 16, window.innerWidth - 360);
          const y = Math.min(e.clientY + 16, window.innerHeight - 200);
          this._tooltipEl.style.left = x + 'px';
          this._tooltipEl.style.top = y + 'px';
        }
      });
    },

    switchSetup(tab) {
      this.currentSetup = tab;
      ['trpl', 'pump-probe', 'magneto', 'insitu', 'zscan', 'michelson'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.style.display = t === tab ? '' : 'none';
      });

      switch (tab) {
        case 'trpl': this.renderTRPL(); break;
        case 'pump-probe': this.renderPumpProbe(); break;
        case 'magneto': this.renderMagneto(); break;
        case 'insitu': this.renderInsitu(); break;
        case 'zscan': this.renderZScan(); break;
        case 'michelson': this.renderMichelson(); break;
      }
    },

    // ==========================================
    // Interactive SVG Box Helper with Vector Icons
    // ==========================================
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
      } else if (lowerId.includes('hwp') || lowerId.includes('qwp') || lowerId.includes('waveplate') || lowerId.includes('attenuator') || lbl1.includes('波片') || lbl1.includes('衰减') || lbl2.includes('hwp') || lbl2.includes('qwp') || lbl2.includes('attenuator')) {
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
      } else if (lowerId.includes('mirror') || lowerId.includes('hr') || lowerId.includes('oc') || lowerId.includes('collimator') || lowerId.includes('focusing') || lbl1.includes('反射') || lbl1.includes('镜') || lbl2.includes('mirror') || lbl1.includes('准直') || lbl1.includes('聚焦')) {
        iconSvg = `
          <path d="M ${cx-12} ${cy+12} L ${cx-8} ${cy+12} L ${cx-8} ${cy-10} L ${cx+6} ${cy-10}" fill="none" stroke="#95A5A6" stroke-width="2"/>
          <line x1="${cx-7}" y1="${cy+8}" x2="${cx+7}" y2="${cy-6}" stroke="#3498DB" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="${cx-5}" y1="${cy+6}" x2="${cx+5}" y2="${cy-4}" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
        `;
      } else if (lowerId.includes('lens') || lbl1.includes('透镜') || lbl2.includes('lens')) {
        iconSvg = `
          <path d="M ${cx} ${cy-12} Q ${cx+6} ${cy} ${cx} ${cy+12} Q ${cx-6} ${cy} ${cx} ${cy-12} Z" fill="rgba(52, 152, 219, 0.4)" stroke="#3498DB" stroke-width="1.2"/>
          <line x1="${cx-12}" y1="${cy}" x2="${cx+12}" y2="${cy}" stroke="#BDC3C7" stroke-width="1" stroke-dasharray="2,2"/>
        `;
      } else if (lowerId.includes('obj') || lbl1.includes('物镜') || lbl2.includes('obj')) {
        iconSvg = `
          <rect x="${cx-5}" y="${cy-14}" width="10" height="3" fill="#D35400" rx="0.5"/>
          <rect x="${cx-7}" y="${cy-11}" width="14" height="9" fill="#7F8C8D" stroke="#2C3E50" stroke-width="0.8"/>
          <path d="M ${cx-7} ${cy-2} L ${cx-4} ${cy+10} L ${cx+4} ${cy+10} L ${cx+7} ${cy-2} Z" fill="#2E4053" stroke="#2C3E50" stroke-width="0.8"/>
          <rect x="${cx-5}" y="${cy}" width="10" height="2" fill="#ECC94B"/>
          <rect x="${cx-2.5}" y="${cy+10}" width="5" height="1.8" fill="#E2E8F0" rx="0.3"/>
        `;
      } else if (lowerId.includes('sample') || lbl1.includes('样品') || lbl1.includes('器件') || lbl2.includes('sample') || lbl2.includes('device')) {
        iconSvg = `
          <rect x="${cx-13}" y="${cy-4}" width="26" height="8" rx="1.2" fill="#212F3D" stroke="#17202A" stroke-width="0.8"/>
          <rect x="${cx+13}" y="${cy-2}" width="3" height="4" fill="#7F8C8D" rx="0.3"/>
          <rect x="${cx-16}" y="${cy-2}" width="3" height="4" fill="#7F8C8D" rx="0.3"/>
          <polygon points="${cx-9},${cy-4} ${cx+9},${cy-4} ${cx+6},${cy-10} ${cx-6},${cy-10}" fill="rgba(46, 134, 193, 0.4)" stroke="#2980B9" stroke-width="0.8"/>
          <circle cx="${cx}" cy="${cy-7}" r="2.5" fill="${cleanColor}" filter="url(#te-glow)"/>
        `;
      } else if (lowerId.includes('spectro') || lowerId.includes('detector') || lowerId.includes('pd') || lbl1.includes('光谱') || lbl1.includes('检测') || lbl1.includes('探测') || lbl2.includes('spectro') || lbl2.includes('detector')) {
        iconSvg = `
          <rect x="${cx-15}" y="${cy-12}" width="30" height="24" rx="2.5" fill="#1C2833" stroke="#2C3E50" stroke-width="1.2"/>
          <line x1="${cx-10}" y1="${cy-7}" x2="${cx-10}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
          <line x1="${cx-7}" y1="${cy-7}" x2="${cx-7}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
          <line x1="${cx-4}" y1="${cy-7}" x2="${cx-4}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
          <rect x="${cx-19}" y="${cy-4}" width="4" height="8" fill="#95A5A6" rx="0.5"/>
          <circle cx="${cx+9}" cy="${cy+6}" r="1.5" fill="#2ECC71" filter="url(#te-glow)"/>
        `;
      } else if (lowerId.includes('filter') || lbl1.includes('滤波') || lbl2.includes('filter') || lbl1.includes('长通') || lbl1.includes('带通') || lbl1.includes('陷波') || lbl1.includes('边缘')) {
        iconSvg = `
          <rect x="${cx-11}" y="${cy-13}" width="22" height="26" rx="1.5" fill="#2E4053" stroke="#212F3D" stroke-width="1"/>
          <circle cx="${cx}" cy="${cy}" r="7" fill="${cleanColor}" opacity="0.65" stroke="${cleanColor}" stroke-width="0.8"/>
          <path d="M ${cx-4} ${cy-4} Q ${cx} ${cy-6} ${cx+4} ${cy-4}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6"/>
        `;
      } else if (lowerId.includes('grating') || lbl1.includes('光栅') || lbl2.includes('grating')) {
        iconSvg = `
          <rect x="${cx-14}" y="${cy-10}" width="28" height="20" rx="1" fill="#2E4053" stroke="#212F3D" stroke-width="1"/>
          <line x1="${cx-10}" y1="${cy-6}" x2="${cx-10}" y2="${cy+6}" stroke="#ECC94B" stroke-width="1.2"/>
          <line x1="-7" y1="-6" x2="-7" y2="6" transform="translate(${cx}, ${cy})" stroke="#ECC94B" stroke-width="1.2" stroke-dasharray="1,1"/>
          <line x1="${cx-6}" y1="${cy-6}" x2="${cx-6}" y2="${cy+6}" stroke="#ECC94B" stroke-width="1.2"/>
          <line x1="${cx-2}" y1="${cy-6}" x2="${cx-2}" y2="${cy+6}" stroke="#ECC94B" stroke-width="1.2"/>
          <line x1="${cx+2}" y1="${cy-6}" x2="${cx+2}" y2="${cy+6}" stroke="#ECC94B" stroke-width="1.2"/>
          <line x1="${cx+6}" y1="${cy-6}" x2="${cx+6}" y2="${cy+6}" stroke="#ECC94B" stroke-width="1.2"/>
          <line x1="${cx+10}" y1="${cy-6}" x2="${cx+10}" y2="${cy+6}" stroke="#ECC94B" stroke-width="1.2"/>
        `;
      } else if (lowerId.includes('slit') || lowerId.includes('pinhole') || lowerId.includes('aperture') || lbl1.includes('狭缝') || lbl1.includes('针孔') || lbl1.includes('光阑')) {
        iconSvg = `
          <rect x="${cx-9}" y="${cy-13}" width="18" height="26" rx="1.5" fill="#212F3D" stroke="#17202A" stroke-width="1"/>
          <line x1="${cx}" y1="${cy-9}" x2="${cx}" y2="${cy+9}" stroke="#D35400" stroke-width="1.8"/>
          <circle cx="${cx}" cy="${cy}" r="2" fill="#17202A"/>
          <circle cx="${cx}" cy="${cy}" r="0.6" fill="#FFFFFF"/>
        `;
      } else if (lowerId.includes('lockin') || lowerId.includes('tcspc') || lowerId.includes('smu') || lowerId.includes('sourcemeter') || lbl1.includes('锁相') || lbl1.includes('源表') || lbl1.includes('仪器') || lbl1.includes('控制器') || lbl2.includes('instrument') || lbl2.includes('amp') || lbl2.includes('smu')) {
        iconSvg = `
          <rect x="${cx-15}" y="${cy-10}" width="30" height="20" rx="2" fill="#2C3E50" stroke="#1A252F" stroke-width="1.2"/>
          <rect x="${cx-11}" y="${cy-6}" width="12" height="6" fill="#1ABC9C" rx="0.5" opacity="0.8"/>
          <circle cx="${cx+6}" cy="${cy-3}" r="1.5" fill="#E74C3C"/>
          <circle cx="${cx+10}" cy="${cy-3}" r="1.5" fill="#2ECC71"/>
          <line x1="${cx-11}" y1="${cy+4}" x2="${cx+11}" y2="${cy+4}" stroke="#BDC3C7" stroke-width="1"/>
          <circle cx="${cx-9}" cy="${cy+4}" r="1" fill="#7F8C8D"/>
          <circle cx="${cx-5}" cy="${cy+4}" r="1" fill="#7F8C8D"/>
          <circle cx="${cx-1}" cy="${cy+4}" r="1" fill="#7F8C8D"/>
        `;
      } else if (lowerId.includes('chopper') || lbl1.includes('斩波') || lbl2.includes('chopper')) {
        iconSvg = `
          <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="#7F8C8D" stroke-width="1.5"/>
          <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#34495E" stroke-width="1.5" stroke-dasharray="6,4"/>
          <circle cx="${cx}" cy="${cy}" r="3" fill="#34495E"/>
          <line x1="${cx}" y1="${cy-14}" x2="${cx}" y2="${cy+14}" stroke="#34495E" stroke-width="1"/>
          <line x1="${cx-14}" y1="${cy}" x2="${cx+14}" y2="${cy}" stroke="#34495E" stroke-width="1"/>
        `;
      } else if (lowerId.includes('delay') || lowerId.includes('stage') || lbl1.includes('延迟') || lbl1.includes('位移') || lbl2.includes('delay') || lbl2.includes('stage')) {
        iconSvg = `
          <rect x="${cx-15}" y="${cy+4}" width="30" height="4" fill="#7F8C8D" rx="1"/>
          <rect x="${cx-10}" y="${cy-6}" width="20" height="8" fill="#34495E" rx="1"/>
          <polygon points="${cx-6},${cy-2} ${cx},${cy-8} ${cx+6},${cy-2}" fill="none" stroke="#E74C3C" stroke-width="1.5"/>
          <line x1="${cx-13}" y1="${cy+6}" x2="${cx+13}" y2="${cy+6}" stroke="#BDC3C7" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
        `;
      } else if (lowerId.includes('expander') || lbl1.includes('扩束') || lbl2.includes('expander')) {
        iconSvg = `
          <rect x="${cx-15}" y="${cy-8}" width="30" height="16" fill="none" stroke="#7F8C8D" stroke-width="1.2" rx="1"/>
          <path d="M ${cx-8} ${cy-6} Q ${cx-5} ${cy} ${cx-8} ${cy+6} Q ${cx-11} ${cy} ${cx-8} ${cy-6} Z" fill="rgba(52, 152, 219, 0.4)" stroke="#3498DB" stroke-width="0.8"/>
          <path d="M ${cx+6} ${cy-10} Q ${cx+10} ${cy} ${cx+6} ${cy+10} Q ${cx+2} ${cy} ${cx+6} ${cy-10} Z" fill="rgba(52, 152, 219, 0.4)" stroke="#3498DB" stroke-width="0.8"/>
          <line x1="${cx-14}" y1="${cy}" x2="${cx+14}" y2="${cy}" stroke="#BDC3C7" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
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
          document.querySelectorAll(`#component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.add('highlighted');
            OPTICS.scrollIntoViewSafe(document.getElementById('component-list'), item);
          });
        });
        el.addEventListener('mouseleave', () => {
          tip.style.display = 'none';
          tip.style.opacity = '0';

          // Remove highlight in component list
          const id = el.dataset.tip;
          document.querySelectorAll(`#component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.remove('highlighted');
          });
        });
      });
    },

    // ==========================================
    // Setup 1: TRPL setup
    // ==========================================
    renderTRPL() {
      const W = 1100, H = 340;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <filter id="te-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arr-te" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#AF52DE"/></marker>
          <marker id="arr-td" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#0071E3"/></marker>
          <marker id="arr-ts" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#34C759"/></marker>
          <marker id="arr-tsync" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF9500"/></marker>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Beams (Double-layer volumetric glow) -->
        <!-- Laser to ND -->
        <line x1="140" y1="125" x2="180" y2="125" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="140" y1="125" x2="180" y2="125" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-te)"/>

        <!-- ND to Sample -->
        <line x1="270" y1="125" x2="380" y2="125" stroke="#AF52DE" stroke-width="8" opacity="0.2" filter="url(#te-glow)"/>
        <line x1="270" y1="125" x2="380" y2="125" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-te)"/>

        <!-- Sample to Collector -->
        <line x1="460" y1="125" x2="560" y2="125" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="460" y1="125" x2="560" y2="125" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-ts)"/>

        <!-- Collector to Filter -->
        <line x1="650" y1="125" x2="690" y2="125" stroke="#34C759" stroke-width="6" opacity="0.2" filter="url(#te-glow)"/>
        <line x1="650" y1="125" x2="690" y2="125" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-ts)"/>

        <!-- Filter to Detector -->
        <line x1="780" y1="125" x2="820" y2="125" stroke="#0071E3" stroke-width="6" opacity="0.2" filter="url(#te-glow)"/>
        <line x1="780" y1="125" x2="820" y2="125" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-td)"/>

        <!-- Detector to TCSPC (Stop signal) -->
        <line x1="865" y1="160" x2="865" y2="230" stroke="#0071E3" stroke-width="2" stroke-dasharray="4,2"/>

        <!-- Sync line from Laser down to y=265, and right to TCSPC -->
        <path d="M 85 160 L 85 265 L 820 265" fill="none" stroke="#FF9500" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arr-tsync)"/>

        <!-- Text labels shifted above beam line to avoid text overlap -->
        <text x="160" y="70" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">激发脉冲 ω</text>
        <text x="510" y="70" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">荧光发射信号</text>
        <text x="880" y="195" font-size="10" fill="var(--text-secondary)" text-anchor="start">单光子 Stop 信号</text>
        <text x="450" y="255" font-size="10" fill="#FF9500" text-anchor="middle" font-weight="600">激光同步触发 Start 信号 (高速电缆/光电耦合)</text>

        <!-- Components -->
        ${this._box(30, 90, 110, 70, '脉冲激光器', '#AF52DE', 'fs/ps Laser', 'tr-laser')}
        ${this._box(180, 90, 90, 70, 'ND 滤波片', '#FF9500', 'Power Control', 'tr-ndfilter')}
        ${this._box(380, 85, 80, 80, '被测样品', '#34C759', 'Sample', 'tr-sample')}
        ${this._box(560, 90, 90, 70, '收集透镜', '#34C759', 'Collector Lens', 'tr-collect')}
        ${this._box(690, 90, 90, 70, '带通滤波器', '#0071E3', 'Bandpass Filter', 'tr-filter')}
        ${this._box(820, 90, 90, 70, '单光子探测器', '#0071E3', 'SPAD/PMT', 'tr-detector')}
        ${this._box(820, 230, 100, 70, 'TCSPC 模块', '#FF9500', '时间关联模块', 'tr-tcspc')}
      </svg>`;

      document.getElementById('trpl-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentsList('trpl');
      this._renderNotesContent('trpl');
    },

    // ==========================================
    // Setup 2: Pump-Probe setup
    // ==========================================
    renderPumpProbe() {
      const W = 1100, H = 340;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <filter id="te-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arr-pp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF3B30"/></marker>
          <marker id="arr-probe" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#0071E3"/></marker>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Beams (Double-layer volumetric glow) -->
        <!-- Laser to BS -->
        <line x1="140" y1="110" x2="200" y2="110" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="140" y1="110" x2="200" y2="110" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-pp)"/>
        
        <!-- === Pump beam path (upper route) === -->
        <!-- BS to Chopper -->
        <line x1="260" y1="110" x2="330" y2="110" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="260" y1="110" x2="330" y2="110" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-pp)"/>
        <text x="295" y="70" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">泵浦光 (Pump - 强激发)</text>
        
        <!-- Chopper to Sample -->
        <line x1="395" y1="110" x2="480" y2="110" stroke="#FF3B30" stroke-width="6" opacity="0.25" filter="url(#te-glow)"/>
        <line x1="395" y1="110" x2="480" y2="110" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-pp)"/>

        <!-- === Probe beam path (lower route) === -->
        <!-- From BS down to Delay Line -->
        <line x1="230" y1="140" x2="230" y2="200" stroke="#0071E3" stroke-width="6" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="230" y1="140" x2="230" y2="200" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-probe)"/>
        <text x="215" y="175" font-size="10" fill="var(--text-secondary)" text-anchor="end" font-weight="700">探测光 (Probe)</text>
        
        <!-- From Delay Line up to Sample -->
        <path d="M 350 230 L 510 230 L 510 160" fill="none" stroke="#0071E3" stroke-width="6" opacity="0.3" filter="url(#te-glow)"/>
        <path d="M 350 230 L 510 230 L 510 160" fill="none" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-probe)"/>
        
        <!-- === Combined Detection path === -->
        <!-- Probe reflecting from Sample to PD -->
        <line x1="560" y1="110" x2="680" y2="110" stroke="#0071E3" stroke-width="6" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="560" y1="110" x2="680" y2="110" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-probe)"/>
        <text x="620" y="70" font-size="10" fill="var(--text-secondary)" text-anchor="middle">透射/反射探测信号</text>

        <!-- PD electrical line down to Lock-in -->
        <path d="M 725 150 L 725 210 L 770 210" fill="none" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="3,3"/>
        
        <!-- Chopper reference line down to Lock-in -->
        <path d="M 362 140 L 362 280 L 770 280" fill="none" stroke="#FF9500" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="560" y="274" font-size="10" fill="#FF9500" text-anchor="middle">同步调制参考频率 f_chop</text>

        <!-- Components -->
        ${this._box(30, 75, 110, 70, '飞秒激光器', '#FF3B30', 'fs Laser Source', 'pp-laser')}
        ${this._box(200, 75, 60, 75, '分束镜', '#AF52DE', 'BS 90:10', 'pp-bs')}
        ${this._box(330, 75, 65, 65, '光斩波器', '#FF9500', 'Chopper', 'pp-chopper')}
        ${this._box(200, 200, 150, 60, '电动时间延迟线', '#0071E3', 'Delay Line Stage', 'pp-delay')}
        ${this._box(480, 80, 80, 80, '测试样品', '#34C759', 'Sample', 'pp-sample')}
        ${this._box(680, 75, 90, 75, '高速探测器', '#0071E3', 'Photodiode', 'pp-pd')}
        ${this._box(770, 195, 110, 110, '锁相放大器', '#FF9500', 'Lock-in Amp', 'pp-lockin')}
      </svg>`;

      document.getElementById('pump-probe-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentsList('pump-probe');
      this._renderNotesContent('pump-probe');
    },

    // ==========================================
    // Setup 3: Magneto-PL setup
    // ==========================================
    renderMagneto() {
      const W = 1100, H = 340;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <filter id="te-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arr-mag" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#AF52DE"/></marker>
          <marker id="arr-magsig" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#34C759"/></marker>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Volumetric lasers -->
        <!-- Laser to Polarizer -->
        <line x1="130" y1="130" x2="190" y2="130" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="130" y1="130" x2="190" y2="130" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-mag)"/>
        
        <!-- Polarizer to Cryostat window -->
        <line x1="280" y1="130" x2="400" y2="130" stroke="#AF52DE" stroke-width="6" opacity="0.25" filter="url(#te-glow)"/>
        <line x1="280" y1="130" x2="400" y2="130" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-mag)"/>

        <!-- Inside Cryostat: focusing beam to sample -->
        <line x1="400" y1="130" x2="490" y2="130" stroke="#AF52DE" stroke-width="3" opacity="0.2" filter="url(#te-glow)"/>
        <line x1="400" y1="130" x2="490" y2="130" stroke="#FFFFFF" stroke-width="1" />
        
        <!-- Magnetic field line indicator (around sample) -->
        <rect x="440" y="55" width="120" height="20" rx="4" fill="#FF9500" opacity="0.1"/>
        <text x="500" y="69" font-size="10" fill="#FF9500" font-weight="700" text-anchor="middle">超导静磁场 B = 0 ~ 9T</text>
        
        <!-- Magnetic field coils representation -->
        <rect x="460" y="80" width="80" height="20" rx="3" fill="#FF9500" opacity="0.3"/>
        <rect x="460" y="160" width="80" height="20" rx="3" fill="#FF9500" opacity="0.3"/>

        <!-- Emission back or through Cryostat right window -->
        <line x1="540" y1="130" x2="600" y2="130" stroke="#34C759" stroke-width="3" opacity="0.2"/>
        <line x1="540" y1="130" x2="600" y2="130" stroke="#FFFFFF" stroke-width="1" />
        
        <!-- Right Cryostat window to Spectrometer -->
        <line x1="630" y1="130" x2="780" y2="130" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="630" y1="130" x2="780" y2="130" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-magsig)"/>
        <text x="705" y="75" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">低温强磁场 PL 发射</text>

        <!-- Components -->
        ${this._box(30, 95, 100, 70, '连续激光器', '#AF52DE', 'CW Laser', 'mag-laser')}
        ${this._box(190, 95, 90, 70, '起偏/波片组', '#AF52DE', 'Polarization', 'mag-hwp')}
        
        <!-- Cryostat frame -->
        <g>
          <rect x="400" y="45" width="230" height="180" rx="15" fill="none" stroke="var(--border)" stroke-width="2"/>
          <rect x="400" y="45" width="230" height="180" rx="15" fill="var(--text-tertiary)" opacity="0.03"/>
          <text x="515" y="212" font-size="11.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">低温恒温器 Cryostat (4.2K)</text>
          
          <!-- Sample inside -->
          ${this._box(490, 115, 50, 30, '样品', '#34C759', '', 'mag-sample')}
        </g>

        ${this._box(780, 85, 110, 90, '光栅光谱仪', '#1D1D1F', 'Spectrometer', 'mag-spectro')}
      </svg>`;

      document.getElementById('magneto-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentsList('magneto');
      this._renderNotesContent('magneto');
    },

    // ==========================================
    // Setup 4: In-situ PL setup
    // ==========================================
    renderInsitu() {
      const W = 1100, H = 340;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <filter id="te-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arr-ins" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF3B30"/></marker>
          <marker id="arr-inssig" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#34C759"/></marker>
          <marker id="arr-insorange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF9500"/></marker>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Volumetric lasers -->
        <!-- Laser to DM -->
        <line x1="140" y1="120" x2="270" y2="120" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="140" y1="120" x2="270" y2="120" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-ins)"/>
        
        <!-- DM reflects down to LWD Objective -->
        <line x1="300" y1="120" x2="300" y2="175" stroke="#FF3B30" stroke-width="6" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="300" y1="120" x2="300" y2="175" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-ins)"/>
        
        <!-- Objective to Sample inside Stage -->
        <line x1="300" y1="215" x2="300" y2="250" stroke="#FF3B30" stroke-width="4" opacity="0.2"/>
        <line x1="300" y1="215" x2="300" y2="250" stroke="#FFFFFF" stroke-width="1.2" stroke-dasharray="4,2"/>

        <!-- Signal PL goes back up to DM -->
        <line x1="300" y1="250" x2="300" y2="215" stroke="#34C759" stroke-width="4" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="300" y1="250" x2="300" y2="215" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="300" y1="175" x2="300" y2="120" stroke="#34C759" stroke-width="6" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="300" y1="175" x2="300" y2="120" stroke="#FFFFFF" stroke-width="1.8"/>
        
        <!-- DM transmits to Spectrometer -->
        <line x1="330" y1="120" x2="450" y2="120" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="330" y1="120" x2="450" y2="120" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-inssig)"/>

        <!-- Electrical Source Meter connection wires to probes inside Stage -->
        <path d="M 760 215 L 700 215 L 700 250 H 600" fill="none" stroke="#FF9500" stroke-width="2" />
        <path d="M 760 235 L 685 235 L 685 270 H 600" fill="none" stroke="var(--text-tertiary)" stroke-width="2" />
        <text x="692" y="198" font-size="10" fill="#FF9500" text-anchor="middle" font-weight="700">V_ds, V_g 电学控制偏压</text>

        <!-- Components -->
        ${this._box(30, 85, 110, 70, '显微激发源', '#FF3B30', 'Micro Laser', 'ins-laser')}
        ${this._box(270, 85, 60, 70, '二向色镜', '#AF52DE', 'DM Splitter', 'ins-dm')}
        ${this._box(260, 175, 80, 40, '长工作物镜', '#0071E3', 'LWD Obj', 'ins-objective')}
        
        <!-- Stage frame -->
        <g>
          <rect x="230" y="240" width="370" height="70" rx="8" fill="none" stroke="var(--border)" stroke-width="2" stroke-dasharray="6,3"/>
          <rect x="230" y="240" width="370" height="70" rx="8" fill="var(--text-tertiary)" opacity="0.05"/>
          <text x="415" y="302" font-size="11" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">微区原位探针台 Probe Stage</text>
          
          <!-- Sample inside stage -->
          ${this._box(275, 250, 50, 35, '器件', '#34C759', 'Device', 'ins-sample')}
          <!-- Probe tip representation -->
          <path d="M 580 255 L 325 260" fill="none" stroke="#FF9500" stroke-width="2" marker-end="url(#arr-insorange)"/>
          <text x="460" y="250" font-size="9" fill="#FF9500" font-weight="700" text-anchor="middle">电极微探针 Probes</text>
        </g>

        ${this._box(450, 85, 110, 70, '光谱仪', '#1D1D1F', 'Raman/PL谱仪', 'ins-spectro')}
        ${this._box(760, 180, 120, 80, '电学源表', '#FF9500', 'Source Meter SMU', 'ins-sourcemeter')}
      </svg>`;

      document.getElementById('insitu-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentsList('insitu');
      this._renderNotesContent('insitu');
    },

    // ==========================================
    // Setup 5: Z-Scan Nonlinear Setup
    // ==========================================
    renderZScan() {
      const W = 1100, H = 340;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <filter id="te-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arr-pp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF3B30"/></marker>
          <marker id="arr-insorange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF9500"/></marker>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Beams (Double-layer volumetric glow representing Gauss Waist) -->
        <!-- Laser to Attenuator -->
        <line x1="140" y1="155" x2="180" y2="155" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="140" y1="155" x2="180" y2="155" stroke="#FFFFFF" stroke-width="2"/>

        <!-- Attenuator to Focus Lens -->
        <line x1="270" y1="155" x2="300" y2="155" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="270" y1="155" x2="300" y2="155" stroke="#FFFFFF" stroke-width="2"/>

        <!-- Converging beam from lens to waist -->
        <polygon points="380,140 380,170 500,157 500,153" fill="#FF3B30" opacity="0.25" filter="url(#te-glow)"/>
        <polygon points="380,140 380,170 500,157 500,153" fill="#FFFFFF" opacity="0.12"/>
        <line x1="380" y1="155" x2="500" y2="155" stroke="#FF3B30" stroke-width="2" stroke-dasharray="4,2"/>

        <!-- Diverging beam from waist to Aperture -->
        <polygon points="500,153 500,157 650,180 650,130" fill="#FF3B30" opacity="0.25" filter="url(#te-glow)"/>
        <polygon points="500,153 500,157 650,180 650,130" fill="#FFFFFF" opacity="0.12"/>
        <line x1="500" y1="155" x2="650" y2="155" stroke="#FF3B30" stroke-width="2" stroke-dasharray="4,2"/>

        <!-- Through Aperture to Detector -->
        <line x1="730" y1="155" x2="790" y2="155" stroke="#FF3B30" stroke-width="6" opacity="0.25" filter="url(#te-glow)"/>
        <line x1="730" y1="155" x2="790" y2="155" stroke="#FFFFFF" stroke-width="1.8" marker-end="url(#arr-pp)"/>

        <!-- Annotation labels shifted above to prevent text overlaps -->
        <text x="500" y="75" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">高斯焦点光束束腰 (Waist)</text>
        <text x="710" y="75" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">闭口光阑(CA)/开口(OA)</text>

        <!-- Translation movement indicator -->
        <g>
          <line x1="440" y1="270" x2="560" y2="270" stroke="#FF9500" stroke-width="1.5" marker-end="url(#arr-insorange)" marker-start="url(#arr-insorange)"/>
          <text x="500" y="288" font-size="10.5" fill="#FF9500" font-weight="700" text-anchor="middle">Z 轴精密位移扫描 (±Z_R)</text>
        </g>

        <!-- Components -->
        ${this._box(30, 120, 110, 70, '超快激光器', '#FF3B30', 'fs Pulse Laser', 'zs-laser')}
        ${this._box(180, 120, 90, 70, '精密衰减器', '#FF9500', 'Attenuator', 'zs-attenuator')}
        ${this._box(300, 120, 80, 70, '聚焦透镜', '#0071E3', 'Focus Lens', 'zs-lens')}
        ${this._box(460, 115, 80, 80, '非线性样品', '#34C759', 'Thin Sample', 'zs-sample')}
        ${this._box(425, 195, 150, 60, '精密位移台', '#FF9500', 'Z-Stage', 'zs-stage')}
        ${this._box(650, 120, 80, 70, '远场光阑', '#1D1D1F', 'Aperture', 'zs-aperture')}
        ${this._box(790, 120, 90, 70, '功率探测器', '#0071E3', 'Detector', 'zs-detector')}
      </svg>`;

      document.getElementById('zscan-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentsList('zscan');
      this._renderNotesContent('zscan');
    },

    // ==========================================
    // Setup 6: Michelson Interferometer
    // ==========================================
    renderMichelson() {
      const W = 1100, H = 380;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <filter id="te-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arr-pp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF3B30"/></marker>
          <marker id="arr-insorange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF9500"/></marker>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Beams (Double-layer volumetric glow) -->
        <!-- Laser to Expander -->
        <line x1="140" y1="175" x2="180" y2="175" stroke="#FF3B30" stroke-width="4" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="140" y1="175" x2="180" y2="175" stroke="#FFFFFF" stroke-width="1.5"/>

        <!-- Expanded beam to Beam Splitter (BS) -->
        <polygon points="270,170 270,180 340,195 340,155" fill="#FF3B30" opacity="0.2" filter="url(#te-glow)"/>
        <polygon points="270,170 270,180 340,195 340,155" fill="#FFFFFF" opacity="0.1"/>
        <line x1="270" y1="175" x2="340" y2="175" stroke="#FF3B30" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="305" y="145" font-size="10" fill="var(--text-secondary)" text-anchor="middle">扩束平行光</text>

        <!-- Horizontal Arm: BS to Moving Mirror M2 -->
        <line x1="380" y1="175" x2="680" y2="175" stroke="#FF3B30" stroke-width="12" opacity="0.25" filter="url(#te-glow)"/>
        <line x1="380" y1="175" x2="680" y2="175" stroke="#FFFFFF" stroke-width="2"/>
        <text x="530" y="152" font-size="10.5" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">动镜探测臂 d₂</text>
        <!-- Reflected path back to BS -->
        <line x1="680" y1="175" x2="380" y2="175" stroke="#FF3B30" stroke-width="6" opacity="0.15"/>

        <!-- Vertical Arm: BS to Reference Mirror M1 -->
        <line x1="375" y1="135" x2="375" y2="75" stroke="#FF3B30" stroke-width="12" opacity="0.25" filter="url(#te-glow)"/>
        <line x1="375" y1="135" x2="375" y2="75" stroke="#FFFFFF" stroke-width="2"/>
        <text x="395" y="105" font-size="10.5" fill="var(--text-secondary)" text-anchor="start" font-weight="700">定镜参考臂 d₁</text>
        <!-- Reflected path back to BS -->
        <line x1="375" y1="75" x2="375" y2="135" stroke="#FF3B30" stroke-width="6" opacity="0.15"/>

        <!-- Downward Arm: BS to Detector (Combined interference beam) -->
        <line x1="375" y1="215" x2="375" y2="285" stroke="#FF9500" stroke-width="14" opacity="0.3" filter="url(#te-glow)"/>
        <line x1="375" y1="215" x2="375" y2="285" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arr-insorange)"/>
        <text x="395" y="250" font-size="11" fill="#FF9500" font-weight="700" text-anchor="start">相干干涉信号 (d₁ - d₂)</text>

        <!-- Scanning movement indicator under M2 -->
        <g>
          <line x1="710" y1="315" x2="770" y2="315" stroke="#FF9500" stroke-width="1.5" marker-end="url(#arr-insorange)" marker-start="url(#arr-insorange)"/>
          <text x="740" y="332" font-size="9.5" fill="#FF9500" font-weight="700" text-anchor="middle">精密扫描 (Δd)</text>
        </g>

        <!-- Components -->
        ${this._box(30, 140, 110, 70, '相干激光器', '#FF3B30', 'Coherent Laser', 'mi-laser')}
        ${this._box(180, 140, 90, 70, '空间扩束镜', '#0071E3', 'Beam Expander', 'mi-expander')}
        ${this._box(335, 135, 80, 80, '分束镜', '#AF52DE', '50:50 BS', 'mi-bs')}
        ${this._box(330, 15, 90, 60, '参考镜 M1', '#1D1D1F', 'Fixed Mirror', 'mi-mirror1')}
        ${this._box(680, 135, 90, 80, '探测镜 M2', '#1D1D1F', 'Moving Mirror', 'mi-mirror2')}
        ${this._box(680, 230, 120, 60, '微位移器', '#FF9500', 'PZT/Stage', 'mi-pzt')}
        ${this._box(330, 285, 90, 75, '检测器/屏', '#0071E3', 'Screen/CCD', 'mi-detector')}
      </svg>`;

      document.getElementById('michelson-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponentsList('michelson');
      this._renderNotesContent('michelson');
    },

    // ==========================================
    // Component List & Experimental Notes
    // ==========================================
    _renderComponentsList(setup) {
      const components = {
        trpl: [
          { name: '脉冲激光器', id: 'tr-laser' },
          { name: 'ND 滤波片', id: 'tr-ndfilter' },
          { name: '样品', id: 'tr-sample' },
          { name: '收集透镜', id: 'tr-collect' },
          { name: '滤波器组', id: 'tr-filter' },
          { name: '单光子探测器', id: 'tr-detector' },
          { name: 'TCSPC 模块', id: 'tr-tcspc' },
          { name: '同步触发电路', id: 'tr-sync' }
        ],
        'pump-probe': [
          { name: '飞秒激光器', id: 'pp-laser' },
          { name: '分束镜 BS', id: 'pp-bs' },
          { name: '光学斩波器', id: 'pp-chopper' },
          { name: '电动时间延迟线', id: 'pp-delay' },
          { name: '样品', id: 'pp-sample' },
          { name: '高速探测器 PD', id: 'pp-pd' },
          { name: '锁相放大器', id: 'pp-lockin' }
        ],
        magneto: [
          { name: '激发激光器', id: 'mag-laser' },
          { name: '偏振/波片组', id: 'mag-hwp' },
          { name: '超导磁体恒温器', id: 'mag-cryo' },
          { name: '超导静磁场', id: 'mag-magnet' },
          { name: '低温样品', id: 'mag-sample' },
          { name: '高分辨光谱仪', id: 'mag-spectro' }
        ],
        insitu: [
          { name: '激发光源', id: 'ins-laser' },
          { name: '二向色分束镜', id: 'ins-dm' },
          { name: '显微物镜 (LWD)', id: 'ins-objective' },
          { name: '原位探针台', id: 'ins-stage' },
          { name: '微区电学探针', id: 'ins-probes' },
          { name: '微纳器件样品', id: 'ins-sample' },
          { name: '原位电学源表', id: 'ins-sourcemeter' },
          { name: '光致发光光谱仪', id: 'ins-spectro' }
        ],
        zscan: [
          { name: '超快飞秒激光器', id: 'zs-laser' },
          { name: '精密光强衰减器', id: 'zs-attenuator' },
          { name: '强聚焦透镜', id: 'zs-lens' },
          { name: '非线性光学样品', id: 'zs-sample' },
          { name: '精密 Z轴平移台', id: 'zs-stage' },
          { name: '远场探测光阑', id: 'zs-aperture' },
          { name: '光电探测器/功率计', id: 'zs-detector' }
        ],
        michelson: [
          { name: '单模相干激光器', id: 'mi-laser' },
          { name: '空间滤波扩束镜', id: 'mi-expander' },
          { name: '50:50 分束镜', id: 'mi-bs' },
          { name: '平面定镜 M1 (参考臂)', id: 'mi-mirror1' },
          { name: '平面动镜 M2 (扫描臂)', id: 'mi-mirror2' },
          { name: '压电微动马达 PZT', id: 'mi-pzt' },
          { name: '干涉观察屏 / CCD', id: 'mi-detector' }
        ]
      };

      const el = document.getElementById('component-list');
      if (!el) return;

      const list = components[setup] || [];
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

    _renderNotesContent(setup) {
      const notes = {
        trpl: `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>测量模型与拟合：</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
              <li><strong>单指数衰减：</strong>I(t) = A·exp(-t/τ) + B (对应单一激子跃迁)</li>
              <li><strong>双指数衰减：</strong>I(t) = A₁·exp(-t/τ₁) + A₂·exp(-t/τ₂) + B (对应自由激子与缺陷态复合等多个并联通道)</li>
            </ul>
            <p style="margin-bottom:10px"><strong>设计要点：</strong></p>
            <ul style="padding-left:20px">
              <li style="color:var(--orange)">防止堆积效应 (Pile-up)：确保单光子计数率不超过激光重频的 1%~5%，否则前置短寿命脉冲计数偏高。</li>
              <li>滤波纯度：长通+带通滤波器 OD > 6，严防散射的脉冲激发光漏入 SPAD 损坏器件并引入超窄背景尖峰。</li>
            </ul>
          </div>`,
        'pump-probe': `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>测试物理效应：</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
              <li>测量激发的瞬态吸收变化 (ΔA)、瞬态反射变化 (ΔR/R)、瞬态透射变化 (ΔT/T)</li>
              <li>时域分辨率完全由激发/探测脉冲的重叠宽度决定，不受检测电子学带宽限制。</li>
            </ul>
            <p style="margin-bottom:10px"><strong>设计要点：</strong></p>
            <ul style="padding-left:20px">
              <li style="color:var(--accent)">延迟线校准：延迟时间 Δt = 2 · Δd / c。反射镜往返光程需精确准直，避免位移时探测光斑在样品表面产生微小位移 (空间抖动)。</li>
              <li>背景热效应消除：斩波器频率应调至几百Hz以上，利用锁相环电路严格消除连续光热积累干扰。</li>
            </ul>
          </div>`,
        magneto: `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>磁光学跃迁：</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
              <li><strong>Zeeman 能级分裂：</strong>ΔE = g · μ_B · B。通过能级分裂大小可直接测量激子有效 g 因子。</li>
              <li><strong>谷偏振调控：</strong>在 TMDs 二维材料中，外加垂直磁场打破时间反演对称性，导致 K 和 K' 谷的简并破缺。</li>
            </ul>
            <p style="margin-bottom:10px"><strong>设计要点：</strong></p>
            <ul style="padding-left:20px">
              <li style="color:var(--red)">消双折射窗口：恒温器窗口石英片必须为无应力设计。低温真空下的机械形变和应力产生双折射，会导致圆偏振光 (σ⁺/σ⁻) 退偏或改变椭圆度，从而恶化偏振度测量。</li>
            </ul>
          </div>`,
        insitu: `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>光电联动调控：</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
              <li><strong>载流子浓度控制：</strong>通过施加栅偏压 (V_g) 注入电子/空穴，调控二维材料中激子与带电激子 (Trion) 的转换，从而强调制 PL 谱。</li>
              <li><strong>焦耳热与应变：</strong>高电流下的瞬态焦耳发热，对应 Raman 峰位由于晶格膨胀发生的红移。</li>
            </ul>
            <p style="margin-bottom:10px"><strong>设计要点：</strong></p>
            <ul style="padding-left:20px">
              <li style="color:var(--green)">长工作距离 (LWD) 消除像差：物镜 WD 需长于探针台防护盖厚度。由于透过玻璃窗观察，需选用带盖玻片厚度补偿校正环的显微物镜，修正球差，保持光斑聚焦极限。</li>
              <li>原位消噪：电学探针与样品扎接需稳固，源表偏压需使用同轴三轴电缆 (Triaxial Cable) 屏蔽极微弱的漏电流 (fA~pA)。</li>
            </ul>
          </div>`,
        zscan: `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>测量模型与物理机制：</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
              <li><strong>闭口 Z-Scan (CA)：</strong>非线性折射使样品在焦点前等效为发散透镜，焦点后为聚焦透镜（自聚焦介质）。透射功率曲线呈现“峰-谷”或“谷-峰”特征。通过峰谷差值 ΔT_p-v 可提取非线性折射率 n₂。</li>
              <li><strong>开口 Z-Scan (OA)：</strong>排除折射影响，仅测吸收。若为双光子吸收（TPA），在焦点处（光强最大）吸收最强，曲线在 Z=0 处表现为对称的极小值（谷）。</li>
            </ul>
            <p style="margin-bottom:10px"><strong>设计要点：</strong></p>
            <ul style="padding-left:20px">
              <li style="color:var(--orange)">高斯光束质量：Z-scan 理论高度依赖于基模高斯光束 (TEM₀₀)。光束畸变会导致提取的 n₂ 产生巨大误差。</li>
              <li>样品厚度限制：样品厚度 L 必须远小于 Rayleigh 长度 Z_R (L &lt;&lt; Z_R)，称为薄介质近似，否则需要极其复杂的数值校正模型。</li>
            </ul>
          </div>`,
        michelson: `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>干涉条纹与公式：</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
              <li>两光束的光程差为 Δ = 2(d₁ - d₂)。相干干涉的强度公式为 I = I₁ + I₂ + 2√(I₁I₂) · cos(2πΔ/λ)。</li>
              <li><strong>条纹移动：</strong>动镜每移动 λ/2，干涉条纹将移动一个周期的间距，可实现 nm 级微小物理位移的高灵敏测定。</li>
            </ul>
            <p style="margin-bottom:10px"><strong>设计要点：</strong></p>
            <ul style="padding-left:20px">
              <li style="color:var(--accent)">机械稳定性与隔震：由于干涉条纹对波长级的光程变化极度敏感，光路必须搭建在防震台上，并避免空气对流扰动引起的相位抖动。</li>
              <li>偏振退偏效应：如果分束镜 BS 对 s 偏振 and p 偏振的反射和透射率不相等（偏振分束），会降低最终干涉条纹的对比度（可见度 V）。</li>
            </ul>
          </div>`
      };

      const el = document.getElementById('notes-content');
      if (el) el.innerHTML = notes[setup] || '';
    },

    destroy() {
      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';
    }
  };

  App.registerTool('setups', tool);
})();

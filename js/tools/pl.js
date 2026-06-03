/* ============================================

   Optical Toolkit — PL Photoluminescence

   Regular PL, Linear Polarization PL, Circular Polarization PL,

   Three-mode comparison

   ============================================ */



(() => {



  const TOOLTIPS = {

    // Tab 1: Regular PL

    'pl-laser': 'PL 激发光源\n波长选择：需高于被测材料的带隙能量（E_exc > E_gap）\n常用：UV 325nm (HeCd)、405nm (半导体)、532nm (Nd:YAG)\n功率：0.1~50mW，避免样品损伤和非线性效应\n注意：激光波长应远离 PL 发射峰，便于滤波',

    'pl-dm': '二向色镜 (Dichroic Mirror)\n功能：反射激发光，透射 PL 发射光\n截止波长位于 λ_exc 和 λ_em 之间\n反射率 >95% @ λ_exc，透过率 >90% @ λ_em\n注意：需确认二向色镜的光谱截止陡度',

    'pl-obj': '显微物镜 (Microscope Objective)\n功能：聚焦激光到样品微区，收集 PL 发射光\n参数：NA 0.4~0.95，放大倍数 20x~100x\n焦点光斑尺寸 ~λ/(2NA)\n高 NA 物镜收集效率高，适合弱 PL 信号',

    'pl-sample': '样品 (Sample)\n典型材料：半导体、量子点、TMD、钙钛矿、有机发光材料\nPL 来源于光吸收后的辐射复合过程\n注意：避免激光功率过高导致样品发热或光漂白',

    'pl-lpfilter': '长通滤波器 (Long-pass Filter)\n功能：滤除残余激发光，仅透过 PL 发射信号\n要求：OD>6 @ λ_exc，透过率 >90% @ λ_em\n边缘陡度决定可测最短 PL 波长\n与二向色镜串联使用提高滤波效果',

    'pl-spectro': '光谱仪 + CCD 检测器\n功能：记录 PL 光谱 I(λ)\n光栅选择：600 g/mm（宽范围）/ 1200 g/mm（高分辨）\nCCD 制冷至 -70°C 降低暗噪声\n积分时间：0.1~100s，根据信号强度调整',



    // Tab 2: Linear Polarization PL

    'lpl-laser': 'PL 激发光源\n与常规 PL 相同的激发光源\n注意：激光器自身偏振态需稳定\n线偏振 PL 测量不依赖激发偏振方向',

    'lpl-polarizer': '起偏器 P (Polarizer)\n功能：产生高质量线偏振激发光\n类型：格兰-泰勒棱镜（消光比 >10⁵:1）\n薄膜偏振片（经济，消光比 ~10³:1）\n固定激发偏振方向，便于后续偏振分析',

    'lpl-hwp': '半波片 λ/2 (Half-wave Plate)\n功能：旋转线偏振方向\n原理：快轴角度 θ 使偏振方向旋转 2θ\n应用：连续扫描激发偏振角\n需针对激发波长选择零级或多级波片',

    'lpl-dm': '二向色镜\n与常规 PL 相同\n反射激发光，透射 PL 发射光\n偏振态不改变（二向色镜对 s/p 分量透过率略有差异）',

    'lpl-obj': '显微物镜\n聚焦激发光到样品，收集 PL 发射\n注意：高 NA 物镜可能引入退偏效应\n优选反射式物镜（离轴抛物面镜）减少偏振畸变',

    'lpl-sample': '各向异性样品\n典型材料：\n• 晶体材料（各向异性带结构）\n• 纳米棒/纳米线（形状各向异性）\n• 二维材料 TMD（各向异性发射）\n• 液晶材料（取向各向异性）\nPL 偏振度反映材料光学各向异性',

    'lpl-lpfilter': '长通滤波器\n滤除残余激发光\n注意：滤波器可能引入额外偏振效应\n使用接近 45° 入射角可减小偏振依赖',

    'lpl-analyzer': '检偏器 A (Analyzer)\n功能：选择检测 PL 的平行 (I∥) 或垂直 (I⊥) 偏振分量\n旋转 90° 切换检测方向\n消光比 >10³:1 保证偏振度测量精度\n需做 G 因子偏振响应校正',

    'lpl-spectro': '光谱仪 + CCD\n分别记录 I∥(λ) 和 I⊥(λ) 两组光谱\n计算线偏振度 P = (I∥ − I⊥)/(I∥ + I⊥)\n需扣除仪器偏振响应差异',



    // Tab 3: Circular Polarization PL

    'cpl-laser': 'PL 激发光源\n与常规 PL 相同\n圆偏振 PL 中激发偏振态影响自旋极化注入\n圆偏振激发可选择性激发特定自旋态',

    'cpl-polarizer': '起偏器 P\n功能：产生高质量线偏振光\n作为 QWP₁ 的输入\n消光比 >10⁴:1 保证圆偏振纯度',

    'cpl-qwp1': 'λ/4 波片 QWP₁ (Quarter-wave Plate)\n功能：将线偏振光转换为圆偏振光\n快轴 45° → σ⁺ (右旋圆偏振)\n快轴 -45° → σ⁻ (左旋圆偏振)\n需零级波片，避免多级波片的温漂',

    'cpl-dm': '二向色镜\n反射圆偏振激发光，透射 PL 发射光\n注意：二向色镜对 LCP/RCP 反射率可能略有差异\n需标定或使用介电镜减少偏振不对称性',

    'cpl-obj': '显微物镜\n聚焦圆偏振光到样品\n高 NA 物镜的去偏效应需考虑\n收集的 PL 仍保留圆偏振信息',

    'cpl-sample': '手性/自旋极化样品\n典型材料：\n• TMD 材料（MoS₂, WSe₂）：谷极化 PL\n• 自旋极化 PL\n• 手性分子：圆偏振发光 (CPL)\n圆偏振度反映自旋/谷极化程度',

    'cpl-lpfilter': '长通滤波器\n滤除残余激发光\n保留 PL 圆偏振态信息',

    'cpl-qwp2': 'λ/4 波片 QWP₂\n功能：将圆偏振 PL 转换回线偏振光\nσ⁺ → 线偏振（竖直），σ⁻ → 线偏振（水平）\n与 QWP₁ 快轴方向一致\n宽带测量需 achromatic 波片',

    'cpl-analyzer': '检偏器 A\n功能：选择 σ⁺ 或 σ⁻ 对应的线偏振分量\n旋转 90° 切换检测 σ⁺/σ⁻\n两次测量分别得到 Iσ⁺ 和 Iσ⁻',

    'cpl-spectro': '光谱仪 + CCD\n记录 σ⁺ 和 σ⁻ 分量的 PL 光谱\n圆偏振度 P_circ = (Iσ⁺ − Iσ⁻)/(Iσ⁺ + Iσ⁻)',

  };



  const tool = {

    title: 'PL 光致发光',

    description: '常规 PL、线偏振 PL、圆偏振 PL 光路原理与三种模式对比',

    currentTab: 'regular',

    _tooltipEl: null,



    render(container) {

      container.innerHTML = `

        <div class="tool-inputs" style="max-width:100%">

          <div class="card">

            <div class="toggle-group" id="pl-tabs">

              <button class="toggle-btn active" data-tab="regular">常规 PL</button>

              <button class="toggle-btn" data-tab="linear">线偏振 PL</button>

              <button class="toggle-btn" data-tab="circular">圆偏振 PL</button>

              <button class="toggle-btn" data-tab="compare">三种模式对比</button>

            </div>

          </div>



          <!-- Tab 1: Regular PL -->

          <div class="card tab-panel" id="tab-regular">

            <div class="card-title"><span class="icon">💡</span> 常规 PL 光致发光光路</div>

            <div class="help-text" style="margin-bottom:16px">

              光致发光 (PL) 是材料吸收光子后通过辐射复合发射光子的过程。常规 PL 测量总发射强度光谱，不涉及偏振分辨。

            </div>

            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 常规配置信息</div>

                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">

                    <strong>基本参数与测量指南：</strong><br>

                    1. <b>激发波长 (λ_exc)</b>：需高于材料带隙能量。常用紫外 (325nm)、绿光 (532nm) 等。<br>

                    2. <b>二向色镜 (DM)</b>：反射短波激发光，透射长波 PL 发射信号。<br>

                    3. <b>信号收集</b>：同轴后向散射收集配置，效率最高。<br>

                    4. <b>长通滤波 (LP)</b>：关键边缘陡度滤除激发光，OD > 6。<br>

                    5. <b>分析物</b>：测量材料禁带宽度、缺陷态发光及发光效率。

                  </div>

                </div>

              </div>

              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="pl-regular-diagram"></div>

                </div>

              </div>

            </div>

            <div id="pl-regular-notes"></div>

          </div>



          <!-- Tab 2: Linear Polarization PL -->

          <div class="card tab-panel" id="tab-linear" style="display:none">

            <div class="card-title"><span class="icon">📐</span> 线偏振 PL 测试光路</div>

            <div class="help-text" style="margin-bottom:16px">

              线偏振 PL 通过检偏器分别测量平行 (I∥) 和垂直 (I⊥) 偏振分量，计算线偏振度 P = (I∥ − I⊥)/(I∥ + I⊥)，用于研究材料光学各向异性。

            </div>



            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 线偏振配置</div>

                  <div class="toggle-group" id="pl-linear-subconfig" style="margin-bottom:12px;flex-direction:column">

                    <button class="toggle-btn active" data-sub="lin-para" style="text-align:left;padding-left:16px">平行 (Parallel - I∥)</button>

                    <button class="toggle-btn" data-sub="lin-cross" style="text-align:left;padding-left:16px">正交 (Cross - I⊥)</button>

                  </div>

                  <div id="pl-linear-operation-guide" style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">

                    <!-- Content dynamic -->

                  </div>

                </div>

              </div>



              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="pl-linear-diagram"></div>

                </div>

              </div>

            </div>

            <div id="pl-linear-notes"></div>

          </div>



          <!-- Tab 3: Circular Polarization PL -->

          <div class="card tab-panel" id="tab-circular" style="display:none">

            <div class="card-title"><span class="icon">🌀</span> 圆偏振 PL 测试光路</div>

            <div class="help-text" style="margin-bottom:16px">

              圆偏振 PL 通过 λ/4 波片和检偏器分别测量 σ⁺ 和 σ⁻ 分量，计算圆偏振度 P_circ = (Iσ⁺ − Iσ⁻)/(Iσ⁺ + Iσ⁻)，用于研究自旋极化和手性材料。

            </div>



            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 圆偏振配置</div>

                  <div class="toggle-group" id="pl-circular-subconfig" style="margin-bottom:12px;flex-direction:column">

                    <button class="toggle-btn active" data-sub="circ-pp" style="text-align:left;padding-left:16px">σ⁺ σ⁺ (右旋激发 / 右旋检测)</button>

                    <button class="toggle-btn" data-sub="circ-pm" style="text-align:left;padding-left:16px">σ⁺ σ⁻ (右旋激发 / 左旋检测)</button>

                    <button class="toggle-btn" data-sub="circ-mp" style="text-align:left;padding-left:16px">σ⁻ σ⁺ (左旋激发 / 右旋检测)</button>

                    <button class="toggle-btn" data-sub="circ-mm" style="text-align:left;padding-left:16px">σ⁻ σ⁻ (左旋激发 / 左旋检测)</button>

                  </div>

                  <div id="pl-circular-operation-guide" style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent);margin-bottom:12px">

                    <!-- Content dynamic -->

                  </div>

                  <div style="background:var(--bg-primary);border-radius:8px;padding:12px;font-family:var(--font-mono);font-size:12px;border:1px solid var(--border)">

                    <div style="font-weight:700;color:var(--text-secondary);margin-bottom:6px">圆偏振度 (Circular Polarization):</div>

                    <div style="font-size:14px;color:var(--accent);font-weight:700;background:white;padding:8px;border-radius:6px;text-align:center;border:1px solid var(--border)">

                      P_circ = (Iσ⁺ − Iσ⁻) / (Iσ⁺ + Iσ⁻)

                    </div>

                  </div>

                </div>

              </div>



              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="pl-circular-diagram"></div>

                </div>

              </div>

            </div>

            <div id="pl-circular-notes"></div>

          </div>



          <!-- Tab 4: Comparison -->

          <div class="card tab-panel" id="tab-compare" style="display:none">

            <div class="card-title"><span class="icon">⚖️</span> 三种 PL 模式对比</div>

            <div id="pl-compare-content"></div>

          </div>

        </div>



        <div class="tool-results">

          <div class="card" id="pl-component-card">

            <div class="card-title"><span class="icon">📋</span> 元件清单与说明</div>

            <div id="pl-component-list"></div>

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

      this.switchTab('regular');

    },



    bindEvents() {

      document.getElementById('pl-tabs')?.addEventListener('click', (e) => {

        const btn = e.target.closest('.toggle-btn');

        if (!btn) return;

        document.querySelectorAll('#pl-tabs .toggle-btn').forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        this.switchTab(btn.dataset.tab);

      });



      document.getElementById('pl-linear-subconfig')?.addEventListener('click', (e) => {

        const btn = e.target.closest('.toggle-btn');

        if (!btn) return;

        document.querySelectorAll('#pl-linear-subconfig .toggle-btn').forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        this.renderLinear();

      });



      document.getElementById('pl-circular-subconfig')?.addEventListener('click', (e) => {

        const btn = e.target.closest('.toggle-btn');

        if (!btn) return;

        document.querySelectorAll('#pl-circular-subconfig .toggle-btn').forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        this.renderCircular();

      });



      // Bidirectional hover: hover list item to highlight SVG box
      const compList = document.getElementById('pl-component-list');
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

      ['regular', 'linear', 'circular', 'compare'].forEach(t => {

        const el = document.getElementById(`tab-${t}`);

        if (el) el.style.display = t === tab ? '' : 'none';

      });



      const compCard = document.getElementById('pl-component-card');

      if (compCard) compCard.style.display = tab === 'compare' ? 'none' : '';



      switch (tab) {

        case 'regular': this.renderRegular(); break;

        case 'linear': this.renderLinear(); break;

        case 'circular': this.renderCircular(); break;

        case 'compare': this.renderCompare(); break;

      }

    },



    // ==========================================

    // SVG Helper: interactive component box with tooltip

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

          <circle cx="${cx}" cy="${cy-7}" r="2.5" fill="${cleanColor}" filter="url(#pl-glow)"/>

        `;

      } else if (lowerId.includes('spectro') || lbl1.includes('光谱') || lbl2.includes('spectro')) {

        iconSvg = `

          <rect x="${cx-15}" y="${cy-12}" width="30" height="24" rx="2.5" fill="#1C2833" stroke="#2C3E50" stroke-width="1.2"/>

          <line x1="${cx-10}" y1="${cy-7}" x2="${cx-10}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>

          <line x1="${cx-7}" y1="${cy-7}" x2="${cx-7}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>

          <line x1="${cx-4}" y1="${cy-7}" x2="${cx-4}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>

          <rect x="${cx-19}" y="${cy-4}" width="4" height="8" fill="#95A5A6" rx="0.5"/>

          <circle cx="${cx+9}" cy="${cy+6}" r="1.5" fill="#2ECC71" filter="url(#pl-glow)"/>

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

          <text x="${x + 46}" y="${y + h/2 - (label2 ? 5 : -4)}" font-size="12" fill="#1D1D1F" font-weight="700" text-anchor="start">${label1}</text>

          ${label2 ? `<text x="${x + 46}" y="${y + h/2 + 13}" font-size="9.5" fill="#6E6E73" text-anchor="start">${label2}</text>` : ''}

        `;

      } else {

        labelHtml = `

          <text x="${x + w/2}" y="${y + h - 18}" font-size="11.5" fill="#1D1D1F" font-weight="700" text-anchor="middle">${label1}</text>

          ${label2 ? `<text x="${x + w/2}" y="${y + h - 6}" font-size="9" fill="#6E6E73" text-anchor="middle">${label2}</text>` : ''}

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
          document.querySelectorAll(`#pl-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.add('highlighted');
            OPTICS.scrollIntoViewSafe(document.getElementById('pl-component-list'), item);
          });
        });
        el.addEventListener('mouseleave', () => {
          tip.style.display = 'none';
          tip.style.opacity = '0';

          // Remove highlight in component list
          const id = el.dataset.tip;
          document.querySelectorAll(`#pl-component-list .component-list-item[data-id="${id}"]`).forEach(item => {
            item.classList.remove('highlighted');
          });
        });
      });
    },



    // ==========================================

    // Tab 1: Regular PL

    // ==========================================

    renderRegular() {

      const W = 1200, H = 550;



      const svg = `

      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">

        <defs>

          <marker id="pl-arr-e" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#AF52DE"/></marker>

          <marker id="pl-arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#34C759"/></marker>

          <filter id="pl-glow" x="-30%" y="-30%" width="160%" height="160%">

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



        <!-- Section labels -->

        <rect x="30" y="30" width="410" height="28" rx="6" fill="#AF52DE" opacity="0.08"/>

        <text x="235" y="49" font-size="13" fill="#AF52DE" text-anchor="middle" font-weight="700">激发光路 Excitation Path</text>

        <rect x="460" y="30" width="710" height="28" rx="6" fill="#34C759" opacity="0.08"/>

        <text x="815" y="49" font-size="13" fill="#34C759" text-anchor="middle" font-weight="700">发射与检测光路 Emission & Detection Path</text>



        <!-- === Beam Lines (Perfect Alignment with Premium Glow) === -->

        <!-- Excitation beam: Laser to ND -->

        <line x1="150" y1="140" x2="190" y2="140" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#pl-glow)"/>

        <line x1="150" y1="140" x2="190" y2="140" stroke="#AF52DE" stroke-width="2.5" marker-end="url(#pl-arr-e)"/>

        <text x="170" y="128" font-size="10" fill="#AF52DE" text-anchor="middle" font-weight="700">λ_exc</text>

        <!-- Unpolarized indicator -->

        <circle cx="170" cy="95" r="6" fill="none" stroke="#AEAEB2" stroke-width="1.2"/>

        <line x1="164" y1="95" x2="176" y2="95" stroke="#AEAEB2" stroke-width="1"/>

        <line x1="170" y1="89" x2="170" y2="101" stroke="#AEAEB2" stroke-width="1"/>

        <text x="170" y="83" font-size="8" fill="#AEAEB2" text-anchor="middle">非偏振</text>



        <!-- ND to DM -->

        <line x1="300" y1="140" x2="340" y2="140" stroke="#AF52DE" stroke-width="7" opacity="0.25" filter="url(#pl-glow)"/>

        <line x1="300" y1="140" x2="340" y2="140" stroke="#AF52DE" stroke-width="2" marker-end="url(#pl-arr-e)"/>



        <!-- DM reflects excitation down to Objective -->

        <line x1="400" y1="140" x2="400" y2="295" stroke="#AF52DE" stroke-width="7" opacity="0.25" filter="url(#pl-glow)"/>

        <line x1="400" y1="140" x2="400" y2="295" stroke="#AF52DE" stroke-width="2" marker-end="url(#pl-arr-e)"/>



        <!-- Objective to Sample -->

        <line x1="400" y1="365" x2="400" y2="380" stroke="#AF52DE" stroke-width="7" opacity="0.25" filter="url(#pl-glow)"/>

        <line x1="400" y1="365" x2="400" y2="380" stroke="#AF52DE" stroke-width="2" marker-end="url(#pl-arr-e)"/>



        <!-- PL emission: Sample goes up through Objective and DM -->

        <line x1="400" y1="380" x2="400" y2="365" stroke="#34C759" stroke-width="6" stroke-dasharray="6,3" opacity="0.25" filter="url(#pl-glow)"/>

        <line x1="400" y1="380" x2="400" y2="365" stroke="#34C759" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#pl-arr-g)"/>

        <line x1="400" y1="295" x2="400" y2="140" stroke="#34C759" stroke-width="6" stroke-dasharray="6,3" opacity="0.25" filter="url(#pl-glow)"/>

        <line x1="400" y1="295" x2="400" y2="140" stroke="#34C759" stroke-width="2.5" stroke-dasharray="6,3"/>



        <!-- PL transmits straight through DM to the right (to LP Filter) -->

        <line x1="400" y1="140" x2="500" y2="140" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#pl-glow)"/>

        <line x1="400" y1="140" x2="500" y2="140" stroke="#34C759" stroke-width="2.5" marker-end="url(#pl-arr-g)"/>

        <text x="470" y="128" font-size="11" fill="#34C759" text-anchor="middle" font-weight="700">PL 信号</text>



        <!-- LP Filter to Spectrometer -->

        <line x1="610" y1="140" x2="650" y2="140" stroke="#34C759" stroke-width="7" opacity="0.25" filter="url(#pl-glow)"/>

        <line x1="610" y1="140" x2="650" y2="140" stroke="#34C759" stroke-width="2" marker-end="url(#pl-arr-g)"/>

        <!-- === Optical components === -->

        ${this._box(40, 100, 110, 80, '激光器', '#AF52DE', 'Laser Source', 'pl-laser')}

        ${this._box(190, 100, 110, 80, 'ND 滤波片', '#FF9500', 'Power Control', 'pl-ndfilter')}

        ${this._box(340, 100, 120, 80, '二向色镜', '#AF52DE', 'DM', 'pl-dm')}

        ${this._box(350, 295, 100, 70, '物镜', '#0071E3', 'Objective', 'pl-obj')}

        ${this._box(340, 380, 120, 70, '样品', '#34C759', 'Sample', 'pl-sample')}

        ${this._box(500, 100, 110, 80, '长通滤波器', '#FF9500', 'LP Filter', 'pl-lpfilter')}

        ${this._box(650, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'Spectrometer', 'pl-spectro')}



        <!-- Diagonal line on dichroic mirror -->

        <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>

        <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射激发光 ↓</text>

        <text x="430" y="195" font-size="9" fill="#34C759" text-anchor="start" font-weight="600">透射 PL ↑</text>







        <!-- === PL Physics Principle Box === -->

        <rect x="490" y="220" width="310" height="170" rx="10" fill="white" stroke="#E5E5EA" stroke-width="1.5"/>

        <text x="510" y="245" font-size="13" fill="#1D1D1F" font-weight="700">PL 发光物理过程</text>

        

        <circle cx="520" cy="275" r="10" fill="#AF52DE" opacity="0.1"/><text x="520" y="279" font-size="11" fill="#AF52DE" text-anchor="middle" font-weight="700">1</text>

        <text x="540" y="279" font-size="11" fill="#1D1D1F" font-weight="600">光吸收 (Absorption)</text>

        <text x="540" y="293" font-size="10" fill="#6E6E73">样品吸收入射光子，电子向高能级跃迁</text>



        <circle cx="520" cy="315" r="10" fill="#34C759" opacity="0.1"/><text x="520" y="319" font-size="11" fill="#34C759" text-anchor="middle" font-weight="700">2</text>

        <text x="540" y="319" font-size="11" fill="#1D1D1F" font-weight="600">非辐射弛豫 (Relaxation)</text>

        <text x="540" y="333" font-size="10" fill="#6E6E73">激发态电子通过发声子快速弛豫到带底</text>



        <circle cx="520" cy="355" r="10" fill="#34C759" opacity="0.1"/><text x="520" y="359" font-size="11" fill="#34C759" text-anchor="middle" font-weight="700">3</text>

        <text x="540" y="359" font-size="11" fill="#1D1D1F" font-weight="600">辐射复合 (Emission)</text>

        <text x="540" y="373" font-size="10" fill="#6E6E73">电子跃迁回低能级并发射光子(带隙PL)</text>



        <!-- === Typical Spectrum Plot (Far Right) === -->

        <rect x="830" y="90" width="330" height="290" rx="10" fill="white" stroke="#E5E5EA" stroke-width="1.5"/>

        <text x="995" y="118" font-size="12" fill="#1D1D1F" font-weight="700" text-anchor="middle">微区 PL 光谱示意图</text>

        

        <!-- Coordinates -->

        <line x1="880" y1="140" x2="880" y2="330" stroke="#8E8E93" stroke-width="1.5"/>

        <line x1="880" y1="330" x2="1130" y2="330" stroke="#8E8E93" stroke-width="1.5"/>

        <text x="1130" y="348" font-size="10" fill="#8E8E93" text-anchor="end">波长 λ (nm)</text>

        <text x="872" y="145" font-size="10" fill="#8E8E93" text-anchor="end" writing-mode="tb">光强 Intensity</text>



        <!-- Excitation Peak (532nm) -->

        <path d="M 915 330 L 920 150 L 925 330" fill="none" stroke="#AF52DE" stroke-width="2"/>

        <text x="920" y="140" font-size="9" fill="#AF52DE" text-anchor="middle">激发激光 (532 nm)</text>



        <!-- LP Filter Cutoff (550nm) -->

        <line x1="965" y1="140" x2="965" y2="330" stroke="#FF9500" stroke-width="1.5" stroke-dasharray="4,2"/>

        <text x="965" y="132" font-size="9" fill="#FF9500" text-anchor="middle">滤波截止 (550 nm)</text>



        <!-- PL Emission Curve (Broad asymmetric peaking at 650nm) -->

        <path d="M 970 330 Q 1010 180 1050 180 T 1125 330" fill="rgba(52, 199, 89, 0.06)" stroke="#34C759" stroke-width="3"/>

        <text x="1050" y="172" font-size="10" fill="#34C759" text-anchor="middle" font-weight="700">样品 PL 谱</text>

        <text x="1050" y="348" font-size="9" fill="#6E6E73" text-anchor="middle">Stokes位移 > 100 nm</text>



        <!-- === Polarization timeline-style state annotations at the bottom === -->

        <rect x="30" y="480" width="${W - 60}" height="50" rx="8" fill="#F5F5F7" stroke="#E5E5EA"/>

        <text x="50" y="509" font-size="12" fill="#1D1D1F" font-weight="700">偏振态与信号流：</text>

        <text x="150" y="509" font-size="11" fill="#6E6E73">

          激发源(非偏振) → ND(功率衰减) → 二向色镜(反射激发) → 物镜(聚焦样品) → 样品(PL辐射) → 物镜(收集) → 二向色镜(透射信号) → 长通滤波器(滤除532nm) → 谱仪检测

        </text>

      </svg>`;



      document.getElementById('pl-regular-diagram').innerHTML = svg;

      this._attachTooltips();



      document.getElementById('pl-regular-notes').innerHTML = `

        <div style="margin-top:16px;background:var(--bg-primary);border-radius:12px;padding:16px">

          <div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px">常规 PL 典型配置要点</div>

          <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">

            <ul style="padding-left:20px">

              <li><strong>激发波长选择：</strong>应高于样品带隙能量，常用 UV (325nm)、可见 (532nm)、近红外 (785nm)</li>

              <li><strong>滤波组合：</strong>二向色镜 + 长通滤波器串联，OD>6 滤除激发光</li>

              <li><strong>光谱范围：</strong>覆盖样品全部发光峰，光栅选择与光谱范围匹配</li>

              <li><strong>功率控制：</strong>避免过高功率导致样品发热、光漂白或非线性效应</li>

              <li><strong>空间分辨：</strong>共聚焦配置可实现 ~1μm 空间分辨 mapping</li>

            </ul>

          </div>

        </div>

      `;



      this._renderComponentList('regular');

    },



    // ==========================================

    // Tab 2: Linear Polarization PL

    // ==========================================

    renderLinear() {

      const W = 1200, H = 550;

      const subconfig = document.querySelector('#pl-linear-subconfig .active')?.dataset.sub || 'lin-para';

      const isPara = subconfig === 'lin-para';



      const polState = (x, y, label, desc, color) => `

        <rect x="${x - 45}" y="${y}" width="90" height="36" rx="6" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>

        <text x="${x}" y="${y + 15}" font-size="10" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>

        <text x="${x}" y="${y + 29}" font-size="8" fill="var(--text-secondary)" text-anchor="middle">${desc}</text>`;



      const svg = `

      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">

        <defs>

          <marker id="lpl-arr-e" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#AF52DE"/></marker>

          <marker id="lpl-arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#34C759"/></marker>

          <filter id="lpl-glow" x="-30%" y="-30%" width="160%" height="160%">

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



        <!-- Section labels -->

        <rect x="30" y="30" width="500" height="28" rx="6" fill="#AF52DE" opacity="0.08"/>

        <text x="280" y="49" font-size="13" fill="#AF52DE" text-anchor="middle" font-weight="700">激发光路 (含偏振控制)</text>

        <rect x="540" y="30" width="630" height="28" rx="6" fill="#0071E3" opacity="0.08"/>

        <text x="855" y="49" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">发射与偏振检测光路 (PR-PL)</text>



        <!-- === Beam Lines === -->

        <!-- Laser to P -->

        <line x1="150" y1="140" x2="190" y2="140" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#lpl-glow)"/>

        <line x1="150" y1="140" x2="190" y2="140" stroke="#AF52DE" stroke-width="2" marker-end="url(#lpl-arr-e)"/>

        

        <!-- P to DM -->

        <line x1="300" y1="140" x2="340" y2="140" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#lpl-glow)"/>

        <line x1="300" y1="140" x2="340" y2="140" stroke="#AF52DE" stroke-width="2" marker-end="url(#lpl-arr-e)"/>

        

        <!-- DM down to HWP to Objective to Sample -->

        <line x1="400" y1="140" x2="400" y2="380" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#lpl-glow)"/>

        <line x1="400" y1="140" x2="400" y2="380" stroke="#AF52DE" stroke-width="2" marker-end="url(#lpl-arr-e)"/>

        

        <!-- Sample PL up through Objective, HWP, DM -->

        <line x1="400" y1="380" x2="400" y2="140" stroke="#34C759" stroke-width="6" stroke-dasharray="6,3" opacity="0.3" filter="url(#lpl-glow)"/>

        <line x1="400" y1="380" x2="400" y2="140" stroke="#34C759" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#lpl-arr-g)"/>

        

        <!-- DM straight through LP to A to Spectro -->

        <line x1="400" y1="140" x2="800" y2="140" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#lpl-glow)"/>

        <line x1="400" y1="140" x2="800" y2="140" stroke="#34C759" stroke-width="2.5" marker-end="url(#lpl-arr-g)"/>

        <!-- === Optical components === -->

        ${this._box(40, 100, 110, 80, '激光', '#AF52DE', 'Laser Source', 'lpl-laser')}

        ${this._box(190, 100, 110, 80, '起偏 P', '#AF52DE', '固定 0°', 'lpl-polarizer')}

        ${this._box(340, 100, 120, 80, '二向色镜', '#AF52DE', 'DM', 'lpl-dm')}

        ${this._box(350, 210, 100, 70, '半波片', '#AF52DE', 'HWP λ/2', 'lpl-hwp')}

        ${this._box(350, 295, 100, 70, '物镜', '#0071E3', 'Objective', 'lpl-obj')}

        ${this._box(340, 380, 120, 70, '样品', '#34C759', 'Sample', 'lpl-sample')}

        ${this._box(500, 100, 110, 80, '长通 LP', '#FF9500', 'LP Filter', 'lpl-lpfilter')}

        ${this._box(650, 100, 110, 80, '检偏 A', '#0071E3', isPara ? '设为 0°' : '设为 90°', 'lpl-analyzer')}

        ${this._box(800, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'Spectrometer', 'lpl-spectro')}



        <!-- Diagonal line on dichroic mirror -->

        <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>







        <!-- Polarization annotations -->

        <!-- After P -->

        <line x1="240" y1="90" x2="240" y2="110" stroke="#AF52DE" stroke-width="2"/>

        <text x="240" y="80" font-size="9" fill="#AF52DE" text-anchor="middle">↕ 线偏振</text>

        

        <!-- Between HWP and Objective (Rotated) -->

        <line x1="380" y1="225" x2="390" y2="245" stroke="#AF52DE" stroke-width="2"/>

        <text x="415" y="240" font-size="9" fill="#AF52DE" text-anchor="start">↗ 旋转</text>

        

        <!-- After A -->

        <line x1="700" y1="90" x2="700" y2="110" stroke="#0071E3" stroke-width="2"/>

        <text x="700" y="80" font-size="9" fill="#0071E3" text-anchor="middle">选择 ${isPara ? 'I∥' : 'I⊥'}</text>



        <!-- Highlight Overlays for Active Modules -->

        <!-- HWP Highlight Box (操作执行模块) -->

        <rect x="346" y="206" width="108" height="78" rx="8" fill="none" stroke="#FF9500" stroke-width="2.5" stroke-dasharray="4,2"/>

        <rect x="346" y="190" width="108" height="15" rx="3" fill="#FF9500"/>

        <text x="400" y="201" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 旋转扫描 (操作执行)</text>



        <!-- Analyzer A Highlight Box -->

        <rect x="646" y="96" width="118" height="88" rx="10" fill="none" stroke="#8E8E93" stroke-width="1.5" stroke-dasharray="4,4"/>

        <text x="705" y="91" font-size="9" fill="#8E8E93" text-anchor="middle" font-weight="700">${isPara ? '⚙️ 固定 0°' : '⚙️ 固定 90°'}</text>



        <!-- === Explanation & Formula (Right side) === -->

        <rect x="960" y="100" width="210" height="280" rx="10" fill="white" stroke="#E5E5EA" stroke-width="1.5"/>

        <text x="1065" y="130" font-size="13" fill="#0071E3" font-weight="700" text-anchor="middle">线偏振 PL 物理量</text>

        

        <!-- Formula -->

        <rect x="975" y="150" width="180" height="50" rx="8" fill="#0071E3" opacity="0.06" stroke="#0071E3" stroke-width="1"/>

        <text x="1065" y="166" font-size="9" fill="#0071E3" text-anchor="middle" font-weight="600">线偏振度 (DOLP)</text>

        <text x="1065" y="188" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">P = (I∥ − I⊥) / (I∥ + I⊥)</text>



        <circle cx="985" cy="230" r="3.5" fill="#AF52DE"/><text x="998" y="234" font-size="10.5" fill="var(--text-primary)">I∥：A 与 P 平行</text>

        <circle cx="985" cy="260" r="3.5" fill="#FF9500"/><text x="998" y="264" font-size="10.5" fill="var(--text-primary)">I⊥：A 与 P 垂直</text>

        

        <text x="1065" y="305" font-size="9.5" fill="var(--text-secondary)" text-anchor="middle">旋转 HWP 改变偏振角 θ</text>

        <text x="1065" y="325" font-size="9.5" fill="var(--text-secondary)" text-anchor="middle">以消除谱仪的偏振响应误差</text>

        <text x="1065" y="345" font-size="9.5" fill="var(--text-secondary)" text-anchor="middle">或固定 HWP 并旋转 A</text>



        <!-- === Polarization timeline-style state annotations at the bottom === -->

        <rect x="30" y="475" width="${W - 60}" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border)"/>

        <text x="50" y="504" font-size="12" fill="var(--text-primary)" font-weight="700">偏振流：</text>

        

        ${polState(140, 482, '非偏振', '激光', '#AEAEB2')}

        ${polState(250, 482, '↕ 线偏振', '起偏器 P', '#AF52DE')}

        ${polState(360, 482, '经 DM', '反射', '#AF52DE')}

        ${polState(470, 482, '↗ 旋转', '经 HWP', '#AF52DE')}

        ${polState(590, 482, '部分偏振', 'PL发射(上行)', '#34C759')}

        ${polState(710, 482, '反向旋转', '经 HWP', '#34C759')}

        ${polState(820, 482, '经 DM', '透射', '#34C759')}

        ${polState(930, 482, isPara ? 'I∥ (0°)' : 'I⊥ (90°)', '检偏器 A', '#0071E3')}

        ${polState(1060, 482, 'DOLP 计算', '输出偏振度', 'var(--text-primary)')}

      </svg>`;



      document.getElementById('pl-linear-diagram').innerHTML = svg;

      this._attachTooltips();



      const guideHtml = `

        <strong>线偏振测量指南 (${isPara ? '平行 Parallel' : '正交 Cross'})：</strong><br>

        1. <b>入射端：</b>起偏器 P 固定在 0° 方向。<br>

        2. <b>操作执行（转动）：</b>连续旋转 <span style="color:#FF9500;font-weight:700">半波片 HWP</span> 进行角度扫描，步进通常为 5°~10°。<br>

        3. <b>探测端：</b>将检偏器 A 固定在 <b>${isPara ? '0° (平行)' : '90° (正交)'}</b>。<br>

        4. <b>实验操作：</b>测试中，需手动或通过电动马达连续旋转 <span style="color:#FF9500;font-weight:700">半波片 HWP</span>，并在每个角度记录 PL 光谱。

      `;

      document.getElementById('pl-linear-operation-guide').innerHTML = guideHtml;



      document.getElementById('pl-linear-notes').innerHTML = `

        <div style="margin-top:16px;background:var(--bg-primary);border-radius:12px;padding:16px">

          <div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px">线偏振 PL 测量要点</div>

          <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">

            <p style="margin-bottom:10px"><strong>G 因子修正：</strong></p>

            <div style="background:white;padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12px;margin:8px 0;color:var(--accent)">

              P_corrected = [P_raw − G·P_raw²] / [1 − G·P_raw]<br>

              G = I∥_cal / I⊥_cal（用非偏振光源标定仪器偏振比）

            </div>

            <p style="margin-bottom:10px"><strong>典型材料与应用：</strong></p>

            <ul style="padding-left:20px">

              <li><strong>晶体材料：</strong>各向异性带结构导致不同晶向 PL 偏振度不同</li>

              <li><strong>纳米棒/纳米线：</strong>形状各向异性，长轴方向发射偏振度可达 0.5~0.9</li>

              <li><strong>二维材料 TMD：</strong>各向异性 PL 可用于确定晶轴取向</li>

              <li><strong>粉末/多晶：</strong>各方向平均后 P → 0，需单晶或取向样品</li>

            </ul>

          </div>

        </div>

      `;



      this._renderComponentList('linear');

    },



    // ==========================================

    // Tab 3: Circular Polarization PL

    // ==========================================

    renderCircular() {

      const W = 1200, H = 550;

      const subconfig = document.querySelector('#pl-circular-subconfig .active')?.dataset.sub || 'circ-pp';

      

      let q1Angle = '+45°';

      let q2Angle = '+45°';

      let pType = 'σ⁺';

      let dType = 'σ⁺';

      

      if (subconfig === 'circ-pm') {

        q1Angle = '+45°'; q2Angle = '-45°'; pType = 'σ⁺'; dType = 'σ⁻';

      } else if (subconfig === 'circ-mp') {

        q1Angle = '-45°'; q2Angle = '+45°'; pType = 'σ⁻'; dType = 'σ⁺';

      } else if (subconfig === 'circ-mm') {

        q1Angle = '-45°'; q2Angle = '-45°'; pType = 'σ⁻'; dType = 'σ⁻';

      }



      const polState = (x, y, label, desc, color) => `

        <rect x="${x - 45}" y="${y}" width="90" height="36" rx="6" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>

        <text x="${x}" y="${y + 15}" font-size="10" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>

        <text x="${x}" y="${y + 29}" font-size="8" fill="var(--text-secondary)" text-anchor="middle">${desc}</text>`;



      const svg = `

      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">

        <defs>

          <marker id="cpl-arr-e" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#AF52DE"/></marker>

          <marker id="cpl-arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#34C759"/></marker>

          <marker id="cpl-arr-b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>

          <filter id="cpl-glow" x="-30%" y="-30%" width="160%" height="160%">

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



        <!-- Section labels -->

        <rect x="30" y="30" width="500" height="28" rx="6" fill="#AF52DE" opacity="0.08"/>

        <text x="280" y="49" font-size="13" fill="#AF52DE" text-anchor="middle" font-weight="700">激发光路 (含偏振控制)</text>

        <rect x="540" y="30" width="630" height="28" rx="6" fill="#0071E3" opacity="0.08"/>

        <text x="855" y="49" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">发射与偏振检测光路 (PR-PL)</text>



        <!-- === Beam Lines === -->

        <!-- Laser to P -->

        <line x1="150" y1="140" x2="180" y2="140" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#cpl-glow)"/>

        <!-- P to QWP1 -->

        <line x1="290" y1="140" x2="320" y2="140" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#cpl-glow)"/>

        <!-- QWP1 to DM -->

        <line x1="430" y1="140" x2="460" y2="140" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#cpl-glow)"/>

        

        <!-- DM down to Objective to Sample -->

        <line x1="520" y1="140" x2="520" y2="310" stroke="#AF52DE" stroke-width="8" opacity="0.3" filter="url(#cpl-glow)"/>

        <!-- Sample PL up -->

        <line x1="520" y1="310" x2="520" y2="140" stroke="#34C759" stroke-width="6" stroke-dasharray="6,3" opacity="0.3" filter="url(#cpl-glow)"/>

        

        <!-- DM straight through LP to QWP2 to A to Spectro -->

        <line x1="520" y1="140" x2="1040" y2="140" stroke="#34C759" stroke-width="8" opacity="0.3" filter="url(#cpl-glow)"/>

        

        <!-- Core lines -->

        <line x1="150" y1="140" x2="460" y2="140" stroke="#AF52DE" stroke-width="2" marker-end="url(#cpl-arr-e)"/>

        <line x1="520" y1="140" x2="520" y2="310" stroke="#AF52DE" stroke-width="2" marker-end="url(#cpl-arr-e)"/>

        <line x1="520" y1="310" x2="520" y2="140" stroke="#34C759" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#cpl-arr-g)"/>

        <line x1="520" y1="140" x2="1040" y2="140" stroke="#34C759" stroke-width="2.5" marker-end="url(#cpl-arr-g)"/>



        <!-- === Optical components === -->

        ${this._box(40, 100, 110, 80, '激光', '#AF52DE', 'Laser Source', 'cpl-laser')}

        ${this._box(180, 100, 110, 80, '起偏 P', '#AF52DE', '固定 0°', 'cpl-polarizer')}

        ${this._box(320, 100, 110, 80, 'QWP 1', '#AF52DE', `快轴 ${q1Angle}`, 'cpl-qwp1')}

        ${this._box(460, 100, 120, 80, '二向色镜', '#AF52DE', 'DM', 'cpl-dm')}

        ${this._box(470, 210, 100, 70, '物镜', '#0071E3', 'Objective', 'cpl-obj')}

        ${this._box(460, 310, 120, 70, '样品', '#34C759', 'Sample', 'cpl-sample')}

        ${this._box(620, 100, 110, 80, '长通 LP', '#FF9500', 'LP Filter', 'cpl-lpfilter')}

        ${this._box(760, 100, 110, 80, 'QWP 2', '#0071E3', `快轴 ${q2Angle}`, 'cpl-qwp2')}

        ${this._box(900, 100, 110, 80, '检偏 A', '#0071E3', '固定 90°', 'cpl-analyzer')}

        ${this._box(1040, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'Spectrometer', 'cpl-spectro')}



        <!-- Diagonal line on dichroic mirror -->

        <line x1="485" y1="175" x2="555" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>



        <!-- Polarization annotations -->

        <!-- After P -->

        <line x1="230" y1="90" x2="230" y2="110" stroke="#AF52DE" stroke-width="2"/>

        <text x="230" y="80" font-size="9" fill="#AF52DE" text-anchor="middle">↕ 线偏振</text>

        <!-- After QWP1 -->

        <circle cx="370" cy="100" r="6" fill="none" stroke="#AF52DE" stroke-width="1.5"/>

        <polygon points="378,100 375,97 375,103" fill="#AF52DE" transform="rotate(${q1Angle === '+45°' ? 0 : 180}, 370, 100)"/>

        <text x="370" y="80" font-size="9" fill="#AF52DE" text-anchor="middle">${pType} 圆偏振</text>

        <!-- Sample Emission -->

        <text x="590" y="240" font-size="10" fill="#34C759" text-anchor="middle" font-weight="600">σ⁺ + σ⁻ 混合发光</text>

        <!-- After QWP2 -->

        <line x1="860" y1="90" x2="860" y2="110" stroke="#0071E3" stroke-width="2"/>

        <text x="860" y="80" font-size="9" fill="#0071E3" text-anchor="middle">圆→线</text>



        <!-- Highlight Overlays for Active Modules -->

        <!-- QWP 1 Highlight Box (操作执行模块) -->

        <rect x="316" y="96" width="118" height="88" rx="10" fill="none" stroke="#FF9500" stroke-width="2.5" stroke-dasharray="4,2"/>

        <rect x="316" y="80" width="118" height="15" rx="3" fill="#FF9500"/>

        <text x="375" y="91" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 转至 ${q1Angle} (操作执行)</text>



        <!-- QWP 2 Highlight Box (操作执行模块) -->

        <rect x="756" y="96" width="118" height="88" rx="10" fill="none" stroke="#FF9500" stroke-width="2.5" stroke-dasharray="4,2"/>

        <rect x="756" y="80" width="118" height="15" rx="3" fill="#FF9500"/>

        <text x="815" y="91" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 转至 ${q2Angle} (操作执行)</text>



        <!-- Analyzer Highlight Box -->

        <rect x="896" y="96" width="118" height="88" rx="10" fill="none" stroke="#8E8E93" stroke-width="1.5" stroke-dasharray="4,4"/>

        <text x="955" y="91" font-size="9" fill="#8E8E93" text-anchor="middle" font-weight="700">⚙️ 固定 90°</text>



        <!-- === Polarization timeline-style state annotations at the bottom === -->

        <rect x="30" y="475" width="${W - 60}" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border)"/>

        <text x="50" y="504" font-size="12" fill="var(--text-primary)" font-weight="700">偏振流：</text>

        

        ${polState(140, 482, '非偏振', '激光', '#AEAEB2')}

        ${polState(250, 482, '↕ 线偏振', '起偏器 P', '#AF52DE')}

        ${polState(360, 482, `${pType} 圆偏振`, 'QWP 1', '#AF52DE')}

        ${polState(470, 482, `${pType} 激发`, '经物镜', '#0071E3')}

        ${polState(590, 482, 'σ⁺+σ⁻ 混合', 'PL发射', '#34C759')}

        ${polState(710, 482, '去除激发光', 'LP 滤波', '#FF9500')}

        ${polState(820, 482, '圆→线转换', 'QWP 2', '#0071E3')}

        ${polState(930, 482, `I(${pType}, ${dType})`, '检偏器 A', '#0071E3')}

        ${polState(1060, 482, '自旋/谷分析', '计算偏振度', 'var(--text-primary)')}

      </svg>`;



      document.getElementById('pl-circular-diagram').innerHTML = svg;

      this._attachTooltips();



      const guideHtml = `

        <strong>圆偏振测量指南 (${pType}${dType} 配置)：</strong><br>

        1. <b>入射端（转动）：</b>起偏器 P 固定在 0°。手动旋转激发端 <span style="color:#FF9500;font-weight:700">QWP 1</span> 至 <b>${q1Angle}</b>，产生 <b>${pType}</b> 圆偏振激发光。<br>

        2. <b>探测端（转动）：</b>将收集端 <span style="color:#FF9500;font-weight:700">QWP 2</span> 手动旋转至 <b>${q2Angle}</b>，检偏器 A 固定在 <b>90°</b>，从而提取 <b>${dType}</b> 的 PL 圆偏振分量。<br>

        3. <b>操作执行：</b>实验前需要手动调节旋转激发端 <span style="color:#FF9500;font-weight:700">QWP 1 (${q1Angle})</span> 和收集端 <span style="color:#FF9500;font-weight:700">QWP 2 (${q2Angle})</span> 的快轴角度。

      `;

      document.getElementById('pl-circular-operation-guide').innerHTML = guideHtml;



      document.getElementById('pl-circular-notes').innerHTML = `

        <div style="margin-top:16px;background:var(--bg-primary);border-radius:12px;padding:16px">

          <div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px">圆偏振 PL 测量要点</div>

          <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">

            <p style="margin-bottom:10px"><strong>波片校准：</strong></p>

            <ul style="padding-left:20px;margin-bottom:12px">

              <li>QWP₁：调起偏器 P 使输出最大，插入 QWP 旋转至消光，快轴与 P 成 45°</li>

              <li>QWP₂：用已知圆偏振光校准，旋转使检偏器输出不随旋转变化</li>

              <li>波片需针对使用波长选择，宽带测量需 achromatic 波片</li>

            </ul>

            <p style="margin-bottom:10px"><strong>自旋极化与谷极化：</strong></p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">

              <div style="background:white;border-radius:8px;padding:12px">

                <div style="font-weight:600;color:var(--accent);margin-bottom:4px">自旋极化 (GaAs, InP)</div>

                <div style="font-size:12px">圆偏振激发选择性激发自旋向上/向下电子。自旋极化率 = (n↑ − n↓)/(n↑ + n↓)，反映自旋弛豫机制。</div>

              </div>

              <div style="background:white;border-radius:8px;padding:12px">

                <div style="font-weight:600;color:var(--orange);margin-bottom:4px">谷极化 (TMD 材料)</div>

                <div style="font-size:12px">MoS₂/WSe₂ 的 K/K' 谷选择定则：σ⁺ 激发 K 谷，σ⁻ 激发 K' 谷。谷极化度反映谷间散射速率。</div>

              </div>

            </div>

            <p style="margin-bottom:10px"><strong>手性材料：</strong></p>

            <ul style="padding-left:20px">

              <li>手性分子的圆偏振发光 (CPL) 不对称因子 g_lum = 2(Iσ⁺ − Iσ⁻)/(Iσ⁺ + Iσ⁻)</li>

              <li>典型 CPL 材料：螺旋烯、手性钙钛矿、手性液晶</li>

              <li>低温 + 磁场可增强自旋极化，延长自旋弛豫时间</li>

            </ul>

          </div>

        </div>

      `;



      this._renderComponentList('circular');

    },



    // ==========================================

    // Tab 4: Three-mode comparison

    // ==========================================

    renderCompare() {

      document.getElementById('pl-compare-content').innerHTML = `

        <!-- Comparison table -->

        <div style="font-size:14px;font-weight:700;margin-bottom:16px">三种 PL 模式对比表</div>

        <div style="overflow-x:auto;margin-bottom:24px">

          <table style="width:100%;border-collapse:collapse;font-size:13px">

            <thead>

              <tr style="border-bottom:2px solid var(--border)">

                <th style="text-align:left;padding:12px;color:var(--text-secondary);font-weight:600;white-space:nowrap">对比项</th>

                <th style="text-align:center;padding:12px;color:#AF52DE;font-weight:600">常规 PL</th>

                <th style="text-align:center;padding:12px;color:#0071E3;font-weight:600">线偏振 PL</th>

                <th style="text-align:center;padding:12px;color:#FF9500;font-weight:600">圆偏振 PL</th>

              </tr>

            </thead>

            <tbody>

              ${[

                ['额外元件', '无', 'P + HWP + A', 'P + QWP₁ + QWP₂ + A'],

                ['测量量', 'I(λ)', 'I∥(λ), I⊥(λ)', 'Iσ⁺(λ), Iσ⁻(λ)'],

                ['物理量', '光谱强度', '线偏振度 P', '圆偏振度 P_circ'],

                ['信息内容', '能级/发光效率', '各向异性/取向', '自旋极化/手性'],

                ['典型材料', '所有发光材料', '晶体/纳米棒/2D材料', 'TMD/GaAs/手性分子'],

                ['光路复杂度', '★☆☆ 简单', '★★☆ 中等', '★★★ 较复杂'],

                ['校准需求', '光谱响应校正', 'G因子偏振校正', '波片校准 + G因子'],

                ['数据处理', '光谱基线校正', '计算 P(λ)', '计算 P_circ(λ)'],

              ].map(([item, a, b, c]) => `

                <tr style="border-bottom:1px solid var(--border-light)">

                  <td style="padding:10px 12px;font-weight:500">${item}</td>

                  <td style="padding:10px 12px;text-align:center">${a}</td>

                  <td style="padding:10px 12px;text-align:center;color:var(--accent)">${b}</td>

                  <td style="padding:10px 12px;text-align:center;color:var(--orange)">${c}</td>

                </tr>

              `).join('')}

            </tbody>

          </table>

        </div>



        <!-- Optical path symbol comparison -->

        <div style="font-size:14px;font-weight:700;margin-bottom:16px">光路符号对比</div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">

          <div style="background:white;border:2px solid #AF52DE;border-radius:12px;padding:20px;text-align:center">

            <div style="font-size:15px;font-weight:700;color:#AF52DE;margin-bottom:14px">常规 PL</div>

            <div style="font-family:var(--font-mono);font-size:13px;line-height:2.2;color:var(--text-primary)">

              <span style="color:#AF52DE;font-weight:600">激光器</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">DM</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#0071E3">物镜</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#34C759;font-weight:600">样品</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#FF9500">LP</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#1D1D1F;font-weight:600">光谱仪</span>

            </div>

            <div style="font-size:11px;color:var(--text-tertiary);margin-top:10px">无偏振选择元件</div>

            <div style="margin-top:12px;background:var(--bg-primary);border-radius:8px;padding:10px">

              <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px">测量结果</div>

              <div style="font-family:var(--font-mono);font-size:18px;color:#AF52DE;font-weight:700">I(&lambda;)</div>

            </div>

          </div>



          <div style="background:white;border:2px solid #0071E3;border-radius:12px;padding:20px;text-align:center">

            <div style="font-size:15px;font-weight:700;color:#0071E3;margin-bottom:14px">线偏振 PL</div>

            <div style="font-family:var(--font-mono);font-size:12px;line-height:2.2;color:var(--text-primary)">

              <span style="color:#AF52DE;font-weight:600">激光器</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">P</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">HWP</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">DM</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#0071E3">物镜</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#34C759;font-weight:600">样品</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#FF9500">LP</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#0071E3;font-weight:600">A</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#1D1D1F;font-weight:600">光谱仪</span>

            </div>

            <div style="font-size:11px;color:var(--text-tertiary);margin-top:10px">P=起偏器, HWP=半波片, A=检偏器</div>

            <div style="margin-top:12px;background:var(--bg-primary);border-radius:8px;padding:10px">

              <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px">测量结果</div>

              <div style="font-family:var(--font-mono);font-size:16px;color:#0071E3;font-weight:700">I∥(&lambda;), I⊥(&lambda;)</div>

              <div style="font-family:var(--font-mono);font-size:14px;color:#0071E3;font-weight:600;margin-top:4px">P = (I∥−I⊥)/(I∥+I⊥)</div>

            </div>

          </div>



          <div style="background:white;border:2px solid #FF9500;border-radius:12px;padding:20px;text-align:center">

            <div style="font-size:15px;font-weight:700;color:#FF9500;margin-bottom:14px">圆偏振 PL</div>

            <div style="font-family:var(--font-mono);font-size:11px;line-height:2.2;color:var(--text-primary)">

              <span style="color:#AF52DE;font-weight:600">激光器</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">P</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">QWP₁</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#AF52DE">DM</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#0071E3">物镜</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#34C759;font-weight:600">样品</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#FF9500">LP</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#0071E3">QWP₂</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#0071E3;font-weight:600">A</span>

              <span style="color:#AEAEB2"> → </span>

              <span style="color:#1D1D1F;font-weight:600">光谱仪</span>

            </div>

            <div style="font-size:11px;color:var(--text-tertiary);margin-top:10px">QWP=λ/4波片, 需两级波片+检偏器</div>

            <div style="margin-top:12px;background:var(--bg-primary);border-radius:8px;padding:10px">

              <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px">测量结果</div>

              <div style="font-family:var(--font-mono);font-size:16px;color:#FF9500;font-weight:700">Iσ⁺(&lambda;), Iσ⁻(&lambda;)</div>

              <div style="font-family:var(--font-mono);font-size:14px;color:#FF9500;font-weight:600;margin-top:4px">P_circ = (Iσ⁺−Iσ⁻)/(Iσ⁺+Iσ⁻)</div>

            </div>

          </div>

        </div>



        <!-- When to use which -->

        <div style="font-size:14px;font-weight:700;margin-bottom:12px">选择指南</div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">

          <div style="background:var(--bg-primary);border-radius:10px;padding:16px;border-left:4px solid #AF52DE">

            <div style="font-weight:700;color:#AF52DE;margin-bottom:8px">选择常规 PL</div>

            <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">

              <ul style="padding-left:16px">

                <li>测量发光峰位、峰宽、强度</li>

                <li>评估量子产率和发光效率</li>

                <li>温度/功率依赖光谱</li>

                <li>空间分辨 mapping</li>

                <li>不需要偏振信息时</li>

              </ul>

            </div>

          </div>

          <div style="background:var(--bg-primary);border-radius:10px;padding:16px;border-left:4px solid #0071E3">

            <div style="font-weight:700;color:#0071E3;margin-bottom:8px">选择线偏振 PL</div>

            <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">

              <ul style="padding-left:16px">

                <li>研究晶体光学各向异性</li>

                <li>确定纳米棒/纳米线取向</li>

                <li>测量 2D 材料各向异性发射</li>

                <li>应力/应变诱导双折射</li>

                <li>液晶材料取向分析</li>

              </ul>

            </div>

          </div>

          <div style="background:var(--bg-primary);border-radius:10px;padding:16px;border-left:4px solid #FF9500">

            <div style="font-weight:700;color:#FF9500;margin-bottom:8px">选择圆偏振 PL</div>

            <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">

              <ul style="padding-left:16px">

                <li>测量 TMD 谷极化度</li>

                <li>研究半导体自旋极化发光</li>

                <li>表征手性分子 CPL</li>

                <li>自旋弛豫动力学</li>

                <li>拓扑绝缘体表面态</li>

              </ul>

            </div>

          </div>

        </div>

      `;

    },



    // ==========================================

    // Component list (shared)

    // ==========================================

    _renderComponentList(mode) {

      const components = {

        regular: [

          { name: '激光器', id: 'pl-laser' },

          { name: '二向色镜 DM', id: 'pl-dm' },

          { name: '显微物镜', id: 'pl-obj' },

          { name: '样品', id: 'pl-sample' },

          { name: '长通滤波器', id: 'pl-lpfilter' },

          { name: '光谱仪 + CCD', id: 'pl-spectro' },

        ],

        linear: [

          { name: '激光器', id: 'lpl-laser' },

          { name: '起偏器 P', id: 'lpl-polarizer' },

          { name: '半波片 HWP', id: 'lpl-hwp' },

          { name: '二向色镜 DM', id: 'lpl-dm' },

          { name: '显微物镜', id: 'lpl-obj' },

          { name: '样品', id: 'lpl-sample' },

          { name: '长通滤波器', id: 'lpl-lpfilter' },

          { name: '检偏器 A', id: 'lpl-analyzer' },

          { name: '光谱仪 + CCD', id: 'lpl-spectro' },

        ],

        circular: [

          { name: '激光器', id: 'cpl-laser' },

          { name: '起偏器 P', id: 'cpl-polarizer' },

          { name: 'λ/4 波片 QWP₁', id: 'cpl-qwp1' },

          { name: '二向色镜 DM', id: 'cpl-dm' },

          { name: '显微物镜', id: 'cpl-obj' },

          { name: '样品', id: 'cpl-sample' },

          { name: '长通滤波器', id: 'cpl-lpfilter' },

          { name: 'λ/4 波片 QWP₂', id: 'cpl-qwp2' },

          { name: '检偏器 A', id: 'cpl-analyzer' },

          { name: '光谱仪 + CCD', id: 'cpl-spectro' },

        ],

      };



      const list = components[mode] || [];

      const el = document.getElementById('pl-component-list');

      if (!el) return;



      if (list.length === 0) {

        el.innerHTML = '<div class="help-text">切换到光路标签页查看元件清单</div>';

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



    destroy() {

      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';

    }

  };



  App.registerTool('pl', tool);

})();


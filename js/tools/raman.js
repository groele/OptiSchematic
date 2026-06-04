/* ============================================



   Optical Toolkit — Raman Spectroscopy



   Conventional, Polarization-resolved, Confocal Raman Mapping



   With hover tooltips, polarization annotations, and comparison



   ============================================ */







(() => {







  // Tooltip descriptions for every component



  const TOOLTIPS = {

    'rm-rayleigh': '瑞利散射 (Rayleigh Scattering)\n弹性散射过程：散射光子能量等于入射光子能量 (hν_s = hν_0)。\n物理机制：分子吸收光子到达虚拟能级后，退激发回到最初的振动基态 (v=0)，不发生能量交换，释放相同波长的光子。\n特点：拉曼测量中极强的背景信号，通常需要通过高截止比边缘/陷波滤波器滤除。',

    'rm-stokes': '斯托克斯散射 (Stokes Raman Scattering)\n非弹性红移散射：散射光子能量低于入射光子能量 (hν_s = hν_0 - hν_v)。\n物理机制：处于振动基态 (v=0) 的分子受激跃迁到虚拟能级，随后退激发至高振动激发态 (v=1)。多余的能量转移为分子晶格振动能量，使得散射光子能量降低而红移。\n应用：常温下基态分子数较多，Stokes 信号最强，是拉曼测量分析的主要信号。',

    'rm-antistokes': '反斯托克斯散射 (Anti-Stokes Raman Scattering)\n非弹性蓝移散射：散射光子能量高于入射光子能量 (hν_s = hν_0 + hν_v)。\n物理机制：处于振动激发态 (v=1) 的分子受激跃迁至虚拟能级后，退激发回振动基态 (v=0)。散射光子额外获取了分子的振动能，能量增加而蓝移。\n应用：强度极弱，其与 Stokes 的比值由玻尔兹曼热分布决定，常用作光学温度计监测局部温度。',

    // Tab 1: Conventional Raman



    'rm-laser': '激发光源 (Excitation Laser)\n常用波长：\n• 532nm (Nd:YAG): 最通用，荧光干扰中等\n• 633nm (HeNe): 适合红色样品\n• 785nm (二极管): 低荧光背景，生物样品优选\n• 1064nm (FT-Raman): 几乎无荧光\n功率：1~50mW，需低于样品损伤阈值\n线宽：<0.1 cm⁻¹ 以保证光谱分辨率',



    'rm-dm': '二向色镜 (Dichroic Mirror)\n功能：反射激发光，透射收集拉曼信号\n参数：截止波长介于激发光与拉曼光谱之间\n反射率 >98% @ 激发波长，透过率 >90% @ 拉曼散射波长',



    'rm-obj': '显微物镜 (Microscope Objective)\n功能：聚焦激发光在样品表面形成微区光斑，同时高效率收集反射的拉曼光\n参数：典型放大倍数 50x-100x，高 NA (0.5~0.9) 可极大地提升光强收集效率',



    'rm-notch': '陷波/边缘滤波器 (Notch/Edge Filter)\n功能：滤除瑞利散射光（与激发光同波长）\n性能：\n• 光密度 OD>6（抑制比 10⁶）\n• 截止波数：<50~100 cm⁻¹\n• 陷波型：可测低波数 Raman\n• 边缘型：截止更陡，低波数不可测\n需针对激发波长选择，与激光器精确匹配',



    'rm-sample': '样品 (Sample)\n类型：固体、液体、气体、薄膜、粉末\n制备：\n• 固体：直接测量或压片\n• 液体：毛细管或石英比色皿\n• 粉体：压片或载玻片上\n• 薄膜：需考虑衬底干扰\n注意：荧光样品优选 785nm/1064nm 激发\nSERS 基底可增强信号 10⁶~10¹⁰ 倍',



    'rm-collect': '收集透镜 (Collection Optics)\n功能：收集样品散射光并耦合进光谱仪\n优选：大 NA 物镜 (NA>0.5) 提高收集效率\n背散射构型（180°）最常用\n注意：\n• 透镜色差会影响聚焦质量\n• 反射式物镜可避免色差\n• 共聚焦针孔可抑制离焦杂散光',



    'rm-lpfilter': '长通滤波器 (Long-pass Filter)\n功能：二次滤除残余激发光，保护 CCD\n与陷波滤波器串联使用，提高总抑制比\n关键参数：\n• 截止波长：略长于激发波长\n• 光密度 OD>6\n• 边缘陡度决定可测最低 Raman 位移\n对低波数 Raman 测量尤为重要',



    'rm-spectro': '光谱仪 + CCD 检测器\n光谱仪参数：\n• 光栅：600 g/mm（宽范围）/ 1200~2400 g/mm（高分辨）\n• 焦距：300~1000 mm（焦距越长分辨率越高）\n• 入射狭缝：10~100 μm\nCCD 检测器：\n• 制冷至 -70°C 降低暗噪声\n• 光谱分辨率：<1 cm⁻¹\n• 积分时间：1~300s',







    // Tab 2: Polarization-resolved Raman



    'pr-laser': '激发光源\n同常规 Raman 配置\n注意：激光器自身输出偏振态需稳定\n线偏振输出的激光器可省略起偏器',



    'pr-polarizer': '起偏器 P (Polarizer)\n功能：产生高质量线偏振激发光\n类型：\n• 格兰-泰勒棱镜（消光比 >10⁵:1）\n• 薄膜偏振片（经济，消光比 ~10³:1）\n• Wollaston 棱镜可同时分离 o光/e光\n消光比影响偏振分辨 Raman 的测量精度',



    'pr-hwp': '半波片 λ/2 (Half-wave Plate)\n功能：旋转线偏振方向\n原理：快轴角度 φ 使偏振方向旋转 2φ\n应用：连续扫描激发偏振方向\n需针对激发波长选择零级或多级波片\n零级波片温度稳定性更好',



    'pr-notch': '陷波滤波器\n功能同常规 Raman：滤除瑞利散射光\n偏振 Raman 中需注意滤波器的偏振效应\n建议使用非偏振敏感的陷波/边缘滤波器',



    'pr-sample': '样品\n各向异性材料最适合偏振 Raman：\n• 晶体（硅、石墨、TMD、钙钛矿）\n• 纳米管/纳米线\n• 液晶\n• 2D 材料\n需标注样品晶轴方向和测量几何\n（背散射/前散射/90°散射）',



    'pr-collect': '收集透镜\n功能同常规 Raman\n注意：光学元件可能引入额外偏振效应\n尽量使用反射式光学（离轴抛物面镜）\n或使用偏振无关的收集光学设计',



    'pr-lpfilter': '长通滤波器\n功能同常规 Raman：二次滤除残余激发光\n与常规 Raman 配置相同',



    'pr-analyzer': '检偏器 A (Analyzer)\n功能：选择检测 Raman 散射光的特定偏振分量\n旋转 90° 切换平行 (I_VV) 和垂直 (I_VH) 分量\n消光比决定退偏比测量精度\n需与起偏器 P 配合完成四分量测量',



    'pr-spectro': '光谱仪 + CCD\n记录不同偏振配置下的 Raman 光谱\n四分量测量：I_VV, I_VH, I_HH, I_HV\n需做仪器偏振响应校正 (G 因子)\nG = I_VV / I_VH (非偏振光源标定)',

    'pr-dm': '二向色镜 DM (Dichroic Mirror — 偏振 Raman)\n功能：反射激发光（短波长），透射收集拉曼散射信号（长波长）\n偏振 Raman 中需注意：部分二向色镜对不同偏振方向的反/透射率存在差异\n建议选用偏振不敏感型二向色镜，或在 G 因子标定时矫正其偏振效应\n关键参数：截止波长介于激发光与拉曼光谱之间，反射率 >98% @ 激发波长，透过率 >90% @ 拉曼信号',

    'tra-qwp': '四分之一波片 λ/4 (Quarter-wave Plate — 圆偏振 Raman)\n功能：将线偏振光转换为圆偏振光，或将圆偏振光转换为线偏振光\n快轴 +45°：将水平线偏振转换为右旋圆偏振 σ⁺\n快轴 -45°：将水平线偏振转换为左旋圆偏振 σ⁻\n应用：产生 σ⁺/σ⁻ 圆偏振激发，探测谷极化 (Valley Polarization) 与手性 Raman 选择定则\n需针对激发波长选择零级消色差波片',







    // Tab 3: Confocal Raman Mapping



    'cr-laser': '激发光源\n同常规 Raman 配置\n共聚焦配置通常使用高亮度激光源\n注意：激光功率密度在高 NA 聚焦下可能很高\n需监控样品损伤',



    'cr-dm': '二向色镜 (Dichroic Mirror)\n功能：同轴反射激发光并透射收集信号\n反射短波长的激光，而高效透射长波长的拉曼散射光，是共轴共聚焦显微系统的核心分离元件',



    'cr-notch': '陷波滤波器\n功能同常规 Raman\n共聚焦系统中滤波器质量直接影响\n空间分辨率（杂散光抑制比）',



    'cr-objective': '高 NA 物镜 (High-NA Objective)\n功能：\n• 聚焦激光到微小光斑（~1 μm）\n• 收集大立体角内的 Raman 散射光\n参数：\n• NA 0.5~0.95（空气/油浸）\n• 放大倍数 50x~100x\n• 工作距离需适配样品\n油浸物镜 NA>1.0 可进一步提高分辨率',



    'cr-sample': '样品 + XYZ 压电平台\n压电扫描平台：\n• 行程：100×100 μm ~ 数 mm\n• 分辨率：<10 nm\n• 扫描速度：决定 mapping 时间\n样品需固定在平台上\n注意：\n• 保持样品表面水平\n• 避免热漂移影响定位精度\n• 可做面扫描 (XY) 或深度扫描 (Z)',



    'cr-collect': '收集光路\n反射型共聚焦配置（180°背散射）\n收集光路与激发光路共用物镜\n经二向色镜/陷波滤波器分离激发光和信号',



    'cr-lpfilter': '长通滤波器\n同常规配置\n共聚焦系统中对滤波器要求更高\n以保证针孔处的杂散光充分抑制',



    'cr-pinhole': '共聚焦针孔 (Confocal Pinhole)\n功能：抑制离焦杂散光，提高空间分辨率\n原理：\n• 仅允许焦平面信号通过\n• 离焦光被针孔阻挡\n参数：\n• 直径：25~200 μm（可调）\n• 较小针孔 → 更高空间分辨率 → 信号更弱\n• 较大针孔 → 信号更强 → 分辨率降低\n典型设置：1 Airy 单位 (AU)',



    'cr-spectro': '光谱仪 + CCD\n同常规 Raman 配置\n共聚焦 mapping 中每像素对应一条 Raman 光谱\n数据量大：典型 100×100 像素 = 10000 条光谱\n需高速读出 CCD 或 EMCCD 以缩短采集时间',

    'cr-lens-l1': '聚焦透镜 L1 (Focus Lens)\n功能：将拉曼散射平行光束聚焦至共聚焦针孔处\n参数：焦距通常为 100~300mm，与光谱仪入口匹配\n需考虑色差补偿（消色差双合透镜优先）',

    'cr-lens-l2': '准直透镜 L2 (Collimation Lens)\n功能：将经过共聚焦针孔的发散光重新准直\n参数：焦距与光谱仪入口焦距匹配以保持光束平行\n注意：L1/L2 焦距比决定光斑在针孔处的大小',


  };







  const tool = {



    title: 'Raman 光谱',



    description: '常规 Raman、偏振分辨 Raman、共聚焦 Raman Mapping 光路原理与对比',



    currentTab: 'principle',



    _tooltipEl: null,







    render(container) {

      container.innerHTML = `

        <!-- Top Control Bar (Tabs) -->

        <div class="card">

          <div class="toggle-group" id="raman-tabs">

            <button class="toggle-btn active" data-tab="principle">Raman 原理</button>

            <button class="toggle-btn" data-tab="conventional">常规 Raman</button>

            <button class="toggle-btn" data-tab="polarization">偏振分辨 Raman</button>

            <button class="toggle-btn" data-tab="confocal">共聚焦 Raman Mapping</button>

            <button class="toggle-btn" data-tab="compare">三种模式对比</button>

          </div>

        </div>



        <!-- Middle Stage (Diagrams) -->

        <div class="dashboard-wide-stage">

          <!-- Tab 0: Raman Principle -->

          <div class="tab-panel" id="tab-principle">

            <div class="card-title" style="margin-bottom:8px"><span class="icon">🔬</span> Raman 散射物理原理</div>

            <div class="help-text" style="margin-bottom:16px">

              拉曼散射（Raman Scattering）是光子与物质分子发生非弹性碰撞时产生的散射过程。入射光子与分子的振动或转动能级发生能量交换，使得散射光的频率发生改变，其频率偏移量（Raman位移）直接对应分子的振动模式。

            </div>

            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 散射过程简述</div>

                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent);margin-bottom:12px">

                    <strong>散射三种类型：</strong><br>

                    1. <b>瑞利散射 (Rayleigh)</b>：弹性散射，光子能量不变 ($h\nu_R = h\nu_0$)；<br>

                    2. <b>斯托克斯散射 (Stokes)</b>：非弹性红移，分子获得能量 ($h\nu_S = h\nu_0 - h\nu_v$)；<br>

                    3. <b>反斯托克斯 (Anti-Stokes)</b>：非弹性蓝移，光子获得能量 ($h\nu_{AS} = h\nu_0 + h\nu_v$)。

                  </div>

                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">

                    <strong>强度比值与温度关系：</strong><br>

                    <div style="font-family:var(--font-mono);font-size:12px;background:var(--bg-card);padding:6px;border-radius:4px;margin:6px 0;text-align:center;border:1px solid var(--border);color:var(--accent)">

                      I_AS / I_S ∝ exp(-hν_v / (k_B T))

                    </div>

                    <span style="font-size:10px;color:var(--text-tertiary)">由于常温下激发态分子数极少，Anti-Stokes 强度远弱于 Stokes。其强度比值服从玻尔兹曼分布，可用于非接触式局部温度传感。</span>

                  </div>

                </div>

              </div>

              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="raman-principle-diagram"></div>

                </div>

              </div>

            </div>

            <div id="raman-principle-text"></div>

          </div>

          <div class="tab-panel" id="tab-conventional" style="display:none">

            <div class="card-title" style="margin-bottom:8px"><span class="icon">🔬</span> 常规 Raman 光谱光路</div>

            <div class="help-text" style="margin-bottom:16px">

              Raman 散射是光子与分子振动的非弹性散射，散射光频率偏移量（Raman 位移 cm⁻¹）反映分子振动能级。

            </div>

            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 常规 Raman 配置</div>

                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent);margin-bottom:12px">

                    <strong>拉曼位移公式：</strong><br>

                    <div style="font-family:var(--font-mono);font-size:12px;background:var(--bg-card);padding:6px;border-radius:4px;margin:6px 0;text-align:center;border:1px solid var(--border);color:var(--accent)">

                      Δw = (1/λ₀ - 1/λ_s) × 10⁷

                    </div>

                    <span style="font-size:10px;color:var(--text-tertiary)">λ₀: 激发波长 (nm)<br>λ_s: 散射波长 (nm)<br>Δw: 拉曼位移 (cm⁻¹)</span>

                  </div>

                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">

                    <strong>测量技术指标：</strong><br>

                    1. <b>激发波长选择</b>：常用 532nm (效率高)、785nm (荧光干扰低) 或 1064nm (无荧光)；<br>

                    2. <b>背散射构型</b>：180° 同轴后向散射，物镜兼具聚焦与散射光收集，极大简化对准；<br>

                    3. <b>瑞利散射滤除</b>：Notch 滤波器滤除激发光，透射拉曼光，消光比 OD > 6。

                  </div>

                </div>

              </div>

              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="conv-diagram"></div>

                </div>

              </div>

            </div>

          </div>



          <div class="tab-panel" id="tab-polarization" style="display:none">

            <div class="card-title" style="margin-bottom:8px"><span class="icon">📐</span> 偏振分辨 Raman 光路</div>

            <div class="help-text" style="margin-bottom:16px">

              偏振分辨 Raman 通过控制激发光偏振方向和选择检测散射光偏振分量，研究分子振动的对称性和晶体取向。

            </div>



            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 偏振测试配置</div>

                  <div class="toggle-group" id="raman-polar-subconfig" style="margin-bottom:12px;flex-direction:column">

                    <button class="toggle-btn active" data-sub="lin-para" style="text-align:left;padding-left:16px">平行线偏振 (Parallel - I_VV)</button>

                    <button class="toggle-btn" data-sub="lin-cross" style="text-align:left;padding-left:16px">垂直线偏振 (Cross - I_VH)</button>

                    <button class="toggle-btn" data-sub="circ-pp" style="text-align:left;padding-left:16px">圆偏振 σ⁺ σ⁺ (右旋激发 / 右旋检测)</button>

                    <button class="toggle-btn" data-sub="circ-pm" style="text-align:left;padding-left:16px">圆偏振 σ⁺ σ⁻ (右旋激发 / 左旋检测)</button>

                    <button class="toggle-btn" data-sub="circ-mp" style="text-align:left;padding-left:16px">圆偏振 σ⁻ σ⁺ (左旋激发 / 右旋检测)</button>

                    <button class="toggle-btn" data-sub="circ-mm" style="text-align:left;padding-left:16px">圆偏振 σ⁻ σ⁻ (左旋激发 / 左旋检测)</button>

                  </div>

                  <div id="raman-polar-operation-guide" style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">

                    <!-- Content dynamic -->

                  </div>

                </div>

              </div>



              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="pol-diagram"></div>

                </div>

              </div>

            </div>

          </div>



          <div class="tab-panel" id="tab-confocal" style="display:none">

            <div class="card-title" style="margin-bottom:8px"><span class="icon">🔍</span> 共聚焦 Raman Mapping 光路</div>

            <div class="help-text" style="margin-bottom:16px">

              共聚焦 Raman 结合共聚焦显微镜的空间滤波能力和 Raman 光谱的化学指纹识别，实现微区化学成分的空间分布成像。

            </div>

            <div style="display:grid;grid-template-columns:320px 1fr;gap:20px">

              <div class="dashboard-control" style="padding:0">

                <div class="card" style="box-shadow:none;border:none;padding:0;background:transparent">

                  <div class="card-title" style="font-size:13px"><span class="icon">⚙️</span> 共聚焦控制参数</div>

                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent)">

                    <strong>空间分辨与成像控制：</strong><br>

                    1. <b>共焦针孔 (Pinhole)</b>：放置于像平面，滤除非焦平面的纵向与横向杂散光，实现高轴向空间分辨；<br>

                    2. <b>XYZ 三维压电台</b>：高精度步进扫描系统，实现微区 2D 面扫描 Mapping 或纵向深度 Profiling；<br>

                    3. <b>成像效率</b>：每一扫频像素均记录完整 Raman 光谱，需配合高速 CCD/EMCCD 以提高采集效率。

                  </div>

                </div>

              </div>

              <div class="dashboard-stage" style="gap:12px">

                <div class="card" style="padding:10px;box-shadow:none;border:none;padding:0;background:transparent">

                   <div id="confocal-diagram"></div>

                </div>

              </div>

            </div>

          </div>



          <div class="tab-panel" id="tab-compare" style="display:none">

            <div class="card-title" style="margin-bottom:8px"><span class="icon">⚖️</span> 三种 Raman 模式对比</div>

            <div id="compare-content"></div>

          </div>

        </div>



        <!-- Bottom Footer (Dual Columns: Notes & Inventory) -->

        <div class="dashboard-wide-footer" id="raman-footer">

          <!-- Left Column: Notes & Explanations -->

          <div class="dashboard-notes">

            <div class="card" style="height:100%">

              <div class="card-title"><span class="icon">📝</span> 实验与物理要点</div>

              <div id="notes-content"></div>

            </div>

          </div>



          <!-- Right Column: Components Inventory -->

          <div class="dashboard-inventory">

            <div class="card" style="height:100%">

              <div class="card-title"><span class="icon">📋</span> 元件清单与规格</div>

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

      this.switchTab(this.currentTab);

    },



    bindEvents() {

      document.getElementById('raman-tabs')?.addEventListener('click', (e) => {

        const btn = e.target.closest('.toggle-btn');

        if (!btn) return;

        document.querySelectorAll('#raman-tabs .toggle-btn').forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        this.switchTab(btn.dataset.tab);

      });



      document.getElementById('raman-polar-subconfig')?.addEventListener('click', (e) => {

        const btn = e.target.closest('.toggle-btn');

        if (!btn) return;

        document.querySelectorAll('#raman-polar-subconfig .toggle-btn').forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        this.renderPolarization();

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

      // Update active button state in the tab group
      document.querySelectorAll('#raman-tabs .toggle-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
      });

      ['principle', 'conventional', 'polarization', 'confocal', 'compare'].forEach(t => {

        const el = document.getElementById(`tab-${t}`);

        if (el) el.style.display = t === tab ? '' : 'none';

      });



      const footer = document.getElementById('raman-footer');

      if (footer) {

        footer.style.display = tab === 'compare' ? 'none' : 'grid';

      }



      switch (tab) {

        case 'principle': this.renderPrinciple(); break;

        case 'conventional': this.renderConventional(); break;

        case 'polarization': this.renderPolarization(); break;

        case 'confocal': this.renderConfocal(); break;

        case 'compare': this.renderCompare(); break;

      }

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



          <circle cx="${cx}" cy="${cy-7}" r="2.5" fill="${cleanColor}" filter="url(#rm-glow)"/>



        `;



      } else if (lowerId.includes('spectro') || lbl1.includes('光谱') || lbl2.includes('spectro')) {



        iconSvg = `



          <rect x="${cx-15}" y="${cy-12}" width="30" height="24" rx="2.5" fill="#1C2833" stroke="#2C3E50" stroke-width="1.2"/>



          <line x1="${cx-10}" y1="${cy-7}" x2="${cx-10}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>



          <line x1="${cx-7}" y1="${cy-7}" x2="${cx-7}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>



          <line x1="${cx-4}" y1="${cy-7}" x2="${cx-4}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>



          <rect x="${cx-19}" y="${cy-4}" width="4" height="8" fill="#95A5A6" rx="0.5"/>



          <circle cx="${cx+9}" cy="${cy+6}" r="1.5" fill="#2ECC71" filter="url(#rm-glow)"/>



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



    // Tab 1: Conventional Raman



    // ==========================================



    renderPrinciple() {
      const W = 1200, H = 500;
      const svg = `
      <svg viewBox="0 0 ${W} ${H}" id="raman-principle-export" style="width:100%;display:block;margin:0 auto">
        <defs>
          <marker id="rm-arr-g" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#34C759"/></marker>
          <marker id="rm-arr-o" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#FF5E00"/></marker>
          <marker id="rm-arr-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#0071E3"/></marker>
          <marker id="rm-arr-p" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#AF52DE"/></marker>
          <filter id="raman-glow" x="-30%" y="-30%" width="160%" height="160%">
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

        <!-- Left Side: Microscopic molecular model & light path -->
        <rect x="30" y="30" width="700" height="440" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-dasharray="4,4" opacity="0.5"/>
        <text x="380" y="55" font-size="14" fill="var(--text-primary)" text-anchor="middle" font-weight="700">微观散射模型 Microscopic Scattering Model</text>
        
        <!-- Incident laser wave -->
        <path d="M 60 250 Q 80 230, 100 250 T 140 250 T 180 250 T 220 250" fill="none" stroke="#34C759" stroke-width="4" opacity="0.3" filter="url(#raman-glow)"/>
        <path d="M 60 250 Q 80 230, 100 250 T 140 250 T 180 250 T 220 250" fill="none" stroke="#34C759" stroke-width="2" marker-end="url(#rm-arr-g)"/>
        <text x="140" y="215" font-size="12" fill="#34C759" font-weight="700" text-anchor="middle">入射激光 Laser (hν₀)</text>
        <text x="140" y="230" font-size="10" fill="var(--text-secondary)" text-anchor="middle">波长: 532 nm</text>

        <!-- Rayleigh Group -->
        <g class="svg-hover-box" data-tip="rm-rayleigh" cursor="pointer">
          <!-- Molecule Rayleigh -->
          <circle cx="290" cy="140" r="10" fill="#34C759" opacity="0.8"/>
          <circle cx="330" cy="140" r="10" fill="#34C759" opacity="0.8"/>
          <path d="M 298 140 Q 301 135, 304 140 T 310 140 T 316 140 T 322 140" fill="none" stroke="var(--text-primary)" stroke-width="2"/>
          <text x="310" y="115" font-size="11" fill="var(--text-primary)" font-weight="700" text-anchor="middle">Rayleigh (v=0)</text>
          
          <!-- Scattered Rayleigh light -->
          <path d="M 350 140 Q 375 125, 400 140 T 450 140 T 500 140 T 550 140" fill="none" stroke="#34C759" stroke-width="4" opacity="0.3" filter="url(#raman-glow)"/>
          <path d="M 350 140 Q 375 125, 400 140 T 450 140 T 500 140 T 550 140" fill="none" stroke="#34C759" stroke-width="2" marker-end="url(#rm-arr-g)"/>
          <text x="460" y="115" font-size="11" fill="#34C759" font-weight="700" text-anchor="middle">弹性散射 hν_R = hν₀</text>
        </g>

        <!-- Stokes Group -->
        <g class="svg-hover-box" data-tip="rm-stokes" cursor="pointer">
          <!-- Molecule Stokes -->
          <circle cx="290" cy="250" r="12" fill="#FF5E00" opacity="0.8"/>
          <circle cx="330" cy="250" r="12" fill="#FF5E00" opacity="0.8"/>
          <path d="M 298 250 Q 302 242, 306 250 T 314 250 T 322 250" fill="none" stroke="var(--text-primary)" stroke-width="2"/>
          <path d="M 272 250 L 262 250" stroke="#FF5E00" stroke-width="1.5" marker-end="url(#rm-arr-o)"/>
          <path d="M 348 250 L 358 250" stroke="#FF5E00" stroke-width="1.5" marker-end="url(#rm-arr-o)"/>
          <text x="310" y="222" font-size="11" fill="var(--text-primary)" font-weight="700" text-anchor="middle">Stokes (v=0 → v=1)</text>

          <!-- Scattered Stokes light -->
          <path d="M 350 250 Q 380 230, 410 250 T 470 250 T 530 250 T 590 250" fill="none" stroke="#FF5E00" stroke-width="4" opacity="0.3" filter="url(#raman-glow)"/>
          <path d="M 350 250 Q 380 230, 410 250 T 470 250 T 530 250 T 590 250" fill="none" stroke="#FF5E00" stroke-width="2" marker-end="url(#rm-arr-o)"/>
          <text x="490" y="222" font-size="11" fill="#FF5E00" font-weight="700" text-anchor="middle">红移散射 hν_S = hν₀ - hν_v</text>
        </g>

        <!-- Anti-Stokes Group -->
        <g class="svg-hover-box" data-tip="rm-antistokes" cursor="pointer">
          <!-- Molecule Anti-Stokes -->
          <circle cx="290" cy="360" r="10" fill="#0071E3" opacity="0.8"/>
          <circle cx="330" cy="360" r="10" fill="#0071E3" opacity="0.8"/>
          <path d="M 298 360 Q 301 355, 304 360 T 310 360 T 316 360 T 322 360" fill="none" stroke="var(--text-primary)" stroke-width="2"/>
          <path d="M 276 360 L 282 360" stroke="#0071E3" stroke-width="1.5" marker-end="url(#rm-arr-b)"/>
          <path d="M 344 360 L 338 360" stroke="#0071E3" stroke-width="1.5" marker-end="url(#rm-arr-b)"/>
          <text x="310" y="335" font-size="11" fill="var(--text-primary)" font-weight="700" text-anchor="middle">Anti-Stokes (v=1 → v=0)</text>

          <!-- Scattered Anti-Stokes light -->
          <path d="M 350 360 Q 370 350, 390 360 T 430 360 T 470 360 T 510 360" fill="none" stroke="#0071E3" stroke-width="4" opacity="0.3" filter="url(#raman-glow)"/>
          <path d="M 350 360 Q 370 350, 390 360 T 430 360 T 470 360 T 510 360" fill="none" stroke="#0071E3" stroke-width="2" marker-end="url(#rm-arr-b)"/>
          <text x="460" y="335" font-size="11" fill="#0071E3" font-weight="700" text-anchor="middle">蓝移散射 hν_AS = hν₀ + hν_v</text>
        </g>
        
        <!-- Background light paths lines to show coupling -->
        <path d="M 220 250 L 270 140" stroke="#34C759" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
        <path d="M 220 250 L 270 250" stroke="#34C759" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
        <path d="M 220 250 L 270 360" stroke="#34C759" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>

        <!-- Right Side: Jablonski Energy Diagram -->
        <rect x="760" y="30" width="410" height="440" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="965" y="55" font-size="14" fill="var(--text-primary)" text-anchor="middle" font-weight="700">能级跃迁图 Jablonski Diagram</text>

        <!-- Virtual States -->
        <line x1="800" y1="120" x2="1140" y2="120" stroke="#AF52DE" stroke-width="1" stroke-dasharray="5,4" opacity="0.8"/>
        <text x="1145" y="123" font-size="10" fill="#AF52DE">虚拟能级 Virtual State (E₀ + hν₀)</text>
        
        <!-- Ground State Vib levels -->
        <line x1="800" y1="360" x2="1140" y2="360" stroke="var(--text-primary)" stroke-width="2"/>
        <text x="1145" y="364" font-size="10" fill="var(--text-primary)" font-weight="700">振动基态 v = 0</text>

        <line x1="800" y1="300" x2="1140" y2="300" stroke="var(--text-secondary)" stroke-width="1.5"/>
        <text x="1145" y="304" font-size="10" fill="var(--text-secondary)">振动激发态 v = 1</text>
        
        <path d="M 1110 360 L 1110 300" stroke="var(--text-primary)" stroke-width="1" marker-end="url(#rm-arr-p)"/>
        <text x="1120" y="335" font-size="9" fill="var(--text-primary)">ΔE = hν_v</text>

        <!-- Transitions -->
        <!-- Rayleigh transitions -->
        <g class="svg-hover-box" data-tip="rm-rayleigh" cursor="pointer">
          <line x1="850" y1="360" x2="850" y2="120" stroke="#34C759" stroke-width="2.5" marker-end="url(#rm-arr-g)"/>
          <line x1="870" y1="120" x2="870" y2="360" stroke="#34C759" stroke-width="2" stroke-dasharray="2,2" marker-end="url(#rm-arr-g)"/>
          <text x="835" y="240" font-size="11" fill="#34C759" font-weight="700" text-anchor="middle">hν₀</text>
          <text x="888" y="240" font-size="11" fill="#34C759" font-weight="700" text-anchor="middle">hν₀</text>
          <text x="860" y="390" font-size="12" fill="var(--text-primary)" text-anchor="middle" font-weight="700">Rayleigh</text>
          <text x="860" y="405" font-size="10" fill="var(--text-secondary)" text-anchor="middle">弹性散射</text>
        </g>

        <!-- Stokes transitions -->
        <g class="svg-hover-box" data-tip="rm-stokes" cursor="pointer">
          <line x1="960" y1="360" x2="960" y2="120" stroke="#34C759" stroke-width="2.5" marker-end="url(#rm-arr-g)"/>
          <line x1="980" y1="120" x2="980" y2="300" stroke="#FF5E00" stroke-width="2.5" marker-end="url(#rm-arr-o)"/>
          <text x="945" y="240" font-size="11" fill="#34C759" font-weight="700" text-anchor="middle">hν₀</text>
          <text x="1008" y="220" font-size="11" fill="#FF5E00" font-weight="700" text-anchor="middle">hν₀ - hν_v</text>
          <text x="970" y="390" font-size="12" fill="var(--text-primary)" text-anchor="middle" font-weight="700">Stokes</text>
          <text x="970" y="405" font-size="10" fill="var(--text-secondary)" text-anchor="middle">非弹性 (红移)</text>
        </g>

        <!-- Anti-Stokes transitions -->
        <g class="svg-hover-box" data-tip="rm-antistokes" cursor="pointer">
          <line x1="1060" y1="300" x2="1060" y2="120" stroke="#34C759" stroke-width="2.5" marker-end="url(#rm-arr-g)"/>
          <line x1="1080" y1="120" x2="1080" y2="360" stroke="#0071E3" stroke-width="2.5" marker-end="url(#rm-arr-b)"/>
          <text x="1042" y="220" font-size="11" fill="#34C759" font-weight="700" text-anchor="middle">hν₀</text>
          <text x="1108" y="240" font-size="11" fill="#0071E3" font-weight="700" text-anchor="middle">hν₀ + hν_v</text>
          <text x="1070" y="390" font-size="12" fill="var(--text-primary)" text-anchor="middle" font-weight="700">Anti-Stokes</text>
          <text x="1070" y="405" font-size="10" fill="var(--text-secondary)" text-anchor="middle">非弹性 (蓝移)</text>
        </g>

        <!-- Export button -->
        <g cursor="pointer" onclick="DIAGRAMS.exportSVG(document.getElementById('raman-principle-export'), 'raman-principle.svg')">
          <rect x="${W - 110}" y="45" width="85" height="24" rx="12" fill="var(--bg-primary)" stroke="var(--border)"/>
          <text x="${W - 67}" y="61" font-size="10" fill="var(--accent)" text-anchor="middle" font-weight="600">💾 导出 SVG</text>
        </g>
      </svg>`;

      document.getElementById('raman-principle-diagram').innerHTML = svg;
      this._attachTooltips();
      
      document.getElementById('raman-principle-text').innerHTML = `
        <div style="margin-top:20px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
            <div style="background:var(--bg-primary);border-radius:12px;padding:20px;border:1px solid var(--border)">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:6px">
                <span style="color:var(--accent)">■</span> 极化率的经典电磁理论解释
              </div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <p>当外加电场 E = E₀ cos(ω₀t) 作用于分子时，分子产生感应偶极矩 P = α E。其中 α 为分子的极化率张量。</p>
                <p>若分子存在振动模式，其法坐标振动为 q = q₀ cos(ω_v t)，极化率 α 可泰勒展开为：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--accent);border:1px solid var(--border)">
                  α = α₀ + (∂α/∂q)₀ q + ...
                </div>
                <p>代入感应偶极矩公式，展开可得：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;line-height:1.6;color:var(--text-primary);border:1px solid var(--border)">
                  P = α₀E₀ cos(ω₀t) <span style="color:var(--text-tertiary)">[Rayleigh]</span><br>
                  + ½ (∂α/∂q)₀ q₀E₀ cos(ω₀ - ω_v)t <span style="color:#FF5E00;font-weight:600">[Stokes]</span><br>
                  + ½ (∂α/∂q)₀ q₀E₀ cos(ω₀ + ω_v)t <span style="color:#0071E3;font-weight:600">[Anti-Stokes]</span>
                </div>
                <p><strong>拉曼活性选择定则 (Raman Active Selection Rule)：</strong></p>
                <p>要使某种分子振动产生拉曼散射，其振动过程中分子极化率的改变量必须不为零，即 <strong>(∂α/∂q)₀ ≠ 0</strong>。</p>
              </div>
            </div>

            <div style="background:var(--bg-primary);border-radius:12px;padding:20px;border:1px solid var(--border)">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:6px">
                <span style="color:var(--accent)">■</span> 量子能级跃迁与玻尔兹曼统计
              </div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
                <p><strong>量子解释：</strong>拉曼散射是非弹性散射过程。当入射光子 (能量为 hν₀) 与分子碰撞时，若分子被激发至高振动的虚拟能级，随后跃迁退激：</p>
                <ul style="padding-left:18px;margin:6px 0">
                  <li>分子退激到原振动状态：发射 hν₀ 光子（瑞利散射）；</li>
                  <li>分子退激到振动激发态 v=1：发射 <span style="color:#FF5E00;font-weight:600">h(ν₀ - ν_v)</span> 光子，红移（斯托克斯散射）；</li>
                  <li>若分子原处于 v=1 振动激发态，退激至 v=0：发射 <span style="color:#0071E3;font-weight:600">h(ν₀ + ν_v)</span> 光子，蓝移（反斯托克斯散射）。</li>
                </ul>
                <p><strong>玻尔兹曼分布与温度传感：</strong></p>
                <p>常温下，分子处于各振动能级的比率由玻尔兹曼分布决定：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--accent);border:1px solid var(--border)">
                  N(v=1) / N(v=0) = exp(-hν_v / (k_B T))
                </div>
                <p>因此 Stokes 与 Anti-Stokes 强度的比值可用于非接触式温度测量：</p>
                <div style="background:var(--bg-card);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;margin:8px 0;color:var(--text-primary);border:1px solid var(--border)">
                  I_AS / I_S = [(ν₀ + ν_v)/(ν₀ - ν_v)]⁴ × exp(-hν_v / (k_B T))
                </div>
                <p>此技术在微电子器件和二维晶体局域原位温度监测中有着广泛应用。</p>
              </div>
            </div>
          </div>
        </div>
      `;
      this._renderComponents('principle');
      this._renderNotes('principle');
    },

    renderConventional() {
      const W = 1200, H = 550;
      const polState = (x, y, label, desc, color) => `
        <rect x="${x - 55}" y="${y}" width="110" height="36" rx="6" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>
        <text x="${x}" y="${y + 15}" font-size="11" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>
        <text x="${x}" y="${y + 29}" font-size="9" fill="var(--text-secondary)" text-anchor="middle">${desc}</text>`;

      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <marker id="rm-arr-r" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF3B30"/></marker>
          <marker id="rm-arr-o" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF5E00"/></marker>
          <marker id="rm-arr-b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>
          <filter id="rm-glow" x="-30%" y="-30%" width="160%" height="160%">
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
        <rect x="30" y="30" width="410" height="28" rx="6" fill="#FF3B30" opacity="0.08"/>
        <text x="235" y="49" font-size="13" fill="#FF3B30" text-anchor="middle" font-weight="700">激发光路 Excitation Path</text>
        <rect x="460" y="30" width="710" height="28" rx="6" fill="#0071E3" opacity="0.08"/>
        <text x="815" y="49" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">发射与检测光路 Emission & Detection Path</text>

        <!-- === Optical Paths (T-Shaped Layout) === -->
        <!-- Excitation Laser Beam (Horizontal, Left to DM) -->
        <line x1="160" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#rm-glow)"/>
        <line x1="160" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#rm-arr-r)"/>
        <text x="250" y="125" font-size="12" fill="#FF3B30" text-anchor="middle" font-weight="700">激发光 λ₀</text>

        <!-- 非偏振指示 - 激光输出 -->
        <circle cx="250" cy="95" r="8" fill="none" stroke="#AEAEB2" stroke-width="1.5"/>
        <line x1="242" y1="95" x2="258" y2="95" stroke="#AEAEB2" stroke-width="1"/>
        <line x1="250" y1="87" x2="250" y2="103" stroke="#AEAEB2" stroke-width="1"/>
        <text x="250" y="77" font-size="9" fill="#AEAEB2" text-anchor="middle">非偏振</text>

        <!-- DM reflects Laser beam down vertically -->
        <line x1="400" y1="140" x2="400" y2="395" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#rm-glow)"/>
        <line x1="400" y1="140" x2="400" y2="395" stroke="#FF3B30" stroke-width="2" marker-end="url(#rm-arr-r)"/>
        <text x="412" y="210" font-size="10.5" fill="#FF3B30" font-weight="600">同轴激发</text>

        <!-- Raman backscattered beam (Vertical, Sample up to DM) -->
        <line x1="400" y1="395" x2="400" y2="140" stroke="#FF5E00" stroke-width="7.5" opacity="0.3" filter="url(#rm-glow)"/>
        <line x1="400" y1="395" x2="400" y2="140" stroke="#FF5E00" stroke-width="3.5" stroke-dasharray="7,4" marker-end="url(#rm-arr-o)"/>
        <rect x="421" y="300" width="104" height="18" rx="5" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="0.8" opacity="0.96"/>
        <text x="473" y="313" font-size="10" fill="#FF5E00" text-anchor="middle" font-weight="700">Raman 散射 λₛ</text>

        <!-- Raman Scattered Beam in detection arm (Solid blue line, style unified with Polarization Raman) -->
        <line x1="400" y1="140" x2="1000" y2="140" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#rm-glow)"/>
        <line x1="400" y1="140" x2="1000" y2="140" stroke="#0071E3" stroke-width="2.5" marker-end="url(#rm-arr-b)"/>

        <!-- Rayleigh scattered (rejected by Notch Filter) -->
        <line x1="575" y1="140" x2="575" y2="210" stroke="#FF3B30" stroke-width="2.5" stroke-dasharray="5,3" opacity="0.8"/>
        <rect x="518" y="186" width="114" height="18" rx="5" fill="var(--bg-card)" stroke="#FF3B30" stroke-width="0.8" opacity="0.96"/>
        <text x="575" y="199" font-size="9.5" fill="#FF3B30" text-anchor="middle" font-weight="700">瑞利散射 (被滤除)</text>

        <!-- Diagonal line on dichroic mirror -->
        <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2.5" stroke-dasharray="5,3"/>
        <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射激发光 ↓</text>
        <rect x="424" y="82" width="86" height="18" rx="5" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="0.8" opacity="0.96"/>
        <text x="467" y="95" font-size="9" fill="#FF5E00" text-anchor="middle" font-weight="700">透射拉曼 ↑</text>

        <!-- === Raman Physics Principle Box === -->
        <rect x="590" y="245" width="300" height="170" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="590" y="270" font-size="13" fill="var(--text-primary)" font-weight="700">Raman 散射物理过程</text>

        <circle cx="620" cy="300" r="10" fill="#FF3B30" opacity="0.1"/><text x="620" y="304" font-size="11" fill="#FF3B30" text-anchor="middle" font-weight="700">1</text>
        <text x="640" y="304" font-size="11" fill="var(--text-primary)" font-weight="600">瑞利散射 (Rayleigh) - 弹性</text>
        <text x="640" y="318" font-size="10" fill="var(--text-secondary)">散射光波长 = 激发光波长 (占总散射 99.99%)</text>

        <circle cx="620" cy="340" r="10" fill="#FF5E00" opacity="0.1"/><text x="620" y="344" font-size="11" fill="#FF5E00" text-anchor="middle" font-weight="700">2</text>
        <text x="640" y="344" font-size="11" fill="var(--text-primary)" font-weight="600">斯托克斯散射 (Stokes) - 红移</text>
        <text x="640" y="358" font-size="10" fill="var(--text-secondary)">分子吸收能量跃迁，散射光能量降低 (主拉曼峰)</text>

        <circle cx="620" cy="380" r="10" fill="#0071E3" opacity="0.1"/><text x="620" y="384" font-size="11" fill="#0071E3" text-anchor="middle" font-weight="700">3</text>
        <text x="640" y="384" font-size="11" fill="var(--text-primary)" font-weight="600">反斯托克斯 (Anti-Stokes) - 蓝移</text>
        <text x="640" y="398" font-size="10" fill="var(--text-secondary)">激发态分子释放能量，散射光能量升高 (强度弱)</text>

        <!-- === Components === -->
        ${this._box(50, 100, 110, 80, '激光器', '#FF3B30', 'Laser Source', 'rm-laser')}
        ${this._box(340, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'Dichroic Mirror', 'rm-dm')}
        ${this._box(350, 265, 100, 55, '显微物镜', '#0071E3', 'Objective', 'rm-obj')}
        ${this._box(340, 395, 120, 65, '样品', '#34C759', 'Sample Stage', 'rm-sample')}
        ${this._box(520, 100, 110, 80, '陷波滤波器', '#AF52DE', '陷波滤波器', 'rm-notch')}
        ${this._box(680, 100, 100, 80, '收集透镜', '#0071E3', 'Collection', 'rm-collect')}
        ${this._box(840, 100, 110, 80, '长通 LP', '#FF5E00', 'LP Filter', 'rm-lpfilter')}
        ${this._box(1000, 90, 130, 100, '光谱仪', '#1D1D1F', '+ CCD 检测器', 'rm-spectro')}

        <!-- === Polarization state annotations (y=480) === -->
        <text x="40" y="465" font-size="12" fill="var(--text-primary)" font-weight="700">每一步偏振态变化：</text>

        ${polState(105, 480, '非偏振', '激发光', '#AEAEB2')}
        ${polState(260, 480, '非偏振', '同轴反射/聚焦', '#AEAEB2')}
        ${polState(400, 480, '非偏振', '拉曼非弹性散射', '#34C759')}
        ${polState(575, 480, '非偏振', '滤除 Rayleigh', '#FF5E00')}
        ${polState(730, 480, '非偏振', '收集拉曼散射', '#0071E3')}
        ${polState(895, 480, '非偏振', '二次滤除激发光', '#FF5E00')}
        ${polState(1065, 480, '光谱检测', 'CCD 记录', 'var(--text-primary)')}
      </svg>`;

      document.getElementById('conv-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponents('conventional');
      this._renderNotes('conventional');
    },
    renderPolarization() {
      const W = 1200, H = 550;
      const subconfig = document.querySelector('#raman-polar-subconfig .active')?.dataset.sub || 'lin-para';
      const isCircular = subconfig.startsWith('circ');
      
      const polState = (x, y, label, desc, color) => `
        <rect x="${x - 45}" y="${y}" width="90" height="36" rx="6" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>
        <text x="${x}" y="${y + 15}" font-size="10" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>
        <text x="${x}" y="${y + 29}" font-size="8" fill="var(--text-secondary)" text-anchor="middle">${desc}</text>`;

      let svg = '';
      let guideHtml = '';

      if (!isCircular) {
        // Linear polarization setup
        const isPara = subconfig === 'lin-para';
        svg = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
          <defs>
            <marker id="pr-arr-r" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF3B30"/></marker>
            <marker id="pr-arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>
            <filter id="pr-glow" x="-30%" y="-30%" width="160%" height="160%">
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
          <rect x="30" y="30" width="500" height="28" rx="6" fill="#FF3B30" opacity="0.08"/>
          <text x="280" y="49" font-size="13" fill="#FF3B30" text-anchor="middle" font-weight="700">激发光路 (含偏振控制)</text>
          <rect x="540" y="30" width="630" height="28" rx="6" fill="#0071E3" opacity="0.08"/>
          <text x="855" y="49" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">发射与偏振检测光路 (PR-Raman)</text>

          <!-- === Beam Lines === -->
          <line x1="150" y1="140" x2="190" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="150" y1="140" x2="190" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#pr-arr-r)"/>
          
          <line x1="300" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="300" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#pr-arr-r)"/>
          
          <line x1="400" y1="140" x2="400" y2="395" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="400" y1="140" x2="400" y2="395" stroke="#FF3B30" stroke-width="2" marker-end="url(#pr-arr-r)"/>
          
          <line x1="400" y1="395" x2="400" y2="140" stroke="#FF5E00" stroke-width="7.5" stroke-dasharray="7,4" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="400" y1="395" x2="400" y2="140" stroke="#FF5E00" stroke-width="3" stroke-dasharray="7,4" marker-end="url(#pr-arr-g)"/>
          
          <line x1="400" y1="140" x2="800" y2="140" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="400" y1="140" x2="800" y2="140" stroke="#0071E3" stroke-width="2.5" marker-end="url(#pr-arr-g)"/>

          <!-- === Optical components === -->
          ${this._box(40, 100, 110, 80, '激光器', '#FF3B30', 'Laser Source', 'pr-laser')}
          ${this._box(190, 100, 110, 80, '起偏器 P', '#AF52DE', '固定 0°', 'pr-polarizer')}
          ${this._box(340, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'DM', 'pr-dm')}
          ${this._box(350, 200, 100, 45, '半波片 HWP', '#AF52DE', 'HWP λ/2', 'pr-hwp')}
          ${this._box(350, 265, 100, 55, '显微物镜', '#0071E3', 'Objective', 'pr-obj')}
          ${this._box(340, 395, 120, 65, '样品', '#34C759', 'Sample', 'pr-sample')}
          ${this._box(500, 100, 110, 80, '长通 LP', '#FF5E00', 'LP Filter', 'pr-lpfilter')}
          ${this._box(650, 100, 110, 80, '检偏器 A', '#0071E3', isPara ? '设为 0°' : '设为 90°', 'pr-analyzer')}
          ${this._box(800, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'Spectrometer', 'pr-spectro')}

          <!-- Diagonal line on dichroic mirror -->
          <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>
          <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射激发光 ↓</text>
          <rect x="424" y="82" width="86" height="18" rx="5" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="0.8" opacity="0.96"/>
          <text x="467" y="95" font-size="9" fill="#FF5E00" text-anchor="middle" font-weight="700">透射拉曼 ↑</text>



          <!-- Polarization annotations -->
          <line x1="240" y1="90" x2="240" y2="110" stroke="#AF52DE" stroke-width="2"/>
          <text x="240" y="80" font-size="9" fill="#AF52DE" text-anchor="middle">↕ 线偏振</text>
          
          
          
          <line x1="700" y1="90" x2="700" y2="110" stroke="#0071E3" stroke-width="2"/>
          <text x="700" y="80" font-size="9" fill="#0071E3" text-anchor="middle">选择 ${isPara ? 'I_VV' : 'I_VH'}</text>

          <!-- Highlight Overlays for Active Modules -->
          <!-- HWP Highlight Box (操作执行模块) -->
          <rect x="346" y="196" width="108" height="53" rx="8" fill="none" stroke="#FF5E00" stroke-width="2.5" stroke-dasharray="4,2"/>
          <line x1="454" y1="222" x2="465" y2="216" stroke="#FF5E00" stroke-width="1.2"/>
          <rect x="465" y="204" width="138" height="22" rx="6" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="1" opacity="0.96"/>
          <text x="534" y="219" font-size="9" fill="#FF5E00" text-anchor="middle" font-weight="700">🔄 旋转扫描 (操作执行)</text>

          <!-- Analyzer A Highlight Box -->
          <rect x="646" y="96" width="118" height="88" rx="10" fill="none" stroke="#8E8E93" stroke-width="1.5" stroke-dasharray="4,4"/>
          <text x="705" y="91" font-size="9" fill="#8E8E93" text-anchor="middle" font-weight="700">${isPara ? '⚙️ 固定 0°' : '⚙️ 固定 90°'}</text>

          <!-- === Polarization timeline-style state annotations at the bottom === -->
          <rect x="30" y="475" width="${W - 60}" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border)"/>
          <text x="50" y="504" font-size="12" fill="var(--text-primary)" font-weight="700">偏振流：</text>
          
          ${polState(140, 482, '非偏振', '激光', '#AEAEB2')}
          ${polState(250, 482, '↕ 线偏振', '起偏器 P', '#AF52DE')}
          ${polState(360, 482, '经 DM', '反射', '#AF52DE')}
          ${polState(470, 482, '线偏振 (θ)', '经 HWP', '#AF52DE')}
          ${polState(590, 482, '部分偏振', 'Raman发射(上行)', '#FF5E00')}
          ${polState(710, 482, '恢复 ↕', '经 HWP', '#FF5E00')}
          ${polState(820, 482, '经 DM', '透射', '#FF5E00')}
          ${polState(930, 482, isPara ? 'I_VV (0°)' : 'I_VH (90°)', '检偏器 A', '#0071E3')}
          ${polState(1060, 482, '退偏比 ρ', '计算获得', 'var(--text-primary)')}
        </svg>`;

        guideHtml = `
          <strong>线偏振拉曼测量指南 (${isPara ? '平行 Parallel' : '正交 Cross'})：</strong><br>
          1. <b>入射端：</b>起偏器 P 固定在 0° 方向。<br>
          2. <b>操作执行（转动）：</b>连续旋转 <span style="color:#FF5E00;font-weight:700">半波片 HWP</span> 进行角度扫描，改变入射线偏振方向。<br>
          3. <b>探测端：</b>将检偏器 A 固定在 <b>${isPara ? '0° (平行)' : '90° (正交)'}</b>。<br>
          4. <b>实验操作：</b>测试中，需手动或通过电动旋转台连续转动 <span style="color:#FF5E00;font-weight:700">半波片 HWP</span>，并在每个角度记录拉曼光谱。
        `;
      } else {
        // Circular polarization setup
        let q1Angle = '+45°';
        let pType = 'σ⁺';
        let dType = 'σ⁺';
        let analyzerAngle = '0°';
        let calcGroupHtml = '';

        // Determine polarization type from subconfig FIRST, then build formula
        if (subconfig === 'circ-pm') {
          q1Angle = '+45°'; pType = 'σ⁺'; dType = 'σ⁻'; analyzerAngle = '90°';
        } else if (subconfig === 'circ-mp') {
          q1Angle = '-45°'; pType = 'σ⁻'; dType = 'σ⁺'; analyzerAngle = '90°';
        } else if (subconfig === 'circ-mm') {
          q1Angle = '-45°'; pType = 'σ⁻'; dType = 'σ⁻'; analyzerAngle = '0°';
        }
        // circ-pp: defaults already set above (σ⁺σ⁺)

        if (pType === 'σ⁺') {
          calcGroupHtml = `• <b>极化度计算（圆偏振自由度）：</b>在 <b>σ⁺</b> 圆偏振光激发下，本配置 <b>σ⁺σ⁺</b>（检偏 A 调至 0°，对应共偏振 $I_{\\sigma^+\\sigma^+}$）与 <b>σ⁺σ⁻</b>（检偏 A 调至 90°，对应交叉偏振 $I_{\\sigma^+\\sigma^-}$）组成<b>同一对照组</b>。利用公式计算手性度/圆偏振度：<br>
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--orange);padding-left:12px;display:block;margin:6px 0">P_circ = [I(σ⁺σ⁺) - I(σ⁺σ⁻)] / [I(σ⁺σ⁺) + I(σ⁺σ⁻)]</span>`;
        } else {
          calcGroupHtml = `• <b>极化度计算（圆偏振自由度）：</b>在 <b>σ⁻</b> 圆偏振光激发下，本配置 <b>σ⁻σ⁻</b>（检偏 A 调至 0°，对应共偏振 $I_{\\sigma^-\\sigma^-}$）与 <b>σ⁻σ⁺</b>（检偏 A 调至 90°，对应交叉偏振 $I_{\\sigma^-\\sigma^+}$）组成<b>同一对照组</b>。利用公式计算手性度/圆偏振度：<br>
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--orange);padding-left:12px;display:block;margin:6px 0">P_circ = [I(σ⁻σ⁻) - I(σ⁻σ⁺)] / [I(σ⁻σ⁻) + I(σ⁻σ⁺)]</span>`;
        }

        svg = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
          <defs>
            <marker id="pr-arr-r" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF3B30"/></marker>
            <marker id="pr-arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>
            <filter id="pr-glow" x="-30%" y="-30%" width="160%" height="160%">
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
          <rect x="30" y="30" width="500" height="28" rx="6" fill="#FF3B30" opacity="0.08"/>
          <text x="280" y="49" font-size="13" fill="#FF3B30" text-anchor="middle" font-weight="700">激发光路 (含偏振控制)</text>
          <rect x="540" y="30" width="630" height="28" rx="6" fill="#0071E3" opacity="0.08"/>
          <text x="855" y="49" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">发射与偏振检测光路 (PR-Raman)</text>

          <!-- === Beam Lines === -->
          <!-- Laser to P -->
          <line x1="150" y1="140" x2="190" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="150" y1="140" x2="190" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#pr-arr-r)"/>
          
          <!-- P to DM -->
          <line x1="300" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="300" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#pr-arr-r)"/>
          
          <!-- DM down to HWP to Objective to Sample -->
          <line x1="400" y1="140" x2="400" y2="395" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="400" y1="140" x2="400" y2="395" stroke="#FF3B30" stroke-width="2" marker-end="url(#pr-arr-r)"/>
          
          <!-- Sample Raman up -->
          <line x1="400" y1="380" x2="400" y2="140" stroke="#FF5E00" stroke-width="7.5" stroke-dasharray="7,4" opacity="0.35" filter="url(#pr-glow)"/>
          <line x1="400" y1="395" x2="400" y2="140" stroke="#FF5E00" stroke-width="3" stroke-dasharray="7,4" marker-end="url(#pr-arr-g)"/>
          
          <!-- DM straight through LP to A to Spectro -->
          <line x1="400" y1="140" x2="800" y2="140" stroke="#0071E3" stroke-width="8" opacity="0.3" filter="url(#pr-glow)"/>
          <line x1="400" y1="140" x2="800" y2="140" stroke="#0071E3" stroke-width="2.5" marker-end="url(#pr-arr-g)"/>

          <!-- === Optical components === -->
          ${this._box(40, 100, 110, 80, '激光器', '#FF3B30', 'Laser Source', 'pr-laser')}
          ${this._box(190, 100, 110, 80, '起偏器 P', '#AF52DE', '固定 0°', 'pr-polarizer')}
          ${this._box(340, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'DM', 'pr-dm')}
          ${this._box(350, 200, 100, 45, '1/4波片 QWP', '#AF52DE', `快轴 ${q1Angle}`, 'tra-qwp')}
          ${this._box(350, 265, 100, 55, '显微物镜', '#0071E3', 'Objective', 'pr-obj')}
          ${this._box(340, 395, 120, 65, '样品', '#34C759', 'Sample', 'pr-sample')}
          ${this._box(500, 100, 110, 80, '长通 LP', '#FF5E00', 'LP Filter', 'pr-lpfilter')}
          ${this._box(650, 100, 110, 80, '检偏器 A', '#0071E3', `转至 ${analyzerAngle}`, 'pr-analyzer')}
          ${this._box(800, 90, 130, 100, '光谱仪', 'var(--text-primary)', 'Spectrometer', 'pr-spectro')}

          <!-- Diagonal line on dichroic mirror -->
          <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2" stroke-dasharray="4,3"/>
          <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射激发光 ↓</text>
          <rect x="424" y="82" width="86" height="18" rx="5" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="0.8" opacity="0.96"/>
          <text x="467" y="95" font-size="9" fill="#FF5E00" text-anchor="middle" font-weight="700">透射拉曼 ↑</text>

          <!-- Polarization annotations -->
          <line x1="240" y1="90" x2="240" y2="110" stroke="#AF52DE" stroke-width="2"/>
          <text x="240" y="80" font-size="9" fill="#AF52DE" text-anchor="middle">↕ 线偏振</text>
          
          <circle cx="465" cy="255" r="6" fill="none" stroke="#AF52DE" stroke-width="1.5"/>
          <polygon points="473,255 470,252 470,258" fill="#AF52DE" transform="rotate(${q1Angle === '+45°' ? 0 : 180}, 465, 255)"/>
          <text x="480" y="258" font-size="9" fill="#AF52DE" text-anchor="start">${pType} 圆偏振</text>
          
          <line x1="630" y1="90" x2="630" y2="110" stroke="#0071E3" stroke-width="2"/>
          <text x="630" y="80" font-size="9" fill="#0071E3" text-anchor="middle">圆→线</text>

          <!-- Highlight Overlays for Active Modules -->
          <!-- QWP Highlight Box (操作执行模块) -->
          <rect x="346" y="196" width="108" height="53" rx="8" fill="none" stroke="#FF5E00" stroke-width="2.5" stroke-dasharray="4,2"/>
          <rect x="346" y="180" width="108" height="15" rx="3" fill="#FF5E00"/>
          <text x="400" y="191" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 转至 ${q1Angle} (操作执行)</text>

          <!-- Analyzer Highlight Box -->
          <rect x="646" y="96" width="118" height="88" rx="10" fill="none" stroke="#FF5E00" stroke-width="2.5" stroke-dasharray="4,2"/>
          <rect x="646" y="80" width="118" height="15" rx="3" fill="#FF5E00"/>
          <text x="705" y="91" font-size="8.5" fill="#FFFFFF" text-anchor="middle" font-weight="700">🔄 转至 ${analyzerAngle} (操作执行)</text>

          <!-- === Polarization timeline-style state annotations at the bottom === -->
          <rect x="30" y="475" width="${W - 60}" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border)"/>
          <text x="50" y="504" font-size="12" fill="var(--text-primary)" font-weight="700">偏振流：</text>
          
          ${polState(140, 482, '非偏振', '激光', '#AEAEB2')}
          ${polState(250, 482, '↕ 线偏振', '起偏器 P', '#AF52DE')}
          ${polState(360, 482, '经 DM', '反射', '#AF52DE')}
          ${polState(470, 482, `下行: ${pType}圆偏`, 'QWP λ/4', '#AF52DE')}
          ${polState(590, 482, '部分偏振', 'Raman发射', '#FF5E00')}
          ${polState(710, 482, '圆→线转换', 'QWP λ/4', '#FF5E00')}
          ${polState(820, 482, '经 DM', '透射', '#FF5E00')}
          ${polState(930, 482, `I(${pType}, ${dType})`, `检偏器 A (${analyzerAngle})`, '#0071E3')}
          ${polState(1060, 482, '手性分析', '计算拉曼偏振', 'var(--text-primary)')}
        </svg>`;

        guideHtml = `
          <strong>圆偏振拉曼测量指南 (${pType}${dType} 配置)：</strong><br>
          1. <b>入射端：</b>起偏器 P 固定在 0°（水平线偏振）。<br>
          2. <b>第一步调节（QWP）：</b>手动旋转双通路复用的 <span style="color:#FF5E00;font-weight:700">QWP λ/4</span>，将其快轴角设为 <b>${q1Angle}</b>。此时激发光通过 QWP 转换为 <b>${pType}</b> 圆偏振光作用于样品。<br>
          3. <b>第二步调节（检偏器）：</b>样品反射的圆偏振拉曼信号经过相同的 QWP 后，由于双通复用，会被转换回线偏振。在透射端调节 <span style="color:#FF5E00;font-weight:700">检偏器 A</span> 至 <b>${analyzerAngle}</b>，从而选择检测 <b>${dType}</b> 的拉曼信号分量。<br>
          4. <b>实验特点：</b>无需在探测端额外放置第二块 1/4 波片，通过在激发与收集共用的光路（二向色镜与物镜之间）中放置单一 QWP，并配合检偏器 A 旋转选择偏振方向，即可实现完整的圆偏振拉曼 / 手性选择定则测量。<br>
        ${calcGroupHtml}
        `;
      }

      document.getElementById('pol-diagram').innerHTML = svg;
      document.getElementById('raman-polar-operation-guide').innerHTML = guideHtml;
      
      this._attachTooltips();
      this._renderComponents('polarization');
      this._renderNotes('polarization');
    },
    renderConfocal() {
      const W = 1200, H = 550;
      const polState = (x, y, label, desc, color) => `
        <rect x="${x - 55}" y="${y}" width="110" height="36" rx="6" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>
        <text x="${x}" y="${y + 15}" font-size="11" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>
        <text x="${x}" y="${y + 29}" font-size="9" fill="var(--text-secondary)" text-anchor="middle">${desc}</text>`;

      const svg = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block;margin:0 auto">
        <defs>
          <marker id="cr-arr-r" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF3B30"/></marker>
          <marker id="cr-arr-o" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF5E00"/></marker>
          <marker id="cr-arr-b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>
          <marker id="cr-arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#34C759"/></marker>
          <filter id="cr-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
          </pattern>
          <linearGradient id="raman-grad-conv" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF5E00" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#FF5E00" stop-opacity="0.2"/>
          </linearGradient>
          <linearGradient id="raman-grad-div" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF5E00" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#0071E3" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="${W}" height="${H}" fill="var(--bg-card)" rx="12" stroke="var(--border)" stroke-width="1.5"/>
        <rect width="${W}" height="${H}" fill="url(#breadboard-grid)" rx="12"/>

        <!-- Section labels -->
        <rect x="30" y="30" width="410" height="28" rx="6" fill="#FF3B30" opacity="0.08"/>
        <text x="235" y="49" font-size="13" fill="#FF3B30" text-anchor="middle" font-weight="700">激发光路 Excitation Path</text>
        <rect x="460" y="30" width="710" height="28" rx="6" fill="#0071E3" opacity="0.08"/>
        <text x="815" y="49" font-size="13" fill="#0071E3" text-anchor="middle" font-weight="700">发射与检测光路 Emission & Detection Path</text>

        <!-- === Optical Paths (T-Shaped Layout) === -->
        
        <!-- Excitation Laser Beam (Horizontal, Left to DM) -->
        <line x1="160" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#cr-glow)"/>
        <line x1="160" y1="140" x2="340" y2="140" stroke="#FF3B30" stroke-width="2" marker-end="url(#cr-arr-r)"/>
        
        <!-- Polarized Indicator (excitation) -->
        <line x1="250" y1="82" x2="250" y2="98" stroke="#FF3B30" stroke-width="1.8"/>
        <line x1="250" y1="82" x2="253" y2="85" stroke="#FF3B30" stroke-width="1.2"/>
        <line x1="250" y1="82" x2="247" y2="85" stroke="#FF3B30" stroke-width="1.2"/>
        <line x1="250" y1="98" x2="253" y2="95" stroke="#FF3B30" stroke-width="1.2"/>
        <line x1="250" y1="98" x2="247" y2="95" stroke="#FF3B30" stroke-width="1.2"/>
        <text x="250" y="72" font-size="9" fill="#FF3B30" text-anchor="middle" font-weight="700">↕ 线偏振</text>

        <!-- DM reflects Laser beam down vertically -->
        <line x1="400" y1="140" x2="400" y2="380" stroke="#FF3B30" stroke-width="8" opacity="0.3" filter="url(#cr-glow)"/>
        <line x1="400" y1="140" x2="400" y2="380" stroke="#FF3B30" stroke-width="2" marker-end="url(#cr-arr-r)"/>
        <text x="412" y="210" font-size="10.5" fill="#FF3B30" font-weight="600">聚焦激发</text>

        <!-- Raman backscattered beam (Vertical, Sample up to DM) -->
        <line x1="400" y1="380" x2="400" y2="140" stroke="#FF5E00" stroke-width="7.5" opacity="0.3" filter="url(#cr-glow)"/>
        <line x1="400" y1="380" x2="400" y2="140" stroke="#FF5E00" stroke-width="3.5" stroke-dasharray="7,4" marker-end="url(#cr-arr-o)"/>
        <rect x="421" y="258" width="104" height="18" rx="5" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="0.8" opacity="0.96"/>
        <text x="473" y="271" font-size="10" fill="#FF5E00" text-anchor="middle" font-weight="700">Raman 散射 λₛ</text>

        <!-- Horizontal Raman signal beam: DM to Focus Lens L1 -->
        <line x1="400" y1="140" x2="670" y2="140" stroke="#FF5E00" stroke-width="7.5" opacity="0.3" filter="url(#cr-glow)"/>
        <line x1="400" y1="140" x2="670" y2="140" stroke="#FF5E00" stroke-width="3.5" stroke-dasharray="7,4" marker-end="url(#cr-arr-o)"/>

        <!-- Converging beam from L1 to Pinhole -->
        <polygon points="670,125 780,139 780,141 670,155" fill="url(#raman-grad-conv)" opacity="0.45"/>
        
        <!-- Out-of-focus blocked rays -->
        <line x1="670" y1="125" x2="770" y2="115" stroke="#8E8E93" stroke-width="2" stroke-dasharray="5,3" opacity="0.9"/>
        <line x1="670" y1="155" x2="770" y2="165" stroke="#8E8E93" stroke-width="2" stroke-dasharray="5,3" opacity="0.9"/>
        <text x="780" y="88" font-size="9" fill="#AEAEB2" text-anchor="middle">离焦杂散光 (被阻挡)</text>

        <!-- Diverging beam from Pinhole to L2 -->
        <polygon points="780,139 890,125 890,155 780,141" fill="url(#raman-grad-div)" opacity="0.45"/>
        <text x="780" y="194" font-size="9.5" fill="#AF52DE" text-anchor="middle" font-weight="700">共焦点针孔 (孔径 1 AU)</text>

        <!-- Collimated signal beam from L2 to Spectrometer -->
        <polygon points="890,125 1060,125 1060,155 890,155" fill="#0071E3" opacity="0.25" filter="url(#cr-glow)"/>
        <line x1="890" y1="140" x2="1060" y2="140" stroke="#0071E3" stroke-width="2.5" marker-end="url(#cr-arr-b)"/>
        <line x1="890" y1="130" x2="1060" y2="130" stroke="#0071E3" stroke-width="2.2" stroke-dasharray="5,3"/>
        <line x1="890" y1="150" x2="1060" y2="150" stroke="#0071E3" stroke-width="2.2" stroke-dasharray="5,3"/>

        <!-- Diagonal line on dichroic mirror -->
        <line x1="365" y1="175" x2="435" y2="105" stroke="#AF52DE" stroke-width="2.5" stroke-dasharray="5,3"/>
        <text x="350" y="195" font-size="9" fill="#AF52DE" text-anchor="start" font-weight="600">反射激发光 ↓</text>
        <rect x="424" y="82" width="86" height="18" rx="5" fill="var(--bg-card)" stroke="#FF5E00" stroke-width="0.8" opacity="0.96"/>
        <text x="467" y="95" font-size="9" fill="#FF5E00" text-anchor="middle" font-weight="700">透射拉曼 ↑</text>

        <!-- === Confocal Filtering Principle Box === -->
        <rect x="550" y="220" width="330" height="170" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="570" y="245" font-size="13" fill="var(--text-primary)" font-weight="700">共聚焦空间滤波原理</text>

        <circle cx="580" cy="275" r="10" fill="#0071E3" opacity="0.1"/><text x="580" y="279" font-size="11" fill="#0071E3" text-anchor="middle" font-weight="700">1</text>
        <text x="600" y="279" font-size="11" fill="var(--text-primary)" font-weight="600">焦点内信号 (In-focus) - 透过</text>
        <text x="600" y="293" font-size="10" fill="var(--text-secondary)">源自焦平面的拉曼信号刚好汇聚在针孔处并穿过</text>

        <circle cx="580" cy="315" r="10" fill="#FF3B30" opacity="0.1"/><text x="580" y="319" font-size="11" fill="#FF3B30" text-anchor="middle" font-weight="700">2</text>
        <text x="600" y="319" font-size="11" fill="var(--text-primary)" font-weight="600">离焦杂散光 (Out-of-focus) - 阻挡</text>
        <text x="600" y="333" font-size="10" fill="var(--text-secondary)">来自焦平面上方/下方的噪声无法在针孔聚焦，被阻挡</text>

        <circle cx="580" cy="355" r="10" fill="#34C759" opacity="0.1"/><text x="580" y="359" font-size="11" fill="#34C759" text-anchor="middle" font-weight="700">3</text>
        <text x="600" y="359" font-size="11" fill="var(--text-primary)" font-weight="600">纵向切片能力 (3D Sectioning)</text>
        <text x="600" y="373" font-size="10" fill="var(--text-secondary)">通过限制收集深度，实现高对比度 3D 拉曼成像 mapping</text>

        <!-- === Components === -->
        ${this._box(50, 100, 110, 80, '激光器', '#FF3B30', 'Laser Source', 'cr-laser')}
        ${this._box(340, 100, 120, 80, '二向色镜 DM', '#AF52DE', 'Dichroic Mirror', 'cr-dm')}
        ${this._box(350, 295, 100, 70, '高 NA 物镜', '#0071E3', 'Objective', 'cr-objective')}
        ${this._box(340, 380, 120, 70, '样品', '#34C759', 'Sample Stage', 'cr-sample')}
        ${this._box(475, 100, 110, 80, '陷波滤波器', '#AF52DE', 'Notch Filter', 'cr-notch')}
        ${this._box(620, 100, 100, 80, '聚焦透镜 L1', '#0071E3', 'Focus Lens', 'cr-lens-l1')}
        ${this._box(740, 100, 80, 80, '共焦针孔', '#AF52DE', 'Pinhole', 'cr-pinhole')}
        ${this._box(840, 100, 100, 80, '准直透镜 L2', '#0071E3', 'Collimation', 'cr-lens-l2')}
        ${this._box(950, 100, 110, 80, '长通 LP', '#FF5E00', 'LP Filter', 'cr-lpfilter')}
        ${this._box(1060, 90, 130, 100, '光谱仪', '#1D1D1F', '+ CCD 检测器', 'cr-spectro')}

        <!-- 3D XYZ Piezo Scanning Stage Coordinate Overlay -->
        <g transform="translate(40, 40)">
          <line x1="240" y1="400" x2="240" y2="435" stroke="#34C759" stroke-width="1.5" marker-end="url(#cr-arr-g)"/>
          <text x="240" y="448" font-size="10" fill="#34C759" text-anchor="middle" font-weight="600">Z轴 (深度)</text>
          
          <line x1="240" y1="400" x2="205" y2="400" stroke="#34C759" stroke-width="1.5" marker-end="url(#cr-arr-g)"/>
          <text x="196" y="404" font-size="10" fill="#34C759" text-anchor="middle" font-weight="600">X轴</text>
          
          <line x1="240" y1="400" x2="220" y2="380" stroke="#34C759" stroke-width="1.5" marker-end="url(#cr-arr-g)"/>
          <text x="212" y="375" font-size="10" fill="#34C759" text-anchor="middle" font-weight="600">Y轴</text>
          <text x="240" y="358" font-size="9" fill="#34C759" text-anchor="middle">XYZ 压电扫频</text>
        </g>

        <!-- === Polarization state annotations at the bottom === -->
        <text x="40" y="465" font-size="12" fill="var(--text-primary)" font-weight="700">每一步偏振态变化：</text>

        ${polState(100, 480, '↕ 线偏振', '激发光', '#AF52DE')}
        ${polState(250, 480, '↕ 线偏振', '同轴反射/聚焦', '#AF52DE')}
        ${polState(400, 480, '混合偏振', '样品散射', '#34C759')}
        ${polState(550, 480, '部分偏振', '信号透射', '#34C759')}
        ${polState(680, 480, '部分偏振', '信号聚焦', '#0071E3')}
        ${polState(800, 480, '空间滤波', '通焦平面信号', '#AF52DE')}
        ${polState(940, 480, '准直滤波', '平行动光束', '#0071E3')}
        ${polState(1090, 480, '光谱检测', 'CCD 记录', 'var(--text-primary)')}
      </svg>`;

      document.getElementById('confocal-diagram').innerHTML = svg;
      this._attachTooltips();
      this._renderComponents('confocal');
      this._renderNotes('confocal');
    },
    renderCompare() {



      document.getElementById('compare-content').innerHTML = `



      <!-- Main comparison table -->



      <div style="overflow-x:auto;margin-bottom:24px">



        <table style="width:100%;border-collapse:collapse;font-size:13px">



          <thead>



            <tr style="border-bottom:2px solid var(--border)">



              <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600">对比项</th>



              <th style="text-align:center;padding:10px 12px;color:var(--text-secondary);font-weight:600">常规 Raman</th>



              <th style="text-align:center;padding:10px 12px;color:var(--accent);font-weight:600">偏振分辨 Raman</th>



              <th style="text-align:center;padding:10px 12px;color:var(--green);font-weight:600">共聚焦 Raman</th>



            </tr>



          </thead>



          <tbody>



            ${[



              ['额外元件', '无', '起偏器 P + 检偏器 A + HWP', '高NA物镜 + 共聚焦针孔 + XYZ压电平台'],



              ['测量量', 'I(λ)', 'I_VV, I_VH, I_HH, I_HV', 'I(x, y, λ)'],



              ['信息', '分子振动频率/强度', '振动模式对称性/分子取向', '空间化学成分分布'],



              ['分辨率', '光谱分辨率 (<1 cm⁻¹)', '偏振度 (退偏比 ρ)', '~1 μm 空间分辨率'],



              ['典型应用', '材料鉴定、相分析', '晶体取向、对称性分析', '微区 mapping、深度剖析'],



              ['数据维度', '一维：强度 vs 波长', '二维：偏振角 vs 波长', '三维：x, y vs 波长'],



              ['光路复杂度', '★☆☆ 简单', '★★☆ 中等', '★★★ 较复杂'],



              ['典型测量时间', '秒~分钟', '分钟~十分钟', '十分钟~小时（mapping）'],



            ].map(([item, a, b, c]) => `



              <tr style="border-bottom:1px solid var(--border-light)">



                <td style="padding:8px 12px;font-weight:500">${item}</td>



                <td style="padding:8px 12px;text-align:center">${a}</td>



                <td style="padding:8px 12px;text-align:center;color:var(--accent)">${b}</td>



                <td style="padding:8px 12px;text-align:center;color:var(--green)">${c}</td>



              </tr>



            `).join('')}



          </tbody>



        </table>



      </div>







      <!-- Simplified optical path comparison -->



      <div style="font-size:14px;font-weight:700;margin:24px 0 12px">光路对比示意</div>



      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px">



        <!-- Conventional -->



        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center">



          <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:10px">常规 Raman</div>



          <svg viewBox="0 0 300 80" style="width:100%;display:block">



            <rect width="300" height="80" fill="#FAFAFA" rx="8"/>



            <rect x="10" y="20" width="50" height="40" rx="6" fill="white" stroke="#FF3B30" stroke-width="1.5"/>



            <text x="35" y="44" font-size="10" fill="#FF3B30" text-anchor="middle" font-weight="600">激光</text>



            <line x1="60" y1="40" x2="80" y2="40" stroke="#FF3B30" stroke-width="2"/>



            <rect x="80" y="20" width="40" height="40" rx="6" fill="white" stroke="#AF52DE" stroke-width="1.5"/>



            <text x="100" y="44" font-size="9" fill="#AF52DE" text-anchor="middle" font-weight="600">陷波</text>



            <line x1="120" y1="40" x2="140" y2="40" stroke="#FF3B30" stroke-width="2"/>



            <rect x="140" y="18" width="40" height="44" rx="6" fill="white" stroke="#34C759" stroke-width="1.5"/>



            <text x="160" y="44" font-size="10" fill="#34C759" text-anchor="middle" font-weight="600">样品</text>



            <line x1="180" y1="40" x2="200" y2="40" stroke="#FF5E00" stroke-width="1.5" stroke-dasharray="4,2"/>



            <rect x="200" y="20" width="40" height="40" rx="6" fill="white" stroke="#FF5E00" stroke-width="1.5"/>



            <text x="220" y="44" font-size="9" fill="#FF5E00" text-anchor="middle" font-weight="600">长通</text>



            <line x1="240" y1="40" x2="255" y2="40" stroke="#0071E3" stroke-width="2"/>



            <rect x="255" y="18" width="35" height="44" rx="6" fill="white" stroke="#1D1D1F" stroke-width="1.5"/>



            <text x="272" y="44" font-size="9" fill="#1D1D1F" text-anchor="middle" font-weight="600">CCD</text>



          </svg>



          <div style="font-size:11px;color:var(--text-tertiary);margin-top:6px">激光→陷波→样品→长通→CCD</div>



        </div>







        <!-- Polarization-resolved -->



        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center">



          <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:10px">偏振分辨 Raman</div>



          <svg viewBox="0 0 300 80" style="width:100%;display:block">



            <rect width="300" height="80" fill="#FAFAFA" rx="8"/>



            <rect x="5" y="20" width="30" height="40" rx="6" fill="white" stroke="#FF3B30" stroke-width="1.5"/>



            <text x="20" y="44" font-size="9" fill="#FF3B30" text-anchor="middle" font-weight="600">激光</text>



            <line x1="35" y1="40" x2="42" y2="40" stroke="#AF52DE" stroke-width="1.5"/>



            <rect x="42" y="20" width="25" height="40" rx="6" fill="white" stroke="#AF52DE" stroke-width="1.5"/>



            <text x="54" y="44" font-size="9" fill="#AF52DE" text-anchor="middle" font-weight="600">P</text>



            <line x1="67" y1="40" x2="74" y2="40" stroke="#AF52DE" stroke-width="1.5"/>



            <rect x="74" y="20" width="25" height="40" rx="6" fill="white" stroke="#AF52DE" stroke-width="1.5"/>



            <text x="86" y="44" font-size="8" fill="#AF52DE" text-anchor="middle" font-weight="600">HWP</text>



            <line x1="99" y1="40" x2="106" y2="40" stroke="#FF3B30" stroke-width="1.5"/>



            <rect x="106" y="20" width="30" height="40" rx="6" fill="white" stroke="#AF52DE" stroke-width="1.5"/>



            <text x="121" y="44" font-size="8" fill="#AF52DE" text-anchor="middle" font-weight="600">陷波</text>



            <line x1="136" y1="40" x2="145" y2="40" stroke="#FF3B30" stroke-width="1.5"/>



            <rect x="145" y="18" width="35" height="44" rx="6" fill="white" stroke="#34C759" stroke-width="1.5"/>



            <text x="162" y="44" font-size="9" fill="#34C759" text-anchor="middle" font-weight="600">样品</text>



            <line x1="180" y1="40" x2="190" y2="40" stroke="#FF5E00" stroke-width="1.5" stroke-dasharray="3,2"/>



            <rect x="190" y="20" width="25" height="40" rx="6" fill="white" stroke="#FF5E00" stroke-width="1.5"/>



            <text x="202" y="44" font-size="8" fill="#FF5E00" text-anchor="middle" font-weight="600">长通</text>



            <line x1="215" y1="40" x2="222" y2="40" stroke="#0071E3" stroke-width="1.5"/>



            <rect x="222" y="20" width="25" height="40" rx="6" fill="white" stroke="#0071E3" stroke-width="1.5"/>



            <text x="234" y="44" font-size="9" fill="#0071E3" text-anchor="middle" font-weight="600">A</text>



            <line x1="247" y1="40" x2="255" y2="40" stroke="#0071E3" stroke-width="1.5"/>



            <rect x="255" y="18" width="35" height="44" rx="6" fill="white" stroke="#1D1D1F" stroke-width="1.5"/>



            <text x="272" y="44" font-size="9" fill="#1D1D1F" text-anchor="middle" font-weight="600">CCD</text>



          </svg>



          <div style="font-size:11px;color:var(--text-tertiary);margin-top:6px">激光→P→HWP→陷波→样品→长通→A→CCD</div>



        </div>







        <!-- Confocal -->



        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center">



          <div style="font-size:13px;font-weight:700;color:var(--green);margin-bottom:10px">共聚焦 Raman</div>



          <svg viewBox="0 0 300 80" style="width:100%;display:block">



            <rect width="300" height="80" fill="#FAFAFA" rx="8"/>



            <rect x="5" y="20" width="35" height="40" rx="6" fill="white" stroke="#FF3B30" stroke-width="1.5"/>



            <text x="22" y="44" font-size="9" fill="#FF3B30" text-anchor="middle" font-weight="600">激光</text>



            <line x1="40" y1="40" x2="50" y2="40" stroke="#AF52DE" stroke-width="1.5"/>



            <rect x="50" y="20" width="30" height="40" rx="6" fill="white" stroke="#AF52DE" stroke-width="1.5"/>



            <text x="65" y="44" font-size="8" fill="#AF52DE" text-anchor="middle" font-weight="600">陷波</text>



            <line x1="80" y1="40" x2="90" y2="40" stroke="#0071E3" stroke-width="1.5"/>



            <rect x="90" y="15" width="35" height="50" rx="6" fill="white" stroke="#0071E3" stroke-width="1.5"/>



            <text x="107" y="38" font-size="8" fill="#0071E3" text-anchor="middle" font-weight="600">物镜</text>



            <text x="107" y="50" font-size="7" fill="#0071E3" text-anchor="middle">高NA</text>



            <line x1="125" y1="40" x2="140" y2="40" stroke="#34C759" stroke-width="1.5"/>



            <rect x="140" y="15" width="35" height="50" rx="6" fill="white" stroke="#34C759" stroke-width="1.5"/>



            <text x="157" y="35" font-size="8" fill="#34C759" text-anchor="middle" font-weight="600">样品</text>



            <text x="157" y="47" font-size="7" fill="#34C759" text-anchor="middle">XYZ</text>



            <line x1="175" y1="40" x2="185" y2="40" stroke="#FF5E00" stroke-width="1.5" stroke-dasharray="3,2"/>



            <rect x="185" y="20" width="25" height="40" rx="6" fill="white" stroke="#AF52DE" stroke-width="1.5"/>



            <text x="197" y="44" font-size="7" fill="#AF52DE" text-anchor="middle" font-weight="600">针孔</text>



            <line x1="210" y1="40" x2="218" y2="40" stroke="#FF5E00" stroke-width="1.5"/>



            <rect x="218" y="20" width="25" height="40" rx="6" fill="white" stroke="#FF5E00" stroke-width="1.5"/>



            <text x="230" y="44" font-size="8" fill="#FF5E00" text-anchor="middle" font-weight="600">长通</text>



            <line x1="243" y1="40" x2="255" y2="40" stroke="#0071E3" stroke-width="1.5"/>



            <rect x="255" y="18" width="35" height="44" rx="6" fill="white" stroke="#1D1D1F" stroke-width="1.5"/>



            <text x="272" y="44" font-size="9" fill="#1D1D1F" text-anchor="middle" font-weight="600">CCD</text>



          </svg>



          <div style="font-size:11px;color:var(--text-tertiary);margin-top:6px">激光→陷波→物镜→样品(XYZ)→针孔→长通→CCD</div>



        </div>



      </div>







      <!-- When to use which -->



      <div style="font-size:14px;font-weight:700;margin-bottom:12px">选择指南</div>



      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">



        <div style="background:var(--bg-primary);border-radius:10px;padding:16px">



          <div style="font-weight:600;color:var(--red);margin-bottom:8px">选常规 Raman 当：</div>



          <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.8">



            <li>需要快速材料鉴定/相分析</li>



            <li>不需要偏振或空间信息</li>



            <li>样品均匀，无需 mapping</li>



            <li>常规质量控制/成分检测</li>



          </ul>



        </div>



        <div style="background:var(--bg-primary);border-radius:10px;padding:16px">



          <div style="font-weight:600;color:var(--accent);margin-bottom:8px">选偏振分辨 Raman 当：</div>



          <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.8">



            <li>研究晶体对称性/点群</li>



            <li>确定晶体取向/晶轴方向</li>



            <li>分析分子振动模式对称性</li>



            <li>表征应变/应力状态</li>



          </ul>



        </div>



        <div style="background:var(--bg-primary);border-radius:10px;padding:16px">



          <div style="font-weight:600;color:var(--green);margin-bottom:8px">选共聚焦 Raman 当：</div>



          <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.8">



            <li>需要化学成分的空间分布</li>



            <li>微区分析 (微米级)</li>



            <li>多层结构的深度剖析</li>



            <li>异质样品的不均匀性研究</li>



          </ul>



        </div>



      </div>



      `;



    },







    // ==========================================



    // Component list & notes (shared)



    // ==========================================



    _renderComponents(setup) {



      const components = {



        principle: [



          { name: '瑞利散射 (Rayleigh)', id: 'rm-rayleigh' },



          { name: '斯托克斯散射 (Stokes)', id: 'rm-stokes' },



          { name: '反斯托克斯散射 (Anti-Stokes)', id: 'rm-antistokes' }



        ],



        conventional: [



          { name: '激光器', id: 'rm-laser' },



          { name: '陷波滤波器', id: 'rm-notch' },



          { name: '样品', id: 'rm-sample' },



          { name: '收集透镜', id: 'rm-collect' },



          { name: '长通 LP', id: 'rm-lpfilter' },



          { name: '光谱仪 + CCD', id: 'rm-spectro' },



        ],



        polarization: [



          { name: '激光器', id: 'pr-laser' },



          { name: '起偏器 P', id: 'pr-polarizer' },



          { name: '半波片 HWP', id: 'pr-hwp' },



          { name: '陷波滤波器', id: 'pr-notch' },



          { name: '样品', id: 'pr-sample' },



          { name: '收集透镜', id: 'pr-collect' },



          { name: '长通 LP', id: 'pr-lpfilter' },



          { name: '检偏器 A', id: 'pr-analyzer' },



          { name: '光谱仪 + CCD', id: 'pr-spectro' },



        ],



        confocal: [



          { name: '激发二极管激光器', id: 'cr-laser' },



          { name: '同轴二向色镜 (DM)', id: 'cr-dm' },



          { name: '显微物镜', id: 'cr-objective' },



          { name: '样品 + XYZ 扫描平台', id: 'cr-sample' },



          { name: '陷波/边缘滤波器', id: 'cr-notch' },



          { name: '共聚焦聚焦透镜 L1', id: 'rm-collect' },



          { name: '共聚焦空间针孔 (Pinhole)', id: 'cr-pinhole' },



          { name: '准直透镜 L2', id: 'rm-collect' },



          { name: '长通 LP', id: 'cr-lpfilter' },



          { name: '光谱仪 + CCD', id: 'cr-spectro' },



        ],



      };







      const el = document.getElementById('component-list');



      if (!el) return;



      el.innerHTML = (components[setup] || []).map((c, i) => {



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







    _renderNotes(setup) {



      const notes = {



        principle: `
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
            <p style="margin-bottom:10px"><strong>拉曼散射物理机制要点：</strong></p>
            <ul style="padding-left:18px;margin-bottom:12px;list-style-type:disc">
              <li><strong>振动活性：</strong>拉曼散射要求分子极化率发生变化 ($\partial\alpha/\partial q \neq 0$)，而红外吸收要求瞬态偶极矩发生变化 ($\partial\mu/\partial q \neq 0$)。两者具有互补对称性。</li>
              <li><strong>光强波长依赖：</strong>拉曼散射强度正比于激发光频率的四次方 ($I_R \propto \nu^4 \propto \lambda^{-4}$)。蓝绿光激发效率高，但可能激发强荧光背景；红外光激发效率低，但荧光小。</li>
              <li><strong>偏振对称性：</strong>极化率张量的对称性决定了拉曼散射光的偏振方向。通过检测平行或垂直偏振的拉曼光谱，可推导晶格振动模式的对称性群表示。</li>
            </ul>
          </div>
        `,

        conventional: `



          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">



            <p style="margin-bottom:10px"><strong>常规 Raman 光谱要点：</strong></p>



            <ul style="padding-left:20px;margin-bottom:12px">



              <li>光谱范围：100~4000 cm⁻¹（一级 Raman）</li>



              <li>分辨率：&lt;1 cm⁻¹（高分辨光谱仪）</li>



              <li>积分时间：1~300s，根据信号强度调整</li>



              <li>激光功率：避免样品损伤，荧光样品用 785nm/1064nm</li>



              <li>信号强度 ∝ ω⁴（短波长激发信号更强，但荧光干扰也更强）</li>



            </ul>



            <p style="margin-bottom:10px"><strong>常见问题与解决：</strong></p>



            <ul style="padding-left:20px">



              <li>荧光干扰 → 换用更长波长激发 (785nm/1064nm)</li>



              <li>Cosmic ray → 多次采集取中值滤除</li>



              <li>基线漂移 → 多项式基线校正或 airPLS 算法</li>



              <li>信噪比低 → 增加积分时间或累加次数</li>



              <li>样品损伤 → 降低激光功率或使用线聚焦/旋转样品</li>



            </ul>



          </div>`,



        polarization: `



          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">



            <p style="margin-bottom:10px"><strong>偏振 Raman 测量要点：</strong></p>



            <ul style="padding-left:20px;margin-bottom:12px">



              <li>退偏比 ρ = I_VH / I_VV 反映振动模式的对称性</li>



              <li>A₁ 对称模式：ρ ≈ 0（完全偏振）</li>



              <li>E/T 对称模式：ρ = 3/4（完全退偏）</li>



              <li>中间值 ρ 表示部分偏振或混合模式</li>



            </ul>



            <p style="margin-bottom:10px"><strong>偏振配置 (Backscattering)：</strong></p>



            <div style="background:var(--bg-primary);padding:10px 14px;border-radius:8px;font-size:12px;margin:8px 0;line-height:1.8">



              <strong>VV</strong>：入射↑ 检测↑ (z(x,x)z̄)　　<strong>VH</strong>：入射↑ 检测→ (z(x,y)z̄)<br>



              <strong>HH</strong>：入射→ 检测→ (z(y,y)z̄)　　<strong>HV</strong>：入射→ 检测↑ (z(y,x)z̄)<br>



              用 Porto 记号表示散射几何：k_i(e_i e_s)k_s



            </div>



            <p style="margin-bottom:10px"><strong>注意事项：</strong></p>



            <ul style="padding-left:20px">



              <li>仪器偏振响应校正：需测量 G 因子 = I_VV/I_VH（非偏振光源）</li>



              <li>光学元件可能引入额外偏振效应</li>



              <li>需标注样品晶轴方向和测量几何</li>



              <li>粉末/多晶样品各方向平均后信息丢失</li>



            </ul>



          </div>`,



        confocal: `



          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">



            <p style="margin-bottom:10px"><strong>共聚焦 Raman Mapping 参数：</strong></p>



            <ul style="padding-left:20px;margin-bottom:12px">



              <li>空间分辨率：~1 μm（取决于 NA 和针孔大小）</li>



              <li>轴向分辨率：~2~5 μm（Z 方向）</li>



              <li>针孔直径：通常设为 1 Airy 单位 (AU)</li>



              <li>Mapping 步长：0.5~2 μm（应 ≤ 空间分辨率）</li>



              <li>每像素积分时间：0.1~10s</li>



            </ul>



            <p style="margin-bottom:10px"><strong>Mapping 模式：</strong></p>



            <ul style="padding-left:20px;margin-bottom:12px">



              <li>点扫描 (Point by point)：逐点采集，灵活但慢</li>



              <li>线扫描 (Line scan)：同时采集一行，速度快数倍</li>



              <li>面扫描 (Area scan)：完整 XY mapping</li>



              <li>深度扫描 (Depth scan)：Z 轴切片，获得三维信息</li>



            </ul>



            <p style="margin-bottom:10px"><strong>数据分析：</strong></p>



            <ul style="padding-left:20px">



              <li>化学成像：提取特定峰位/峰强的空间分布图</li>



              <li>主成分分析 (PCA)：降维提取主要成分</li>



              <li>聚类分析 (K-means)：自动识别不同区域</li>



              <li>曲线拟合：提取峰位/半高宽/强度的空间变化</li>



            </ul>



          </div>`,



      };



      const el = document.getElementById('notes-content');



      if (el) el.innerHTML = notes[setup] || '';



    },







    destroy() {



      if (this._tooltipEl) this._tooltipEl.style.opacity = '0';



    }



  };







  App.registerTool('raman', tool);



})();




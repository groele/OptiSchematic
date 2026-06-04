# 光学工具集 · OptiSchematic (Optical Toolkit)

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/groele/OptiSchematic)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Chrome%20Extension-orange.svg)](#)
[![Pure JS](https://img.shields.io/badge/Core-Vanilla%20JS%20%26%20CSS-red.svg)](#)

[中文版使用说明](#中文版) | [English Documentation](#english-version)

---

# 中文版

**光学工具集 (OptiSchematic / Optical Toolkit)** 是一款专为科研人员、光学工程师和物理专业师生设计的高保真、交互式光学模拟网页应用与 Chrome 浏览器扩展。系统采用**纯前端架构**（无需任何后端服务器与数据库，适配离线高安全计算），将严谨的物理公式、实时交互的矢量光路图 (SVG) 以及高动态数据可视化图表融合在一起，用于辅助光路设计、光谱学实验方案评估、学术论文绘图素材导出以及光学教学演示。

---

## 🌟 核心全局特性

1. **学术级矢量光路图 (SVG)**：精心绘制的物理光学器件矢量图（含滤镜辉光、标准反射面、三维光束渲染等），支持一键无损导出 `.svg` 格式，可直接用于学术论文 (Nature/Science 风格) 或 PPT 报告。
2. **双向联动高亮交互 (Bidirectional Interaction)**：当鼠标悬停在左侧 SVG 示意图元件上时，会自动高亮并平滑安全滚动定位到右侧对应的元件清单说明；反之，在右侧清单上悬停时，左侧光路图对应的元件也会亮起。
3. **侧边快速换算通道**：左侧导航栏常驻快捷换算面板，支持波长 (nm) $\leftrightarrow$ 能量 (eV) $\leftrightarrow$ 频率 (THz) $\leftrightarrow$ 波数 ($\text{cm}^{-1}$) 的实时联动换算。
4. **轻量无依赖沙盒运行**：图表绘制基于本地封装的简易 Canvas 绘图适配层 (`simple-chart.js` / 本地图表适配)，不依赖任何在线 CDN 脚本，符合 Chrome Extension MV3 的内容安全策略 (CSP)。
5. **极简精致的视觉设计**：采用 Apple 风格的毛玻璃 (Glassmorphism) 卡片设计，自适应支持深色模式 (Dark Mode) 和浅色模式 (Light Mode)。

---

## 🔬 十大核心功能模块详解

### 1. 波长与能量换算 (`wavelength.js`)
* **功能描述**：用于光子波长、能量、频率与波数的相互换算。
* **物理背景与公式**：
  * 光子能量与波长关系：$E = h\nu = \frac{hc}{\lambda} = \frac{1239.84}{\lambda\text{ (nm)}}\text{ (eV)}$
  * 波数与波长关系：$\tilde{\nu} = \frac{1}{\lambda} = \frac{10^7}{\lambda\text{ (nm)}}\text{ (cm}^{-1}\text{)}$
  * 频率与波长关系：$f = \frac{c}{\lambda}$
  * 摩尔能量换算：$1\text{ eV} \approx 96.485\text{ kJ/mol} \approx 23.061\text{ kcal/mol}$
* **输入参数**：可选择输入**波长 $\lambda$ (nm)**、**能量 $E$ (eV)**、**频率 $f$ (THz)** 或**波数 $\tilde{\nu}$ ($\text{cm}^{-1}$)**，支持滑块与数值框双向同步。
* **输出指标**：输出波长 (nm/$\mu\text{m}$)、光子能量 (eV/J)、摩尔能量 (kJ/mol, kcal/mol)、频率 (THz/Hz)、波数 ($\text{cm}^{-1}$) 以及角波数 ($k$, $\text{rad/m}$)。并在下方彩条上实时指示光子对应的光谱区域（从紫外、可见光到红外）。
* **典型应用**：快速确定特定激光激发波长对应的光子能量，评估其是否足以越过半导体样品的带隙。

### 2. 光强/光谱换算器 (`intensity.js`)
* **功能描述**：光度学与辐射度量学单位换算、色温到 RGB 的映射、黑体辐射光谱仿真。
* **物理背景与公式**：
  * **单位换算**：依据视见函数（光视效能 $K(\lambda)$，在 555 nm 处为 683 lm/W）实现照度 ($\text{lux}$)、光强 ($\text{cd}$)、亮度 ($\text{cd/m}^2$) 与辐照度 ($\text{W/m}^2$, $\text{W/cm}^2$)、光子通量 ($\text{photons/s/cm}^2$)、光合有效辐射 ($\text{PPFD}$, $\mu\text{mol/m}^2\text{s}$) 之间的换算。
  * **色温转换**：基于 Tanner Helland 算法实现色温（1000K–40000K）到标准 RGB 及 HEX 色值的转换。
  * **黑体辐射**：基于普朗克黑体辐射定律与维恩位移定律：
    $$B(\lambda, T) = \frac{2hc^2}{\lambda^5} \frac{1}{\exp\left(\frac{hc}{\lambda k_B T}\right) - 1}, \quad \lambda_{peak} \cdot T = 2.898 \times 10^6\text{ nm}\cdot\text{K}$$
* **输入参数**：输入光强数值、源单位、目标单位、测试波长（默认 550 nm）、点源距离（可选，用于平方反比定律计算）；色温数值 $T$ (K)；黑体辐射对比温度 $T_1, T_2, T_3$ (K)。
* **典型应用**：计算环境光照强度折算为光子数通量；模拟太阳、白炽灯等光源的辐射光谱特征及其辐射峰值波长。

### 3. 透镜计算器 (`lens.js`)
* **功能描述**：模拟薄透镜成像的几何光学规律，并提供实时几何光线追迹的可视化画布。
* **物理背景与公式**：
  * 薄透镜成像公式（高斯公式）：$\frac{1}{f} = \frac{1}{u} + \frac{1}{v}$
  * 放大率：$M = -\frac{v}{u}$（$M > 0$ 正立，$M < 0$ 倒立；$|M| > 1$ 放大，$|M| < 1$ 缩小）
  * 组合透镜等效焦距：$\frac{1}{f_{eq}} = \frac{1}{f_1} + \frac{1}{f_2} - \frac{d}{f_1 f_2}$ （$d$ 为透镜间距）
* **输入参数**：透镜类型（凸透镜 $f>0$ / 凹透镜 $f<0$）、焦距 $f$ (mm)、物距 $u$ (mm)、第二透镜焦距 $f_2$ (mm) 及透镜间距 $d$ (mm)。
* **输出指标与可视化**：计算像距 $v$ (mm)、放大率 $M$、成像性质（实像/虚像/平行光，正立/倒立）。画布实时绘制三条特殊光线（平行于主光轴的光线、穿过透镜中心的光线、穿过焦点或向焦点传播的光线）经过单透镜的折射轨迹，并标示焦点 $F$ 与 $F'$ 的位置。
* **典型应用**：实验光路中聚焦物镜与集光透镜位置的精确计算，评估共聚焦光路中的系统放大率。

### 4. Raman 光谱 (`raman.js`)
* **功能描述**：拉曼散射物理机制解释，展示常规、共聚焦、偏振分辨拉曼光谱光路图及性能对比。
* **核心内容**：
  * **散射机制**：说明瑞利散射（弹性，$\nu_s = \nu_0$）、斯托克斯拉曼散射（非弹性红移，$\nu_s = \nu_0 - \nu_v$）和反斯托克斯拉曼散射（非弹性蓝移，$\nu_s = \nu_0 + \nu_v$）能级跃迁过程。
  * **共 confocal 机制**：交互展示空间针孔（Pinhole）如何阻挡离焦面的杂散光，实现高空间分辨率的三维切片测试。
  * **偏振分辨拉曼**：展示如何通过控制激发半波片（HWP）与收集检偏器（Analyzer），测试材料声子振动模的晶格对称性与张量元。
* **典型应用**：了解拉曼测试系统中长通滤波片（Edge Filter）、狭缝与光栅刻线对光谱分辨率和低波数截止限的影响。

### 5. PL 光致发光 (`pl.js`)
* **功能描述**：半导体光致发光过程仿真，提供常规 PL、线偏振 PL、圆偏振 PL 的光路图及能级机理。
* **物理背景与核心机制**：
  * 激发条件：激发光子能量必须大于半导体带隙（$E_{exc} > E_g$），以实现电子从价带到导带的跃迁（光子吸收）。
  * 物理过程：吸收后，载流子首先在皮秒内发生非辐射热弛豫，到达导带底（CBM）与价带顶（VBM），最后发生辐射复合发射光子（发光能量 $h\nu_{PL} = E_g$）。
  * 线偏振度（DOLP）与圆偏振度（DOCP）计算公式：
    $$\text{DOLP} = \frac{I_{\parallel} - I_{\perp}}{I_{\parallel} + I_{\perp}}, \quad \text{DOCP} = \frac{I_{\sigma^+} - I_{\sigma^-}}{I_{\sigma^+} + I_{\sigma^-}}$$
* **参数与选择**：展示如何选用起偏器（Polarizer）、半波片（HWP）和四分之一波片（QWP）来制备和分析偏振发光。
* **典型应用**：二维过渡金属硫族化合物（TMDs，如单层 $\text{MoS}_2$）的谷极化（Valley Polarization，圆偏振 PL）以及取向纳米线发光各向异性（线偏振 PL）测量。

### 6. SHG 二次谐波 (`shg.js`)
* **功能描述**：非线性光学倍频（Second Harmonic Generation）机制演示，提供反射式、透射式和偏振分辨 SHG 光路。
* **物理背景与公式**：
  * 二阶非线性极化响应：$P^{(2)}(2\omega) \propto \chi^{(2)} E(\omega)^2$。由于空间反演对称性限制，中心对称介质的体相中 $\chi^{(2)} \equiv 0$。因此 SHG 对对称性破缺（如单层二维材料、表面界面、铁电畴）极其敏感。
  * 波长转换：$\lambda_{SHG} = \frac{\lambda_{fundamental}}{2}$。例如：$1064\text{ nm} \rightarrow 532\text{ nm}$，或飞秒 $800\text{ nm} \rightarrow 400\text{ nm}$。
  * 晶轴偏振图形拟合：对于 $\text{C}_3$ 对称性单层 TMD 晶体（如单层 $\text{MoS}_2$），平行偏振构型下的强度随入射偏振角 $\theta$ 变化呈六瓣花样：$I_{SHG} \propto \cos^2(3\theta)$。
* **交互参数**：支持调节对称性类型（$\text{C}_3$ 褶皱、$\text{C}_2$ 各向异性、$\text{C}_1$ 各向同性）并实时刷新极坐标图（Polar Plot）。
* **典型应用**：利用偏振分辨 SHG 的六瓣花样快速确定单层二维材料的晶轴取向与晶界位置；表征铁电薄膜（如 CIPS）的铁电极化翻转。

### 7. 偏振检测对比 (`polarization.js`)
* **功能描述**：直观展示光束偏振态在“光源” $\rightarrow$ “样品发光” $\rightarrow$ “偏振元件筛选” $\rightarrow$ “检测器记录”全流程中的物理演化。
* **传播数学公式**：
  * 马吕斯定律（线偏振检测）：$I_{det} = I_0 \cos^2(\theta - \varphi)$
  * 圆偏振检测强度：$I_{det} = \frac{I_0}{2} (1 \pm \text{DOCP} \cdot \sin 2\varphi)$
* **操作配置**：支持自由切换光源偏振态（自然光、线偏振光、圆偏振光），动态调节入射偏振角和检偏器角度，实时计算并显示光电探测器端的强度波形。

### 8. 激光器原理 (`lasers.js`)
* **功能描述**：介绍受激辐射、粒子数反转与光学谐振腔的物理机制；提供脉冲激光峰值功率计算器。
* **核心内容**：
  * **谐振腔正确布局**：由左至右严格排布：泵浦源 $\rightarrow$ 全反镜 (HR) $\rightarrow$ 增益介质 $\rightarrow$ 输出耦合镜 (OC) $\rightarrow$ 激光输出。
  * **脉冲时间尺度对比**：直观展现连续波 (CW)、纳秒 (ns, Q开关)、皮秒 (ps, 锁模)、飞秒 (fs, 锁模) 的典型脉宽、重频和峰值功率差异。
  * **峰值功率计算公式**：
    $$E_{pulse} = \frac{P_{avg}}{f_{rep}}, \quad P_{peak} = \frac{E_{pulse}}{\tau_{pulse}} = \frac{P_{avg}}{f_{rep} \times \tau_{pulse}}$$
* **典型应用**：计算飞秒激光器在不同平均功率和重频下的单脉冲能量与极高峰值功率，评估非线性损伤。

### 9. Spectrometer 原理 (`spectrometer.js`)
* **功能描述**：解构经典的 Czerny-Turner 反射式光谱仪设计，并分析衍射光栅效率。
* **光路与性能公式**：
  * 光栅方程：$d(\sin\theta_i + \sin\theta_d) = m\lambda$
  * 倒线色散公式：$\frac{d\lambda}{dx} = \frac{d \cdot \cos\theta_m}{m \cdot f_2}$
  * 光栅闪耀波长效率曲线：基于闪耀角 $\gamma$ 对应的高斯包络效率计算。
* **典型应用**：根据测量的光谱范围和分辨率要求，选择 300, 600, 1200 或 1800 g/mm 的光栅。

### 10. 高级光路与参考 (`setups.js`)
此模块集成了 **9 种科学研究级的光路系统设计参考模板**，提供了标准的三维及二维矢量器件排布，每一项都附有详细的器件作用和测试流程说明：

1. **时间分辨荧光光谱 (TRPL)**
   * **原理**：利用皮秒/飞秒脉冲激光激发样品，单光子雪崩二极管 (SPAD) 记录荧光，结合时间相关单光子计数 (TCSPC) 获得衰减曲线：$I(t) = I_0 \exp(-t/\tau)$。
   * **典型应用**：测量半导体激子寿命、电荷转移速率。
2. **飞秒泵浦-探测 (Pump-Probe)**
   * **原理**：一束强泵浦光激发样品，一束弱探测光经电动位移延迟线延时（$\Delta t = \frac{\Delta d}{c}$），测量反射/透射率变化 $\Delta R/R$。
   * **典型应用**：表征激子超快热化过程（飞秒级）。
3. **低温强磁场 PL (Magneto-PL)**
   * **原理**：样品置于低温超导磁体恒温器（通常 1.5K-4K, 0-9T）中，利用偏振元件（QWP + Analyzer）分离测试 $\sigma^+$ 和 $\sigma^-$ 谷极化发光。
   * **典型应用**：测量谷 Zeeman 分裂能级和自旋极化。
4. **原位电学 PL 调控 (In-situ Electric PL)**
   * **原理**：微区电学探针台通过源表 (SMU) 施加栅压/漏源偏压，同轴显微聚焦测试微纳器件的稳态发射。
   * **典型应用**：场效应晶体管 (FET) 载流子浓度调控 PL。
5. **Z-Scan 非线性扫描**
   * **原理**：样品随精密位移台在透镜焦点前后（$Z$ 轴）平移。闭口 (CA) 探测非线性折射，开口 (OA) 探测非线性吸收。
   * **典型应用**：测量非线性折射率 $n_2$ 和双光子吸收系数 $\beta$。
6. **迈克尔逊干涉仪 (Michelson Interferometer)**
   * **原理**：扩束激光被 50:50 分束镜分为两路，经参考定镜与扫描动镜（含 PZT）返回相遇形成等厚/等倾干涉条纹。
   * **典型应用**：傅里叶变换光谱（FTIR）、微小位移的高精度测量。
7. **MOKE 磁光克尔效应测量光路**
   * **原理**：利用超稳定连续激光，经高消光比线起偏器与光弹调制器 (PEM) 高频偏振调制。样品反射光经 PBS wollaston 棱镜分束后由平衡探测器差分检测，锁相放大器解调得到克尔旋转角 $\theta_K$。
   * **典型应用**：二维磁性材料的磁化磁滞回线表征。
8. **Fabry-Pérot 共振腔锁定光路**
   * **原理**：外腔半导体激光经光学隔离器和模式匹配透镜耦合进高精细度 F-P 谐振腔。采集反射/透射光反馈给 PID 伺服控制器，控制动镜压电陶瓷 (PZT) 锁定腔长，实现精密稳频。
   * **典型应用**：精密光谱学、窄线宽激光稳频。
9. **超快瞬态吸收光谱 (Transient Absorption)**
   * **原理**：飞秒放大器出射激光分束。一路经 OPA 波长可调谐激发样品；另一路经白光产生晶体产生超连续白光，经电动延迟线延迟后探测样品透射白光光谱。高速采集卡 (DAQ) 差分记录吸光度差 $\Delta A = -\log_{10}(I_{on} / I_{off})$。
   * **典型应用**：捕获激发态吸收 (ESA)、基态漂白 (GSB) 等超快瞬态谱。

---

## 🚀 快速开始

### 方式一：直接在浏览器中打开（独立网页版）
1. 克隆或下载本项目至本地：
   ```bash
   git clone https://github.com/groele/OptiSchematic.git
   ```
2. 双击根目录下的 **`index.html`**，即可直接在任意主流浏览器（Chrome, Edge, Firefox, Safari 等）中打开。

### 方式二：安装为 Chrome 浏览器插件（侧边栏/弹出窗口）
本工具符合 Chrome Manifest V3 标准，支持侧边栏 (Side Panel) 布局，极其适合您在并排阅读 PDF 文献时同步进行物理计算。
1. 打开 Google Chrome，在地址栏输入：`chrome://extensions/`
2. 开启右上角的 **“开发者模式” (Developer mode)**。
3. 点击左上角的 **“加载已解压的扩展程序” (Load unpacked)**。
4. 选择本项目的根目录文件夹（包含 `manifest.json` 的文件夹）。
5. 成功加载后，点击浏览器右上角的扩展栏图标，即可选择：
   - **在侧边栏中打开**：并排嵌入到浏览器侧边栏，支持并排辅助查阅文献；
   - **在独立网页中打开**：在新标签页中以完整分辨率大屏使用。

---

## 💻 开发与技术栈

* **无框架 Vanilla CSS & JavaScript**：纯原生 ES6+ 语法，无任何前端打包构建工具（No Webpack/Vite required），极速响应，即开即用。
* **高精细矢量绘图 (SVG)**：定义了标准器件如凹面镜、激光器、分束镜、波片、样品台、超导磁铁等，所有的偏振光路采用 HSL 动态颜色着色（如激发光为红/橙，信号光为绿/蓝），且通过 `#pl-glow`, `#shg-glow` 滤镜提供柔和发光的视觉质感。
* **无痕主题同步机制**：支持本地 `localStorage` 缓存偏振/视觉状态。在首选主题发生变化时，图表色彩与矢量图填充颜色会平滑过渡。

---

## 📐 常用物理常数表

本工具中的计算引擎采用以下国际推荐的精确物理常数：

| 物理常数 | 符号 | 精确数值 | 单位 |
| :--- | :---: | :--- | :--- |
| **真空光速** | $c$ | $2.99792458 \times 10^8$ | $\text{m/s}$ |
| **普朗克常数** | $h$ | $6.62607015 \times 10^{-34}$ | $\text{J}\cdot\text{s}$ |
| **约化普朗克常数** | $\hbar$ | $1.054571817 \times 10^{-34}$ | $\text{J}\cdot\text{s}$ |
| **玻尔兹曼常数** | $k_B$ | $1.380649 \times 10^{-23}$ | $\text{J/K}$ |
| **基本电荷量** | $e$ | $1.602176634 \times 10^{-19}$ | $\text{C}$ |

---

## 📜 版本历史与开源协议

* **v1.1.0 (当前版本)**：
  - 新增详细的中英文双语项目使用说明文档（README.md）。
  - 调整 Manifest 扩展及边侧栏页面组件的版本同步。
* **v1.0.0**：
  - 新增 MOKE 磁光克尔、F-P 谐振腔锁定、超快瞬态吸收等 3 个高级学术测量光路。
  - 全面优化了矢量光学引导线条的连续性，将纯白色线条替换为符合主题的柔和发光光束。
  - 精准校正二向色镜对齐、偏振控制 QWP 多路复用和半导体激子结合能物理公式规范化。
* **开源协议**：本项目基于 **MIT License** 开源，欢迎自由用于教学、学术论文绘图与二次开发。

---
---

# English Version

**Optical Toolkit (OptiSchematic)** is an interactive, high-fidelity scientific simulation web application and Google Chrome extension designed for researchers, optical engineers, and physics educators. Running **entirely client-side** (no backend server or database required, suitable for air-gapped secure labs), it combines rigorous physics calculation engines with interactive vector schematics (SVG) and dynamic data plotting to assist in optical path design, spectroscopic setup evaluation, paper figure creation, and classroom demonstration.

---

## 🌟 Core General Features

1. **Publication-Grade Vector Schematics (SVG)**: High-quality SVG assets featuring Gaussian beam overlays, arrow headers, holographic optical coatings, and realistic filters. The entire diagram can be exported as a vector `.svg` file with a single click, ready for direct import into Adobe Illustrator, PowerPoint, or academic papers (Nature/Science style).
2. **Bidirectional Interaction**: Programmatic hover highlighting between the interactive SVG diagram components and the sidebar list. Hovering on an SVG element highlights and smoothly scrolls to the matching item in the list card; hovering on a card list item glows the respective optical component in the drawing.
3. **Sidebar Quick Converter**: A persistent sidebar widget allowing instant, real-time conversion between Wavelength (nm), Energy (eV), Frequency (THz), and Wavenumber ($\text{cm}^{-1}$) across all inputs.
4. **Offline Sandboxed Visuals**: Charts and curves are rendered via a lightweight, native HTML Canvas adapter (`simple-chart.js`) rather than online CDN scripts, fully satisfying Google Chrome Extension Manifest V3 Content Security Policy (CSP).
5. **Apple-Inspired Design**: Elegant transitions between light and dark modes with responsive grids and glassmorphism card layouts.

---

## 🔬 In-Depth Documentation of the 10 Core Modules

### 1. Wavelength & Energy Converter (`wavelength.js`)
* **Purpose**: Performs mutual conversion among Wavelength, Photon Energy, Frequency, and Wavenumber.
* **Physics & Formulas**:
  * Photon Energy: $E = h\nu = \frac{hc}{\lambda} = \frac{1239.84}{\lambda\text{ (nm)}}\text{ (eV)}$
  * Wavenumber: $\tilde{\nu} = \frac{1}{\lambda} = \frac{10^7}{\lambda\text{ (nm)}}\text{ (cm}^{-1}\text{)}$
  * Frequency: $f = \frac{c}{\lambda}$
  * Molar Energy Equivalents: $1\text{ eV} \approx 96.485\text{ kJ/mol} \approx 23.061\text{ kcal/mol}$
* **Inputs**: Set Wavelength $\lambda$ (nm), Energy $E$ (eV), Frequency $f$ (THz), or Wavenumber $\tilde{\nu}$ ($\text{cm}^{-1}$). Slider and input field values sync in real time.
* **Outputs**: Displays wavelength in nm and $\mu\text{m}$, energy in eV and Joules, molar energy (kJ/mol, kcal/mol), frequency (THz, Hz), and angular wavenumber ($k$, $\text{rad/m}$). Includes a color bar that dynamically updates to indicate the visible or infrared spectrum region.

### 2. Intensity & Spectrum Converter (`intensity.js`)
* **Purpose**: Converts photometric and radiometric units, maps color temperatures to RGB, and visualizes blackbody spectral radiance.
* **Physics & Formulas**:
  * **Unit Converter**: Converts Luminous Intensity ($\text{cd}$), Illuminance ($\text{lux}$), Luminance ($\text{cd/m}^2$), Irradiance ($\text{W/m}^2$, $\text{W/cm}^2$), Photon Flux ($\text{photons/s/cm}^2$), and Photosynthetically Active Radiation ($\text{PPFD}$, $\mu\text{mol/m}^2\text{s}$) using the photopic eye response curve $K(\lambda)$ (683 lm/W at 555 nm).
  * **Color Temperature**: Utilizes the Tanner Helland mapping algorithm to generate standard RGB and HEX codes for blackbody color temperatures between 1000K and 40000K.
  * **Blackbody Radiance**: Implements Planck's Radiation Law and Wien's Displacement Law:
    $$B(\lambda, T) = \frac{2hc^2}{\lambda^5} \frac{1}{\exp\left(\frac{hc}{\lambda k_B T}\right) - 1}, \quad \lambda_{peak} \cdot T = 2.898 \times 10^6\text{ nm}\cdot\text{K}$$
* **Parameters**: Input value, source/target units, optical wavelength, point source distance (for inverse-square law $E = I/d^2$), color temperature, or compare temperatures ($T_1, T_2, T_3$).

### 3. Lens Calculator (`lens.js`)
* **Purpose**: Computes lens imaging conditions and renders a geometric ray tracing diagram in real time.
* **Physics & Formulas**:
  * Thin Lens Formula: $\frac{1}{f} = \frac{1}{u} + \frac{1}{v}$
  * Magnification: $M = -\frac{v}{u}$ (Real images are inverted $M<0$, virtual images are upright $M>0$)
  * Equivalent Focal Length: $\frac{1}{f_{eq}} = \frac{1}{f_1} + \frac{1}{f_2} - \frac{d}{f_1 f_2}$
* **Inputs**: Convex/Concave toggle, primary focal length $f$ (mm), object distance $u$ (mm), second focal length $f_2$ (mm), and separation distance $d$ (mm).
* **Outputs & Visuals**: Calculates image distance $v$ (mm), magnification $M$, image type, and equivalent focal length. The canvas draws the optical axis, lens, focal points, object, image, and three principal ray paths to demonstrate image formation.

### 4. Raman Spectroscopy (`raman.js`)
* **Purpose**: Explains Raman scattering and displays Conventional, Confocal, and Polarization-resolved Raman configurations.
* **Key Content**:
  * **Scattering Principles**: Explains Rayleigh (elastic), Stokes Raman (red-shifted, energy transferred to vibration), and Anti-Stokes Raman (blue-shifted, energy gained from vibrational state) scattering.
  * **Confocal Aperture**: Interactively demonstrates how a spatial pinhole rejects out-of-focus background rays to enable high-resolution depth profiling.
  * **Polarization-Resolved Raman**: Outlines how linear polarizer, half-wave plate (HWP), and analyzer orientations probe lattice vibrations and Raman tensor symmetries.

### 5. Photoluminescence Spectroscopy (`pl.js`)
* **Purpose**: Illustrates photoluminescence pathways in semiconductors and contrasts Regular, Linear-Polarized, and Circular-Polarized configurations.
* **Physics & Mechanism**:
  * Excitation Condition: Photon absorption occurs only if the excitation energy exceeds the material bandgap ($E_{exc} > E_g$).
  * Recombination Sequence: Absorption $\rightarrow$ Sub-picosecond thermalization / non-radiative relaxation to band edges $\rightarrow$ Radiative recombination releasing a photon ($h\nu_{PL} = E_g$).
  * Degree of Polarization Formulas:
    $$\text{DOLP} = \frac{I_{\parallel} - I_{\perp}}{I_{\parallel} + I_{\perp}}, \quad \text{DOCP} = \frac{I_{\sigma^+} - I_{\sigma^-}}{I_{\sigma^+} + I_{\sigma^-}}$$
* **Application**: Used to study valley polarization (via circular PL) in TMDs (e.g., monolayer $\text{MoS}_2$) or transition anisotropy (via linear PL) in crystalline nanowires.

### 6. Second Harmonic Generation (`shg.js`)
* **Purpose**: Shows nonlinear frequency-doubling pathways, contrasting reflective/transmissive SHG and polarization patterns.
* **Physics & Formulas**:
  * Second-Order Polarization: $P^{(2)}(2\omega) \propto \chi^{(2)} E(\omega)^2$. In centrosymmetric lattices, $\chi^{(2)} \equiv 0$ due to inversion symmetry. Hence, SHG is a sensitive probe for symmetry breaking (monolayers, interfaces, ferroelectric domains).
  * Frequency Doubling: $\lambda_{SHG} = \frac{\lambda_{fundamental}}{2}$ ($1064\text{ nm} \rightarrow 532\text{ nm}$, or $800\text{ nm} \rightarrow 400\text{ nm}$).
  * Polar Pattern Fitting: For a 3-fold symmetric ($\text{C}_3$) monolayer crystal (such as $\text{MoS}_2$), the parallel-polarized SHG intensity fits $I_{SHG} \propto \cos^2(3\theta)$, producing a symmetric 6-fold flower shape.

### 7. Polarization Detection (`polarization.js`)
* **Purpose**: Simulates the evolution of light polarization states through polarizers, waveplates, and detectors.
* **Formulas**:
  * Malus's Law (Linear Polarization): $I_{det} = I_0 \cos^2(\theta - \varphi)$
  * Circular Polarization Intensity: $I_{det} = \frac{I_0}{2} (1 \pm \text{DOCP} \cdot \sin 2\varphi)$
* **Control**: Select input polarization state (unpolarized, linear, circular), rotate waveplates/polarizers, and view the simulated intensity trace at the detector.

### 8. Laser Principles (`lasers.js`)
* **Purpose**: Explains stimulated emission, population inversion, and optical resonator cavities; includes a peak power calculator.
* **Features**:
  * **Physical Cavity Layout**: Left-to-right aligned layout: *Pump Source $\rightarrow$ High Reflector (HR) $\rightarrow$ Gain Medium $\rightarrow$ Output Coupler (OC) $\rightarrow$ Laser Output*.
  * **Pulse Time Scales**: Contrasts pulse width, rep-rate, and peak power for Continuous Wave (CW), Nanosecond (ns), Picosecond (ps), and Femtosecond (fs) regimes.
  * **Power Calculations**:
    $$E_{pulse} = \frac{P_{avg}}{f_{rep}}, \quad P_{peak} = \frac{E_{pulse}}{\tau_{pulse}} = \frac{P_{avg}}{f_{rep} \times \tau_{pulse}}$$

### 9. Spectrometer Principles (`spectrometer.js`)
* **Purpose**: Explores Czerny-Turner monochromator designs and diffraction grating behaviors.
* **Physics & Parameters**:
  * Grating Diffraction Equation: $d(\sin\theta_i + \sin\theta_d) = m\lambda$
  * Reciprocal Linear Dispersion: $\frac{d\lambda}{dx} = \frac{d \cdot \cos\theta_m}{m \cdot f_2}$ ($f_2$ is focusing focal length)
  * Theoretical Resolution Limit: $R = \frac{\lambda}{\Delta\lambda} = m \cdot N$ ($N$ is total illuminated grooves)
* **Application**: Helps configure optical setups by showing diffraction efficiency curves for 300, 600, 1200, and 1800 g/mm gratings.

### 10. Advanced Scientific Setups (`setups.js`)
This module integrates **9 academic reference templates for scientific measurement setups**, presenting high-fidelity vector layouts and comprehensive operation procedures:

1. **Time-Resolved PL (TRPL)**
   * **Mechanism**: Picosecond/femtosecond pulse laser excitation coupled with a Single-Photon Avalanche Diode (SPAD) detector and Time-Correlated Single Photon Counting (TCSPC) electronics to plot decay profiles: $I(t) = I_0 \exp(-t/\tau)$.
   * **Applications**: Determining carrier lifetime and charge separation rate in solar cells.
2. **Femtosecond Pump-Probe**
   * **Mechanism**: Splits a femtosecond beam into a strong Pump (exciting the sample) and a weak Probe (detecting state transmission/reflection changes $\Delta R/R$), using a retroreflector on a motorized delay stage ($\Delta t = \frac{\Delta d}{c}$).
   * **Applications**: Capturing sub-picosecond hot carrier thermalization dynamics.
3. **Cryogenic Magneto-PL (Magneto-PL)**
   * **Mechanism**: Sample is loaded into a cryogenic superconducting magnet cryostat ($1.5\text{ K}\sim 4\text{ K}$, $0\sim 9\text{ T}$). Uses Faraday or Voigt geometry.
   * **Applications**: Probing exciton Zeeman splitting and valley polarization.
4. **In-situ Electric PL**
   * **Mechanism**: Incorporates a micro-region probe stage linked with a Source Measure Unit (SMU) to supply gate voltage/drain-source bias during microscope imaging.
   * **Applications**: Monitoring carrier density tuning of exciton and trion PL.
5. **Z-Scan Nonlinear Scanning**
   * **Mechanism**: A high-peak-power beam is focused to a waist. The sample is translated through the focal point along the Z-axis. Closed-Aperture (CA) measures nonlinear refraction, while Open-Aperture (OA) measures nonlinear absorption.
   * **Applications**: Measuring nonlinear refractive index $n_2$ and two-photon absorption $\beta$.
6. **Michelson Interferometer**
   * **Mechanism**: Splitting an expanded laser beam via a 50:50 beamsplitter into reference (static) and scanning (PZT modulated) arms to observe interference fringes.
   * **Applications**: Precision interferometry, Fourier-transform spectroscopy (FTIR).
7. **MOKE (Magneto-Optic Kerr Effect)**
   * **Mechanism**: Uses a stable CW laser, a high-extinction polarizer, and a Photoelastic Modulator (PEM) for high-frequency polarization modulation. Reflective polarization rotation ($\theta_K$) is detected using a Wollaston Prism and a Balanced Photodiode connected to a Lock-in amplifier.
   * **Applications**: Probing hysteresis loops and magnetic domain reversals in 2D magnets.
8. **Fabry-Pérot Cavity Locking**
   * **Mechanism**: Stabilizes a diode laser (ECDL) frequency by routing light through an isolator and mode-matching lenses to a high-finesse F-P cavity. Servocontrol processes the PD error signal to feed back voltage to a mirror PZT.
   * **Applications**: Laser frequency stabilization, optical cavity filters.
9. **Ultrafast Transient Absorption (TA)**
   * **Mechanism**: splits a femtosecond amplifier output into a wavelength-tunable Pump (via OPA) and a supercontinuum White-Light Probe (WLC). Signals are captured by an imaging spectrometer, line sensors, and high-speed DAQ cards to compute transient absorbance: $\Delta A = -\log_{10}(I_{on} / I_{off})$.
   * **Applications**: Mapping excited-state absorption (ESA) and ground-state bleaching (GSB).

---

## 🚀 Getting Started

### Option A: Running Locally in Your Browser
1. Clone or download this repository:
   ```bash
   git clone https://github.com/groele/OptiSchematic.git
   ```
2. Double-click the **`index.html`** file in the root directory to launch the application instantly in Chrome, Safari, Firefox, or Edge.

### Option B: Installing as a Chrome Extension (Side Panel or Tab)
OptiSchematic is fully compatible with Manifest V3. You can run it inside the Chrome Side Panel, which is helpful for side-by-side reading of PDF research papers and running calculations.
1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** (加载已解压的扩展程序) in the top-left.
4. Select the project root folder (containing `manifest.json`).
5. Click the OptiSchematic icon in your extensions toolbar to choose:
   - **Open in Side Panel**: Locks the toolkit to the side of your browser.
   - **Open in New Tab**: Opens a full-screen instance of the app.

---

## 💻 Tech Stack & Customization

* **Pure Vanilla CSS & JS**: No bundling tools or framework overhead required, ensuring fast load times.
* **Advanced HSL SVG Render**: Leverages custom HSL gradients for visual pathways (e.g. green for SHG, red for PL emission). Uses SVG glow filters for high-quality visual cues.
* **Theme Sync**: Automatically synchronizes settings using local browser storage (`localStorage`) and supports system-wide dark/light theme switching.

---

## 📜 Version History & MIT License

* **v1.1.0 (Current Version)**:
  - Added detailed, high-fidelity bilingual documentation and usage manuals.
  - Synchronized browser extensions and sidebar versions.
* **v1.0.0**:
  - Added MOKE, Fabry-Pérot resonator, and Ultrafast Transient Absorption setups.
  - Optimized vector lines in diagrams (replaced all pure white lines with soft gray and blue glowing paths).
  - Resolved character encoding, dichroic mirror alignment, and mathematical formula rendering across all theme configurations.
* **License**: This project is released under the **MIT License**, permitting free educational and commercial reuse.

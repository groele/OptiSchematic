# 光学工具集 — Optical Toolkit (OptiSchematic)

[English](#english) | [中文](#中文)

---

## English

**Optical Toolkit (OptiSchematic)** is an interactive, high-fidelity scientific simulation web application and Chrome extension designed for researchers, optical engineers, and physics educators. It enables users to learn, design, calculate, and visualize advanced optical systems, laser physics, and spectroscopy setups.

The application runs entirely in the browser (client-side) with no backend database or server required.

### 🌟 Key Features

*   **Interactive Vector Schematics**: Beautiful, publication-grade SVG schematics for standard optical configurations (PL, Raman, SHG, Czerny-Turner Spectrometer, lasers, and advanced time-resolved setups).
*   **Bidirectional Interaction**: Programmatic hover highlighting between the interactive SVG diagram components and the sidebar listing. Element hovers trigger safe programmatic scrolling to align list items locally inside their cards.
*   **Real-time Calculators & Physics Engines**:
    *   **Wavelength & Energy Channel**: Dynamic conversions between wavelength (nm), energy (eV), frequency (THz), and wavenumber ($cm^{-1}$).
    *   **Gaussian Beam Profiler**: Simulates beam waist radius, Rayleigh length, divergence angle, and renders dynamic beam propagation profiles.
    *   **Lens Tracer**: Thick/thin lens combinations and real-time geometric ray tracing.
    *   **Laser Pulse Calculator**: Computes pulse energy, peak power, and power density from average power, rep-rate, and pulse duration (ns/ps/fs).
    *   **Grating & Spectrometer Calculator**: Solves the grating diffraction equation ($d \cdot \sin\theta_m = m\lambda$) and plots efficiency curves.
*   **Publication-Grade Export**: Support for exporting high-quality vector `.svg` diagrams directly from the simulation canvas to use in scientific papers or presentations.
*   **Apple-Inspired Dark & Light Theme**: Elegant transitions between light and dark modes with responsive charts and clean vector aesthetics.

---

### 🔬 Core Modules

1.  **Raman Spectroscopy (`raman.js`)**: Conventional, Confocal, and Polarization-resolved (linear/circular) setups. Includes 3D spatial filtering annotations and Rayleigh vs. Stokes scattering principles.
2.  **PL (Photoluminescence) Spectroscopy (`pl.js`)**: Reflective co-axial emission collection setups, with linear and circular polarization waveplate configurations and degree of polarization calculators.
3.  **Nonlinear SHG (Second Harmonic Generation) (`shg.js`)**: Excitation-polarization angle curves ($I_{SHG}(\theta)$ polar plots), transmissive/reflective modes, and 2D materials TMD crystal axis orientation determination.
4.  **Laser Principles & Time Scales (`lasers.js`)**: Explains stimulated emission, population inversion, and mode-locking. Rearranged in a physically accurate resonator layout (*Pump $\rightarrow$ HR $\rightarrow$ Gain Medium $\rightarrow$ OC $\rightarrow$ Output*).
5.  **Spectrometer Principles (`spectrometer.js`)**: Interactive Czerny-Turner path with collimating and focusing concave mirrors, grating efficiency analysis, and detector arrays.
6.  **Advanced Scientific Setups (`setups.js`)**: Scientific reference optical paths for Time-Resolved PL (TRPL), ultrafast Pump-Probe, Cryogenic Magneto-Optics, and *in-situ* electric/ferroelectric tuning.

---

### 💻 Technology Stack

*   **HTML5 & CSS3**: Pure CSS custom properties for Apple-inspired light/dark theme synchronization, glassmorphism card UI, and layout grids.
*   **Vanilla JavaScript**: Modular registration framework (`App.registerTool`) with no heavy framework overhead.
*   **SVG (Scalable Vector Graphics)**: Rich HSL-tailored colored paths, arrow markers, glowing filters (`#pl-glow`, `#shg-glow`), and interactive hitboxes.
*   **Chart.js**: Dynamic plotting of laser waveforms, pulse peak powers, grating efficiency envelopes, and SHG polarization polar plots.

---

### 🚀 Getting Started

#### Option A: Run Locally in the Browser
Simply clone the repository and double-click **`index.html`** to open the tool directly in any modern browser.

#### Option B: Install as a Chrome Extension
1.  Open Google Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** in the top-right corner.
3.  Click **Load unpacked** (加载已解压的扩展程序) in the top-left.
4.  Select the project root directory containing `manifest.json`.
5.  The **Optical Toolkit** is now available in your extensions bar!

---

## 中文

**光学工具集 (OptiSchematic)** 是一款面向科研学者、光学工程师及物理专业师生的交互式、高保真光学模拟网页应用与 Chrome 浏览器插件。该工具集集成了光路原理设计、激光物理仿真、常见光谱测试和实验参数换算等功能，旨在辅助科研绘图、光路设计教学及实验方案评估。

系统采用纯前端架构，无需后端数据库或服务器支持，即开即用。

### 🌟 主要特性

*   **学术级矢量光路图**：包含 PL、Raman、SHG、Czerny-Turner 光谱仪、激光谐振腔以及多种超快/原位科研光路的矢量 SVG 示意图，支持一键导出学术论文级 `.svg` 素材。
*   **双向联动高亮交互**：鼠标悬停在 SVG 示意图元件上时，会自动高亮并安全平滑滚动定位到右侧对应的元件介绍清单；反之，悬停在清单条目上也会在左侧光路图上凸显对应的元件。
*   **实时物理引擎与计算器**：
    *   **快速换算通道**：动态实现波长 (nm) $\leftrightarrow$ 能量 (eV) $\leftrightarrow$ 频率 (THz) $\leftrightarrow$ 波数 ($cm^{-1}$) 互转。
    *   **高斯光束分析**：输入束腰、波长可实时模拟光束传播剖面、瑞利长度及发散角。
    *   **透镜成像计算**：支持薄/厚透镜组合的几何光线追迹模拟。
    *   **脉冲激光峰值功率计算器**：根据平均功率、重复频率及脉冲宽度（ns/ps/fs）换算单脉冲能量、峰值功率和功率密度。
    *   **光栅方程与光谱仪分辨率**：根据光栅方程 ($d \cdot \sin\theta_m = m\lambda$) 仿真不同衍射级次的色散与光栅效率曲线。
*   **双色主题切换**：支持深色模式与浅色模式，图表与矢量图色彩可随系统主题优雅过渡。

---

### 🔬 核心功能模块

1.  **Raman 拉曼光谱 (`raman.js`)**：常规拉曼、共聚焦拉曼与偏振分辨拉曼。包含共聚焦空间滤波原理（针孔滤除离焦杂光）及瑞利/斯托克斯散射物理过程。
2.  **PL 光致发光 (`pl.js`)**：同轴后向散射收集光路，配备线偏振、圆偏振片组合测试及偏振度计算。
3.  **SHG 二次谐波非线性光学 (`shg.js`)**：支持反射式、透射式及偏振分辨 SHG。动态模拟入射偏振角度与二次谐波强度关系（极坐标图极图极化模式），用于提取二维 TMD 材料（如单层 $MoS_2$, $WSe_2$）的晶轴方向。
4.  **激光器原理与时间尺度 (`lasers.js`)**：受激辐射与粒子数反转机制。提供物理结构正确的谐振腔布局示意图（*泵浦源 $\rightarrow$ 全反镜 $\rightarrow$ 增益介质 $\rightarrow$ 输出耦合镜 $\rightarrow$ 激光输出*），以及连续与超快脉冲波形对比。
5.  **光谱仪原理 (`spectrometer.js`)**：Czerny-Turner 光谱仪光路，入射光发散/准直、光栅色散及聚焦镜成像的动态演绎。准直镜与聚焦镜采用标准的凹面反射镜矢量图标。
6.  **高级光路与参考 (`setups.js`)**：科研级时间分辨 PL (TRPL)、飞秒泵浦-探测 (Pump-Probe)、低温强磁场磁光系统，以及电学/铁电原位调控光谱方案。

---

### 💻 技术栈

*   **HTML5 & CSS3**：采用原生 CSS 变量实现主题切换及响应式网格布局。
*   **原生 JavaScript (ES6+)**：采用轻量级路由与模块注册机制 (`App.registerTool`)，响应极速。
*   **SVG 矢量绘图**：包含多种发光波段的辉光滤镜 (`#pl-glow`, `#shg-glow`)、反射面及高精物理器件矢量图。
*   **Chart.js**：用于实时仿真激光脉冲时间波形、脉宽-峰值功率对比图、光栅效率包络及二次谐波偏振极坐标图。

---

### 🚀 使用指南

#### 方式一：本地直接运行
下载或克隆项目代码后，直接双击运行根目录下的 **`index.html`**，即可在任意主流浏览器中独立使用全部功能。

#### 方式二：安装为 Chrome 浏览器插件
1.  打开谷歌浏览器 (Chrome)，在地址栏输入 `chrome://extensions/` 打开扩展程序管理页面。
2.  开启右上角的 **“开发者模式”** (Developer mode)。
3.  点击左上角的 **“加载已解压的扩展程序”** (Load unpacked)。
4.  选择本项目所在的根目录（即包含 `manifest.json` 的文件夹）。
5.  在浏览器的扩展程序栏中点击 **光学工具集** 即可启用！

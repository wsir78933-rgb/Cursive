# Cursive Generator 页面重新设计方案

日期：2026-06-07

## 1. 目标

把当前 Cursive Generator 从“粗黑边、彩色块、玩具感工具页”重设计为一个成熟的高级字体工作台。

目标不是简单换颜色，而是重建页面的信息架构和视觉语言，让用户一进入页面就清楚完成三件事：

1. 输入文本。
2. 选择字体样式并实时预览。
3. 复制 Unicode 文本，或把字体预览保存成 PNG。

## 2. 设计方向

采用“高级字体工作台”方向。

这个方向适合当前产品，因为页面已有字号、颜色、透明背景、PNG 保存、字体预览、复制状态等功能。它不像普通文本转换器，更接近轻量的字体设计工具。

视觉关键词：

- 干净
- 专业
- 精致
- 轻量工作台
- 大预览
- 控制面板
- 字体素材库

明确移除当前视觉语言中的这些元素：

- 粗黑边
- 硬阴影
- 高饱和大色块
- 玩具感按钮
- 全页面网格背景
- 过重的卡片边框

## 3. 页面结构

新版页面分为五个主要区域：

1. 顶部导航
2. 首屏介绍与主工作台
3. 字体筛选栏
4. 字体库
5. 内容与 FAQ 区

### 3.1 顶部导航

顶部导航保持简单，只承载必要入口。

左侧：

- Cursive Generator 品牌名
- 简洁字母标识或文字标识

右侧：

- FAQ 锚点
- 中英文切换

视觉要求：

- 使用浅色背景
- 使用细边框或底部分隔线
- 不使用粗黑边和硬投影
- 按钮保持小尺寸和克制样式

### 3.2 首屏介绍与主工作台

首屏需要同时完成“说明产品”和“让用户开始使用”。

桌面端布局：

```text
左侧：标题、说明、输入框
右侧：实时大预览卡片
```

移动端布局：

```text
标题
说明
输入框
实时大预览卡片
控制项
```

标题建议：

```text
Cursive Text Generator
```

说明文案方向：

```text
Create elegant cursive text for social profiles, documents, invitations, and images.
```

中文对应方向：

```text
生成适合社交资料、文档、邀请函和图片的花体文字。
```

输入区要求：

- 输入框要明显，但不厚重。
- 输入框旁保留 Clear 操作。
- 输入文字变化时，主预览和字体卡片同步变化。

### 3.3 主预览区

主预览区是新版页面的核心，不再只依赖弹窗预览。

主预览区需要展示：

- 当前选中字体名称
- 当前状态：Copyable 或 Preview only
- 当前平台推荐标签，例如 Social、Google Docs、MS Word
- 当前预览文本
- 操作按钮：Copy、Save PNG、Preview

布局示意：

```text
Selected style                         Copyable
Unicode Script                         Social

        𝒽𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹

[ Copy text ] [ Save PNG ] [ Preview ]
```

行为要求：

- Unicode 字体复制转换后的 Unicode 文本。
- Google Font / system font 复制原始文本，不假装复制字体效果。
- Preview only 的字体主要引导用户预览或保存 PNG。
- PNG 导出内容必须和主预览的字体、颜色、字号、背景设置一致。

### 3.4 控制面板

控制面板承载文本视觉设置。

包括：

- Font size
- Text color
- Transparent background
- Clear

样式要求：

- 类似轻量设计工具面板。
- 使用白底、浅边框、柔和阴影。
- 不使用当前蓝色硬边设置框。
- 色彩按钮使用圆形或小色块，减少装饰感。

暂不新增复杂功能。对齐、背景色、多行排版等功能可以后续再做，当前设计只整理已有功能。

## 4. 字体筛选栏

当前筛选按钮过重。新版改成轻量标签栏。

筛选项保持现有五个：

- All
- Social
- Google Docs
- Installable
- MS Word

视觉要求：

- 横向标签布局。
- 移动端允许横向滚动。
- 选中状态用浅底色、细描边、较深文字表达。
- 不使用 Radio 圆点的强视觉形式。

行为保持：

- 切换筛选后只显示对应字体。
- 如果当前选中字体不在新筛选结果中，自动选择该筛选下第一个字体。

## 5. 字体库

字体库从“玩具卡片网格”调整为“字体素材库”。

单个字体卡片内容：

```text
预览文本
字体名称
状态标签 / 来源标签
操作图标
```

视觉要求：

- 白色或极浅背景。
- 1px 浅边框。
- 柔和 hover 状态。
- 选中状态用清晰但克制的描边和背景。
- 卡片高度比当前更紧凑。
- 字体预览文本优先，卡片装饰退后。

行为保持：

- 点击卡片主体：选中字体。
- 点击操作图标：
  - Copyable 字体执行复制。
  - Preview only 字体打开预览。
- 已复制反馈保留，但样式变轻。

## 6. 内容与 FAQ 区

底部内容需要更像成熟工具站，但不能堆砌无意义 SEO 文案。

建议新增或重排为四块：

1. How it works
2. Where can you use cursive text?
3. Copyable cursive vs font preview
4. FAQ

内容原则：

- 短句。
- 分步骤。
- 解释 Unicode 可复制字体和字体预览的区别。
- 保留中英文文案能力。

## 7. 组件边界

保持高内聚、低耦合。主页面只做状态调度，不把所有 UI 都塞进一个大组件。

建议组件结构：

- `CursiveGeneratorPage`
  - 负责页面状态、筛选、复制、保存、预览弹窗开关。
- `GeneratorHeader`
  - 负责顶部导航。
- `GeneratorHero`
  - 负责标题、说明和输入入口。
- `GeneratorWorkbench`
  - 负责主预览区和控制面板布局。
- `StylePreviewPanel`
  - 负责当前选中字体的大预览和操作按钮。
- `GeneratorToolbar`
  - 负责字号、颜色、透明背景、清空等控制。
- `StyleFilterTabs`
  - 负责筛选标签。
- `FontGrid`
  - 负责字体卡片网格。
- `FontCard`
  - 负责单张字体卡片。
- `FaqSection`
  - 负责底部说明与 FAQ。
- `PreviewDialog`
  - 保留为放大预览。

如果实现时为了控制改动量，也可以先不拆出所有新组件，但必须避免让 `CursiveGeneratorPage` 继续膨胀成大型 UI 文件。

## 8. 数据流

核心状态保持现有结构：

- `inputText`
- `fontSize`
- `textColor`
- `transparentBackground`
- `selectedFilter`
- `selectedStyleId`
- `isPreviewOpen`
- `copyLabel`
- `copiedStyleId`

派生数据：

- `visibleStyles`：根据筛选得到的字体列表。
- `selectedStyle`：当前选中的字体。
- `selectedPreviewText`：当前样式下的预览文本。

核心函数保持单一职责：

- `getPreviewText(textStyle)`：只负责生成预览文本。
- `copyStyleToClipboard(textStyle)`：只负责复制和反馈。
- `handleSave()`：只负责保存 PNG。
- `handleFilterChange(value)`：只负责筛选切换和选中项修正。

## 9. 国际化

新增文案必须进入 `src/lib/i18n.ts`，不在组件中硬编码。

需要新增的文案类型包括：

- Hero 说明文案
- Selected style 标签
- Text settings 标题
- Copyable / Preview only 的更清晰说明
- How it works 区块
- Where can you use cursive text 区块
- Copyable cursive vs font preview 区块

## 10. 错误处理

保留 Fail Fast 原则。

- PNG 导出目标缺失时继续抛出明确错误。
- Unicode 字体缺少 `unicodeMap` 时继续抛出明确错误。
- 不新增 `try/catch` 静默吞错。
- 复制失败时只显示明确失败反馈，不假装成功。

## 11. 测试与验证

实现后需要验证：

1. 英文页面可访问。
2. 中文页面可访问。
3. 输入文字后，主预览和字体卡片同步变化。
4. 切换字体后，主预览字体变化。
5. Unicode 字体复制的是转换后的 Unicode 文本。
6. 非 Unicode 字体不会错误暗示复制字体效果。
7. PNG 保存使用当前字体、字号、颜色、背景设置。
8. 筛选标签切换后，字体列表正确。
9. 当前选中字体不在筛选结果里时，会自动切到可见字体。
10. 移动端布局不会横向溢出。
11. `npm run lint` 通过。
12. `npm run test` 通过。

## 12. 非目标

本次不做以下事情：

- 不新增用户账号。
- 不新增模板库。
- 不新增收费功能。
- 不新增复杂图片编辑器。
- 不新增字体搜索。
- 不新增真实第三方字体安装流程。
- 不做 SEO 长文堆砌。

## 13. 验收标准

设计完成后，页面应该满足：

- 首屏能明确表达这是一个字体生成/预览/保存工具。
- 页面视觉不再像练习项目或玩具页面。
- 字体预览成为视觉中心。
- 控制项清楚、克制、像工具面板。
- 字体卡片更适合快速比较。
- Unicode 可复制和字体预览的区别被清楚表达。
- 桌面端和移动端都可用。
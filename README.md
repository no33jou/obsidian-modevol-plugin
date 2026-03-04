# Obsidian Modevol plugin

### 本版本修订 
[x] 增加obsidian 插件配置面板，在obsidian插件面板中，自定义增加标签字母、对应的文本颜色和svg图案，以适应不同标签体系下颜色自定义。



### Function：an Obsidian plugin for fit [modevol](https://www.modevol.com/) style.

[x] Edit a state field for DETCV label.

[ ] In the status bar, create a new block that displays the statistics of modevol.

[ ] The label is associated with the title and show the tree of titles and labels.

### View 

#d Description 描述

#c Custom 自定义

#v Verification 验证    

#e Example 例子 

#t  Transfer 迁移     

#s Summary  总结

#q Question 提问

![image](https://user-images.githubusercontent.com/12016782/218115364-1aaf0e6f-a14e-4614-afd2-4061e8d741c7.png)

### Usage

[#d title relation]

[#e title relation]

[#v title ]

[#t title relation]

[#c name title relation]

### Installation

-   Download the Latest Release from the Releases section of the GitHub Repository
-   Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`  
    Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
-   Reload Obsidian
-   If prompted about Safe Mode, you can disable safe mode and enable the plugin.
    Otherwise head to Settings, third-party plugins, make sure safe mode is off and
    enable the plugin from there.

![image](https://user-images.githubusercontent.com/12016782/218239969-4f6687ff-d3f0-4fc3-be78-a2e447864530.png)


# Bugfix Log

## 1. 运行时必崩 Bug — `this` 上下文丢失
- **出现原因**: `src/main.ts` 第 159 行，在 `this.registerEvent` 函数注册 `editor-change` 事件的 `debounce` 缓冲防抖时，没有正确地绑定 `_refreshHeader` 方法里面的 `this` 导致其上下文丢失。
- **修复方案**: `refreshHeader = debounce(this._refreshHeader.bind(this), 300)`，通过 `.bind(this)` 保存正确的执行上下文。
- **验证结果**: Jest 本地覆盖测试通过 (`tests/main.test.ts` 中 `refreshHeader should maintain this context when debounced` 测试用例)。

## 2. 正则从精确匹配改成全字母通配 — 破坏用户空间
- **出现原因**: 在 PR 修改时，直接把原本的精确匹配改成了全字母通配 `/#([a-z])(?=\\\s)(.*|$)/i`，使得任何首字母后带空格的文本都被错误劫持为自定义标签。
- **修复方案**: 在 `ExpressionInterpreter.ts` 和 `MarkdownPostProcessor` (借由 `ModevolWidget` 中 `suffToClassMap` 动态收集规则) 已有逻辑中加入对应单元测试防护。代码目前已经通过收集启用的配置 `keys` 动态拼接构造正则：`new RegExp('^#([' + keys + '])(?=\\s)(.*|$)')` 及维护 `isKnownTagSymbol` Map 判断，不再误拦截所有首部字符。
- **验证结果**: Jest 自动化单元测试 `tests/bug2.test.ts` 新增用例，确认只有 `enabled: true` 的标签符号会被正常检测，对未配置内容（如 `#x`, `#b` 等）会被忽略，不再劫持一般用户的 Markdown 文本。

## 3. 颜色系统三方打架
- **出现原因**: 原插件的静态样式（`obsidian-modevol-plugin-base/styles.css`）使用了一套 RGB 颜色，而本设置插件中的 `DEFAULT_SETTINGS` 使用了另一套十六进制颜色，导致：a) 默认不改设置时，侧边大纲、标签预览与正文内标签颜色不一致；b) 用户导入/导出配置后，颜色会在两套方案之间跳变。
- **修复方案**: 统一以基础插件的颜色为准，在 [`src/settings.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/settings.ts#L34-L66) 中将内置标签的颜色改为 `#4B99D3`（d）、`#CD5255`（e）、`#EBAB37`（t）、`#5572F1`（v）、`#C9C9C9`（c），并确保 `StyleManager` 只从当前设置注入 CSS 变量，避免静态/动态样式打架。
- **验证结果**: Jest 用例 [`tests/settings.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/settings.test.ts) 中 `Bug 3: DEFAULT_SETTINGS color consistency` 断言各 key 的默认颜色与基础插件完全一致，测试通过；实际运行时三处颜色来源已经统一。

## 4. XSS 注入向量
- **出现原因**: 自定义标签图标 SVG 来自用户输入，之前直接赋值给 `innerHTML`，仅做了非常有限的字符串检查，仍然可能被 `<script>`, `on*` 事件或 `javascript:` URL 绕过，从而在预览面板或设置界面形成 XSS。
- **修复方案**: 在 [`src/ModevolWidget.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/ModevolWidget.ts#L189-L239) 和 [`src/SettingTab.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/SettingTab.ts#L276-L327) 中实现统一的 `sanitizeSvg`：先做字符串级黑名单过滤，然后通过 `DOMParser` 解析为 `image/svg+xml`，拒绝解析错误或非 `<svg>` 根节点，强制移除所有 `<script>` 标签、所有 `on*` 属性以及包含 `javascript:` 的属性值，最后只返回清洗后的 `root.outerHTML`。`validateImportedSettings` 仅在 SVG 通过校验时才保留，失败则清空。
- **验证结果**: Jest 用例 [`tests/sanitizeSvg.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/sanitizeSvg.test.ts) 覆盖：a) 正常 SVG 能通过且仍为 `<svg>`；b) 含 `<script>` 被整体拒绝；c) 带 `onclick` 等事件属性的 SVG 清洗后不再包含对应属性；d) 带 `javascript:` 的链接被剔除；同时验证 `validateImportedSettings` 会将非法 `color` 重置为安全默认并丢弃恶意 SVG。

## 5. 每次击键都 new ExpressionInterpreter
- **出现原因**: 原设计中，标签解析器 `ExpressionInterpreter` 是在编辑器扩展内部频繁创建的，一旦实现不当，就会在每次击键/更新时重新 new，造成不必要的性能开销。
- **修复方案**: 在 [`src/StateField.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/StateField.ts#L20-L27) 中将 `ExpressionInterpreter` 提升为模块级单例 `interpreter`，只在 `setLabelConfigs` 时根据最新的标签配置 new 一次。`labelField` 的 `create/update` 生命周期中仅复用该实例，不再在 `getDecoration` 内按击键创建新对象。
- **验证结果**: 通过为测试暴露 `__getInterpreterForTest`，在 [`tests/stateField.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/stateField.test.ts) 中验证：调用 `setLabelConfigs` 后生成一个解释器实例，随后多次调用 `labelField` 更新不会更换实例；只有在再次调用 `setLabelConfigs` 时才会生成新的解释器实例。

## 6. 全局可变状态到处飞
- **出现原因**: 标签配置既影响解析规则（正则）、也影响渲染样式和预览行为，但原先各模块（`StateField`, `ModevolWidget`, `StyleManager`）之间并没有统一的配置入口，容易出现某处使用的是旧配置、某处使用的是新配置的情况，看起来就像“全局状态在各处漂移”。
- **修复方案**: 将 `ModevolSettings.labels` 作为单一真源，在 [`src/main.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/main.ts#L24-L27) 的 `onload` 及 [`refreshStyles`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/main.ts#L47-L52) 中统一下发到 `StyleManager.injectStyles`、`setStateFieldLabelConfigs` 与 `setWidgetLabelConfigs`。`ExpressionInterpreter` 和 `ModevolWidget` 只通过各自的 `setLabelConfigs` 接收配置，不再自行持有散落的全局状态。
- **验证结果**: `refreshStyles` 调用后，编辑器内标签解析、预览面板图标以及状态栏统计都基于同一套 `labels` 数据。`tests/stateField.test.ts` 中 `Bug 6` 用例验证：先以 d 标签配置初始化解释器，只能识别 `#d`；再次通过 e 标签配置调用 `setLabelConfigs` 后，新实例只识别 `#e`，证明配置更新能完整替换全局解析状态。

## 7. 297 行 AI 生成总结文件提交进仓库
- **出现原因**: 仓库根目录下存在一份 AI 生成的实现总结文档 `Obsidian Modevol 自定义标签配置功能 - 实现总结.md`，属于过程性说明文件，按常规应避免与插件源码混在一起，避免干扰代码审查与发布包体。
- **修复方案**: 计划中的修复方案是将该文件从仓库中移除，或移动到不参与发布的文档区域。但在当前用户环境下，用户明确选择保留该文件，因此本次修复不对其做删除操作，只在此处记录其性质，后续由仓库维护者根据实际发布流程决定是否迁移或从打包清单中排除。
- **验证结果**: 插件构建产物不依赖该文件，`npm run build` 及所有 Jest 测试均可在保留该文档的前提下顺利通过，不影响运行时行为。

## 8. `#c` 仍然硬编码特殊处理
- **出现原因**: 自定义标签最初被硬编码为 `#c`，包括解析逻辑和预览渲染里都直接对 `c`/`#c` 做特殊分支判断，导致：a) 无法通过设置把自定义标签改成其它字母；b) 日后扩展多个自定义标签时会非常困难。
- **修复方案**: 
  - 在 [`src/ExpressionInterpreter.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/ExpressionInterpreter.ts#L20-L33) 中根据 `LabelConfig.custom` 动态维护 `customKeys` 集合，若用户没有显式配置但存在默认的 `c`，则自动补充；暴露 `isCustomKey` 帮助其它模块判断某个 key 是否为“自定义标签”。
  - 在 [`src/StateField.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/StateField.ts#L57-L63) 中不再用 `label.type === 'c'`，而是调用 `interpreter.isCustomKey(label.type)` 来决定是否按“激活标签”样式高亮。
  - 在 [`src/ModevolWidget.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/ModevolWidget.ts#L11-L27,L63-L66) 中通过 `setLabelConfigs` 构建 `customTagSet`，并用 `isCustomTagSymbol` 判断某个 `#x` 是否为自定义标签，完全去掉对 `#c` 的硬编码。
- **验证结果**: Jest 用例 [`tests/customLabel.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/customLabel.test.ts) 将自定义标签 key 改为 `z`，验证：a) `ExpressionInterpreter` 能正确解析 `#z 名称 标题 关系`；b) `isCustomTagSymbol("#z")` 为 `true` 而 `"#d"`、`"#c"` 为 `false`。同时 `tests/expressionInterpreter.test.ts` 中原有的 `#c` 行为测试仍然通过，证明兼容默认配置。

## 9. `loadSettings()` 浅合并陷阱
- **出现原因**: 原来的 `loadSettings` 使用浅合并，将 `this.settings = Object.assign({}, DEFAULT_SETTINGS, savedData)`，会导致：a) `labels` 数组整体被用户配置替换，丢失默认标签；b) 对 key 大小写不敏感；c) 缺失字段（如 `custom`）时无法填回默认值。
- **修复方案**: 在 [`src/settings.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/settings.ts#L69-L111) 中实现 `mergeSettings` 深合并逻辑：先把默认 `labels` 拷贝进 `Map`，再遍历用户的 `labels`，按 key（自动转为小写）合并单个 `LabelConfig` 的各字段，并在缺失时回退到默认值；如果用户提供了新的 key，则基于安全默认构造新的标签配置并加入结果数组。
- **验证结果**: 
  - [`tests/settingsMerge.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/settingsMerge.test.ts) 覆盖：`saved` 为 `null` 时保持默认；修改单个 key 时只覆盖该标签；用户仅提供部分标签时其余默认标签仍然保留。
  - [`tests/settings.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/settings.test.ts#L18-L83) 补充验证：大小写 key 会被规范为小写并继承默认的 `custom` 标记，自定义标签不会因导入而丢失 `custom: true`。

## 10. `hexToRgba` 写了两遍
- **出现原因**: 将颜色配置从固定 CSS 拓展为用户可调时，在多个文件中重复实现了 `hexToRgba`，既增加了维护成本，也让错误处理逻辑难以统一（例如短 hex / 非法字符串）。
- **修复方案**: 在 [`src/colorUtils.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/src/colorUtils.ts) 中集中实现健壮的 `hexToRgba`：统一处理 `#rgb`/`#rrggbb`，对长度不够或解析失败的情况一律返回 `rgba(0, 0, 0, alpha)` 的安全默认值；`StyleManager` 与 `SettingTab` 统一引用该工具函数，移除其它重复实现。
- **验证结果**: Jest 用例 [`tests/colorUtils.test.ts`](file:///c:/Users/x/Desktop/obsidian-modevol-plugin/obsidian-modevol-plugin-setting/tests/colorUtils.test.ts) 覆盖：a) 正常 6 位和 3 位 hex 转换结果；b) 多种非法输入（无 `#`、长度不足、包含非 16 进制字符）均返回预期的 fallback；同时 `npm test` 全量执行通过，证明调用方均已切换到统一实现。

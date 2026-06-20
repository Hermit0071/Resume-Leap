const UI_LANGUAGE_KEY = "resume-generator-ui-language";
let currentLanguage = localStorage.getItem(UI_LANGUAGE_KEY) === "en" ? "en" : "zh";

const messages = {
  zh: {
    pageTitle: "简跃 · 简历生成器", brandSubtitle: "填写、排版并导出 PDF、DOCX、PNG。", mainNavigation: "主导航",
    createResume: "创建简历", myResumes: "我的简历", templateStyle: "模板风格", threePresets: "3 套预设",
    appearance: "外观微调", customizable: "可自定义", accentColor: "主题色", fontSize: "字体大小", layoutDensity: "排版密度",
    airy: "舒展", balanced: "平衡", compact: "紧凑", exportFiles: "导出文件", fullyOffline: "完全离线", export: "导出",
    exportHelp: "PDF 会打开系统打印窗口，请选择“存储为 PDF”。", basicInfo: "基本信息", fillYourself: "自行填写",
    name: "姓名", tagline: "身份标签", school: "学校", email: "邮箱", phone: "电话", location: "地区", website: "个人主页 / 作品集 / 微信号",
    sectionLibrary: "板块库", addAsNeeded: "按需添加", resumeSections: "简历板块", sectionActions: "支持改名、增删、排序",
    addListSection: "新增列表板块", addTextSection: "新增文本板块", livePreview: "实时预览", liveUpdate: "输入内容时同步更新",
    historyIntro: "所有历史版本都保存在当前浏览器中，可随时继续编辑。", newBlankResume: "新建空白简历", saveAsCopy: "将当前简历另存为副本",
    autoSaveHelp: "填写后自动保存。", switchLanguage: "Switch to English", languageButton: "English", resumesCount: (n) => `${n} 份简历`,
    noHistory: "还没有历史简历。开始填写后会自动出现在这里。", customTemplate: "自定义模板", sectionsCount: (n) => `${n} 个板块`,
    updatedAt: (time) => `更新于 ${time}`, delete: "删除", emptyNotSaved: "空白简历不会写入历史。", untitledResume: "未命名简历",
    autoSaved: (time) => `已自动保存：${time}`, opened: (title) => `已打开：${title}`, historyDeleted: "历史记录已删除。",
    blankCreated: "已新建空白简历。", added: "已添加", add: "添加", noSections: "当前还没有板块。你可以添加常用板块，也可以从零创建自己的板块。",
    sectionName: "板块名称", hide: "隐藏", show: "显示", moveUp: "上移", moveDown: "下移", deleteSection: "删除板块", addItem: "新增一项经历",
    bodyContent: "正文内容", bodyPlaceholder: "在这里填写内容", noItems: "这个板块还没有条目。", itemNumber: (n) => `条目 ${n}`,
    deleteItem: "删除条目", title: "标题", subtitle: "副标题", meta: "时间 / 地点 / 级别", summary: "简述", bullets: "要点（每行一条）",
    yourName: "你的姓名", previewEmpty: "添加板块后，内容会显示在这里。", newTextSection: "新的文本板块", newListSection: "新的列表板块",
    myResume: "我的简历", offlineDocxError: "DOCX 离线组件未加载，请确认 vendor 文件夹与 HTML 在同一目录。", unnamedSection: "未命名板块",
    pngRenderError: "浏览器无法渲染 PNG，请使用 Chrome 或 Safari 最新版本。", pngFailed: "PNG 文件生成失败。",
    printOpened: "打印窗口已打开，请选择左下角“PDF”→“存储为 PDF”。", addContentFirst: "请先填写一些内容再导出。",
    generating: (format) => `正在生成 ${format}...`, generated: (format) => `${format} 已生成并开始下载。`, exportFailed: (error) => `导出失败：${error}`,
    storageError: "浏览器未允许本地存储，当前内容无法自动保存。", legacyResume: "旧版简历",
  },
  en: {
    pageTitle: "JianYue · Resume Builder", brandSubtitle: "Write, format, and export to PDF, DOCX, or PNG.", mainNavigation: "Main navigation",
    createResume: "Create Resume", myResumes: "My Resumes", templateStyle: "Template Style", threePresets: "3 presets",
    appearance: "Appearance", customizable: "Customizable", accentColor: "Accent Color", fontSize: "Font Size", layoutDensity: "Layout Density",
    airy: "Airy", balanced: "Balanced", compact: "Compact", exportFiles: "Export", fullyOffline: "Fully offline", export: "Export",
    exportHelp: "PDF opens the system print dialog. Choose Save as PDF.", basicInfo: "Basic Information", fillYourself: "Enter your details",
    name: "Name", tagline: "Profile Tagline", school: "School", email: "Email", phone: "Phone", location: "Location", website: "Website / Portfolio / WeChat",
    sectionLibrary: "Section Library", addAsNeeded: "Add as needed", resumeSections: "Resume Sections", sectionActions: "Rename, add, remove, and reorder",
    addListSection: "Add List Section", addTextSection: "Add Text Section", livePreview: "Live Preview", liveUpdate: "Updates as you type",
    historyIntro: "All versions are stored in this browser, ready for you to continue editing.", newBlankResume: "New Blank Resume", saveAsCopy: "Save Current Resume as a Copy",
    autoSaveHelp: "Changes are saved automatically.", switchLanguage: "切换到中文", languageButton: "中文", resumesCount: (n) => `${n} resume${n === 1 ? "" : "s"}`,
    noHistory: "No saved resumes yet. Your work will appear here automatically.", customTemplate: "Custom template", sectionsCount: (n) => `${n} section${n === 1 ? "" : "s"}`,
    updatedAt: (time) => `Updated ${time}`, delete: "Delete", emptyNotSaved: "Blank resumes are not added to history.", untitledResume: "Untitled Resume",
    autoSaved: (time) => `Autosaved: ${time}`, opened: (title) => `Opened: ${title}`, historyDeleted: "History entry deleted.",
    blankCreated: "New blank resume created.", added: "Added", add: "Add", noSections: "No sections yet. Add one from the library or create your own.",
    sectionName: "Section Name", hide: "Hide", show: "Show", moveUp: "Move Up", moveDown: "Move Down", deleteSection: "Delete Section", addItem: "Add Experience",
    bodyContent: "Content", bodyPlaceholder: "Write your content here", noItems: "This section has no entries yet.", itemNumber: (n) => `Entry ${n}`,
    deleteItem: "Delete Entry", title: "Title", subtitle: "Subtitle", meta: "Date / Location / Level", summary: "Description", bullets: "Highlights (one per line)",
    yourName: "Your Name", previewEmpty: "Add a section to see your content here.", newTextSection: "New Text Section", newListSection: "New List Section",
    myResume: "My Resume", offlineDocxError: "The offline DOCX component could not be loaded. Keep the vendor folder beside this HTML file.", unnamedSection: "Untitled Section",
    pngRenderError: "The browser could not render the PNG. Please use the latest Chrome or Safari.", pngFailed: "PNG generation failed.",
    printOpened: "The print dialog is open. Choose PDF, then Save as PDF.", addContentFirst: "Add some content before exporting.",
    generating: (format) => `Generating ${format}...`, generated: (format) => `${format} is ready and downloading.`, exportFailed: (error) => `Export failed: ${error}`,
    storageError: "Browser storage is unavailable, so changes cannot be saved automatically.", legacyResume: "Legacy Resume",
  },
};

function t(key, ...args) {
  const value = messages[currentLanguage][key] ?? messages.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

const templates = {
  harbor: {
    id: "harbor",
    name: "Harbor Blue",
    description: { zh: "稳重、清晰，适合港大活动申请与综合材料。", en: "Structured and clear for HKU activities and general applications." },
    accent: "#1f4e79",
    density: "balanced",
    swatch: "linear-gradient(135deg, #1f4e79 0%, #7bb4e3 100%)",
  },
  editorial: {
    id: "editorial",
    name: "Editorial Sand",
    description: { zh: "更有人文气质，适合文书感较强的经历展示。", en: "A warm editorial style for narrative-rich experience." },
    accent: "#9a5c2f",
    density: "airy",
    swatch: "linear-gradient(135deg, #f6dfc8 0%, #9a5c2f 100%)",
  },
  jade: {
    id: "jade",
    name: "Jade Horizon",
    description: { zh: "清新现代，适合科研、社团、竞赛型简历。", en: "Fresh and modern for research, clubs, and competitions." },
    accent: "#0f7a5c",
    density: "compact",
    swatch: "linear-gradient(135deg, #d9f6ec 0%, #0f7a5c 100%)",
  },
};

const HISTORY_KEY = "resume-generator-history-v2";
const LEGACY_KEY = "resume-generator-state";
const MIGRATION_KEY = "resume-generator-history-migrated";

const sectionPresets = [
  { key: "education", title: { zh: "教育背景", en: "Education" }, type: "list", description: { zh: "学校、课程、成绩与学术方向", en: "School, coursework, grades, and academic interests" } },
  { key: "leadership", title: { zh: "活动与领导力", en: "Activities & Leadership" }, type: "list", description: { zh: "社团、学生会与组织经历", en: "Clubs, student council, and leadership roles" } },
  { key: "awards", title: { zh: "竞赛与荣誉", en: "Awards & Honors" }, type: "list", description: { zh: "奖项、竞赛结果与荣誉称号", en: "Awards, competition results, and distinctions" } },
  { key: "service", title: { zh: "志愿服务", en: "Community Service" }, type: "list", description: { zh: "公益行动与社区参与", en: "Volunteering and community involvement" } },
  { key: "projects", title: { zh: "项目经历", en: "Projects" }, type: "list", description: { zh: "研究、实践与个人项目", en: "Research, practical work, and personal projects" } },
  { key: "skills", title: { zh: "技能特长", en: "Skills" }, type: "list", description: { zh: "软件、技术与艺术技能", en: "Software, technical, and creative skills" } },
  { key: "languages", title: { zh: "语言能力", en: "Languages" }, type: "list", description: { zh: "语言水平与考试成绩", en: "Language proficiency and test scores" } },
  { key: "statement", title: { zh: "个人陈述亮点", en: "Personal Profile" }, type: "text", description: { zh: "申请动机、兴趣与未来目标", en: "Motivation, interests, and future goals" } },
];

const defaultPresetKeys = ["education", "leadership", "awards", "service", "statement"];

function createPresetSection(key) {
  const preset = sectionPresets.find((item) => item.key === key);
  if (!preset) return null;
  return {
    id: crypto.randomUUID(),
    presetKey: preset.key,
    title: preset.title[currentLanguage],
    type: preset.type,
    visible: true,
    items: preset.type === "text" ? [{ text: "" }] : [emptyItem()],
  };
}

const blankState = () => ({
  templateId: "harbor",
  theme: { accent: templates.harbor.accent, fontScale: 1, density: templates.harbor.density },
  personal: { name: "", tagline: "", school: "", email: "", phone: "", location: "", website: "" },
  sections: defaultPresetKeys.map(createPresetSection).filter(Boolean),
});

function emptyItem() {
  return { title: "", subtitle: "", meta: "", detail: "", bullets: [] };
}

let state = blankState();
let history = loadHistory();
let currentHistoryId = null;
let saveTimer = null;

const templateGrid = document.querySelector("#templateGrid");
const resumePreview = document.querySelector("#resumePreview");
const sectionsEditor = document.querySelector("#sectionsEditor");
const exportStatus = document.querySelector("#exportStatus");
const saveStatus = document.querySelector("#saveStatus");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const historyNavCount = document.querySelector("#historyNavCount");
const presetSectionsGrid = document.querySelector("#presetSectionsGrid");

const personalBindings = [
  ["nameInput", "name"],
  ["taglineInput", "tagline"],
  ["schoolInput", "school"],
  ["emailInput", "email"],
  ["phoneInput", "phone"],
  ["locationInput", "location"],
  ["websiteInput", "website"],
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    saveStatus.textContent = t("storageError");
  }
}

function migrateLegacyDraft() {
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
    if (legacy && hasMeaningfulContent(legacy)) {
      history.unshift({
        id: crypto.randomUUID(),
        title: legacy.personal?.name?.trim() || t("legacyResume"),
        updatedAt: new Date().toISOString(),
        data: legacy,
      });
      persistHistory();
    }
    localStorage.setItem(MIGRATION_KEY, "1");
  } catch {
    // A damaged legacy draft should not prevent the new editor from opening.
  }
}

function hasMeaningfulContent(candidate = state) {
  const personal = candidate.personal || {};
  if (Object.values(personal).some((value) => String(value || "").trim())) return true;
  return (candidate.sections || []).some((section) => {
    if (section.type === "text") return Boolean(section.items?.[0]?.text?.trim());
    return (section.items || []).some((item) =>
      [item.title, item.subtitle, item.meta, item.detail, ...(item.bullets || [])].some((value) => String(value || "").trim())
    );
  });
}

function saveCurrent({ asCopy = false, immediate = false } = {}) {
  if (!hasMeaningfulContent()) {
    saveStatus.textContent = t("emptyNotSaved");
    return;
  }

  const commit = () => {
    if (asCopy || !currentHistoryId) currentHistoryId = crypto.randomUUID();
    const entry = {
      id: currentHistoryId,
      title: state.personal.name.trim() || t("untitledResume"),
      updatedAt: new Date().toISOString(),
      data: clone(state),
    };
    history = [entry, ...history.filter((item) => item.id !== currentHistoryId)].slice(0, 50);
    persistHistory();
    renderHistory();
    saveStatus.textContent = t("autoSaved", formatTime(entry.updatedAt));
  };

  clearTimeout(saveTimer);
  if (immediate) commit();
  else saveTimer = setTimeout(commit, 450);
}

function formatTime(value) {
  return new Intl.DateTimeFormat(currentLanguage === "en" ? "en-US" : "zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderHistory() {
  historyCount.textContent = t("resumesCount", history.length);
  historyNavCount.textContent = history.length;
  if (!history.length) {
    historyList.innerHTML = `<div class="history-empty">${t("noHistory")}</div>`;
    return;
  }

  historyList.innerHTML = history
    .map(
      (entry) => `
        <article class="history-item ${entry.id === currentHistoryId ? "active" : ""}">
          <div class="history-accent" style="background:${entry.data?.theme?.accent || "#1f4e79"}"></div>
          <button class="history-load" data-history-action="load" data-history-id="${entry.id}">
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(templates[entry.data?.templateId]?.name || t("customTemplate"))} · ${t("sectionsCount", (entry.data?.sections || []).length)}</span>
            <time>${t("updatedAt", formatTime(entry.updatedAt))}</time>
          </button>
          <button class="history-delete" data-history-action="delete" data-history-id="${entry.id}" aria-label="${t("delete")}">${t("delete")}</button>
        </article>
      `
    )
    .join("");

  historyList.querySelectorAll("[data-history-action]").forEach((button) => {
    button.addEventListener("click", () => handleHistoryAction(button.dataset.historyAction, button.dataset.historyId));
  });
}

function handleHistoryAction(action, id) {
  const entry = history.find((item) => item.id === id);
  if (action === "load" && entry) {
    state = clone(entry.data);
    currentHistoryId = entry.id;
    syncControls();
    rerender();
    switchPage("create");
    saveStatus.textContent = t("opened", entry.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (action === "delete") {
    history = history.filter((item) => item.id !== id);
    if (currentHistoryId === id) currentHistoryId = null;
    persistHistory();
    renderHistory();
    saveStatus.textContent = t("historyDeleted");
  }
}

function startBlankResume() {
  saveCurrent({ immediate: true });
  state = blankState();
  currentHistoryId = null;
  syncControls();
  rerender();
  switchPage("create");
  saveStatus.textContent = t("blankCreated");
}

function switchPage(pageName) {
  document.querySelectorAll(".app-page").forEach((page) => page.classList.toggle("active", page.id === `${pageName}Page`));
  document.querySelectorAll("[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === pageName));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTemplates() {
  templateGrid.innerHTML = Object.values(templates)
    .map(
      (template) => `
        <button class="template-card ${state.templateId === template.id ? "active" : ""}" data-template-id="${template.id}">
          <div class="swatch" style="background:${template.swatch}"></div>
          <div class="meta"><h3>${template.name}</h3><p>${template.description[currentLanguage]}</p></div>
        </button>
      `
    )
    .join("");

  templateGrid.querySelectorAll("[data-template-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const template = templates[button.dataset.templateId];
      state.templateId = template.id;
      state.theme.accent = template.accent;
      state.theme.density = template.density;
      syncControls();
      renderTemplates();
      renderPreview();
      saveCurrent();
    });
  });
}

function renderPresetSections() {
  presetSectionsGrid.innerHTML = sectionPresets
    .map((preset) => {
      const added = state.sections.some((section) => section.presetKey === preset.key || Object.values(preset.title).includes(section.title));
      return `
        <button class="preset-section-card ${added ? "added" : ""}" data-preset-key="${preset.key}" ${added ? "disabled" : ""}>
          <span class="preset-icon">${preset.type === "text" ? "Aa" : "+"}</span>
          <span class="preset-copy"><strong>${preset.title[currentLanguage]}</strong><small>${preset.description[currentLanguage]}</small></span>
          <span class="preset-state">${added ? t("added") : t("add")}</span>
        </button>
      `;
    })
    .join("");

  presetSectionsGrid.querySelectorAll("[data-preset-key]:not([disabled])").forEach((button) => {
    button.addEventListener("click", () => {
      const section = createPresetSection(button.dataset.presetKey);
      if (!section) return;
      state.sections.push(section);
      renderPresetSections();
      renderSectionsEditor();
      renderPreview();
      saveCurrent();
    });
  });
}

function renderSectionsEditor() {
  sectionsEditor.innerHTML = "";
  if (!state.sections.length) {
    sectionsEditor.innerHTML = `<div class="editor-empty">${t("noSections")}</div>`;
    return;
  }

  state.sections.forEach((section, sectionIndex) => {
    const card = document.querySelector("#sectionCardTemplate").content.firstElementChild.cloneNode(true);
    card.classList.toggle("hidden", !section.visible);
    const itemsMarkup = section.type === "text" ? renderTextSection(section, sectionIndex) : renderListSection(section, sectionIndex);
    card.innerHTML = `
      <div class="section-card-head">
        <label class="field section-title-field"><span>${t("sectionName")}</span>
          <input data-action="section-title" data-section-index="${sectionIndex}" value="${escapeHtml(section.title)}" />
        </label>
        <div class="section-controls">
          <button data-action="toggle-section" data-section-index="${sectionIndex}">${section.visible ? t("hide") : t("show")}</button>
          <button data-action="move-section-up" data-section-index="${sectionIndex}">${t("moveUp")}</button>
          <button data-action="move-section-down" data-section-index="${sectionIndex}">${t("moveDown")}</button>
          <button class="danger" data-action="remove-section" data-section-index="${sectionIndex}">${t("deleteSection")}</button>
        </div>
      </div>
      ${itemsMarkup}
      ${section.type === "list" ? `<div class="toolbar item-add"><button data-action="add-item" data-section-index="${sectionIndex}">${t("addItem")}</button></div>` : ""}
    `;
    sectionsEditor.appendChild(card);
  });

  sectionsEditor.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener(element.tagName === "BUTTON" ? "click" : "input", handleSectionAction);
  });
}

function renderTextSection(section, sectionIndex) {
  return `<label class="field text-section-field"><span>${t("bodyContent")}</span>
    <textarea data-action="text" data-section-index="${sectionIndex}" placeholder="${t("bodyPlaceholder")}">${escapeHtml(section.items?.[0]?.text || "")}</textarea>
  </label>`;
}

function renderListSection(section, sectionIndex) {
  if (!section.items.length) return `<div class="editor-empty compact-empty">${t("noItems")}</div>`;
  return section.items
    .map(
      (item, itemIndex) => `
        <div class="item-card">
          <div class="item-card-head"><strong>${t("itemNumber", itemIndex + 1)}</strong>
            <div class="item-controls">
              <button data-action="move-item-up" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${t("moveUp")}</button>
              <button data-action="move-item-down" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${t("moveDown")}</button>
              <button class="danger" data-action="remove-item" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${t("deleteItem")}</button>
            </div>
          </div>
          <div class="item-grid">
            <label class="field"><span>${t("title")}</span><input data-action="item-title" data-section-index="${sectionIndex}" data-item-index="${itemIndex}" value="${escapeHtml(item.title)}" /></label>
            <label class="field"><span>${t("subtitle")}</span><input data-action="item-subtitle" data-section-index="${sectionIndex}" data-item-index="${itemIndex}" value="${escapeHtml(item.subtitle)}" /></label>
            <label class="field"><span>${t("meta")}</span><input data-action="item-meta" data-section-index="${sectionIndex}" data-item-index="${itemIndex}" value="${escapeHtml(item.meta)}" /></label>
            <label class="field full"><span>${t("summary")}</span><textarea data-action="item-detail" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${escapeHtml(item.detail)}</textarea></label>
            <label class="field full"><span>${t("bullets")}</span><textarea data-action="item-bullets" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${escapeHtml((item.bullets || []).join("\n"))}</textarea></label>
          </div>
        </div>
      `
    )
    .join("");
}

function renderPreview() {
  const contacts = [state.personal.school, state.personal.email, state.personal.phone, state.personal.location, state.personal.website]
    .filter(Boolean)
    .join("  |  ");
  const visibleSections = state.sections.filter((section) => section.visible);
  resumePreview.innerHTML = `
    <div class="resume-root template-${state.templateId} ${state.theme.density}" style="--accent:${state.theme.accent};--font-scale:${state.theme.fontScale}">
      <div class="resume-sheet">
        <div class="resume-rail"></div>
        <div class="resume-body">
          <header class="resume-header">
            <h1>${escapeHtml(state.personal.name) || `<span class="preview-placeholder">${t("yourName")}</span>`}</h1>
            ${state.personal.tagline ? `<div class="tagline">${escapeHtml(state.personal.tagline)}</div>` : ""}
            ${contacts ? `<div class="contacts">${escapeHtml(contacts)}</div>` : ""}
          </header>
          ${visibleSections.map(renderPreviewSection).join("")}
          ${visibleSections.length ? "" : `<div class="resume-empty">${t("previewEmpty")}</div>`}
        </div>
      </div>
    </div>`;
}

function renderPreviewSection(section) {
  if (section.type === "text") {
    return `<section class="resume-section"><h2>${escapeHtml(section.title)}</h2><div class="resume-text">${escapeHtml(section.items?.[0]?.text || "")}</div></section>`;
  }
  return `<section class="resume-section"><h2>${escapeHtml(section.title)}</h2>${section.items
    .map((item) => {
      const bullets = (item.bullets || []).filter((bullet) => bullet.trim());
      return `<article class="resume-item"><div class="resume-item-head"><div><div class="resume-item-title">${escapeHtml(item.title)}</div><div class="resume-item-subtitle">${escapeHtml(item.subtitle)}</div></div><div class="resume-item-meta">${escapeHtml(item.meta)}</div></div>${item.detail ? `<div class="resume-item-detail">${escapeHtml(item.detail)}</div>` : ""}${bullets.length ? `<ul>${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}</article>`;
    })
    .join("")}</section>`;
}

function syncControls() {
  personalBindings.forEach(([id, key]) => { document.querySelector(`#${id}`).value = state.personal[key] || ""; });
  document.querySelector("#accentInput").value = state.theme.accent;
  document.querySelector("#fontScaleInput").value = state.theme.fontScale;
  document.querySelector("#densityInput").value = state.theme.density;
}

function rerender() {
  renderHistory();
  renderTemplates();
  renderPresetSections();
  renderSectionsEditor();
  renderPreview();
}

function moveItem(array, from, to) {
  if (to < 0 || to >= array.length) return false;
  const [item] = array.splice(from, 1);
  array.splice(to, 0, item);
  return true;
}

function handleSectionAction(event) {
  const target = event.currentTarget;
  const action = target.dataset.action;
  const sectionIndex = Number(target.dataset.sectionIndex);
  const itemIndex = Number(target.dataset.itemIndex);
  const section = state.sections[sectionIndex];
  if (!section) return;
  let structureChanged = false;

  if (action === "section-title") section.title = target.value;
  else if (action === "text") section.items[0].text = target.value;
  else if (action === "toggle-section") { section.visible = !section.visible; structureChanged = true; }
  else if (action === "remove-section") { state.sections.splice(sectionIndex, 1); structureChanged = true; }
  else if (action === "move-section-up") structureChanged = moveItem(state.sections, sectionIndex, sectionIndex - 1);
  else if (action === "move-section-down") structureChanged = moveItem(state.sections, sectionIndex, sectionIndex + 1);
  else if (action === "add-item") { section.items.push(emptyItem()); structureChanged = true; }
  else if (action === "remove-item") { section.items.splice(itemIndex, 1); structureChanged = true; }
  else if (action === "move-item-up") structureChanged = moveItem(section.items, itemIndex, itemIndex - 1);
  else if (action === "move-item-down") structureChanged = moveItem(section.items, itemIndex, itemIndex + 1);
  else if (action === "item-title") section.items[itemIndex].title = target.value;
  else if (action === "item-subtitle") section.items[itemIndex].subtitle = target.value;
  else if (action === "item-meta") section.items[itemIndex].meta = target.value;
  else if (action === "item-detail") section.items[itemIndex].detail = target.value;
  else if (action === "item-bullets") section.items[itemIndex].bullets = target.value.split("\n");

  if (structureChanged) {
    renderPresetSections();
    renderSectionsEditor();
  }
  renderPreview();
  saveCurrent();
}

function addSection(type) {
  state.sections.push(type === "text"
    ? { id: crypto.randomUUID(), title: t("newTextSection"), type: "text", visible: true, items: [{ text: "" }] }
    : { id: crypto.randomUUID(), title: t("newListSection"), type: "list", visible: true, items: [emptyItem()] });
  renderSectionsEditor();
  renderPresetSections();
  renderPreview();
  saveCurrent();
}

function fileStem() {
  return (state.personal.name.trim() || t("myResume")).replace(/[\\/:*?"<>|]/g, "_");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportDocx() {
  if (!window.docx) throw new Error(t("offlineDocxError"));
  const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } = window.docx;
  const accent = state.theme.accent.replace("#", "").toUpperCase();
  const children = [];
  children.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
      children: [new TextRun({ text: state.personal.name || t("yourName"), bold: true, size: 42, font: "PingFang SC" })],
  }));
  if (state.personal.tagline) children.push(new Paragraph({ children: [new TextRun({ text: state.personal.tagline, color: accent, size: 24, font: "PingFang SC" })] }));
  const contacts = [state.personal.school, state.personal.email, state.personal.phone, state.personal.location, state.personal.website].filter(Boolean).join(" | ");
  if (contacts) children.push(new Paragraph({ spacing: { after: 180 }, children: [new TextRun({ text: contacts, color: "666666", size: 19, font: "PingFang SC" })] }));

  state.sections.filter((section) => section.visible).forEach((section) => {
    children.push(new Paragraph({
      spacing: { before: 180, after: 100 },
      border: { bottom: { color: accent, style: BorderStyle.SINGLE, size: 8, space: 4 } },
      children: [new TextRun({ text: section.title || t("unnamedSection"), bold: true, color: accent, size: 26, font: "PingFang SC" })],
    }));
    if (section.type === "text") {
      children.push(new Paragraph({ children: [new TextRun({ text: section.items?.[0]?.text || "", size: 21, font: "PingFang SC" })] }));
      return;
    }
    section.items.forEach((item) => {
      const heading = [item.title, item.subtitle, item.meta].filter(Boolean).join("  |  ");
      if (heading) children.push(new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: heading, bold: true, size: 22, font: "PingFang SC" })] }));
      if (item.detail) children.push(new Paragraph({ children: [new TextRun({ text: item.detail, size: 20, color: "333333", font: "PingFang SC" })] }));
      (item.bullets || []).filter(Boolean).forEach((bullet) => children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: bullet, size: 20, font: "PingFang SC" })] })));
    });
  });

  const documentFile = new Document({
    sections: [{ properties: { page: { margin: { top: 850, right: 900, bottom: 850, left: 900 } } }, children }],
  });
  const blob = await Packer.toBlob(documentFile);
  downloadBlob(blob, `${fileStem()}.docx`);
}

function inlineComputedStyles(source, target) {
  const computed = getComputedStyle(source);
  for (let index = 0; index < computed.length; index += 1) {
    const property = computed[index];
    target.style.setProperty(property, computed.getPropertyValue(property), computed.getPropertyPriority(property));
  }
  Array.from(source.children).forEach((child, index) => {
    if (target.children[index]) inlineComputedStyles(child, target.children[index]);
  });
}

async function exportPng() {
  const root = document.querySelector(".resume-root");
  const sheet = root.querySelector(".resume-sheet");
  const width = Math.ceil(sheet.getBoundingClientRect().width);
  const height = Math.ceil(sheet.getBoundingClientRect().height);
  const clonedRoot = root.cloneNode(true);
  inlineComputedStyles(root, clonedRoot);
  clonedRoot.style.width = `${width}px`;
  clonedRoot.style.margin = "0";
  clonedRoot.querySelector(".resume-sheet").style.width = `${width}px`;
  const serialized = new XMLSerializer().serializeToString(clonedRoot);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${serialized}</div></foreignObject></svg>`;
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const imageUrl = URL.createObjectURL(svgBlob);
  const image = new Image();
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error(t("pngRenderError"))); image.src = imageUrl; });
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  context.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(imageUrl);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error(t("pngFailed"));
  downloadBlob(blob, `${fileStem()}.png`);
}

function exportPdf() {
  const previousTitle = document.title;
  document.title = fileStem();
  exportStatus.textContent = t("printOpened");
  const restoreTitle = () => { document.title = previousTitle; window.removeEventListener("afterprint", restoreTitle); };
  window.addEventListener("afterprint", restoreTitle);
  window.print();
}

async function exportResume(format) {
  if (!hasMeaningfulContent()) { exportStatus.textContent = t("addContentFirst"); return; }
  saveCurrent({ immediate: true });
  exportStatus.textContent = t("generating", format.toUpperCase());
  try {
    if (format === "pdf") exportPdf();
    else if (format === "docx") await exportDocx();
    else await exportPng();
    if (format !== "pdf") exportStatus.textContent = t("generated", format.toUpperCase());
  } catch (error) {
    exportStatus.textContent = t("exportFailed", error.message || error);
  }
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  const toggle = document.querySelector("#languageToggle");
  toggle.textContent = t("languageButton");
  toggle.setAttribute("aria-label", t("switchLanguage"));
  toggle.setAttribute("title", t("switchLanguage"));
}

function switchLanguage() {
  const previousLanguage = currentLanguage;
  currentLanguage = currentLanguage === "zh" ? "en" : "zh";
  localStorage.setItem(UI_LANGUAGE_KEY, currentLanguage);
  state.sections.forEach((section) => {
    const preset = sectionPresets.find((item) => item.key === section.presetKey);
    if (preset && section.title === preset.title[previousLanguage]) section.title = preset.title[currentLanguage];
  });
  applyLanguage();
  rerender();
}

function bindEvents() {
  personalBindings.forEach(([id, key]) => {
    document.querySelector(`#${id}`).addEventListener("input", (event) => {
      state.personal[key] = event.target.value;
      renderPreview();
      saveCurrent();
    });
  });
  document.querySelector("#accentInput").addEventListener("input", (event) => { state.theme.accent = event.target.value; renderPreview(); saveCurrent(); });
  document.querySelector("#fontScaleInput").addEventListener("input", (event) => { state.theme.fontScale = Number(event.target.value); renderPreview(); saveCurrent(); });
  document.querySelector("#densityInput").addEventListener("change", (event) => { state.theme.density = event.target.value; renderPreview(); saveCurrent(); });
  document.querySelector("#addListSection").addEventListener("click", () => addSection("list"));
  document.querySelector("#addTextSection").addEventListener("click", () => addSection("text"));
  document.querySelector("#languageToggle").addEventListener("click", switchLanguage);
  document.querySelector("#newResumeButton").addEventListener("click", startBlankResume);
  document.querySelector("#saveCopyButton").addEventListener("click", () => saveCurrent({ asCopy: true, immediate: true }));
  document.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.page === "mine") saveCurrent({ immediate: true });
    switchPage(button.dataset.page);
  }));
  document.querySelectorAll("[data-export]").forEach((button) => button.addEventListener("click", () => exportResume(button.dataset.export)));
  window.addEventListener("pagehide", () => saveCurrent({ immediate: true }));
}

applyLanguage();
migrateLegacyDraft();
syncControls();
bindEvents();
rerender();

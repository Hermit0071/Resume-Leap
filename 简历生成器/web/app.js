const templates = {
  harbor: {
    id: "harbor",
    name: "Harbor Blue",
    description: "稳重、清晰，适合港大活动申请与综合材料。",
    accent: "#1f4e79",
    density: "balanced",
    swatch: "linear-gradient(135deg, #1f4e79 0%, #7bb4e3 100%)",
  },
  editorial: {
    id: "editorial",
    name: "Editorial Sand",
    description: "更有人文气质，适合文书感较强的经历展示。",
    accent: "#9a5c2f",
    density: "airy",
    swatch: "linear-gradient(135deg, #f6dfc8 0%, #9a5c2f 100%)",
  },
  jade: {
    id: "jade",
    name: "Jade Horizon",
    description: "清新现代，适合科研、社团、竞赛型简历。",
    accent: "#0f7a5c",
    density: "compact",
    swatch: "linear-gradient(135deg, #d9f6ec 0%, #0f7a5c 100%)",
  },
};

const HISTORY_KEY = "resume-generator-history-v2";
const LEGACY_KEY = "resume-generator-state";
const MIGRATION_KEY = "resume-generator-history-migrated";

const sectionPresets = [
  { key: "education", title: "教育背景", type: "list", description: "学校、课程、成绩与学术方向" },
  { key: "leadership", title: "活动与领导力", type: "list", description: "社团、学生会与组织经历" },
  { key: "awards", title: "竞赛与荣誉", type: "list", description: "奖项、竞赛结果与荣誉称号" },
  { key: "service", title: "志愿服务", type: "list", description: "公益行动与社区参与" },
  { key: "projects", title: "项目经历", type: "list", description: "研究、实践与个人项目" },
  { key: "skills", title: "技能特长", type: "list", description: "软件、技术与艺术技能" },
  { key: "languages", title: "语言能力", type: "list", description: "语言水平与考试成绩" },
  { key: "statement", title: "个人陈述亮点", type: "text", description: "申请动机、兴趣与未来目标" },
];

const defaultPresetKeys = ["education", "leadership", "awards", "service", "statement"];

function createPresetSection(key) {
  const preset = sectionPresets.find((item) => item.key === key);
  if (!preset) return null;
  return {
    id: crypto.randomUUID(),
    presetKey: preset.key,
    title: preset.title,
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
    saveStatus.textContent = "浏览器未允许本地存储，当前内容无法自动保存。";
  }
}

function migrateLegacyDraft() {
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
    if (legacy && hasMeaningfulContent(legacy)) {
      history.unshift({
        id: crypto.randomUUID(),
        title: legacy.personal?.name?.trim() || "旧版简历",
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
    saveStatus.textContent = "空白简历不会写入历史。";
    return;
  }

  const commit = () => {
    if (asCopy || !currentHistoryId) currentHistoryId = crypto.randomUUID();
    const entry = {
      id: currentHistoryId,
      title: state.personal.name.trim() || "未命名简历",
      updatedAt: new Date().toISOString(),
      data: clone(state),
    };
    history = [entry, ...history.filter((item) => item.id !== currentHistoryId)].slice(0, 50);
    persistHistory();
    renderHistory();
    saveStatus.textContent = `已自动保存：${formatTime(entry.updatedAt)}`;
  };

  clearTimeout(saveTimer);
  if (immediate) commit();
  else saveTimer = setTimeout(commit, 450);
}

function formatTime(value) {
  return new Intl.DateTimeFormat("zh-CN", {
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
  historyCount.textContent = `${history.length} 份简历`;
  historyNavCount.textContent = history.length;
  if (!history.length) {
    historyList.innerHTML = '<div class="history-empty">还没有历史简历。开始填写后会自动出现在这里。</div>';
    return;
  }

  historyList.innerHTML = history
    .map(
      (entry) => `
        <article class="history-item ${entry.id === currentHistoryId ? "active" : ""}">
          <div class="history-accent" style="background:${entry.data?.theme?.accent || "#1f4e79"}"></div>
          <button class="history-load" data-history-action="load" data-history-id="${entry.id}">
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(templates[entry.data?.templateId]?.name || "自定义模板")} · ${(entry.data?.sections || []).length} 个板块</span>
            <time>更新于 ${formatTime(entry.updatedAt)}</time>
          </button>
          <button class="history-delete" data-history-action="delete" data-history-id="${entry.id}" aria-label="删除">删除</button>
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
    saveStatus.textContent = `已打开：${entry.title}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (action === "delete") {
    history = history.filter((item) => item.id !== id);
    if (currentHistoryId === id) currentHistoryId = null;
    persistHistory();
    renderHistory();
    saveStatus.textContent = "历史记录已删除。";
  }
}

function startBlankResume() {
  saveCurrent({ immediate: true });
  state = blankState();
  currentHistoryId = null;
  syncControls();
  rerender();
  switchPage("create");
  saveStatus.textContent = "已新建空白简历。";
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
          <div class="meta"><h3>${template.name}</h3><p>${template.description}</p></div>
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
      const added = state.sections.some((section) => section.presetKey === preset.key || section.title === preset.title);
      return `
        <button class="preset-section-card ${added ? "added" : ""}" data-preset-key="${preset.key}" ${added ? "disabled" : ""}>
          <span class="preset-icon">${preset.type === "text" ? "Aa" : "+"}</span>
          <span class="preset-copy"><strong>${preset.title}</strong><small>${preset.description}</small></span>
          <span class="preset-state">${added ? "已添加" : "添加"}</span>
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
    sectionsEditor.innerHTML = '<div class="editor-empty">当前还没有板块。你可以添加常用板块，也可以从零创建自己的板块。</div>';
    return;
  }

  state.sections.forEach((section, sectionIndex) => {
    const card = document.querySelector("#sectionCardTemplate").content.firstElementChild.cloneNode(true);
    card.classList.toggle("hidden", !section.visible);
    const itemsMarkup = section.type === "text" ? renderTextSection(section, sectionIndex) : renderListSection(section, sectionIndex);
    card.innerHTML = `
      <div class="section-card-head">
        <label class="field section-title-field"><span>板块名称</span>
          <input data-action="section-title" data-section-index="${sectionIndex}" value="${escapeHtml(section.title)}" />
        </label>
        <div class="section-controls">
          <button data-action="toggle-section" data-section-index="${sectionIndex}">${section.visible ? "隐藏" : "显示"}</button>
          <button data-action="move-section-up" data-section-index="${sectionIndex}">上移</button>
          <button data-action="move-section-down" data-section-index="${sectionIndex}">下移</button>
          <button class="danger" data-action="remove-section" data-section-index="${sectionIndex}">删除板块</button>
        </div>
      </div>
      ${itemsMarkup}
      ${section.type === "list" ? `<div class="toolbar item-add"><button data-action="add-item" data-section-index="${sectionIndex}">新增一项经历</button></div>` : ""}
    `;
    sectionsEditor.appendChild(card);
  });

  sectionsEditor.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener(element.tagName === "BUTTON" ? "click" : "input", handleSectionAction);
  });
}

function renderTextSection(section, sectionIndex) {
  return `<label class="field text-section-field"><span>正文内容</span>
    <textarea data-action="text" data-section-index="${sectionIndex}" placeholder="在这里填写内容">${escapeHtml(section.items?.[0]?.text || "")}</textarea>
  </label>`;
}

function renderListSection(section, sectionIndex) {
  if (!section.items.length) return '<div class="editor-empty compact-empty">这个板块还没有条目。</div>';
  return section.items
    .map(
      (item, itemIndex) => `
        <div class="item-card">
          <div class="item-card-head"><strong>条目 ${itemIndex + 1}</strong>
            <div class="item-controls">
              <button data-action="move-item-up" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">上移</button>
              <button data-action="move-item-down" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">下移</button>
              <button class="danger" data-action="remove-item" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">删除条目</button>
            </div>
          </div>
          <div class="item-grid">
            <label class="field"><span>标题</span><input data-action="item-title" data-section-index="${sectionIndex}" data-item-index="${itemIndex}" value="${escapeHtml(item.title)}" /></label>
            <label class="field"><span>副标题</span><input data-action="item-subtitle" data-section-index="${sectionIndex}" data-item-index="${itemIndex}" value="${escapeHtml(item.subtitle)}" /></label>
            <label class="field"><span>时间 / 地点 / 级别</span><input data-action="item-meta" data-section-index="${sectionIndex}" data-item-index="${itemIndex}" value="${escapeHtml(item.meta)}" /></label>
            <label class="field full"><span>简述</span><textarea data-action="item-detail" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${escapeHtml(item.detail)}</textarea></label>
            <label class="field full"><span>要点（每行一条）</span><textarea data-action="item-bullets" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">${escapeHtml((item.bullets || []).join("\n"))}</textarea></label>
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
            <h1>${escapeHtml(state.personal.name) || '<span class="preview-placeholder">你的姓名</span>'}</h1>
            ${state.personal.tagline ? `<div class="tagline">${escapeHtml(state.personal.tagline)}</div>` : ""}
            ${contacts ? `<div class="contacts">${escapeHtml(contacts)}</div>` : ""}
          </header>
          ${visibleSections.map(renderPreviewSection).join("")}
          ${visibleSections.length ? "" : '<div class="resume-empty">添加板块后，内容会显示在这里。</div>'}
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
    ? { id: crypto.randomUUID(), title: "新的文本板块", type: "text", visible: true, items: [{ text: "" }] }
    : { id: crypto.randomUUID(), title: "新的列表板块", type: "list", visible: true, items: [emptyItem()] });
  renderSectionsEditor();
  renderPresetSections();
  renderPreview();
  saveCurrent();
}

function fileStem() {
  return (state.personal.name.trim() || "我的简历").replace(/[\\/:*?"<>|]/g, "_");
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
  if (!window.docx) throw new Error("DOCX 离线组件未加载，请确认 vendor 文件夹与 HTML 在同一目录。 ");
  const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } = window.docx;
  const accent = state.theme.accent.replace("#", "").toUpperCase();
  const children = [];
  children.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    children: [new TextRun({ text: state.personal.name || "你的姓名", bold: true, size: 42, font: "PingFang SC" })],
  }));
  if (state.personal.tagline) children.push(new Paragraph({ children: [new TextRun({ text: state.personal.tagline, color: accent, size: 24, font: "PingFang SC" })] }));
  const contacts = [state.personal.school, state.personal.email, state.personal.phone, state.personal.location, state.personal.website].filter(Boolean).join(" | ");
  if (contacts) children.push(new Paragraph({ spacing: { after: 180 }, children: [new TextRun({ text: contacts, color: "666666", size: 19, font: "PingFang SC" })] }));

  state.sections.filter((section) => section.visible).forEach((section) => {
    children.push(new Paragraph({
      spacing: { before: 180, after: 100 },
      border: { bottom: { color: accent, style: BorderStyle.SINGLE, size: 8, space: 4 } },
      children: [new TextRun({ text: section.title || "未命名板块", bold: true, color: accent, size: 26, font: "PingFang SC" })],
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
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error("浏览器无法渲染 PNG，请使用 Chrome 或 Safari 最新版本。")); image.src = imageUrl; });
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  context.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(imageUrl);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG 文件生成失败。 ");
  downloadBlob(blob, `${fileStem()}.png`);
}

function exportPdf() {
  const previousTitle = document.title;
  document.title = fileStem();
  exportStatus.textContent = "打印窗口已打开，请选择左下角“PDF”→“存储为 PDF”。";
  const restoreTitle = () => { document.title = previousTitle; window.removeEventListener("afterprint", restoreTitle); };
  window.addEventListener("afterprint", restoreTitle);
  window.print();
}

async function exportResume(format) {
  if (!hasMeaningfulContent()) { exportStatus.textContent = "请先填写一些内容再导出。"; return; }
  saveCurrent({ immediate: true });
  exportStatus.textContent = `正在生成 ${format.toUpperCase()}...`;
  try {
    if (format === "pdf") exportPdf();
    else if (format === "docx") await exportDocx();
    else await exportPng();
    if (format !== "pdf") exportStatus.textContent = `${format.toUpperCase()} 已生成并开始下载。`;
  } catch (error) {
    exportStatus.textContent = `导出失败：${error.message || error}`;
  }
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
  document.querySelector("#newResumeButton").addEventListener("click", startBlankResume);
  document.querySelector("#saveCopyButton").addEventListener("click", () => saveCurrent({ asCopy: true, immediate: true }));
  document.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.page === "mine") saveCurrent({ immediate: true });
    switchPage(button.dataset.page);
  }));
  document.querySelectorAll("[data-export]").forEach((button) => button.addEventListener("click", () => exportResume(button.dataset.export)));
  window.addEventListener("pagehide", () => saveCurrent({ immediate: true }));
}

migrateLegacyDraft();
syncControls();
bindEvents();
rerender();

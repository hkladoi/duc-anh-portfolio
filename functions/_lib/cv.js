import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFString, PageSizes, rgb } from "pdf-lib";

const PAGE_MARGIN = 38;
const PAGE_BOTTOM = 34;
const BODY_SIZE = 8.6;
const BODY_LINE_HEIGHT = 11.4;

const STATIC_CONTENT = {
  vi: {
    sections: {
      objective: "MỤC TIÊU NGHỀ NGHIỆP",
      education: "HỌC VẤN",
      experience: "KINH NGHIỆM LÀM VIỆC",
      project: "DỰ ÁN CÁ NHÂN",
      skills: "KỸ NĂNG"
    },
    objective: [
      {
        label: "Mục tiêu ngắn hạn:",
        text: "Trong ngắn hạn, tôi mong muốn được làm việc ở vị trí C# Web Developer để áp dụng kiến thức về ASP.NET vào thực tế, rèn luyện kỹ năng xây dựng các ứng dụng web hiện đại và có tính bảo mật cao."
      },
      {
        label: "Mục tiêu dài hạn:",
        text: "Về dài hạn, tôi định hướng trở thành một lập trình viên web backend vững chuyên môn, có khả năng thiết kế và triển khai các hệ thống web phức tạp, hiệu suất cao. Tôi mong muốn mở rộng kiến thức về kiến trúc phần mềm, API, microservices và công nghệ cloud để phát triển các ứng dụng web hiện đại, linh hoạt và dễ mở rộng."
      }
    ],
    education: {
      school: "CAO ĐẲNG FPT",
      period: "09/2021 - 12/2023",
      major: "Ứng dụng phần mềm"
    },
    labels: {
      project: "Dự án:",
      work: "Công việc:",
      technologies: "Công nghệ:",
      teamSize: "Quy mô nhóm:",
      people: "người",
      description: "Mô tả:",
      url: "Đường dẫn:"
    },
    teamSizes: [15, 20, 7],
    skillGroups: [
      {
        title: "KỸ NĂNG CHUYÊN MÔN",
        items: [
          "Front-end: HTML, CSS, JavaScript, Bootstrap, Axios",
          "Back-end: .NET, Python, FastAPI, RESTful API",
          "Database: SQL Server, MySQL, PostgreSQL, SQLite3",
          "Tools: Git, Teams, Jira, Trello"
        ]
      },
      {
        title: "KỸ NĂNG MỀM",
        items: [
          "Khả năng làm việc nhóm tốt và giao tiếp hiệu quả",
          "Tư duy chi tiết và có trách nhiệm cao trong công việc",
          "Biết quản lý thời gian và ưu tiên công việc hợp lý",
          "Chủ động học hỏi, ham tìm hiểu kỹ thuật mới",
          "Suy nghĩ logic, có khả năng phản biện và phân tích vấn đề"
        ]
      },
      { title: "KỸ NĂNG KHÁC", items: ["Tiếng Anh: Trình độ B2"] }
    ]
  },
  en: {
    sections: {
      objective: "CAREER OBJECTIVE",
      education: "EDUCATION",
      experience: "WORK EXPERIENCE",
      project: "PERSONAL PROJECT",
      skills: "SKILLS"
    },
    objective: [
      {
        label: "Short-term objective:",
        text: "I want to contribute as a C# Web Developer, apply my ASP.NET knowledge in production, and strengthen my ability to build modern, secure web applications."
      },
      {
        label: "Long-term objective:",
        text: "I aim to become a strong backend engineer who can design and deliver complex, high-performance systems. I plan to deepen my knowledge of software architecture, APIs, microservices, and cloud platforms to build flexible and scalable products."
      }
    ],
    education: {
      school: "FPT POLYTECHNIC COLLEGE",
      period: "Sep 2021 - Dec 2023",
      major: "Software Applications"
    },
    labels: {
      project: "Project:",
      work: "Work:",
      technologies: "Technologies:",
      teamSize: "Team size:",
      people: "people",
      description: "Description:",
      url: "URL:"
    },
    teamSizes: [15, 20, 7],
    skillGroups: [
      {
        title: "TECHNICAL SKILLS",
        items: [
          "Front-end: HTML, CSS, JavaScript, Bootstrap, Axios",
          "Back-end: .NET, Python, FastAPI, RESTful API",
          "Databases: SQL Server, MySQL, PostgreSQL, SQLite3",
          "Tools: Git, Teams, Jira, Trello"
        ]
      },
      {
        title: "SOFT SKILLS",
        items: [
          "Effective teamwork and communication",
          "Detail-oriented and accountable approach to work",
          "Time management and prioritization",
          "Proactive learning and technical curiosity",
          "Logical thinking, critical reasoning, and problem analysis"
        ]
      },
      { title: "OTHER SKILLS", items: ["English: B2 proficiency"] }
    ]
  }
};

function normalizeText(value) {
  return String(value ?? "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\s+/g, " ");
}

function cleanText(value) {
  return normalizeText(value).trim();
}

function createFontFamily(regular, bold) {
  return { regular, bold };
}

function fontForCharacter(fonts, bold) {
  return bold ? fonts.bold : fonts.regular;
}

function measureText(fonts, text, size, bold = false) {
  return [...normalizeText(text)].reduce(
    (width, character) => width + fontForCharacter(fonts, bold).widthOfTextAtSize(character, size),
    0
  );
}

function drawTextRuns(page, fonts, text, x, y, size, bold = false, color = rgb(0.08, 0.08, 0.08)) {
  let cursorX = x;
  let run = "";
  let runFont = null;

  const flush = () => {
    if (!run || !runFont) return;
    page.drawText(run, { x: cursorX, y, size, font: runFont, color });
    cursorX += runFont.widthOfTextAtSize(run, size);
    run = "";
  };

  for (const character of [...normalizeText(text)]) {
    const characterFont = fontForCharacter(fonts, bold);
    if (runFont && characterFont !== runFont) flush();
    runFont = characterFont;
    run += character;
  }
  flush();
  return cursorX - x;
}

function addLink(document, page, x, y, width, height, url) {
  const annotation = document.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + width, y + height],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(url)
    }
  });
  page.node.addAnnot(document.context.register(annotation));
}

function tokenise(segments, fonts, size, maxWidth) {
  const tokens = [];

  for (const [segmentIndex, segment] of segments.entries()) {
    const text = cleanText(segment.text);
    if (segmentIndex > 0 && tokens.length && tokens.at(-1).text !== " ") {
      tokens.push({ ...segment, text: " ", width: measureText(fonts, " ", size, segment.bold) });
    }
    for (const rawToken of text.split(/(\s+)/).filter(Boolean)) {
      const tokenText = /^\s+$/.test(rawToken) ? " " : rawToken;
      const width = measureText(fonts, tokenText, size, segment.bold);

      if (width <= maxWidth || tokenText === " ") {
        tokens.push({ ...segment, text: tokenText, width });
        continue;
      }

      let part = "";
      for (const character of [...tokenText]) {
        const candidate = part + character;
        if (part && measureText(fonts, candidate, size, segment.bold) > maxWidth) {
          tokens.push({ ...segment, text: part, width: measureText(fonts, part, size, segment.bold) });
          part = character;
        } else {
          part = candidate;
        }
      }
      if (part) tokens.push({ ...segment, text: part, width: measureText(fonts, part, size, segment.bold) });
    }
  }

  return tokens;
}

function wrapSegments(segments, fonts, size, maxWidth) {
  const lines = [];
  let line = [];
  let width = 0;

  for (const token of tokenise(segments, fonts, size, maxWidth)) {
    if (token.text === " " && line.length === 0) continue;
    if (line.length > 0 && width + token.width > maxWidth) {
      while (line.at(-1)?.text === " ") {
        width -= line.at(-1).width;
        line.pop();
      }
      lines.push(line);
      line = token.text === " " ? [] : [token];
      width = token.text === " " ? 0 : token.width;
      continue;
    }
    line.push(token);
    width += token.width;
  }

  while (line.at(-1)?.text === " ") line.pop();
  if (line.length) lines.push(line);
  return lines;
}

function createLayout(document, fonts) {
  const layout = {
    document,
    fonts,
    pages: [],
    page: null,
    y: 0,
    width: PageSizes.A4[0],
    height: PageSizes.A4[1]
  };

  layout.newPage = () => {
    layout.page = document.addPage(PageSizes.A4);
    layout.pages.push(layout.page);
    layout.y = layout.height - PAGE_MARGIN;
  };

  layout.ensure = (height) => {
    if (!layout.page || layout.y - height < PAGE_BOTTOM) layout.newPage();
  };

  layout.richParagraph = (segments, options = {}) => {
    const size = options.size ?? BODY_SIZE;
    const lineHeight = options.lineHeight ?? BODY_LINE_HEIGHT;
    const indent = options.indent ?? 0;
    const x = PAGE_MARGIN + indent;
    const maxWidth = layout.width - PAGE_MARGIN * 2 - indent;
    const lines = wrapSegments(segments, fonts, size, maxWidth);

    for (const line of lines) {
      layout.ensure(lineHeight);
      let cursorX = x;
      for (const token of line) {
        const tokenWidth = drawTextRuns(layout.page, fonts, token.text, cursorX, layout.y, size, token.bold, options.color);
        if (token.link && token.text.trim()) addLink(document, layout.page, cursorX, layout.y - 1, tokenWidth, lineHeight, token.link);
        cursorX += tokenWidth;
      }
      layout.y -= lineHeight;
    }
    layout.y -= options.after ?? 2;
  };

  layout.section = (title) => {
    layout.ensure(30);
    layout.y -= 5;
    drawTextRuns(layout.page, fonts, title, PAGE_MARGIN, layout.y, 11.2, true);
    layout.y -= 5;
    layout.page.drawLine({
      start: { x: PAGE_MARGIN, y: layout.y },
      end: { x: layout.width - PAGE_MARGIN, y: layout.y },
      thickness: 0.75,
      color: rgb(0.08, 0.08, 0.08)
    });
    layout.y -= 14;
  };

  layout.divider = () => {
    layout.ensure(12);
    layout.y -= 4;
    layout.page.drawLine({
      start: { x: PAGE_MARGIN, y: layout.y },
      end: { x: layout.width - PAGE_MARGIN, y: layout.y },
      thickness: 0.35,
      color: rgb(0.82, 0.82, 0.82)
    });
    layout.y -= 8;
  };

  layout.newPage();
  return layout;
}

function drawCenteredText(layout, text, size, bold = false) {
  const width = measureText(layout.fonts, text, size, bold);
  drawTextRuns(layout.page, layout.fonts, text, (layout.width - width) / 2, layout.y, size, bold);
  layout.y -= size + 5;
}

function drawHeader(layout, content) {
  drawCenteredText(layout, content.introduction.name, 20, true);
  drawCenteredText(layout, content.introduction.role.toUpperCase(), 11.5, true);

  const contactItems = [
    { text: "0928875697" },
    { text: content.contact.email, link: `mailto:${content.contact.email}` },
    { text: content.contact.github, link: content.contact.github },
    { text: content.introduction.location }
  ];
  const separator = " | ";
  const size = 8.2;
  const totalWidth = contactItems.reduce(
    (width, item, index) => width + measureText(layout.fonts, item.text, size) + (index ? measureText(layout.fonts, separator, size) : 0),
    0
  );
  let x = Math.max(PAGE_MARGIN, (layout.width - totalWidth) / 2);

  for (const [index, item] of contactItems.entries()) {
    if (index) x += drawTextRuns(layout.page, layout.fonts, separator, x, layout.y, size);
    const width = drawTextRuns(layout.page, layout.fonts, item.text, x, layout.y, size);
    if (item.link) addLink(layout.document, layout.page, x, layout.y - 1, width, size + 3, item.link);
    x += width;
  }
  layout.y -= 24;
}

function drawEducation(layout, education) {
  layout.ensure(34);
  drawTextRuns(layout.page, layout.fonts, education.school, PAGE_MARGIN, layout.y, 9.4, true);
  const periodWidth = measureText(layout.fonts, education.period, 9.4, true);
  drawTextRuns(layout.page, layout.fonts, education.period, layout.width - PAGE_MARGIN - periodWidth, layout.y, 9.4, true);
  layout.y -= 18;
  layout.richParagraph([{ text: education.major }], { after: 6 });
}

function drawExperience(layout, content, copy) {
  for (const [index, item] of content.experience.items.entries()) {
    layout.ensure(74);
    const companyWidth = measureText(layout.fonts, item.company, 9.2, true);
    const periodWidth = measureText(layout.fonts, item.period, 8.7, true);
    drawTextRuns(layout.page, layout.fonts, item.company, PAGE_MARGIN, layout.y, 9.2, true);

    if (companyWidth + periodWidth + 18 <= layout.width - PAGE_MARGIN * 2) {
      drawTextRuns(layout.page, layout.fonts, item.period, layout.width - PAGE_MARGIN - periodWidth, layout.y, 8.7, true);
      layout.y -= 16;
    } else {
      layout.y -= 13;
      drawTextRuns(layout.page, layout.fonts, item.period, PAGE_MARGIN, layout.y, 8.7, true);
      layout.y -= 15;
    }

    layout.richParagraph([{ text: item.role, bold: true }], { size: 8.8, after: 3 });
    layout.richParagraph([
      { text: `- ${copy.labels.project} `, bold: true },
      { text: item.projectOverview }
    ]);
    layout.richParagraph([
      { text: `- ${copy.labels.work} `, bold: true },
      { text: item.responsibilities }
    ]);
    layout.richParagraph([
      { text: `- ${copy.labels.technologies} `, bold: true },
      { text: item.technologies.join(", ") }
    ]);
    if (copy.teamSizes[index]) {
      layout.richParagraph([
        { text: `- ${copy.labels.teamSize} `, bold: true },
        { text: `${copy.teamSizes[index]} ${copy.labels.people}` }
      ], { after: 1 });
    }

    if (index < content.experience.items.length - 1) layout.divider();
  }
}

function drawProjects(layout, projects, copy) {
  for (const [index, project] of projects.entries()) {
    layout.ensure(60);
    layout.richParagraph([{ text: project.title, bold: true }, { text: ` - ${project.type}` }], { size: 9.4, after: 4 });
    layout.richParagraph([
      { text: `- ${copy.labels.description} `, bold: true },
      { text: project.description }
    ]);
    layout.richParagraph([
      { text: `- ${copy.labels.url} `, bold: true },
      { text: project.url, link: project.url }
    ], { after: 5 });
    if (index < projects.length - 1) layout.divider();
  }
}

function drawSkills(layout, groups) {
  for (const group of groups) {
    layout.ensure(34);
    layout.richParagraph([{ text: group.title, bold: true }], { size: 8.9, after: 1 });
    for (const item of group.items) layout.richParagraph([{ text: `- ${item}` }], { indent: 10, after: 0 });
    layout.y -= 5;
  }
}

export async function buildCvPdf(content, locale, fontBytes) {
  const copy = STATIC_CONTENT[locale];
  if (!copy) throw new Error("Unsupported locale");

  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  document.setTitle(`${content.introduction.name} - CV`);
  document.setAuthor(content.introduction.name);
  document.setSubject(content.introduction.role);
  document.setCreator("portfolio.hkladoi.tech");

  const [regular, bold] = await Promise.all([
    document.embedFont(fontBytes.regular),
    document.embedFont(fontBytes.bold)
  ]);
  const fonts = createFontFamily(regular, bold);
  const layout = createLayout(document, fonts);

  drawHeader(layout, content);
  layout.section(copy.sections.objective);
  for (const objective of copy.objective) {
    layout.richParagraph([{ text: `${objective.label} `, bold: true }, { text: objective.text }], { after: 3 });
  }

  layout.section(copy.sections.education);
  drawEducation(layout, copy.education);

  layout.section(copy.sections.experience);
  drawExperience(layout, content, copy);

  if (layout.pages.length === 1) layout.newPage();
  layout.section(copy.sections.project);
  drawProjects(layout, content.project.items, copy);

  layout.section(copy.sections.skills);
  drawSkills(layout, copy.skillGroups);

  for (const [index, page] of layout.pages.entries()) {
    const pageNumber = `${index + 1} / ${layout.pages.length}`;
    const width = measureText(fonts, pageNumber, 7.4);
    drawTextRuns(page, fonts, pageNumber, (layout.width - width) / 2, 18, 7.4, false, rgb(0.45, 0.45, 0.45));
  }

  return document.save();
}

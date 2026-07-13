import type { PortfolioContent } from "@/types/portfolio";

export const en: PortfolioContent = {
  locale: "en",
  languageName: "English",
  alternateLanguageLabel: "VI",
  alternateHref: "/vi/",
  metadata: {
    title: "Trinh Tran Duc Anh - .NET Developer",
    description:
      ".NET developer in Hanoi building dependable business systems with ASP.NET, C#, Python, SQL, and a steady eye for performance."
  },
  navigation: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" }
  ],
  hero: {
    eyebrow: "C# / .NET DEVELOPER · HANOI",
    role: "Backend developer",
    statement: "I turn complex business rules into software that feels calm, dependable, and ready to grow.",
    introduction:
      "I am Duc Anh, a .NET developer shaping practical systems with C#, ASP.NET, Python, and SQL - from real-estate lifecycles to internal platforms that keep businesses moving.",
    primaryCta: "Explore my work",
    secondaryCta: "Download CV",
    availability: "Open to full-time opportunities",
    location: "Cau Giay, Hanoi"
  },
  about: {
    eyebrow: "01 / ABOUT",
    title: "Thoughtful engineering for the machinery behind a business.",
    paragraphs: [
      "I enjoy the part of software that sits beneath the surface: the rules, data flows, and quiet decisions that allow a product to remain trustworthy as it grows.",
      "My path has taken me through real estate, housing design, enterprise reporting, and e-commerce. Across each domain, I have learned to listen carefully, translate complexity into maintainable code, and leave a system clearer than I found it.",
      "Today I am deepening my craft in backend architecture, APIs, microservices, and cloud platforms - with the long-term ambition of designing high-performance systems that scale without losing their simplicity."
    ],
    principles: [
      { number: "01", title: "Clarity first", description: "Make intent visible in code, interfaces, and communication." },
      { number: "02", title: "Built to endure", description: "Treat maintenance and performance as part of the first design." },
      { number: "03", title: "Learn in motion", description: "Stay curious, ask better questions, and improve through delivery." }
    ]
  },
  experience: {
    eyebrow: "02 / EXPERIENCE",
    title: "Experience across products where details matter.",
    intro:
      "From long-lived desktop systems to modern web platforms, I have contributed across implementation, review, testing, maintenance, and performance work.",
    items: [
      {
        company: "InfoPlus Co., Ltd.",
        role: ".NET Developer",
        period: "Apr 2025 - Present",
        summary:
          "Developing a real-estate management platform that follows the full property lifecycle for a large investor.",
        highlights: [
          "Implement and maintain workflows spanning inventory, reservations, purchase contracts, finance, and business reporting.",
          "Work within a 15-person product team to improve system reliability and performance."
        ],
        technologies: ["ASP.NET 9", "Razor", "MySQL", "SQL Server", "Redis"]
      },
      {
        company: "Ominext JSC",
        role: ".NET Developer",
        period: "Feb 2024 - Mar 2025",
        summary:
          "Built housing-design and enterprise-management tools in a 20-person engineering environment.",
        highlights: [
          "Developed features for materials, design workflows, and staff-customer collaboration in a housing management system.",
          "Contributed to an internal platform for people, projects, revenue, and reporting using Python and FastAPI.",
          "Handled UI implementation, code review, test cases, unit tests, maintenance, and performance optimization."
        ],
        technologies: ["C#", "VB.NET", "WinForms", "ASP.NET", "Python", "FastAPI", "PostgreSQL", "SQLite"]
      },
      {
        company: "Smart Software Vietnam JSC",
        role: ".NET Developer",
        period: "Nov 2023 - Jan 2024",
        summary:
          "Helped a seven-person team build an online sneaker commerce and product-management platform.",
        highlights: [
          "Implemented application features and interfaces across Blazor and web technologies.",
          "Participated in review, unit testing, maintenance, and performance optimization."
        ],
        technologies: ["C#", "Blazor", "HTML", "CSS", "JavaScript", "REST API", "SQL Server"]
      }
    ]
  },
  projects: {
    eyebrow: "03 / SELECTED SYSTEMS",
    title: "Systems built for real work, not just the demo.",
    intro:
      "A selection of commercial products I have helped move forward. Project names are generalized to respect client confidentiality.",
    items: [
      {
        index: "01",
        title: "Real-estate lifecycle platform",
        context: "Enterprise property operations",
        description:
          "A connected operational system carrying each property from inventory and reservation through contracts, financial transactions, and reporting.",
        contribution: "Development · Maintenance · Performance optimization",
        technologies: ["ASP.NET 9", "Razor", "Redis", "SQL Server", "MySQL"]
      },
      {
        index: "02",
        title: "Housing design management",
        context: "Construction and customer collaboration",
        description:
          "A workspace for materials, housing designs, and the many conversations that connect employees with customers throughout a project.",
        contribution: "Development · UI design · Review · Unit testing",
        technologies: ["C#", "VB.NET", "WinForms", "ASP.NET", "PostgreSQL"]
      },
      {
        index: "03",
        title: "Enterprise reporting toolkit",
        context: "Internal operations",
        description:
          "A company management platform bringing people, projects, revenue, and reporting into one coherent flow.",
        contribution: "Development · Review · Testing · Optimization",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Redmine"]
      },
      {
        index: "04",
        title: "Sneaker commerce platform",
        context: "E-commerce",
        description:
          "An online storefront and product-management experience designed to help a sneaker business operate and sell through the web.",
        contribution: "Development · UI design · Review · Unit testing",
        technologies: ["C#", "Blazor", "JavaScript", "REST API", "SQL Server"]
      }
    ]
  },
  skills: {
    eyebrow: "04 / CAPABILITIES",
    title: "A practical toolkit, sharpened by production.",
    intro:
      "I work most comfortably where backend logic, reliable data, and maintainable interfaces meet.",
    groups: [
      { title: "Backend", items: ["C# / .NET", "ASP.NET", "Python", "FastAPI", "RESTful APIs", "Razor", "Blazor"] },
      { title: "Data", items: ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "Redis"] },
      { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "Bootstrap", "Axios"] },
      { title: "Workflow", items: ["Git", "Jira", "Trello", "Redmine", "Microsoft Teams", "Unit testing"] }
    ],
    strengthsTitle: "How I work",
    strengths: [
      "Collaborative and clear in team communication",
      "Detail-oriented, responsible, and deliberate",
      "Comfortable prioritizing work and managing time",
      "Curious about new technologies and better patterns",
      "Logical, analytical, and open to constructive debate"
    ]
  },
  education: {
    eyebrow: "05 / EDUCATION",
    title: "Learning, formally and every day.",
    school: "FPT Polytechnic College",
    program: "Software Application",
    period: "Sep 2021 - Dec 2023",
    language: "English proficiency: B2"
  },
  contact: {
    eyebrow: "06 / CONTACT",
    title: "Let’s build the quiet engine behind something meaningful.",
    body:
      "I am open to a full-time .NET development role where thoughtful engineering, steady collaboration, and long-term product quality are valued.",
    emailLabel: "Start a conversation",
    githubLabel: "Visit GitHub",
    note: "Based in Hanoi · Open to on-site, hybrid, or remote conversations"
  },
  footer: "Designed and built with care in Hanoi."
};

export const vi: PortfolioContent = {
  locale: "vi",
  languageName: "Tiếng Việt",
  alternateLanguageLabel: "EN",
  alternateHref: "/",
  metadata: {
    title: "Trịnh Trần Đức Anh - Lập trình viên .NET",
    description:
      "Lập trình viên .NET tại Hà Nội, xây dựng hệ thống nghiệp vụ bền bỉ với ASP.NET, C#, Python, SQL và tư duy tối ưu hiệu năng."
  },
  navigation: [
    { label: "Giới thiệu", href: "#about" },
    { label: "Kinh nghiệm", href: "#experience" },
    { label: "Dự án", href: "#work" },
    { label: "Kỹ năng", href: "#skills" }
  ],
  hero: {
    eyebrow: "C# / .NET DEVELOPER · HÀ NỘI",
    role: "Lập trình viên backend",
    statement: "Tôi biến những quy trình nhiều tầng thành hệ thống gọn gàng, bền bỉ và sẵn sàng lớn lên cùng sản phẩm.",
    introduction:
      "Tôi là Đức Anh, một lập trình viên .NET kiến tạo các hệ thống thực tiễn bằng C#, ASP.NET, Python và SQL - từ vòng đời bất động sản đến những nền tảng âm thầm giữ nhịp vận hành cho doanh nghiệp.",
    primaryCta: "Khám phá công việc",
    secondaryCta: "Tải CV",
    availability: "Sẵn sàng cho cơ hội toàn thời gian",
    location: "Cầu Giấy, Hà Nội"
  },
  about: {
    eyebrow: "01 / GIỚI THIỆU",
    title: "Làm kỹ phần phía sau, để mọi thứ phía trước vận hành nhẹ nhàng.",
    paragraphs: [
      "Tôi yêu phần công việc ít khi hiện diện trên màn hình: những quy tắc nghiệp vụ, dòng chảy dữ liệu và các quyết định nhỏ giúp một sản phẩm giữ được sự đáng tin khi ngày một lớn lên.",
      "Hành trình của tôi đi qua bất động sản, thiết kế nhà ở, báo cáo doanh nghiệp và thương mại điện tử. Ở mỗi miền nghiệp vụ, tôi học cách lắng nghe thật kỹ, dịch sự phức tạp thành mã nguồn dễ bảo trì, và rời một hệ thống trong trạng thái sáng rõ hơn khi mình bắt đầu.",
      "Hiện tại, tôi tiếp tục đào sâu kiến trúc backend, API, microservices và cloud - hướng tới khả năng thiết kế những hệ thống hiệu năng cao, linh hoạt mà không đánh mất vẻ đơn giản."
    ],
    principles: [
      { number: "01", title: "Rõ ràng trước tiên", description: "Để ý định hiện lên trong mã nguồn, giao diện và cách trao đổi." },
      { number: "02", title: "Bền bỉ từ thiết kế", description: "Xem bảo trì và hiệu năng là một phần của bài toán ngay từ đầu." },
      { number: "03", title: "Học trong chuyển động", description: "Luôn tò mò, đặt câu hỏi tốt hơn và trưởng thành qua từng lần giao sản phẩm." }
    ]
  },
  experience: {
    eyebrow: "02 / KINH NGHIỆM",
    title: "Trải nghiệm trong những sản phẩm nơi từng chi tiết đều có trọng lượng.",
    intro:
      "Từ hệ thống desktop lâu năm đến nền tảng web hiện đại, tôi tham gia xuyên suốt lập trình, review, kiểm thử, bảo trì và tối ưu hiệu năng.",
    items: [
      {
        company: "Công ty TNHH InfoPlus",
        role: ".NET Developer",
        period: "04/2025 - Hiện tại",
        summary:
          "Phát triển nền tảng quản lý trọn vòng đời bất động sản cho một chủ đầu tư lớn.",
        highlights: [
          "Xây dựng và bảo trì quy trình từ tồn kho, đặt chỗ, hợp đồng mua bán đến thu chi tài chính và báo cáo kinh doanh.",
          "Cộng tác trong đội ngũ 15 thành viên, tập trung vào độ ổn định và hiệu năng của hệ thống."
        ],
        technologies: ["ASP.NET 9", "Razor", "MySQL", "SQL Server", "Redis"]
      },
      {
        company: "Công ty Cổ phần Ominext",
        role: ".NET Developer",
        period: "02/2024 - 03/2025",
        summary:
          "Xây dựng hệ thống thiết kế nhà ở và công cụ quản trị doanh nghiệp trong đội ngũ 20 người.",
        highlights: [
          "Phát triển chức năng quản lý vật liệu, thiết kế và tương tác giữa nhân viên với khách hàng trong hệ thống nhà ở.",
          "Đóng góp vào nền tảng nội bộ quản lý nhân sự, dự án, doanh thu và báo cáo bằng Python, FastAPI.",
          "Thực hiện giao diện, review code, test case, unit test, bảo trì và tối ưu hiệu năng."
        ],
        technologies: ["C#", "VB.NET", "WinForms", "ASP.NET", "Python", "FastAPI", "PostgreSQL", "SQLite"]
      },
      {
        company: "Công ty Cổ phần Smart Software Việt Nam",
        role: ".NET Developer",
        period: "11/2023 - 01/2024",
        summary:
          "Cùng đội ngũ bảy thành viên xây dựng nền tảng kinh doanh và quản lý sản phẩm sneaker trực tuyến.",
        highlights: [
          "Phát triển tính năng và giao diện ứng dụng bằng Blazor cùng các công nghệ web.",
          "Tham gia review, kiểm thử đơn vị, bảo trì và tối ưu hiệu năng."
        ],
        technologies: ["C#", "Blazor", "HTML", "CSS", "JavaScript", "REST API", "SQL Server"]
      }
    ]
  },
  projects: {
    eyebrow: "03 / HỆ THỐNG TIÊU BIỂU",
    title: "Những hệ thống được viết cho công việc thật, không chỉ để trình diễn.",
    intro:
      "Một số sản phẩm thương mại tôi đã góp sức xây dựng. Tên dự án được khái quát để tôn trọng tính bảo mật của khách hàng.",
    items: [
      {
        index: "01",
        title: "Nền tảng vòng đời bất động sản",
        context: "Vận hành bất động sản doanh nghiệp",
        description:
          "Một hệ thống liền mạch đưa mỗi sản phẩm từ tồn kho và đặt chỗ, qua hợp đồng, giao dịch tài chính đến những báo cáo cuối cùng.",
        contribution: "Lập trình · Bảo trì · Tối ưu hiệu năng",
        technologies: ["ASP.NET 9", "Razor", "Redis", "SQL Server", "MySQL"]
      },
      {
        index: "02",
        title: "Quản lý thiết kế nhà ở",
        context: "Xây dựng và cộng tác khách hàng",
        description:
          "Không gian quản lý vật liệu, thiết kế nhà ở và những cuộc trao đổi kết nối nhân viên với khách hàng trong suốt dự án.",
        contribution: "Lập trình · Thiết kế UI · Review · Unit test",
        technologies: ["C#", "VB.NET", "WinForms", "ASP.NET", "PostgreSQL"]
      },
      {
        index: "03",
        title: "Bộ công cụ báo cáo doanh nghiệp",
        context: "Vận hành nội bộ",
        description:
          "Nền tảng gom nhân sự, dự án, doanh thu và báo cáo vào một dòng chảy quản trị nhất quán.",
        contribution: "Lập trình · Review · Kiểm thử · Tối ưu",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Redmine"]
      },
      {
        index: "04",
        title: "Nền tảng thương mại sneaker",
        context: "Thương mại điện tử",
        description:
          "Trải nghiệm cửa hàng và quản lý sản phẩm trực tuyến, giúp một doanh nghiệp sneaker vận hành và bán hàng trên web.",
        contribution: "Lập trình · Thiết kế UI · Review · Unit test",
        technologies: ["C#", "Blazor", "JavaScript", "REST API", "SQL Server"]
      }
    ]
  },
  skills: {
    eyebrow: "04 / NĂNG LỰC",
    title: "Một bộ công cụ thực tiễn, được mài sắc qua sản phẩm thật.",
    intro:
      "Tôi làm việc tự tin nhất tại giao điểm của logic backend, dữ liệu đáng tin cậy và những giao diện dễ bảo trì.",
    groups: [
      { title: "Backend", items: ["C# / .NET", "ASP.NET", "Python", "FastAPI", "RESTful APIs", "Razor", "Blazor"] },
      { title: "Dữ liệu", items: ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "Redis"] },
      { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "Bootstrap", "Axios"] },
      { title: "Quy trình", items: ["Git", "Jira", "Trello", "Redmine", "Microsoft Teams", "Unit testing"] }
    ],
    strengthsTitle: "Cách tôi làm việc",
    strengths: [
      "Cộng tác tốt và giao tiếp rõ ràng trong đội nhóm",
      "Chú ý chi tiết, trách nhiệm và thận trọng",
      "Biết ưu tiên công việc và quản lý thời gian",
      "Chủ động tìm hiểu công nghệ và cách làm tốt hơn",
      "Tư duy logic, phân tích và sẵn sàng phản biện xây dựng"
    ]
  },
  education: {
    eyebrow: "05 / HỌC VẤN",
    title: "Học trong trường lớp, và học mỗi ngày.",
    school: "Cao đẳng FPT Polytechnic",
    program: "Ứng dụng phần mềm",
    period: "09/2021 - 12/2023",
    language: "Trình độ tiếng Anh: B2"
  },
  contact: {
    eyebrow: "06 / LIÊN HỆ",
    title: "Cùng xây bộ máy thầm lặng phía sau một điều có ý nghĩa.",
    body:
      "Tôi đang tìm kiếm vị trí .NET Developer toàn thời gian, nơi kỹ thuật chỉn chu, sự cộng tác bền bỉ và chất lượng sản phẩm dài hạn được trân trọng.",
    emailLabel: "Bắt đầu câu chuyện",
    githubLabel: "Ghé thăm GitHub",
    note: "Tại Hà Nội · Sẵn sàng trao đổi cơ hội on-site, hybrid hoặc remote"
  },
  footer: "Được thiết kế và xây dựng chỉn chu tại Hà Nội."
};

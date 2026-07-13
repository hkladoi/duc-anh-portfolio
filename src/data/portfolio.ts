import type { PortfolioContent } from "@/types/portfolio";

export const en: PortfolioContent = {
  locale: "en",
  alternateLanguageLabel: "VI",
  alternateHref: "/vi/",
  metadata: {
    title: "Trinh Tran Duc Anh — .NET Developer",
    description: ".NET developer in Hanoi working with C#, ASP.NET, Python, SQL, and production business systems."
  },
  navigation: [
    { label: "About", href: "#top" },
    { label: "Contact", href: "#contact" },
    { label: "Experience", href: "#experience" },
    { label: "Personal project", href: "#project" }
  ],
  introduction: {
    label: "Hello, I’m",
    name: "Trinh Tran Duc Anh",
    role: ".NET Developer",
    statement: "I build clear, dependable software for complex business workflows.",
    body:
      "I am a backend-focused developer with experience across real estate, housing design, enterprise reporting, and e-commerce. I enjoy turning dense requirements into maintainable systems that teams can trust and continue to grow.",
    location: "Cau Giay, Hanoi",
    availability: "Open to full-time opportunities"
  },
  contact: {
    label: "Contact",
    title: "Let’s work together.",
    body: "For a role, a project, or simply a technical conversation, the quickest way to reach me is by email.",
    emailLabel: "Email me",
    githubLabel: "GitHub",
    cvLabel: "View CV"
  },
  experience: {
    label: "Experience",
    title: "Where I’ve worked",
    items: [
      {
        company: "InfoPlus Co., Ltd.",
        role: ".NET Developer",
        period: "Apr 2025 — Present",
        summary:
          "Develop and maintain a real-estate management platform covering inventory, reservations, contracts, financial transactions, and business reports.",
        technologies: ["ASP.NET 9", "Razor", "MySQL", "SQL Server", "Redis"]
      },
      {
        company: "Ominext JSC",
        role: ".NET Developer",
        period: "Feb 2024 — Mar 2025",
        summary:
          "Built housing-design and enterprise-management software; contributed to implementation, code review, testing, maintenance, and performance improvements.",
        technologies: ["C#", "VB.NET", "WinForms", "ASP.NET", "Python", "FastAPI", "PostgreSQL"]
      },
      {
        company: "Smart Software Vietnam JSC",
        role: ".NET Developer",
        period: "Nov 2023 — Jan 2024",
        summary:
          "Helped build an online sneaker storefront and product-management system, from application features and UI to testing and maintenance.",
        technologies: ["C#", "Blazor", "JavaScript", "REST API", "SQL Server"]
      }
    ]
  },
  project: {
    label: "Personal project",
    title: "Bazaizai Store",
    type: "E-commerce website",
    description:
      "A live online store built as a practical product project, featuring a browsable catalog and product filtering for a straightforward shopping experience.",
    visitLabel: "Visit store",
    url: "https://store.hkladoi.tech"
  },
  footer: "Built in Hanoi."
};

export const vi: PortfolioContent = {
  locale: "vi",
  alternateLanguageLabel: "EN",
  alternateHref: "/",
  metadata: {
    title: "Trịnh Trần Đức Anh — Lập trình viên .NET",
    description: "Lập trình viên .NET tại Hà Nội, làm việc với C#, ASP.NET, Python, SQL và các hệ thống nghiệp vụ thực tế."
  },
  navigation: [
    { label: "Giới thiệu", href: "#top" },
    { label: "Liên hệ", href: "#contact" },
    { label: "Kinh nghiệm", href: "#experience" },
    { label: "Dự án cá nhân", href: "#project" }
  ],
  introduction: {
    label: "Xin chào, tôi là",
    name: "Trịnh Trần Đức Anh",
    role: ".NET Developer",
    statement: "Tôi xây dựng phần mềm rõ ràng, bền bỉ cho những quy trình nghiệp vụ phức tạp.",
    body:
      "Tôi là lập trình viên thiên về backend, từng làm việc với các sản phẩm trong lĩnh vực bất động sản, thiết kế nhà ở, quản trị doanh nghiệp và thương mại điện tử. Tôi thích biến những yêu cầu nhiều tầng thành hệ thống dễ bảo trì, đáng tin cậy và có thể tiếp tục phát triển lâu dài.",
    location: "Cầu Giấy, Hà Nội",
    availability: "Sẵn sàng cho cơ hội toàn thời gian"
  },
  contact: {
    label: "Liên hệ",
    title: "Cùng làm việc nhé.",
    body: "Nếu bạn muốn trao đổi về một vị trí, một dự án hoặc đơn giản là một câu chuyện kỹ thuật, email là cách nhanh nhất để liên hệ với tôi.",
    emailLabel: "Gửi email",
    githubLabel: "GitHub",
    cvLabel: "Xem CV"
  },
  experience: {
    label: "Kinh nghiệm",
    title: "Những nơi tôi đã làm việc",
    items: [
      {
        company: "Công ty TNHH InfoPlus",
        role: ".NET Developer",
        period: "04/2025 — Hiện tại",
        summary:
          "Phát triển và bảo trì nền tảng quản lý bất động sản, bao gồm tồn kho, đặt chỗ, hợp đồng, giao dịch tài chính và báo cáo kinh doanh.",
        technologies: ["ASP.NET 9", "Razor", "MySQL", "SQL Server", "Redis"]
      },
      {
        company: "Công ty Cổ phần Ominext",
        role: ".NET Developer",
        period: "02/2024 — 03/2025",
        summary:
          "Xây dựng phần mềm thiết kế nhà ở và quản trị doanh nghiệp; tham gia lập trình, review code, kiểm thử, bảo trì và tối ưu hiệu năng.",
        technologies: ["C#", "VB.NET", "WinForms", "ASP.NET", "Python", "FastAPI", "PostgreSQL"]
      },
      {
        company: "Công ty Cổ phần Smart Software Việt Nam",
        role: ".NET Developer",
        period: "11/2023 — 01/2024",
        summary:
          "Tham gia xây dựng cửa hàng sneaker và hệ thống quản lý sản phẩm trực tuyến, từ tính năng, giao diện đến kiểm thử và bảo trì.",
        technologies: ["C#", "Blazor", "JavaScript", "REST API", "SQL Server"]
      }
    ]
  },
  project: {
    label: "Dự án cá nhân",
    title: "Bazaizai Store",
    type: "Website thương mại điện tử",
    description:
      "Một cửa hàng trực tuyến đang hoạt động, được xây dựng như một sản phẩm thực tế với danh mục và bộ lọc sản phẩm, hướng tới trải nghiệm mua sắm gọn gàng và dễ sử dụng.",
    visitLabel: "Mở cửa hàng",
    url: "https://store.hkladoi.tech"
  },
  footer: "Được xây dựng tại Hà Nội."
};

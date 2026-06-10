import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

const mockRoadmapData = {
  versions: [
    {
      id: "current",
      type: "current",
      versionNumber: "0.4.3",
      date: "2026-04-15",
      isCurrent: true,
      isNext: false,
      isOld: false,
      items: {
        es: [{ summary: "Nueva funcionalidad", description: "Descripción en español" }],
        en: [{ summary: "New feature", description: "Description in English" }],
      },
    },
    {
      id: "next",
      type: "next",
      versionNumber: "0.5.0",
      date: "2026-05-01",
      isCurrent: false,
      isNext: true,
      isOld: false,
      items: {
        es: [{ summary: "Próxima feature", "description": "Descripción" }],
        en: [{ summary: "Next feature", "description": "Description" }],
      },
    },
    {
      id: "prev",
      type: "previous",
      versionNumber: "0.4.2",
      date: "2026-04-01",
      isCurrent: false,
      isNext: false,
      isOld: false,
      items: {
        es: [{ summary: "Feature anterior", "description": "Descripción" }],
        en: [{ summary: "Previous feature", "description": "Description" }],
      },
    },
    {
      id: "old-1",
      type: "old",
      versionNumber: "0.4.1",
      date: "2026-03-15",
      isCurrent: false,
      isNext: false,
      isOld: true,
      showInTab: false,
      items: {
        es: [{ summary: "Feature vieja", "description": "Descripción" }],
        en: [{ summary: "Old feature", "description": "Description" }],
      },
    },
  ],
};

vi.mock("fs", async () => {
  const actual = await vi.importActual("fs");
  return {
    ...actual,
    writeFileSync: vi.fn(),
  };
});

vi.mock("../roadmap-data.json", () => ({
  default: mockRoadmapData,
}));

describe("Roadmap - formatDate", () => {
  it("formatea fecha correctamente al formato español", () => {
    const result = formatDate("2026-04-15");
    expect(result).toMatch(/\d{1,2} de \w+ de 2026/);
  });

  it("contiene el año correcto", () => {
    const result = formatDate("2026-04-15");
    expect(result).toContain("2026");
  });

  it("formatea diferentes fechas", () => {
    const result = formatDate("2026-12-25");
    expect(result).toMatch(/\d{1,2} de \w+ de 2026/);
  });

  it("retorna string con formato español", () => {
    const result = formatDate("2026-04-15");
    expect(result).toMatch(/^\d{1,2} de .+ de \d{4}$/);
  });
});

describe("Roadmap - generateRoadmapMD", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("genera markdown con estructura básica", () => {
    generateRoadmapMD();

    expect(fs.writeFileSync).toHaveBeenCalled();
    const outputPath = fs.writeFileSync.mock.calls[0][0];
    expect(outputPath).toBe("./ROADMAP.md");
  });

  it("incluye versión actual en el markdown", () => {
    generateRoadmapMD();

    const content = fs.writeFileSync.mock.calls[0][1] as string;
    expect(content).toContain("Versión Actual: 0.4.3");
  });

  it("incluye versión próxima en el markdown", () => {
    generateRoadmapMD();

    const content = fs.writeFileSync.mock.calls[0][1] as string;
    expect(content).toContain("Próxima Versión: 0.5.0");
  });

  it("incluye versiones anteriores en el markdown", () => {
    generateRoadmapMD();

    const content = fs.writeFileSync.mock.calls[0][1] as string;
    expect(content).toContain("Versiones Anteriores");
    expect(content).toContain("0.4.2");
  });

  it("incluye estadísticas al final", () => {
    generateRoadmapMD();

    const content = fs.writeFileSync.mock.calls[0][1] as string;
    expect(content).toContain("Estadísticas");
    expect(content).toContain("Versiones totales:");
  });

  it("imprime mensaje de confirmación", () => {
    generateRoadmapMD();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "✅ ROADMAP.md generado automáticamente"
    );
  });

  it("incluye items en español de versión actual", () => {
    generateRoadmapMD();

    const content = fs.writeFileSync.mock.calls[0][1] as string;
    expect(content).toContain("Nueva funcionalidad");
  });

  it("incluye items en inglés de versión actual", () => {
    generateRoadmapMD();

    const content = fs.writeFileSync.mock.calls[0][1] as string;
    expect(content).toContain("New feature");
  });
});

describe("Roadmap - Data Structure Validation", () => {
  it("roadmapData tiene estructura válida", () => {
    expect(mockRoadmapData).toHaveProperty("versions");
    expect(Array.isArray(mockRoadmapData.versions)).toBe(true);
  });

  it("cada versión tiene campos requeridos", () => {
    mockRoadmapData.versions.forEach((version) => {
      expect(version).toHaveProperty("id");
      expect(version).toHaveProperty("type");
      expect(version).toHaveProperty("versionNumber");
      expect(version).toHaveProperty("date");
      expect(version).toHaveProperty("isCurrent");
      expect(version).toHaveProperty("isNext");
      expect(version).toHaveProperty("items");
    });
  });

  it("cada versión tiene items en ambos idiomas", () => {
    mockRoadmapData.versions.forEach((version) => {
      expect(version.items).toHaveProperty("es");
      expect(version.items).toHaveProperty("en");
      expect(Array.isArray(version.items.es)).toBe(true);
      expect(Array.isArray(version.items.en)).toBe(true);
    });
  });

  it("cada item tiene summary y description", () => {
    mockRoadmapData.versions.forEach((version) => {
      version.items.es.forEach((item) => {
        expect(item).toHaveProperty("summary");
        expect(item).toHaveProperty("description");
      });
    });
  });

  it("solo hay una versión actual", () => {
    const currentVersions = mockRoadmapData.versions.filter((v) => v.isCurrent);
    expect(currentVersions.length).toBe(1);
  });

  it("solo hay una versión próxima", () => {
    const nextVersions = mockRoadmapData.versions.filter((v) => v.isNext);
    expect(nextVersions.length).toBe(1);
  });
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generateRoadmapMD() {
  const roadmapData = mockRoadmapData;
  let markdown = "# 📍 Roadmap\n\n";
  markdown +=
    "> **Nota**: Este archivo se genera automáticamente desde `src/data/roadmap.json`. No editar manualmente.\n\n";

  const currentVersion = roadmapData.versions.find((v) => v.isCurrent);
  const nextVersion = roadmapData.versions.find((v) => v.isNext);
  const previousVersions = roadmapData.versions.filter(
    (v) => v.type === "previous"
  );
  const oldVersions = roadmapData.versions.filter((v) => v.isOld);

  if (currentVersion) {
    markdown += `## 🚀 Versión Actual: ${currentVersion.versionNumber}\n\n`;
    markdown += `**Fecha de lanzamiento:** ${formatDate(currentVersion.date)}\n\n`;
    markdown += "### Novedades\n\n";
    markdown += "#### Español\n";
    currentVersion.items.es.forEach((item) => {
      markdown += `- **${item.summary}**: ${item.description}\n`;
    });
    markdown += "\n#### English\n";
    currentVersion.items.en.forEach((item) => {
      markdown += `- **${item.summary}**: ${item.description}\n`;
    });
    markdown += "\n---\n\n";
  }

  if (nextVersion) {
    markdown += `## 🔜 Próxima Versión: ${nextVersion.versionNumber}\n\n`;
    markdown += `**Fecha estimada:** ${formatDate(nextVersion.date)}\n\n`;
    markdown += "### Características planeadas\n\n";
    markdown += "#### Español\n";
    nextVersion.items.es.forEach((item) => {
      markdown += `- **${item.summary}**: ${item.description}\n`;
    });
    markdown += "\n#### English\n";
    nextVersion.items.en.forEach((item) => {
      markdown += `- **${item.summary}**: ${item.description}\n`;
    });
    markdown += "\n---\n\n";
  }

  if (previousVersions.length > 0) {
    markdown += `## 📦 Versiones Anteriores\n\n`;
    previousVersions.forEach((version) => {
      markdown += `### ${version.versionNumber} (${formatDate(version.date)})\n\n`;
      markdown += "#### Español\n";
      version.items.es.forEach((item) => {
        markdown += `- **${item.summary}**: ${item.description}\n`;
      });
      markdown += "\n#### English\n";
      version.items.en.forEach((item) => {
        markdown += `- **${item.summary}**: ${item.description}\n`;
      });
      markdown += "\n";
    });
    markdown += "---\n\n";
  }

  if (oldVersions.length > 0) {
    markdown += `## 📜 Versiones Antiguas\n\n`;
    markdown += `<details>\n<summary>Ver versiones anteriores (${oldVersions.length})</summary>\n\n`;
    oldVersions.forEach((version) => {
      markdown += `### ${version.versionNumber} (${formatDate(version.date)})\n\n`;
      markdown += "#### Español\n";
      version.items.es.forEach((item) => {
        markdown += `- **${item.summary}**: ${item.description}\n`;
      });
      markdown += "\n#### English\n";
      version.items.en.forEach((item) => {
        markdown += `- **${item.summary}**: ${item.description}\n`;
      });
      markdown += "\n";
    });
    markdown += `</details>\n\n`;
  }

  const totalVersions = roadmapData.versions.length;
  const totalFeatures = roadmapData.versions.reduce(
    (acc, v) => acc + v.items.es.length,
    0
  );

  markdown += `---\n\n`;
  markdown += `## 📊 Estadísticas\n\n`;
  markdown += `- **Versiones totales:** ${totalVersions}\n`;
  markdown += `- **Características totales:** ${totalFeatures}\n`;
  markdown += `- **Última actualización:** ${new Date().toLocaleDateString(
    "es-ES"
  )}\n`;

  fs.writeFileSync("./ROADMAP.md", markdown);
  console.log("✅ ROADMAP.md generado automáticamente");
}

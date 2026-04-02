// scripts/generate-roadmap.js
import fs from "fs";
import path from "path";
import roadmapData from "../src/data/roadmap.json" assert { type: "json" };

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

function generateRoadmapMD() {
  let markdown = "# 📍 Roadmap\n\n";
  markdown += "## Historial de versiones\n\n";
  markdown += "> **Nota**: Este archivo se genera automáticamente desde `src/data/roadmap.json`. No editar manualmente.\n\n";

  // Separar versiones por tipo
  const currentVersion = roadmapData.versions.find((v) => v.isCurrent);
  const nextVersion = roadmapData.versions.find((v) => v.isNext);
  const previousVersions = roadmapData.versions.filter((v) => v.type === "previous");
  const oldVersions = roadmapData.versions.filter((v) => v.isOld);

  // Sección de versión actual
  if (currentVersion) {
    markdown += `## 🚀 Versión Actual: ${currentVersion.version}\n\n`;
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

  // Sección de próxima versión
  if (nextVersion) {
    markdown += `## 🔜 Próxima Versión: ${nextVersion.version}\n\n`;
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

  // Sección de versiones anteriores (últimas 3)
  if (previousVersions.length > 0) {
    markdown += `## 📦 Versiones Anteriores\n\n`;
    previousVersions.forEach((version) => {
      markdown += `### ${version.version} (${formatDate(version.date)})\n\n`;

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

  // Sección de versiones antiguas (colapsable)
  if (oldVersions.length > 0) {
    markdown += `## 📜 Versiones Antiguas\n\n`;
    markdown += `<details>\n<summary>Ver versiones anteriores (${oldVersions.length})</summary>\n\n`;

    oldVersions.forEach((version) => {
      markdown += `### ${version.version} (${formatDate(version.date)})\n\n`;

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

  // Estadísticas
  const totalVersions = roadmapData.versions.length;
  const totalFeatures = roadmapData.versions.reduce((acc, v) => acc + v.items.es.length, 0);

  markdown += `---\n\n`;
  markdown += `## 📊 Estadísticas\n\n`;
  markdown += `- **Versiones totales:** ${totalVersions}\n`;
  markdown += `- **Características totales:** ${totalFeatures}\n`;
  markdown += `- **Última actualización:** ${new Date().toLocaleDateString("es-ES")}\n`;

  fs.writeFileSync("./ROADMAP.md", markdown);
  console.log("✅ ROADMAP.md generado automáticamente");
}

generateRoadmapMD();

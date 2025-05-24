import { remark } from "remark";
import rehype from "remark-rehype";
import stringify from "rehype-stringify";
import sanitize from "rehype-sanitize";

export const fetchMd = async (name: string, fileName = 'README.md'): Promise<string | undefined> => {
  const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/valentyna-antoniuk/${name}/refs/heads/main/`;
  const url = `${GITHUB_RAW_BASE}${fileName}`;
  try {
    const response = await fetch(url);
    console.info(`Fetching: ${url}`);
    if (!response.ok)
      throw new Error(`Failed to fetch README: ${response.statusText}`);
    let text = await response.text();
    console.info(`🟢 Successfully received: ${url}`);

    text = text.replace(/!\[([^\]]*)]\(\.?(?:\/)?public\/([^)\s]+)\)/g, (match, alt, path) => {
      return `![${alt}](${GITHUB_RAW_BASE}public/${path})`;
    });

    return renderMarkdownSafe(text);
  } catch (error) {
    console.error("❌ Failed to fetch", url);
    console.error(error);
  }
};

export const extractMarkdownSection = (
  markdown: string,
  heading = "🚀 Skills & Expertise",
): string | null => {
  const regex = new RegExp(`## ${heading}\\s*([\\s\\S]*?)(?=^##\\s|\\Z)`, "m");
  const match = markdown.match(regex);
  return match ? match[1].trim() : null;
};

export const renderMarkdownSafe = async (markdown: string): Promise<string> => {
  const file = await remark()
    .use(rehype)
    .use(sanitize)
    .use(stringify)
    .process(markdown);
  return String(file);
};

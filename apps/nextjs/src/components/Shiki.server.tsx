import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { Lang, Theme } from "shiki";
import { cache } from "react";
import { getHighlighter as shikiGetHighlighter } from "shiki";

interface ShikiProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  code: string;
  lang: Lang;
  theme: Theme;
  className?: string;
}

/**
 *
 * **THIS SERVER COMPONENT HAS TO RUN IN NODE.JS. Edge runtime is not supported.**
 * @returns
 */
export default async function Shiki({
  code,
  lang,
  theme,
  className,
}: ShikiProps) {
  const highlighter = await getHighlighter(lang, theme);

  const html = highlighter.codeToHtml(code, {
    lang,
    theme,
  });

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html.replace(
          '<pre class="shiki',
          `<pre class="${className} shiki`,
        ),
      }}
    />
  );
}

const highlighterPromise = shikiGetHighlighter({});

const getHighlighter = cache(async (language: Lang, theme: Theme) => {
  const highlighter = await highlighterPromise;
  const loadedLanguages = highlighter.getLoadedLanguages();
  const loadedThemes = highlighter.getLoadedThemes();

  const promises = [];
  if (!loadedLanguages.includes(language)) {
    promises.push(highlighter.loadLanguage(language));
  }

  if (!loadedThemes.includes(theme)) {
    promises.push(highlighter.loadTheme(theme));
  }

  await Promise.all(promises);

  return highlighter;
});

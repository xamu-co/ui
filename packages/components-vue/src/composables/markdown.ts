import MarkdownIt from "markdown-it";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs"; // CommonJS
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTasklists from "markdown-it-task-lists"; // CommonJS
import MarkdownItTOC from "markdown-it-toc-done-right";

const markdown = new MarkdownIt()
	.use(MarkdownItAbbr)
	.use(MarkdownItAnchor)
	.use(MarkdownItFootnote)
	.use(MarkdownItHighlightjs)
	.use(MarkdownItSub)
	.use(MarkdownItSup)
	.use(MarkdownItTasklists)
	.use(MarkdownItTOC);

/**
 * Renders markdown to HTML
 * Opens external links in new tab
 *
 * @param body - Markdown body
 * @returns HTML
 */
export default function useMarkdown(body: string): string {
	let html = markdown.render(body);

	// External links
	html = html.replaceAll('href="//', 'target="_blank" href="//');
	html = html.replaceAll('href="http://', 'target="_blank" href="http://');
	html = html.replaceAll('href="https://', 'target="_blank" href="https://');

	return html;
}

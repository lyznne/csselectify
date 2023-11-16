const cheerio = require('cheerio');

/**
 * @param {string | Buffer} htmlContent
 */
function getCSSFilesLinkedToHtml(htmlContent) {
	const $ = cheerio.load(htmlContent);
	const cssFiles = [];

	$('link[rel="stylesheet"]').each((index, linkElement) => {
		const cssFileLink = $(linkElement).attr('href');
		if (cssFileLink) {
			cssFiles.push(cssFileLink);
		}
	});

	return cssFiles;
}
exports.getCSSFilesLinkedToHtml = getCSSFilesLinkedToHtml;

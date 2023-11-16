const path = require("path");
const fs = require('fs');
const cheerio = require('cheerio');


/**
* @param {{ fileName: any; }} doc
* @param {string} selectedOption
* @param {string | Buffer | cheerio.AnyNode | cheerio.AnyNode[]} htmlContent
*/


async function linkCSSFile(doc, selectedOption, htmlContent) {
    // Get the folder associated with the HTML file
    const htmlFilePath = doc.fileName;
    const folderPath = path.dirname(htmlFilePath);
    const cssFilePath = path.join(folderPath, selectedOption);


    // Check if the selected file is not 'output.css' and if it doesn't exist, create it
    if (selectedOption !== 'output.css' && !fs.existsSync(cssFilePath)) {
        fs.writeFileSync(cssFilePath, '');
    }

    // Add a link to the HTML file for 'output.css' if it doesn't exist
    // Parse HTML content using Cheerio

    const $ = cheerio.load(htmlContent);
    if ($(`link[href="${selectedOption}"]`).length === 0) {
        $('head').append(`<link rel="stylesheet" href="${selectedOption}"> \n`);
        const updatedHtmlContent = $.html();
        fs.writeFileSync(htmlFilePath, updatedHtmlContent);
    }




    const cssData = { $, cssFilePath }

    console.log('css data in linkcssfile func ', cssData)

    return cssData;

}

module.exports = {
    linkCSSFile
}
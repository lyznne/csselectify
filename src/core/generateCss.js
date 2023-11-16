const fs = require('fs');
function generateCSS($, cssFilePath, vscode) {

    // writing the css		
    // Find all HTML elements with a 'class' attribute
    const cssClasses = [];

    $('*[class]').each((/** @type {any} */ index, /** @type {any} */ element) => {
        const classes = $(element).attr('class').split(' ');
        cssClasses.push(...classes);
    });

    if (cssClasses.length === 0) {
        vscode.window.showInformationMessage('No CSS classes found in the HTML file.');
        return;
    }


    // Prepare the CSS content
    const cssContent = cssClasses.map(className => `.${className} { /* styles */ }`).join('\n');

    // Write CSS content to the connected CSS file
    try {
        fs.writeFileSync(cssFilePath, cssContent);
        vscode.window.showInformationMessage('CSS classes written to CSS file.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error writing to the CSS file: ${error.message}`);
    }
}

module.exports = { generateCSS };

const { window } = require("vscode");
const { getCSSFilesLinkedToHtml } = require("../utils/getCSSFilesLinkedToHtml");
const { linkCSSFile } = require("./getLinkedFile");

/**
 * @param {import("vscode").TextEditor} editor
 * @param {typeof import("vscode")} vscode
 */


let $;
let cssFilePath;

/**
 * @param {{ document: any; }} editor
 * @param {{ window: { activeTextEditor: any; showErrorMessage: (arg0: string) => void; showInformationMessage: (arg0: string) => void; showQuickPick: (arg0: any[], arg1: { placeHolder: string; title: string; canPickMany: boolean; }) => any; showInputBox: (arg0: { prompt: string; placeHolder: string; }) => any; }; }} vscode
 */
async function genCSSFilesOnUserChoice(editor, vscode) {

    editor = vscode.window.activeTextEditor

    if (!editor) {
        vscode.window.showErrorMessage('No open text editor found.');
        return;
    }


    // edit file in folder 
    const doc = editor.document;

    if (doc.languageId !== 'html') {
        vscode.window.showErrorMessage('Active editor is not an HTML file.');
        return;
    }

    const htmlContent = doc.getText();
    const cssFiles = getCSSFilesLinkedToHtml(htmlContent);


    if (cssFiles.length === 0) {
        vscode.window.showInformationMessage('No CSS files linked in the HTML.');
        return;
    }

    let selectedOption;
    const quickPickItems = [...cssFiles, 'output.css'];
    quickPickItems.push({ label: 'Enter a new file name', description: 'manually enter a file name' });

    const selectedQuickPick = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'select or enter css file name',
        title: 'Where to save the css code? ',
        canPickMany: false,
    });

    if (selectedQuickPick) {

        if (selectedQuickPick.label !== 'Enter a new file name') {
            selectedOption = selectedQuickPick;
        }else{
        //if the selectedQuickPick.label is 'Enter a new file name' proceed
            const userInput = await vscode.window.showInputBox({
                prompt: 'Enter the css file name',
                placeHolder: 'custom.css',
            });

            // if user gives name only or non-css file 
            //ensure the file has .css file extension
            if (!userInput) return;

            let filename = userInput.trim();

            if (!filename.endsWith('.css')) {
                filename += '.css';
            }

            selectedOption = filename;

            console.log(selectedOption)
        }
    }



    // const selectedOption = await vscode.window.showQuickPick([...cssFiles, 'output.css'], {
    // 	placeHolder: 'output.css',
    // 	title: 'Where to save the CSS code?',
    // 	canPickMany: false,
    // });


    // if (!selectedOption) {
    //     return;
    // }

    if (!selectedOption) {
        return Promise.resolve(undefined); // Ensure the function always returns a Promise
    }

    // Call the linkCSSFile function
    const cssData = await linkCSSFile(doc, selectedOption, htmlContent);
    console.log('css data from gen', cssData)



    // if (!cssData || !cssData.$ || !cssData.cssFilePath) {
    //     vscode.window.showErrorMessage('Failed to generate CSS data.');
    //     return;
    // }

    const { $, cssFilePath } = cssData;

    console.log($);
    console.log(cssFilePath);

    return cssData

    // Call the linkCSSFile function and return its result
    // return linkCSSFile(doc, selectedOption, htmlContent);




}

module.exports = { genCSSFilesOnUserChoice }
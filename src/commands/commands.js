const { genCSSFilesOnUserChoice } = require('../core/fileOperations');
const vscode = require('vscode');
const { generateCSS } = require('../core/generateCss');


let shouldTriggerUpdate = true;
let editor;



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */


function activate(context) {
    console.log('Congratulations, your extension "csselectify" is now active!');

    // The commandId parameter must match the command field in package.json

    let disposable = vscode.commands.registerCommand('csselectify.csselectify', async () => {
        editor = vscode.window.activeTextEditor


        if (editor) {
        await genCSSFilesOnUserChoice(editor, vscode)
        .then((cssData)=>{

            if(!cssData){
               vscode.window.showErrorMessage('Failed to generate CSS data.') 
            }

            console.log("css data => ", cssData);

            generateCode(cssData)

        })
        .catch((error)=>{
            console.error('Error:', error);
        })
        }

      
      

    });

    context.subscriptions.push(disposable);

}


/**
* @param {{ $: any; cssFilePath: any; }} [cssData]
*/
function generateCode(cssData) {
    if (cssData) {
        console.log('css data in gen func -->', cssData);

        const { $, cssFilePath } = cssData;

        generateCSS($, cssFilePath, vscode);

        vscode.workspace.onDidChangeTextDocument(event => {
            if (editor && event.document === event.document) {
                vscode.commands.executeCommand('csselectify.csselectify');
            }
        });
    }

}



function deactivate() {

}

module.exports = {
    activate,
    deactivate,
}
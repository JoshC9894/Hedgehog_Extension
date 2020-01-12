// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hedgehog-array" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed


		let timeout: NodeJS.Timer | undefined = undefined
		let activeEditor = vscode.window.activeTextEditor

		const decorationType = vscode.window.createTextEditorDecorationType({
			after: {
				contentText: "🦔🦔🦔"
			}
		});

		function updateDecoration() {
			let searchString = 'Array'
			let regex = new RegExp(searchString)
			let docText = activeEditor?.document.getText().split('\n')
			let arrays: vscode.DecorationOptions[] = []

			for(let line = 0; line<docText!.length; line++) {
				let match =  docText![line].match(regex)
				if (match !== null && match.index !== undefined) {
					let start = new vscode.Position(line, match.index)
					let end = new vscode.Position(line, match.index + searchString.length)
					let decoration = { range: new vscode.Range(start, end) }
					arrays.push(decoration)
				}
			}

			activeEditor?.setDecorations(decorationType, arrays);
		}

		function triggerUpdate() {
			if (timeout) {
				clearTimeout(timeout)
				timeout = undefined
			}
			timeout = setTimeout(updateDecoration, 500)
		}

		if (activeEditor) {
			triggerUpdate()
		}

		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor
			if (editor) { triggerUpdate() }
		}, null, context.subscriptions)

		vscode.workspace.onDidChangeTextDocument(event => {
			if (activeEditor && event.document === activeEditor.document) { triggerUpdate() }
		}, null, context.subscriptions)
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
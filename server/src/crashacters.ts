import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { hrtime } from 'process';

export function findCrashacters(document: TextDocument): Diagnostic[] {
	const startTime = hrtime.bigint();

	const textBuffer = Buffer.from(document.getText(), 'utf-8');
	const diagnostics: Diagnostic[] = [];

	for(let i = 0; i < textBuffer.length; i++){
		if(textBuffer[i] === 0x42){
			diagnostics.push({
				message: "B",
				range: {
					start: document.positionAt(i),
					end: document.positionAt(i+1)
				}
			});
		}
	}

	const endTime = hrtime.bigint();

	console.log(endTime - startTime);

	return diagnostics;
}
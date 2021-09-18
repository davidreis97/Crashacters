import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { hrtime } from 'process';
import { ComparableRange, RangeTreeNode } from './structures';

const utf8BadRanges = [new ComparableRange(0x00, 0x19), new ComparableRange(0x7F, 0xA0)];
const comparableTreeRoot = new RangeTreeNode(utf8BadRanges[0]);
for(const range of utf8BadRanges){
	comparableTreeRoot.insert(range);
}

const auxComparableRange = new ComparableRange(0,0);

export function findCrashacters(document: TextDocument): Diagnostic[] {
	const startTime = hrtime.bigint();

	const textBuffer = Buffer.from(document.getText(), 'utf-8');
	const diagnostics: Diagnostic[] = [];

	for(let i = 0; i < textBuffer.length; i++){
		auxComparableRange.start = textBuffer[i];
		auxComparableRange.end = textBuffer[i];
		if(comparableTreeRoot.search(auxComparableRange)){
			diagnostics.push({
				message: "Crashacter: U+00"+textBuffer[i].toString(16),
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
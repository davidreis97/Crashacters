import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { hrtime } from 'process';
import { ComparableRange, SortedList } from './structures';

const utf8BadRanges = [new ComparableRange(0x00, 0x0C), new ComparableRange(0x0E, 0x19), new ComparableRange(0x7F, 0xA0)];
const comparableRangeList = new SortedList<ComparableRange>();
for(const range of utf8BadRanges){
	comparableRangeList.insert(range);
}

const currentCharacter = new ComparableRange(0,0);

export function findCrashacters(document: TextDocument): Diagnostic[] {
	const startTime = hrtime.bigint();

	const textBuffer = Buffer.from(document.getText(), 'utf-8');
	const diagnostics: Diagnostic[] = [];

	for(let i = 0; i < textBuffer.length; i++){
		currentCharacter.start = textBuffer[i];
		currentCharacter.end = textBuffer[i];
		if(comparableRangeList.search(currentCharacter)){
			diagnostics.push({
				message: "Crashacter: U+00"+hex(textBuffer[i]),
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

const hex = (d: number) => Number(d).toString(16).padStart(2, '0');
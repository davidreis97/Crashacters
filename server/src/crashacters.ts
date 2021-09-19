import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { hrtime } from 'process';
import { ComparableRange, SortedList } from './structures';

const utf8BadRanges = [new ComparableRange(0x00, 0x08),new ComparableRange(0x0B, 0x0C), new ComparableRange(0x0E, 0x1F), new ComparableRange(0x7F, 0xFFFFFF)];
const comparableRangeList = new SortedList<ComparableRange>();
for(const range of utf8BadRanges){
	comparableRangeList.insert(range);
}

const currentCharacter = new ComparableRange(0,0);

export function findCrashacters(document: TextDocument): Diagnostic[] {
	const startTime = hrtime.bigint();

	const text = document.getText();
	const diagnostics: Diagnostic[] = [];

	for(let i = 0; i < text.length; i++){
		const codePoint = text[i].codePointAt(0);
		if(codePoint == null) continue;
		currentCharacter.start = codePoint;
		currentCharacter.end = codePoint;
		if(comparableRangeList.search(currentCharacter)){
			diagnostics.push({
				message: "Crashacter: U+"+hex(codePoint),
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
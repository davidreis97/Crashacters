import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { hrtime } from 'process';
import { ComparableRange, SortedList } from './structures';
import { CrashactersSettings } from './server';

export class Crashacters{
	blacklistedCharacterRanges: SortedList<ComparableRange>;
	currentCharacter = new ComparableRange(0,0);

	constructor(){
		this.blacklistedCharacterRanges = new SortedList<ComparableRange>();
	}

	findCrashacters(document: TextDocument, settings: CrashactersSettings): Diagnostic[] {
		const startTime = hrtime.bigint();
	
		this.loadRanges(settings);

		console.log(this.blacklistedCharacterRanges.array);
	
		const textBuffer = Buffer.from(document.getText(), 'utf-8');
		const diagnostics: Diagnostic[] = [];
		let diagnosticsGenerated = 0;
	
		for(let i = 0; i < textBuffer.length; i++){
			this.currentCharacter.start = textBuffer[i];
			this.currentCharacter.end = textBuffer[i];
			if(this.blacklistedCharacterRanges.search(this.currentCharacter)){
				if(diagnosticsGenerated >= settings.maxNumberOfProblems) break;
				diagnosticsGenerated++;
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

	loadRanges(settings: CrashactersSettings){
		this.blacklistedCharacterRanges.clear();
		for(const range of settings.characterBlacklist.ranges){
			if(range.start == null || !Number.isFinite(range.start) || range.end == null || !Number.isFinite(range.end)){
				console.log(`Bad range, skipping [${JSON.stringify(range)}]`);
				continue;
			}
			this.blacklistedCharacterRanges.insert(new ComparableRange(range.start, range.end));
		}
	}
}

const hex = (d: number) => Number(d).toString(16).padStart(2, '0');
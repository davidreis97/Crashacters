import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { hrtime } from 'process';
import { ComparableRange, SortedList } from './structures';
import { CrashactersSettings } from './server';
import { Metric, pushMetric } from './analytics';

export class Crashacters{
	blacklistedCharacterRanges: SortedList<ComparableRange>;
	currentCharacter = new ComparableRange(0,0);

	constructor(){
		this.blacklistedCharacterRanges = new SortedList<ComparableRange>();
	}

	findCrashacters(document: TextDocument, settings: CrashactersSettings): Diagnostic[] {
		const startTime = hrtime.bigint();
		const text = document.getText();
		const diagnostics = [];

		this.loadRanges(settings);
		let diagnosticsGenerated = 0;
	
		for(let i = 0; i < text.length; i++){
			const codePoint = text[i].codePointAt(0);
			if(codePoint == null) continue;
			this.currentCharacter.start = codePoint;
			this.currentCharacter.end = codePoint;
			if(this.blacklistedCharacterRanges.search(this.currentCharacter)){
				if(diagnosticsGenerated >= settings.maxNumberOfProblems) break;
				diagnosticsGenerated++;
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
	
		pushMetric(Metric.PROCESSING_TIME, Number(startTime - endTime));
	
		return diagnostics;
	}

	loadRanges(settings: CrashactersSettings){
		this.blacklistedCharacterRanges.clear();
		for(const range of settings.characterBlacklist.ranges){
			if(range.start == null || !Number.isFinite(range.start) || range.end == null || !Number.isFinite(range.end)){
				continue;
			}
			this.blacklistedCharacterRanges.insert(new ComparableRange(range.start, range.end));
		}
	}
}

const hex = (d: number) => Number(d).toString(16).padStart(4, '0');
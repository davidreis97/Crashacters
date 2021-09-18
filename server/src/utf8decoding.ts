const singleByteMask = 0b00000000;
const doubleByteMask = 0b11000000;
const tripleByteMask = 0b11100000;
const quadrupleByteMask = 0b11110000;
const continuationMask = 0b10000000;

export class Result{
	char = 0;
	newIndex = 0;
	error = false;
}

const maskMatches = (c: number, mask: number) => (c & mask) === mask;

const isSingleByte = (c: number) => maskMatches(c,singleByteMask);
const isDoubleByte = (c: number) => maskMatches(c,doubleByteMask);
const isTripleByte = (c: number) => maskMatches(c,tripleByteMask);
const isQuadrupleByte = (c: number) => maskMatches(c, quadrupleByteMask);

const removeContinuationMask = (c: number) => c ^ continuationMask;

//TODO - Missing check buffer limits
//TODO - Less hardcoded
export function decodeUtfChar(text: Buffer, result: Result, index = 0){
	if(isSingleByte(text[index])){
		result.newIndex = index + 1;
		result.char = text[index];
	}else if(isDoubleByte(text[index])){
		result.newIndex = index + 2;
		result.char = (text[index] << 8) + text[index+1];
	}else if(isTripleByte(text[index])){
		result.newIndex = index + 3;
		result.char = (text[index] << 16) + (text[index+1] << 8) + text[index+2];
	}else if(isQuadrupleByte(text[index])){
		result.newIndex = index + 4;
		result.char = (text[index] << 24) + (text[index+1] << 16) + (text[index+2] << 8) + text[index+3];
	}else{
		console.log(`Bad char at index ${index}`);
		result.error = true;
	}
}
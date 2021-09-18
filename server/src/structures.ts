export abstract class Comparable{
	abstract compare(c1: Comparable): number;
	greaterThan = (c1:Comparable) : boolean => this.compare(c1) > 0;
	lessThan = (c1:Comparable) : boolean => this.compare(c1) < 0;
	contains = (c1:Comparable) : boolean => this.compare(c1) === 0;
}

export class ComparableRange extends Comparable{
	start: number
	end: number

	constructor(start: number, end: number){
		super();
		this.start = start;
		this.end = end;
	}

	compare(r2:ComparableRange): number {
		const startDiff = this.start - r2.start;
		if(startDiff > 0) return startDiff;

		const endDiff = this.end - r2.end;
		if(endDiff < 0) return endDiff;
		
		return 0;
	}
}

export class SortedList<T extends Comparable>{
	array: T[]
	
	constructor(){
		this.array = [];
	}

	search(value: T): boolean{
		let left = 0;
		let right = this.array.length - 1;

		while(left <= right){
			const m = Math.floor((left + right) / 2);
			const comparison = this.array[m].compare(value);
			if(comparison < 0){
				left = m + 1;
			}else if(comparison > 0){
				right = m - 1;
			}else{
				return true;
			}
		}
		return false;
	}

	//Don't really care about insertion speed
	insert(value: T){
		for(let i = 0; i < this.array.length; i++){
			if(this.array[i].greaterThan(value)){
				this.array.splice(i, 0, value);
				return;
			}
		}
		this.array.push(value);
	}
}

//Unbalanced
export class TreeNode<T extends Comparable>{
	left?: TreeNode<T>
	right?: TreeNode<T>
	value!: T

	constructor(value: T){
		this.value = value;
	}

	search(value: T): boolean{
		if(this.value.contains(value)) return true;

		if(value.greaterThan(this.value)){
			if (this.right != null){
				return this.right.search(value);
			}
		}else{
			if (this.left != null){
				return this.left.search(value);
			}
		}

		return false;
	}

	insert(newValue: T){
		const newNode = new TreeNode(newValue);
		if(newValue.greaterThan(this.value)){
			if(this.right == null){
				this.right = newNode;
			}else{
				this.right.insert(newValue);
			}
		}else{
			if(this.left == null){
				this.left = newNode;
			}else{
				this.left.insert(newValue);
			}
		}
	}
}
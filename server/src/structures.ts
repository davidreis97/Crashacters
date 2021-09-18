export abstract class Comparable{
	abstract compare(c1: Comparable): number;
	greaterThan = (c1:Comparable) : boolean => this.compare(c1) > 0;
	lessThan = (c1:Comparable) : boolean => this.compare(c1) < 0;
	equalTo = (c1:Comparable) : boolean => this.compare(c1) === 0;
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

//Unbalanced
export class RangeTreeNode<T extends Comparable>{
	left?: RangeTreeNode<T>
	right?: RangeTreeNode<T>
	value!: T

	constructor(value: T){
		this.value = value;
	}

	search(value: T): boolean{
		if(this.value.equalTo(value)) return true;

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
		const newNode = new RangeTreeNode(newValue);
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
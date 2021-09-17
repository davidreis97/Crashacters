export abstract class Comparable{
	abstract compare(c1: Comparable): number;
	greaterThan = (c1:Comparable) : boolean => this.compare(c1) > 0;
	lessThan = (c1:Comparable) : boolean => this.compare(c1) < 0;
	equalTo = (c1:Comparable) : boolean => this.compare(c1) === 0;
}

//Assumes that ranges don't intersect
export class FastComparableRange extends Comparable{
	start: number
	end: number

	constructor(start: number, end: number){
		super();
		this.start = start;
		this.end = end;
	}

	compare = (r2: FastComparableRange): number => this.start - r2.end;
}

//Unbalanced
export class TreeNode<T extends Comparable>{
	left?: TreeNode<T>
	right?: TreeNode<T>
	value: T

	constructor(value: T){
		this.value = value;
	}

	insert(newValue: T){
		const newNode = new TreeNode(newValue);
		if(newValue.greaterThan(this.value)){
			if(this.right == null){
				this.right = newNode;
			}else{
				if(newValue.lessThan(this.right.value)){
					newNode.right = this.right;
					this.right = newNode;
				}else{
					this.right.insert(newValue);
				}
			}
		}else{
			if(this.left == null){
				this.left = newNode;
			}else{
				if(newValue.greaterThan(this.left.value)){
					newNode.left = this.left;
					this.left = newNode;
				}else{
					this.left.insert(newValue);
				}
			}
		}
	}
}
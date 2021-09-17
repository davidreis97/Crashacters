import assert from 'assert';
import 'mocha';
import {Comparable, TreeNode} from '../src/structures';

class ComparableNumber extends Comparable{
	value: number;

	constructor(value:number){
		super();
		this.value = value;
	}

	compare = (c1: ComparableNumber): number => this.value - c1.value 
}

describe('TreeNode Insertion', () => {
	it('should insert a greater node at right when right is null', () => {
		const root = new TreeNode(new ComparableNumber(0));
		const newNode = new ComparableNumber(1);
		root.insert(newNode);
		assert.strictEqual(root.right, newNode);
	});

	it('should insert a lesser node at left when left is null', () => {
		const root = new TreeNode(new ComparableNumber(0));
		const newNode = new ComparableNumber(-1);
		root.insert(newNode);
		assert.strictEqual(root.left, newNode);
	});

	it('should invert and insert a lesser node at left when left is not null and smaller', () => {
		const root = new TreeNode(new ComparableNumber(0));
		const leftNode = new TreeNode(new ComparableNumber(-2));
		const newNode = new ComparableNumber(-1);
		root.left = leftNode;
		root.insert(newNode);
		assert.strictEqual(root.left, newNode);
		assert.strictEqual(root.left.left, leftNode);
	});

	it('should invert and insert a greater node at right when right is not null and smaller', () => {
		const root = new TreeNode(new ComparableNumber(0));
		const rightNode = new TreeNode(new ComparableNumber(2));
		const newNode = new ComparableNumber(1);
		root.right = rightNode;
		root.insert(newNode);
		assert.strictEqual(root.right, newNode);
		assert.strictEqual(root.right.right, rightNode);
	});
});
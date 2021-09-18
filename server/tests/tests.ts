import assert from 'assert';
import 'mocha';
import {Comparable, ComparableRange, RangeTreeNode} from '../src/structures';

class ComparableNumber extends Comparable{
	value: number;

	constructor(value:number){
		super();
		this.value = value;
	}

	compare = (c1: ComparableNumber): number => this.value - c1.value 
}

describe('TreeNode Insertion', () => {
	it('should set a greater node to right when right is null', () => {
		const root = new RangeTreeNode(new ComparableNumber(0));
		const newNode = new ComparableNumber(1);
		root.insert(newNode);
		assert.strictEqual(root.right?.value, newNode);
	});

	it('should set a lesser node to left when left is null', () => {
		const root = new RangeTreeNode(new ComparableNumber(0));
		const newNode = new ComparableNumber(-1);
		root.insert(newNode);
		assert.strictEqual(root.left?.value, newNode);
	});

	it('should insert a greater node at right when right is not null', () => {
		const root = new RangeTreeNode(new ComparableNumber(0));
		const rightNode = new RangeTreeNode(new ComparableNumber(2));
		const newNode = new ComparableNumber(1);
		root.right = rightNode;
		root.insert(newNode);
		assert.strictEqual(root.right, rightNode);
		assert.strictEqual(root.right?.left?.value, newNode);
	});

	it('should insert a lesser node at left when left is not null', () => {
		const root = new RangeTreeNode(new ComparableNumber(0));
		const leftNode = new RangeTreeNode(new ComparableNumber(-2));
		const newNode = new ComparableNumber(-1);
		root.left = leftNode;
		root.insert(newNode);
		assert.strictEqual(root.left, leftNode);
		assert.strictEqual(root.left?.right?.value, newNode);
	});
});

describe('TreeNode Search', () => {
	it('should find a value that is equal to another value in the tree', () => {
		const root = new RangeTreeNode(new ComparableNumber(0));
		root.insert(new ComparableNumber(3));
		root.insert(new ComparableNumber(2));
		root.insert(new ComparableNumber(7));
		root.insert(new ComparableNumber(4));
		root.insert(new ComparableNumber(1));

		assert.strictEqual(root.search(new ComparableNumber(4)), true);
		assert.strictEqual(root.search(new ComparableNumber(2)), true);
		assert.strictEqual(root.search(new ComparableNumber(7)), true);
	});

	it('should not find a value that is not equal to any another value in the tree', () => {
		const root = new RangeTreeNode(new ComparableNumber(0));
		root.insert(new ComparableNumber(3));
		root.insert(new ComparableNumber(2));
		root.insert(new ComparableNumber(7));
		root.insert(new ComparableNumber(4));
		root.insert(new ComparableNumber(1));

		assert.strictEqual(root.search(new ComparableNumber(5)), false);
		assert.strictEqual(root.search(new ComparableNumber(-1)), false);
	});
});

describe('ComparableRange Insertion', () => {
	it('should insert a greater node at right when right is not null', () => {
		const root = new RangeTreeNode(new ComparableRange(0,20));
		const rightNode = new RangeTreeNode(new ComparableRange(10,30));
		const newNode = new ComparableRange(5,10);
		root.right = rightNode;
		root.insert(newNode);
		assert.strictEqual(root.right, rightNode);
		assert.strictEqual(root.right?.left?.value, newNode);
	});

	it('should insert a lesser node at left when left is not null', () => {
		const root = new RangeTreeNode(new ComparableRange(0,20));
		const leftNode = new RangeTreeNode(new ComparableRange(-10,10));
		const newNode = new ComparableRange(-5,-10);
		root.left = leftNode;
		root.insert(newNode);
		assert.strictEqual(root.left, leftNode);
		assert.strictEqual(root.left?.right?.value, newNode);
	});
});

describe('ComparableRange Search', () => {
	it('should describe two ranges that are within one another as equal', () => {
		const a = new ComparableRange(10,20);
		const b = new ComparableRange(15,15);

		assert.strictEqual(a.equalTo(b), true);
	});

	it('should describe two ranges that are not within one another as different', () => {
		const a = new ComparableRange(10,20);
		const b = new ComparableRange(9,15);

		assert.strictEqual(a.equalTo(b), false);
	});

	it('should find a value that is within one of the ranges in the tree', () => {
		const root = new RangeTreeNode(new ComparableRange(10,20));
		root.insert(new ComparableRange(11,30));
		root.insert(new ComparableRange(5,10));
		root.insert(new ComparableRange(50,70));

		assert.strictEqual(root.search(new ComparableRange(6,6)), true);
		assert.strictEqual(root.search(new ComparableRange(20,30)), true);
	});

	it('should not find a value that is not within any of the ranges in the tree', () => {
		const root = new RangeTreeNode(new ComparableRange(10,20));
		root.insert(new ComparableRange(11,30));
		root.insert(new ComparableRange(5,10));
		root.insert(new ComparableRange(50,70));

		assert.strictEqual(root.search(new ComparableRange(31,31)), false);
		assert.strictEqual(root.search(new ComparableRange(0,5)), false);
	});
});
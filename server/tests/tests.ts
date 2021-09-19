import assert from 'assert';
import 'mocha';
import {Comparable, ComparableRange, SortedList, TreeNode} from '../src/structures';
import {Crashacters} from '../src/crashacters';
import { CrashactersSettings } from '../src/server';

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
        const root = new TreeNode(new ComparableNumber(0));
        const newNode = new ComparableNumber(1);
        root.insert(newNode);
        assert.strictEqual(root.right?.value, newNode, "Case1");
    });

    it('should set a lesser node to left when left is null', () => {
        const root = new TreeNode(new ComparableNumber(0));
        const newNode = new ComparableNumber(-1);
        root.insert(newNode);
        assert.strictEqual(root.left?.value, newNode, "Case1");
    });

    it('should insert a greater node at right when right is not null', () => {
        const root = new TreeNode(new ComparableNumber(0));
        const rightNode = new TreeNode(new ComparableNumber(2));
        const newNode = new ComparableNumber(1);
        root.right = rightNode;
        root.insert(newNode);
        assert.strictEqual(root.right, rightNode, "Case1");
        assert.strictEqual(root.right?.left?.value, newNode, "Case2");
    });

    it('should insert a lesser node at left when left is not null', () => {
        const root = new TreeNode(new ComparableNumber(0));
        const leftNode = new TreeNode(new ComparableNumber(-2));
        const newNode = new ComparableNumber(-1);
        root.left = leftNode;
        root.insert(newNode);
        assert.strictEqual(root.left, leftNode, "Case1");
        assert.strictEqual(root.left?.right?.value, newNode, "Case2");
    });
});

describe('SortedList Insertion', () => {
    it('should insert any new value on index 0 in an empty list', () => {
        const list = new SortedList<ComparableNumber>();
        list.insert(new ComparableNumber(10));
        assert.strictEqual(list.array.length, 1, "Case1");
        assert.strictEqual(list.array[0].value, 10, "Case2");
    });

    it('should insert a new value larger than any other element at the end', () => {
        const list = new SortedList<ComparableNumber>();
        list.array = [new ComparableNumber(-5),new ComparableNumber(3),new ComparableNumber(8),new ComparableNumber(9)];
        list.insert(new ComparableNumber(10));
        assert.strictEqual(list.array.length, 5, "Case1");
        assert.strictEqual(list.array[4].value, 10, "Case2");
    });

    it('should insert a new value smaller than any other element at the start', () => {
        const list = new SortedList<ComparableNumber>();
        list.array = [new ComparableNumber(-5),new ComparableNumber(3),new ComparableNumber(8),new ComparableNumber(9)];
        list.insert(new ComparableNumber(-6));
        assert.strictEqual(list.array.length, 5, "Case1");
        assert.strictEqual(list.array[0].value, -6, "Case2");
    });

    it('should insert a new value in the correct sorted position', () => {
        const list = new SortedList<ComparableNumber>();
        list.array = [new ComparableNumber(-5),new ComparableNumber(3),new ComparableNumber(8),new ComparableNumber(9)];
        list.insert(new ComparableNumber(4));
        assert.strictEqual(list.array.length, 5, "Case1");
        assert.strictEqual(list.array[2].value, 4, "Case2");
    });
});

describe('SortedList Search', () => {
    it('should find a value that is contained by another value in the list', () => {
        const list = new SortedList<ComparableNumber>();
        list.array = [new ComparableNumber(-5),new ComparableNumber(3),new ComparableNumber(8),new ComparableNumber(9)];
        assert.strictEqual(list.search(new ComparableNumber(3)), true, "Case1");
    });

    it('should not find a value that is not contained by any another value in the tree', () => {
        const list = new SortedList<ComparableNumber>();
        list.array = [new ComparableNumber(-5),new ComparableNumber(3),new ComparableNumber(8),new ComparableNumber(9)];
        assert.strictEqual(list.search(new ComparableNumber(4)), false, "Case1");
    });
});

describe('TreeNode Search', () => {
    it('should find a value that is contained by another value in the tree', () => {
        const root = new TreeNode(new ComparableNumber(0));
        root.insert(new ComparableNumber(3));
        root.insert(new ComparableNumber(2));
        root.insert(new ComparableNumber(7));
        root.insert(new ComparableNumber(4));
        root.insert(new ComparableNumber(1));

        assert.strictEqual(root.search(new ComparableNumber(4)), true, "Case1");
        assert.strictEqual(root.search(new ComparableNumber(2)), true, "Case2");
        assert.strictEqual(root.search(new ComparableNumber(7)), true, "Case3");
    });

    it('should not find a value that is not contained by any another value in the tree', () => {
        const root = new TreeNode(new ComparableNumber(0));
        root.insert(new ComparableNumber(3));
        root.insert(new ComparableNumber(2));
        root.insert(new ComparableNumber(7));
        root.insert(new ComparableNumber(4));
        root.insert(new ComparableNumber(1));

        assert.strictEqual(root.search(new ComparableNumber(5)), false, "Case1");
        assert.strictEqual(root.search(new ComparableNumber(-1)), false, "Case2");
    });
});

describe('ComparableRange Insertion', () => {
    it('should insert a greater node at right when right is not null', () => {
        const root = new TreeNode(new ComparableRange(0,20));
        const rightNode = new TreeNode(new ComparableRange(10,30));
        const newNode = new ComparableRange(5,10);
        root.right = rightNode;
        root.insert(newNode);
        assert.strictEqual(root.right, rightNode, "Case1");
        assert.strictEqual(root.right?.left?.value, newNode, "Case2");
    });

    it('should insert a lesser node at left when left is not null', () => {
        const root = new TreeNode(new ComparableRange(0,20));
        const leftNode = new TreeNode(new ComparableRange(-10,10));
        const newNode = new ComparableRange(-5,-10);
        root.left = leftNode;
        root.insert(newNode);
        assert.strictEqual(root.left, leftNode, "Case1");
        assert.strictEqual(root.left?.right?.value, newNode, "Case2");
    });
});

describe('ComparableRange Search', () => {
    it('should describe B as contained by A but not A contained by B given that B is a subset of A', () => {
        const a = new ComparableRange(10,20);
        const b = new ComparableRange(15,15);

        assert.strictEqual(a.contains(b), true, "Case1");
        assert.strictEqual(b.contains(a), false, "Case2");
    });

    it('should not describe two ranges as contained given that neither is a subset of the other', () => {
        const a = new ComparableRange(10,20);
        const b = new ComparableRange(9,15);

        assert.strictEqual(a.contains(b), false, "Case1");
        assert.strictEqual(b.contains(a), false, "Case2");
    });

    it('should find a value that is contained by of the ranges in the tree', () => {
        const root = new TreeNode(new ComparableRange(10,20));
        root.insert(new ComparableRange(11,30));
        root.insert(new ComparableRange(5,10));
        root.insert(new ComparableRange(50,70));

        assert.strictEqual(root.search(new ComparableRange(6,6)), true, "Case1");
        assert.strictEqual(root.search(new ComparableRange(20,30)), true, "Case2");
    });

    it('should not find a value that is not contained by any of the ranges in the tree', () => {
        const root = new TreeNode(new ComparableRange(10,20));
        root.insert(new ComparableRange(11,30));
        root.insert(new ComparableRange(5,10));
        root.insert(new ComparableRange(50,70));

        assert.strictEqual(root.search(new ComparableRange(31,31)), false, "Case1");
        assert.strictEqual(root.search(new ComparableRange(0,5)), false, "Case2");
        assert.strictEqual(root.search(new ComparableRange(49,70)), false, "Case3");
    });

    it('should find a value that is contained by any of the ranges in the list', () => {
        const list = new SortedList<ComparableRange>();
        list.insert(new ComparableRange(10,20));
        list.insert(new ComparableRange(11,30));
        list.insert(new ComparableRange(5,10));
        list.insert(new ComparableRange(50,70));

        assert.strictEqual(list.search(new ComparableRange(6,6)), true, "Case1");
        assert.strictEqual(list.search(new ComparableRange(20,30)), true, "Case2");
    });

    it('should not find a value that is not contained by any of the ranges in the list', () => {
        const list = new SortedList<ComparableRange>();
        list.insert(new ComparableRange(10,20));
        list.insert(new ComparableRange(11,30));
        list.insert(new ComparableRange(5,10));
        list.insert(new ComparableRange(50,70));

        assert.strictEqual(list.search(new ComparableRange(31,31)), false, "Case1");
        assert.strictEqual(list.search(new ComparableRange(0,5)), false, "Case2");
        assert.strictEqual(list.search(new ComparableRange(49,70)), false, "Case3");
    });
});

describe('ComparableRange[] Parsing', () => {
    const crashacter = new Crashacters();

    it('should correctly parse a valid object', () => {
        const settings: CrashactersSettings = {maxNumberOfProblems: -1, characterBlacklist: {ranges: [{"start": 0, "end": 1}, {"start":2, "end":127}]}};
        crashacter.loadRanges(settings);
        const ranges = crashacter.blacklistedCharacterRanges.array;

        assert.strictEqual(ranges != null, true);
        assert.strictEqual(ranges.length, 2);
        assert.strictEqual(ranges[0] instanceof ComparableRange, true);
        assert.strictEqual(ranges[1] instanceof ComparableRange, true);
        assert.strictEqual(ranges[0].start, 0);
        assert.strictEqual(ranges[0].end, 1);
        assert.strictEqual(ranges[1].start, 2);
        assert.strictEqual(ranges[1].end, 127);
    });
});
function LinkedList() {
	this.head = null;
	this.tail = null;
	this.length = 0;
}

LinkedList.prototype = Object.create(Object.prototype);
LinkedList.constructor = LinkedList;

LinkedList.prototype.push = function(data) {
	this.length++;
	var node = {next:null, prev:null, data:data};
	if (this.tail == null) {
		this.head = node;
		this.tail = node; 
	}
	else {
		this.tail.next = node;
		node.prev = this.tail;
		this.tail = node;
	}
}

LinkedList.prototype.remove = function(node) {
	this.length--;
	if (node == this.head) {
		this.head = node.next;
		if (this.head) {
			this.head.prev = null;
		}
	}
	else if (node == this.tail) {
		this.tail = this.tail.prev;
		if (this.tail) {
			this.tail.next = null;
		}
	}
	else {
		this.tail.next = node;
		node.prev = this.tail;
		this.tail = node;
	}
}

module.exports = LinkedList;
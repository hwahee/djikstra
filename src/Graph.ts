import { canvas, ctx } from './Canvas.js'
import { FONTSIZE, getRandomInt, INF } from './Global.js'
import mouse from './Mouse.js'

const RADIUS = 10
const D_RADIUS = 2		//증가량

class GraphNode {
	private item: string
	private x: number
	private y: number
	private r: number = RADIUS
	private color: string
	private on_djikstra: boolean = false
	private link: { [key: number]: number } = {}
	constructor(alphabet: string[], color: string) {
		this.item = alphabet[0]
		this.x = getRandomInt(canvas.width)
		this.y = getRandomInt(canvas.height)
		this.color = color
	}
	isLinked(idx: number) {
		return this.link[idx] !== undefined
	}
	isOnDjikstra() {
		return this.on_djikstra;
	}
	setOnDjikstra(onoff: boolean = true) { this.on_djikstra = onoff }
	setPosition(x: number, y: number) {
		this.x = x
		this.y = y
	}
	getShapeInfo() { return { x: this.x, y: this.y, r: this.r, color: this.color } }
	getListOfLink() {
		const result: string[] = Object.keys(this.link)
		let ret: number[] = []
		for (let i = 0; i < result.length; i++) {
			ret.push(parseInt(result[i]))
		}
		return ret
	}
	getDistance(idx: number) { return this.link[idx] }
	setDistance(idx: number, dist: number) { this.link[idx] = dist }
	connect(idx: number) {
		this.link[idx] = 0
		this.r += D_RADIUS
	}
	disconnect(idx: number) {
		delete this.link[idx]
		this.r -= D_RADIUS
	}
	disconnectAll() {
		this.r -= Object.keys(this.link).length * D_RADIUS
		this.link = {}
	}
	draw() {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, 3.14 * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
		ctx.closePath()
		ctx.beginPath()
		ctx.font = FONTSIZE + "px Georgia"
		ctx.fillStyle = "white"
		ctx.textAlign = "center"
		ctx.fillText(this.item, this.x, this.y + FONTSIZE * 0.36)
		ctx.closePath()
		if (this.on_djikstra) {
			ctx.beginPath()
			ctx.arc(this.x, this.y, this.r * 1.5, 0, 3.14 * 2, false)
			ctx.strokeStyle = "white"
			ctx.lineWidth = 3
			ctx.stroke()
			ctx.closePath()
		}
	}
}

class Graph {
	private list: GraphNode[] = []
	newNode(symbol: any, color: string) {
		this.list.push(new GraphNode(symbol, color))
	}
	link(a: number, b: number, twoway: boolean) {
		if (!this.list[a].isLinked(b))
			this.list[a].connect(b)
		if (twoway)
			this.link(b, a, false);
	}
	cut(a: number, b: number, twoway: boolean) {
		if (this.list[a].isLinked(b))
			this.list[a].disconnect(b)
		if (twoway)
			this.cut(b, a, false);
	}
	clearLink(idx: number) {
		this.list[idx].disconnectAll()
	}
	djikstra(a: number, b: number) {
		let distance_array: number[] = []
		let checked: number[] = [a]
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].setOnDjikstra(false)
		}

		//initialize distances from the first node
		for (let i = 0; i < this.list.length; i++) {
			if (i === a)
				distance_array[i] = 0;
			else if (!this.list[a].isLinked(i))
				distance_array[i] = INF;
			else
				distance_array[i] = this.list[a].getDistance(i);
		}

		while (checked.length !== this.list.length) {
			//find an index of a node having shortest distance
			let min_distance_index = -1
			let min_distance = INF
			for (let i = 0; i < this.list.length; i++) {
				if (i === a) continue
				if (checked.indexOf(i) === -1 && distance_array[i] < min_distance) {
					min_distance = distance_array[i]
					min_distance_index = i
				}
			}

			if (min_distance_index !== -1)
				checked.push(min_distance_index)
			else
				break
				
			//this.list[min_distance_index].setOnDjikstra(true)
			if (min_distance_index === b) break;
			const keys: number[] = this.list[min_distance_index].getListOfLink()
			for (let i of keys) {
				if (distance_array[min_distance_index] + this.list[min_distance_index].getDistance(i) < distance_array[i]) {
					distance_array[i] = distance_array[min_distance_index] + this.list[min_distance_index].getDistance(i)
				}
			}
		}

		checked.reverse()
		const showDjikstra = () => {
			if (checked.length) {
				this.list[checked[checked.length - 1]].setOnDjikstra(true)
				checked.pop()
				setTimeout(showDjikstra, 500)
			}
		}
		showDjikstra()

		return distance_array[b];
	}
	setDistance() {
		for (let i = 0; i < this.list.length; i++) {
			for (let j of this.list[i].getListOfLink()) {
				var src = this.list[i].getShapeInfo()
				var dst = this.list[j].getShapeInfo()

				let length = Math.floor(Math.sqrt(Math.pow(dst.x - src.x, 2) + Math.pow(dst.y - src.y, 2)))
				this.list[i].setDistance(j, length)
			}
		}
	}
	move() {
		if (mouse.isDown()) {
			const m: any = mouse.getPosition()
			if (mouse.getSelected() === undefined) {
				for (let i = 0; i < this.list.length; i++) {
					const target = this.list[i].getShapeInfo()
					if (Math.pow((target.x - m.x), 2) + Math.pow((target.y - m.y), 2) <= Math.pow(target.r, 2)) {
						mouse.select(i)
						break;
					}
				}
			}
			else {
				this.list[mouse.getSelected()].setPosition(m.x, m.y)
			}
		}
	}
	draw() {
		for (let i = 0; i < this.list.length; i++) {
			for (let j of this.list[i].getListOfLink()) {
				var src = this.list[i].getShapeInfo()
				var dst = this.list[j].getShapeInfo()
				// console.log(src)
				// console.log(dst)
				// console.log("++++++++++++++++")
				ctx.beginPath();
				ctx.moveTo(src.x - src.r / 2, src.y);
				ctx.lineTo(dst.x + dst.r / 2, dst.y);
				ctx.strokeStyle = src.color;
				ctx.lineWidth = src.r / 3;
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.textAlign = "center";
				ctx.fillStyle = "white";
				ctx.fillText(`${this.list[i].getDistance(j)}`, (dst.x + src.x) / 2, (dst.y + src.y) / 2);
				ctx.closePath();
			}
		}
		for (var i = 0; i < this.list.length; i++) {
			this.list[i].draw();
		}
	}
}

const Node_array: Graph = new Graph()
Node_array.newNode("A", "rgba(192, 168, 0, 1)");
Node_array.newNode("Bamaica", "green");
Node_array.newNode("C", "black");
Node_array.newNode("D", "purple");
Node_array.newNode("E", "coral");
Node_array.newNode("F", "blue");
Node_array.newNode("G", "brown");
Node_array.newNode("HWAHEE", "gray");

Node_array.link(0, 1, true);
Node_array.link(0, 2, true);
Node_array.link(1, 3, true);
Node_array.link(1, 4, true);
Node_array.link(2, 5, true);
Node_array.link(2, 6, true);
Node_array.link(3, 7, true);

export { Node_array }



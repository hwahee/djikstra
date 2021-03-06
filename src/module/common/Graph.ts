import { canvas, ctx } from './Canvas.js'
import { D_RADIUS, FONTSIZE, getRandomColorRGB, getRandomInt, MAX_NODE, RADIUS, ShapeInfo, symbol } from './Global.js'
import mouse from './Mouse.js'

interface IF_GraphNopde {
	r: number
	link: number[]
	item: string
	x: number
	y: number
	color: string
}
class GraphNode {
	private item: string
	protected x: number
	protected y: number
	protected r: number = RADIUS
	private color: string
	protected link: { [key: number]: number } = {}
	constructor(alphabet: string, color: string) {
		this.item = alphabet
		this.x = getRandomInt(canvas.width)
		this.y = getRandomInt(canvas.height)
		this.color = color
	}
	fromJSON(obj: IF_GraphNopde) {
		this.r = obj.r
		this.link = obj.link
		this.item = obj.item
		this.x = obj.x
		this.y = obj.y
		this.color = obj.color
	}
	isLinked(idx: number) {
		return this.link[idx] !== undefined
	}
	setPosition(x: number, y: number) {
		this.x = x
		this.y = y
	}
	getShapeInfo() { return { x: this.x, y: this.y, r: this.r, color: this.color } as ShapeInfo }
	getListOfLink() {
		const result: string[] = Object.keys(this.link)
		let ret: number[] = []
		for (let i = 0; i < result.length; i++) {
			ret.push(parseInt(result[i]))
		}
		return ret
	}
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
	}
}

class Graph {
	protected list: GraphNode[] = []
	makeNewNode(alphabet: string, color: string) { return new GraphNode(alphabet, color) }
	newNode() {
		for (let i = 0; i < this.size(); i++) {
			if (this.list[i] === undefined) {
				this.list[i] = this.makeNewNode(symbol.at(i), getRandomColorRGB())
				return
			}
		}
		if (MAX_NODE <= this.size()) {
			alert("????????? ????????? ???????????????.")
			return
		}
		this.list.push(this.makeNewNode(symbol.assign(), getRandomColorRGB()))
	}
	assignJsonToNode(obj: any) {
		symbol.reset()
		for (let i of obj) {
			this.newNode()
			const target: IF_GraphNopde = i as IF_GraphNopde
			target.item = symbol.assign()
			this.list[this.list.length - 1].fromJSON(target)
		}
	}
	deleteNode() {
		this.clearLink(this.size() - 1)
		this.list.pop()
		symbol.unassign()
	}
	link(a: number, b: number, twoway: boolean) {
		if (!this.list[a].isLinked(b))
			this.list[a].connect(b)
		if (twoway)
			this.link(b, a, false);
	}
	linkRandom(num: number, twoway: boolean) {
		for (let i = 0; i < this.size(); i++)
			this.clearLink(i)

		while (0 < num) {
			let a: number
			let b: number
			let trial = 1000
			while (true) {
				a = getRandomInt(this.size())
				b = getRandomInt(this.size())
				if (!(this.list[a] == undefined || this.list[b] == undefined) && a !== b && !this.list[a].isLinked(b)) break
				else {
					trial--
					if (trial <= 0) {
						alert("???????????? ?????? ????????? ???????????????.")
						return
					}
				}
			}
			this.link(a, b, twoway)
			num--
		}
	}
	cut(a: number, b: number, twoway: boolean) {
		if (this.list[a].isLinked(b))
			this.list[a].disconnect(b)
		if (twoway)
			this.cut(b, a, false);
	}
	clearLink(idx: number) {
		for (let i = 0; i < this.size(); i++) {
			this.cut(idx, i, true)
		}
	}
	size() { return this.list.length }
	move() {
		if (mouse.isDown()) {
			const m: any = mouse.getPosition()
			if (mouse.getSelected() === undefined) {
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i] == undefined) continue
					const target = this.list[i].getShapeInfo()
					if (Math.pow((target.x - m.x), 2) + Math.pow((target.y - m.y), 2) <= Math.pow(target.r, 2)) {
						mouse.select(i)
						break
					}
				}
			}
			else {
				this.list[mouse.getSelected()].setPosition(m.x, m.y)
			}
		}
	}
	drawLink(src: ShapeInfo, dst: ShapeInfo) {
		ctx.beginPath()
		ctx.moveTo(src.x - src.r / 2, src.y)
		ctx.lineTo(dst.x + dst.r / 2, dst.y)
		ctx.strokeStyle = src.color
		ctx.lineWidth = src.r / 3
		ctx.stroke()
		ctx.closePath()
	}
	drawNode() {
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].draw()
		}
	}
	draw() {
		for (let i = 0; i < this.size(); i++) {
			if (this.list[i] == undefined) continue
			for (let j of this.list[i].getListOfLink()) {
				let src = this.list[i].getShapeInfo()
				let dst = this.list[j].getShapeInfo()

				this.drawLink(src, dst)
			}
		}
		this.drawNode()
	}
	print() { return JSON.stringify(this) }
}

const Node_array: Graph = new Graph()

export { IF_GraphNopde, GraphNode, Graph, Node_array }



import { ctx } from '../common/Canvas.js'
import { INF } from '../common/Global.js'
import { Graph, GraphNode } from '../common/Graph.js'

const RADIUS = 10
const D_RADIUS = 2		//증가량

class GraphNode_Djikstra extends GraphNode {
	private on_djikstra: boolean = false
	constructor(alphabet: string, color: string) {
		super(alphabet, color)
	}
	isOnDjikstra() {
		return this.on_djikstra;
	}
	setOnDjikstra(onoff: boolean = true) { this.on_djikstra = onoff }

	getDistance(idx: number) { return this.link[idx] }
	setDistance(idx: number, dist: number) { this.link[idx] = dist }

	draw() {
		super.draw()
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

class Graph_Djikstra extends Graph {
	protected list: GraphNode_Djikstra[]
	makeNewNode(alphabet: string, color: string) { return new GraphNode_Djikstra(alphabet, color) }

	djikstra(a: number, b: number) {
		let distance_array: number[] = []
		let checked: number[] = [a]
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
			this.list[i].setOnDjikstra(false)
		}

		//initialize distances from the first node
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
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
			if (min_distance_index === b) break
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
			if (this.list[i] == undefined) continue
			for (let j of this.list[i].getListOfLink()) {
				let src = this.list[i].getShapeInfo()
				let dst = this.list[j].getShapeInfo()

				let length = Math.floor(Math.sqrt(Math.pow(dst.x - src.x, 2) + Math.pow(dst.y - src.y, 2)))
				this.list[i].setDistance(j, length)
			}
		}
	}
	draw() {
		for (let i = 0; i < this.size(); i++) {
			if (this.list[i] == undefined) continue
			for (let j of this.list[i].getListOfLink()) {
				let src = this.list[i].getShapeInfo()
				let dst = this.list[j].getShapeInfo()

				super.drawLink(src, dst)

				ctx.beginPath();
				ctx.textAlign = "center";
				ctx.fillStyle = "white";
				ctx.fillText(`${this.list[i].getDistance(j)}`, (dst.x + src.x) / 2, (dst.y + src.y) / 2);
				ctx.closePath();
			}
		}
		super.drawNode()
	}
}

const Node_array: Graph_Djikstra = new Graph_Djikstra()

export { Node_array }



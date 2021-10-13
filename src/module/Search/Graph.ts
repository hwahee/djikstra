import { ctx } from '../common/Canvas.js'
import { Graph, GraphNode } from '../common/Graph.js'

const RADIUS = 10
const D_RADIUS = 2		//증가량

class GraphNode_Search extends GraphNode {
	private visited: boolean = false
	constructor(alphabet: string, color: string) {
		super(alphabet, color)
	}
	isVisited() { return this.visited }
	setVisited(onoff: boolean = true) { this.visited = onoff }

	draw() {
		super.draw()
		if (this.visited) {
			ctx.beginPath()
			ctx.arc(this.x, this.y, this.r * 1.5, 0, 3.14 * 2, false)
			ctx.strokeStyle = "white"
			ctx.lineWidth = 3
			ctx.stroke()
			ctx.closePath()
		}
	}
}

class Graph_Search extends Graph {
	protected list: GraphNode_Search[]
	makeNewNode(alphabet: string, color: string) { return new GraphNode_Search(alphabet, color) }
	DFS_core(start: number, result: number[]) {
		const keys: number[] = this.list[start].getListOfLink()
		for (let i of keys) {
			if (!this.list[i].isVisited()) {
				this.list[i].setVisited(true)
				result.push(i)
				this.DFS_core(i, result)
			}
		}
	}
	DFS(start: number) {
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
			this.list[i].setVisited(false)
		}
		if(this.list.length<=start){
			return "INVALID START POINT"
		}

		let result: number[] = []
		this.list[start].setVisited(true)
		result.push(start)
		this.DFS_core(start, result)

		let visited=result.slice()
		visited.reverse()
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
			this.list[i].setVisited(false)
		}
		const showDFS = () => {
			if (visited.length) {
				this.list[visited[visited.length - 1]].setVisited(true)
				visited.pop()
				setTimeout(showDFS, 500)
			}
		}
		showDFS()

		return result
	}
	draw() {
		for (let i = 0; i < this.size(); i++) {
			if (this.list[i] == undefined) continue
			for (let j of this.list[i].getListOfLink()) {
				let src = this.list[i].getShapeInfo()
				let dst = this.list[j].getShapeInfo()

				super.drawLink(src, dst)
			}
		}
		super.drawNode()
	}
}

const Node_array: Graph_Search = new Graph_Search()

export { Node_array }



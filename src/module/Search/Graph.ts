import { ctx } from '../common/Canvas.js'
import { ANIMATION_SPEED } from '../common/Global.js'
import { Graph, GraphNode } from '../common/Graph.js'

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
		if (this.list.length <= start) {
			return "INVALID START POINT"
		}

		let result: number[] = []
		this.list[start].setVisited(true)
		result.push(start)
		this.DFS_core(start, result)

		let visited = result.slice()
		visited.reverse()
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
			this.list[i].setVisited(false)
		}
		const showDFS = () => {
			if (visited.length) {
				this.list[visited[visited.length - 1]].setVisited(true)
				visited.pop()
				setTimeout(showDFS, ANIMATION_SPEED)
			}
		}
		showDFS()

		return result
	}
	BFS(start: number) {
		class UnpoppingQueue {
			arr: number[]=[]
			L = 0
			R = 0
			size() { return this.R - this.L }
			push(item: number) {
				this.arr.push(item)
				this.R += 1
			}
			top() {
				if (this.L === this.R) {
					return undefined
				}
				return this.arr[this.L]
			}
			pop() {
				const ret: number | undefined = this.top()
				if (ret !== undefined) this.L++
				return ret
			}
		}
		const q: UnpoppingQueue = new UnpoppingQueue()

		//방문 여부 초기화 및 매개변수 사용 가능 확인
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
			this.list[i].setVisited(false)
		}
		if (this.list.length <= start) {
			return "INVALID START POINT"
		}

		//초기 변수, 큐, 방문여부 세팅
		let result:number[]=[start]
		q.push(start)
		this.list[start].setVisited(true)

		while (q.size()){
			const target:number=q.pop()
			for(let i of this.list[target].getListOfLink()){
				if(!this.list[i].isVisited()){
					q.push(i)
					this.list[i].setVisited(true)
					result.push(i)
				}
			}
		}
		
		let visited = result.slice()
		visited.reverse()
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i] == undefined) continue
			this.list[i].setVisited(false)
		}
		const showBFS = () => {
			if (visited.length) {
				this.list[visited[visited.length - 1]].setVisited(true)
				visited.pop()
				setTimeout(showBFS, ANIMATION_SPEED)
			}
		}
		showBFS()

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

export { Graph_Search }



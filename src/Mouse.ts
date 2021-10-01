class Mouse {
	private down = false
	private selected:number|undefined = undefined
	private x: number
	private y: number

	constructor() { }
	mouseUpdate(event: MouseEvent) {
		this.x = event.offsetX
		this.y = event.offsetY
	}
	isDown() { return this.down }
	getPosition() { return { x: this.x, y: this.y } }
	click() { this.down = true }
	unclick() {
		this.down = false
		mouse.selected = undefined
	}
	getSelected() { return this.selected }
	select(target: number | undefined) { this.selected = target }
}

const mouse: Mouse = new Mouse()
document.getElementById('myCanvas').addEventListener('mousedown', ()=>{mouse.click()})
document.getElementById('myCanvas').addEventListener('mouseup', ()=>{mouse.unclick()})
document.getElementById('myCanvas').addEventListener('mousemove', (e)=>{mouse.mouseUpdate(e)})
export default mouse
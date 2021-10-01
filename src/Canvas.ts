const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

const clearCanvas = () => {
	ctx?.clearRect(0, 0, canvas.width, canvas.height)
}
export { canvas, ctx, clearCanvas }
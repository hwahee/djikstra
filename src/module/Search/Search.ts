import { clearCanvas } from '../common/Canvas.js'
import { Node_array } from './Graph.js'

document.getElementById("cnt").addEventListener('click', () => {
    const src: number = parseInt((document.getElementById("cnt_src") as HTMLInputElement).value)
    const dst: number = parseInt((document.getElementById("cnt_dst") as HTMLInputElement).value)
    const dbl: boolean = (document.getElementById("cnt_double") as HTMLInputElement).checked
    if (src === dst)
        alert("You can't connect the same nodes.")
    else
        handler.push(() => { Node_array.link(src, dst, dbl) })
})
document.getElementById("cut").addEventListener('click', () => {
    const src: number = parseInt((document.getElementById("cut_src") as HTMLInputElement).value)
    const dst: number = parseInt((document.getElementById("cut_dst") as HTMLInputElement).value)
    const dbl: boolean = (document.getElementById("cut_double") as HTMLInputElement).checked
    if (src === dst)
        alert("You can't cut a link between the same nodes.")
    else
        handler.push(() => { Node_array.cut(src, dst, dbl) })
})
document.getElementById("do_DFS").addEventListener('click', () => {
    const start: number = parseInt((document.getElementById("search_start") as HTMLInputElement).value)
    handler.push(() => {
        const ret: HTMLInputElement = document.getElementById('search_result') as HTMLInputElement
        ret.value = String(Node_array.DFS(start))
    })
})
document.getElementById("do_BFS").addEventListener('click', () => {
    const start: number = parseInt((document.getElementById("search_start") as HTMLInputElement).value)
    handler.push(() => {
        const ret: HTMLInputElement = document.getElementById('search_result') as HTMLInputElement
        ret.value = String(Node_array.BFS(start))
    })
})
document.getElementById("newNode").addEventListener('click', () => {
    handler.push(() => { Node_array.newNode() })
})
document.getElementById("linkRandom").addEventListener('click', () => {
    const num: number = parseInt((document.getElementById("linkRandom_num") as HTMLInputElement).value)
    const dbl: boolean = (document.getElementById("linkRandom_double") as HTMLInputElement).checked
    handler.push(() => { Node_array.linkRandom(num, dbl) })
})
document.getElementById("deleteNode").addEventListener('click', () => {
    handler.push(() => { Node_array.deleteNode() })
})

const handler: CallableFunction[] = []
setInterval(() => {
    clearCanvas()
    while (handler.length != 0) {
        handler[handler.length - 1]()
        handler.pop()
    }
    Node_array.move()
    Node_array.draw()
}, 40)
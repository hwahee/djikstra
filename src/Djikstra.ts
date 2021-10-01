import { clearCanvas } from './Canvas'
import {Node_array} from './Graph'

document.getElementById("cnt").addEventListener('click', ()=>{
	const src:number = parseInt((document.getElementById("cnt_src") as HTMLInputElement).value)
    const dst:number = parseInt((document.getElementById("cnt_dst") as HTMLInputElement).value)
    const dbl:boolean = (document.getElementById("cnt_double") as HTMLInputElement).checked
    if (src === dst)
        alert("You can't connect the same nodes.");
    else
        Node_array.link(src, dst, dbl);
})
document.getElementById("cut").addEventListener('click', ()=>{
	const src:number = parseInt((document.getElementById("cut_src") as HTMLInputElement).value)
    const dst:number = parseInt((document.getElementById("cut_dst") as HTMLInputElement).value)
    const dbl:boolean = (document.getElementById("cut_double") as HTMLInputElement).checked
    if (src === dst)
        alert("You can't cut a link between the same nodes.");
    else
        Node_array.cut(src, dst, dbl);
})
document.getElementById("calculate_djikstra").addEventListener('click', ()=>{
	const src:number = parseInt((document.getElementById("dj_src") as HTMLInputElement).value)
    const dst:number = parseInt((document.getElementById("dj_dst") as HTMLInputElement).value)
	const ret:HTMLInputElement= document.getElementById('dj_ret') as HTMLInputElement
	ret.value=String(Node_array.djikstra(src, dst))
})

setInterval(()=>{
	clearCanvas()
	Node_array.move()
	Node_array.setDistance()
	Node_array.draw()
}, 10)
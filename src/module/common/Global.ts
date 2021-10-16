const FONTSIZE:number=20
const INF:number=4000000
const RADIUS = 10
const D_RADIUS = 2
const ANIMATION_SPEED:number=500

function getRandomInt(max:number):number{
    return Math.floor(Math.random() * Math.floor(max))
}
function getRandomColorRGB():string{
    return `rgba(${getRandomInt(256)},${getRandomInt(256)},${getRandomInt(256)},1)`
}

interface ShapeInfo {
	x: number, y: number, r: number, color: string
}

class Symbol{
	private list:string="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private cursor:number=0;
	assign(){
		if(this.cursor<this.list.length)
			return this.list[this.cursor++]
		else{
			alert("심볼을 모두 사용하였습니다.")
			return "\0"
		}
	}
    unassign(){
        if(--this.cursor<0) this.cursor=0
    }
	at(idx:number){return this.list[idx]}
    size(){return this.list.length}
}
const symbol=new Symbol()
const MAX_NODE=symbol.size()

export {FONTSIZE, INF,ANIMATION_SPEED, ShapeInfo, getRandomInt, getRandomColorRGB, symbol, MAX_NODE,RADIUS,D_RADIUS}
import Express from 'express'
import {createServer} from 'http'

const app=Express()
app.get('/',(req, res)=>{
	res.sendFile(__dirname+`\\src\\djikstra.html`)
})
app.get('/djikstra.js',(req, res)=>{
	res.sendFile(__dirname+`\\src\\djikstra.js`)
})
app.get('/Canvas',(req, res)=>{
	res.sendFile(__dirname+`\\src\\Canvas.js`)
})
app.get('/Graph',(req, res)=>{
	res.sendFile(__dirname+`\\src\\Graph.js`)
})
app.get('/Global',(req, res)=>{
	res.sendFile(__dirname+`\\src\\Global.js`)
})
app.get('/Mouse',(req, res)=>{
	res.sendFile(__dirname+`\\src\\Mouse.js`)
})

const PORT=8080
app.listen(PORT, ()=>{
	console.log(`lttp listening on port: ${PORT}\n`)
})
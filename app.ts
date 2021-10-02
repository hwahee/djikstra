import express from 'express'
import * as path from 'path'

const app=express()
app.use(express.static(path.join(__dirname, `public`)))
app.get('/',(req, res)=>{
	res.sendFile(path.join(__dirname,`index.html`))
})
// app.get('/Djikstra.js',(req, res)=>{
// 	res.sendFile(__dirname+`\\src\\Djikstra.js`)
// })
// app.get('/Canvas',(req, res)=>{
// 	res.sendFile(__dirname+`\\src\\Canvas.js`)
// })
// app.get('/Graph',(req, res)=>{
// 	res.sendFile(__dirname+`\\src\\Graph.js`)
// })
// app.get('/Global',(req, res)=>{
// 	res.sendFile(__dirname+`\\src\\Global.js`)
// })
// app.get('/Mouse',(req, res)=>{
// 	res.sendFile(__dirname+`\\src\\Mouse.js`) 
// })

const PORT=8080
app.listen(PORT, ()=>{
	console.log(`http listening on port: ${PORT}\n`)
})
import express from 'express'
import * as path from 'path'

const app=express()
app.use(express.static(path.join(__dirname, `public`)))
app.get('/',(req, res)=>{
	res.sendFile(path.join(__dirname,`src/html/Search.html`))
})
app.get('/djikstra',(req, res)=>{
	res.sendFile(path.join(__dirname,`src/html/Djikstra.html`))
})
app.get('/common',(req, res)=>{
	res.sendFile(path.join(__dirname,`src/html/Common.html`))
})

const PORT=3000
app.listen(PORT, ()=>{
	console.log(`http listening on port: ${PORT}\n`)
})
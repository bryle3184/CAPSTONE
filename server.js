
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()

dotenv.config()

const mongurl = process.env.MONGO_URL

mongoose.connect(mongurl).then(() => {console.log('Database connected')})

const schema1 = new mongoose.Schema({
    name: String,
    id: String,
    password: String
})

const schema2 = new mongoose.Schema({
    name: String,
    section: String,
    id: String,
    starttime: Date,
    endtime: Date,
})

const schema3 = new mongoose.Schema({
    name: String,
    quantity: Number
})

const schema4 = new mongoose.Schema({
    name: String,
    materials: Array
})

const schema5 = new mongoose.Schema({
    name: String,
    id: String,
    password: String
})

const model1 = mongoose.model('students', schema1)
const model2 = mongoose.model('schedules', schema2)
const model3 = mongoose.model('materials', schema3)
const model4 = mongoose.model('reservations', schema4)
const model5 = mongoose.model('faculties', schema5)

app.use(express.static('./src'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

let studentid,studentpass
let facultyid,facultypass

app.get('/api/materials.html', async(req, res) => {
    const data = await model3.find()

    res.json(data)
})

app.get('/error/login.html', async(req, res) => {
    const data = await model1.findOne({id:studentid, password:studentpass})

    if(data){
        res.json({msg:''})
        return
    }
    res.json({msg:'Invalid Input!'})
})

app.get('/error/login1.html', async(req, res) => {
    const data = await model5.findOne({id:facultyid,password:facultypass})

    if(data){
        res.json({msg:''})
        return
    }
    res.json({msg:'Invalid Input!'})
})

let starts,ends

app.get('/error/lessons.html', async(req, res) => {
    const data = await model2.findOne({starttime:{$lte: starts}, endtime:{$gte: ends}})

    if(!data){
        res.json({msg:''})
        return
    }
    res.json({msg:'Schedule Occupied'})
})

app.post('/login1.html', async(req, res) => {
    const {ID, password} = req.body
    facultyid = ID
    facultypass = password
    const data = await model5.findOne({id: ID, password: password})

    console.log(model5)
    if(data){
        console.log(data)
        return res.redirect('/faculty.html')
    }
    return
})

app.post('/login.html', async(req, res) => {
    const {ID, password} = req.body
    studentid = ID
    studentpass = password
    const data = await model1.findOne({id:`${ID}`, password:`${password}`})

    if(data){
        console.log(data)
        return res.redirect('/lessons.html')
    }
    return
})

app.post('/lessons.html', async(req, res) => {
    const {studentname, section, studentid, starttime, endtime} = req.body
    starts = new Date(starttime)
    ends = new Date(endtime)
    const occupied = await model2.findOne({starttime:{$lte: new Date(starttime)}, endtime:{$gte: new Date(endtime)}})

    console.log(occupied)

    if(!occupied){
        const data = await model2.insertMany({name:studentname, id:studentid, section:section, starttime: new Date(starttime), endtime: new Date(endtime)})
        console.log(data)

        const data1 = await model4.insertMany({name:studentname})
        console.log(data1)
        
        res.redirect('/materials.html')
        return
    }
    return
})

app.post('/materials.html', async(req, res) => {
    const {quantities} = req.body
    
    const data = await model4.updateOne({materials:{$size:0}},{materials:[
        {
            name: 'Compound Microscope',
            quantity:quantities[0]
        },
        {
            name:'Digital Microscope',
            quantity:quantities[1]
        },
        {
            name:'Dropper',
            quantity:quantities[2]
        },
        {
            name:'Dissection Tray',
            quantity:quantities[3]
        },
        {
            name:'Dissection Kit',
            quantity:quantities[4]
        },
        {
            name:'Glass Rod',
            quantity:quantities[5]
        },
        {
            name:'Glass Slide',
            quantity:quantities[6]
        },
        {
            name:'Pipet',
            quantity:quantities[7]
        },
        {
            name:'Forceps',
            quantity:quantities[8]
        },
        {
            name:'Scalpel',
            quantity:quantities[9]
        },
        {
            name:'Test Tube',
            quantity:quantities[10]
        },
        {
            name:'Test Tube Racks',
            quantity:quantities[11]
        },
        {
            name:'Beaker',
            quantity:quantities[12]
        },
        {
            name:'Erlenmeyer Flask',
            quantity:quantities[13]
        },
        {
            name:'Tongs',
            quantity:quantities[14]
        },
        {
            name:'Bunsen Burner',
            quantity:quantities[15]
        },
        {
            name:'Alcohol Lamp',
            quantity:quantities[16]
        },
        {
            name:'Meter Stick',
            quantity:quantities[17]
        },
        {
            name:'Stopwatch',
            quantity:quantities[18]
        }
    ]
    })
    console.log(data)
    res.redirect('/success.html')
})

let ids
let names
let sections

app.post('/faculty.html', async(req, res) => {
    const {ID, name, section} = req.body
    ids = ID
    names = name
    sections = section
    const data = await model2.findOne({id:ID, name:name, section:section})

    if(data){
        console.log(data)
        return res.redirect('/infos.html')
    }
    return res.send('This student has no reservation yet! <a href="/faculty.html">Return to home</a>')
})

app.get('/api/infos.html', async(req, res) => {
    const data = await model2.find({name:names, id:ids, section:sections})
    
    res.json(data)
})

app.listen(5000, () => {
    console.log('Server Ready! port:5000')
})

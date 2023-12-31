// const fs = require('fs');
// const callmethod = require('./extend.js');
// fs.writeFileSync('note.txt', 'this is created by node.js')
// callmethod.data.walk();

// const express = require('express');
// const app = express()
// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost/EmployeeDB';

// app.get('/',(req, res)=>{
//     res.send("hello")
// })

// app.route('/Employeeid').get(function(req,res){
//     MongoClient.connect(url, function(err, db){
//         const cursor = db.collection('Employee').find()
//     })
// })

// app.listen(5000)

// const arr = ["aefae", "mgmg", "kyaw kyaw"]

// arr.forEach((data)=>{
//     console.log(data)
// })

// var request = require("request");
// request("http://www.google.com",function(error,response,body)
// {
// console.log(body);
// });

// const fs = require('fs');
// const myReadableStream = fs.createReadStream('text.txt','utf-8')
// const myWrittenStream = fs.createWriteStream('new.txt', 'utf-8')
// myReadableStream.on('data', function(chunk){
//     myReadableStream.pipe(myWrittenStream)
// })

// const fs = require('fs');
// const http = require('http');
// const obj = {
//     name: 'lonely',
//     age: '34',
//     genre: {
//         superpower: true,
//         visibility: true,
//     }
// }

// const myReadableStream = fs.createReadStream('text.txt', 'utf-8');
// const server = http.createServer(function(req, res){
//     // myReadableStream.
//     res.writeHead(200, {'Content_Type': 'text/json'})
//     res.end(req.url)
// })

// server.listen(3000, function(){
//     console.log('server running')
// })

const express = require('express');
const fs = require('fs')
const app = express();
const http = require('http');
const path = require('path');
const url = require('url');
const io = require('socket.io')(http);
const colors = require('colors/safe');
const morgan = require('morgan')
// const routes = require('route')

const fruitsData = require('./data');
const { error } = require('console');

const port = 3000;

let routes = {
    "GET": () => {
        console.log("Getmethod")
    },
    "POST": () => {
        console.log("Post method")
    }
};

let start = (req, res) => {
    routes[req.method]();
    res.writeHead(200, {
        'Content_Type': 'text/json',
        'Origins': '*'
    })
}
// app.get('/', function(req, res){
//     res.send('Hello');
// })

// app.get('/contact', function(req, res){
//     res.send('Hello contact is here')
// })
const server = http.createServer(start)
const data = fs.readFileSync(`${__dirname}/tours.json`);
const tours = JSON.parse(data);

app.use(express.static("wwwroot"))
app.use(express.json());
app.use(morgan("dev"))
// app.use(routes)
app.use(express.static(path.join(__dirname, 'wwwroot/styles.css')))

const reqTime = require('./middlewares/requestTime');
const userRouter = require('./routers/userRoute');



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot/index.html'))
})

app.get('/home', (req, res) => {
    res.send(tours)
})

app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + "/" + "wwwroot/style.css");
});


app.get('/activities', (req, res, next) => {
    res.end('adf')
})

app.get('/home/fruits', (req, res) => {
    let filter = url.parse(req.url, true)
    // showData = 
    try {
        res.end(JSON.stringify(fruitsData.data[filter.query.id]))
    } catch (e) {
        res.end('Error')
    }
})

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours,
        },
    });
});

// app.get("/api/v1/tours/:id/:price?", getSingleTourById)

const getTours = (req, res) => {
    const newId = tours.length;
    const newTour = Object.assign(req.body, { id: newId });
    tours.push(newTour);
    console.log(tours.length)
    fs.writeFileSync('./tours.json',
        JSON.stringify(tours), (error) => {
            if (error) {
                res.status(300).json({ message: "An Error Occured" })
            } else {
                res.status(201).json({ message: "success" })
            }
        }
    )
    res.status(201).json({ message: "success" })
}

const getSingleTourById = (req, res) => {
    var result;
    console.log(req.params.price, '//')
    if (req.params.price === null || req.params.price === undefined) {
        result = tours.find(i =>
            tours.indexOf(i) == req.params.id
        )
    } else {
        result = tours.find(i => tours.indexOf(i) == req.params.id && i.price.toString()[0] === req.params.price.toString()[0])
        if (result === null || result === undefined) {
            result = []
        }
    }
    res.status(200).json({
        status: "success",
        data: result,
    });
}

app.route("/api/v1/tours/:id/:price?").get(getSingleTourById)
// app.route("/api/v1/tours").get(getTours)


app.use(reqTime)

app.use("/api/v1", userRouter)

// app.route("/api/v1/users").get(getUsers).post(addUsers)
// app.route("/api/v1/users/:id").patch(editUser).delete(deleteUsers)
// app.route("/api/v1/sign-in").post(siginIn)



io.on('connection', (socket) => {
    console.log('some users are conneting')
})


app.listen(port, () => {
    console.log(colors.green((`<<<<<<<<<<-- Server running on port ${port} -->>>>>>>>>`)))
})


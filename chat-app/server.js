const dotenv = require("dotenv")
dotenv.config()
var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var mongoose = require("mongoose")
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const uri = process.env.ENV_MONGO_URL
var Message = mongoose.model("Message", {
  name: String,
  message: String,
})

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
})

app.get("/messages/:user", (req, res) => {
  var user = req.params.user
  Message.find({ name: user }, (err, messages) => {
    res.send(messages)
  })
})

app.post("/messages", async (req, res) => {
  try {
    var message = new Message(req.body)
    var savedMessage = await message.save()
    console.log("first saved", savedMessage)

    var censoredWord = await Message.findOne({ message: "badword" })

    if (censoredWord) {
      await Message.deleteOne({ _id: censoredWord.id })
    } else {
      io.emit("message", req.body)
    }
    res.sendStatus(200)
  } catch (err) {
    if (err) res.sendStatus(500)
  }
})

io.on("connection", (socket) => console.log("first user connected"))

mongoose.connect(uri, (err) => {
  console.log("first mongodb connection error", err)
})

var server = http.listen(3000, () => {
  console.log("Server is listening on", server.address().port)
})

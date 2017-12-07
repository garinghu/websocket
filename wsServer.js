var ws = require("nodejs-websocket")
var PORT = 8080;

var clientCount = 0;



// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    clientCount++
    conn.nickname = 'user' + clientCount;
    var mes = {}
    mes.type = "enter"
    mes.data = conn.nickname + 'comes in'
    broadcast(JSON.stringify(mes))
	conn.on("text", function (str) {
        console.log("Received "+str)
        var mes = {}
        mes.type = "message"
        mes.data = conn.nickname + str
		broadcast(JSON.stringify(mes))
	})
	conn.on("close", function (code, reason) {
        console.log("Connection closed")
        var mes = {}
        mes.type = "leave"
        mes.data = conn.nickname + 'leaves'
		broadcast(JSON.stringify(mes))
    })
    
    conn.on("error", function (err) {
        console.log("handle err")
        console.log(err);
    })
}).listen(PORT)
function broadcast (str) {
    //保存server下的所有连接
    server.connections.forEach(function (connection) {
        connection.send(str)
    })
}
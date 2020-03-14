const findPair = require("./methods/findpair.js")

module.exports = function (server) {
    const io = require('socket.io')(server)
    console.log(server)
    console.log(io)
    var sockets = {}
    var readySockets = {}
    io.on('connection', socket => {
        // 连接客户端

        //配对状态

        // 登录后放入scokets中缓存
        sockets[socket.id] = socket

        console.log("连接---(" + socket.id + ")" + Date())

        socket.on('disconnect', function () {
            // 客户端连接断开
            if (!socket || !socket.userInfo) {
                return;
            }
            console.log("***断开连接--(" + socket.id + "-" + socket.userInfo.userName + ")" + Date())
            if (socket.paired && sockets[socket.pair_socket_id]) {
                // 如果已经配对且对象还没下线
                // 通知对方配对对象下线
                sockets[socket.pair_socket_id].paired = false;
                sockets[socket.pair_socket_id].emit("pairagain")
            }
            delete sockets[socket.id]
            delete readySockets[socket.id]
            console.log(sockets)
        })
        socket.on('pair', userInfo => {

            // let old_socket = sockets[userId]

            //业务需求不需要
            // if (old_socket && old_socket !== socket) {
            //     // 检测同一账号是否重复登陆
            //     old_socket.emit('logout')
            //     old_socket.disconnect()
            //     console.log(old_socket.id + '-强制下线-' + Date())
            // }
            //用户名
            // 设定配对状态
            let pair_socket = sockets[socket.pair_socket_id]
            if (socket.paired && pair_socket && pair_socket.paired && pair_socket.pair_socket_id === socket.id) {
                // 如果说这个B已经配对了还tm想换一个，通知对方
                pair_socket.emit("pairagain")

            }
            socket.userInfo = userInfo
            socket.paired = false;
            socket.pair_socket_id = null;
            console.log("请求配对---(" + socket.id + "-" + socket.userInfo.userName + ")" + Date())
            // 为新用户配对
            let result = findPair(socket, readySockets)
            if (result === null) {
                //如果没找到合适的配对，就放进等待区域

                readySockets[socket.id] = socket
                console.log("等待区域新增---(" + socket.id + "-" + userInfo.userName + ")" + Date())
                console.log("此时等待区域:")
                console.log(readySockets)
            } else {

                console.log("配对成功---(" + socket.id + result.id + ")" + Date())
                result.emit("acceptPair", socket.userInfo)
                socket.emit("acceptPair", result.userInfo)
                console.log("此时等待区域:")
                console.log(readySockets)
            }
        })

        // 接收信息
        socket.on('chat', msg => {
            if (!socket.paired) {
                // 如果没配对
                // 防止意外情况
                return
            }
            let message = {
                id: Date(),
                username: socket.userInfo.userName,
                Message: msg,
                me: true
            }
            console.log(msg)
            socket.emit("chat", message)
            pair_socket = sockets[socket.pair_socket_id]
            message.me = false
            pair_socket.emit("chat", message)
        })
    })
}
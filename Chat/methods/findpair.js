module.exports = function (socket, readySockets) {

    if (socket.userInfo.findSex === "不限") {
        //不限定查找配对
        for (let id in readySockets) {
            if (readySockets[id].userInfo.findSex === "不限" || socket.userInfo.selfSex === readySockets[id].userInfo.findSex) {
                // 不限定，并且符合对方条件的
                // 符合匹配条件
                //修改socket状态
                socket.pair_socket_id = id
                socket.paired = true;

                let paired_socket = readySockets[id]
                paired_socket.pair_socket_id = socket.id;
                paired_socket.paired = true
                //将等待区的socket删除
                delete readySockets[id]
                return paired_socket
            }
        }
    } else {
        for (let id in readySockets) {
            // 限定查找配对
            if (socket.userInfo.findSex === readySockets[id].userInfo.selfSex) {
                // 对方符合我的条件
                if (readySockets[id].userInfo.findSex === "不限" || readySockets[id].userInfo.findSex === socket.userInfo.selfSex) {
                    // 我符合对方条件
                    socket.pair_socket_id = id
                    socket.paired = true;

                    let paired_socket = readySockets[id]
                    paired_socket.pair_socket_id = socket.id;
                    paired_socket.paired = true
                    //将等待区的socket删除
                    delete readySockets[id]
                    return paired_socket
                }
            }
        }
    }

    return null
}
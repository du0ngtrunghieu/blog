module.exports = (io)=>{
    var test=[]
     io.on('connection', function (socket) {
            console.log('Có thành viên kết nối');
          
            socket.on("comment",(data)=>{
                socket.emit('send_comment',data)
                socket.broadcast.emit('send_comment',data)
            })
            socket.on("disconnect",function (socket) {
                console.log("đã có thành viên ngắt kết nối");
                
              })
            
           
   
        
     });
}
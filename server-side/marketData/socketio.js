const { Server } = require('socket.io');


let io;

async function setIOValue() {
  try{
    console.log("socket running.")
    io = new Server(9000, {
      cors: {
        origin: 'http://localhost:3000',
        //  origin: "http://3.110.187.5/",
        methods: ['GET', 'POST', 'PATCH'],
      }
  
    });
  } catch(err){
    console.log(err)
  }

}

function getIOValue(){
  return io;
}



module.exports = {setIOValue, getIOValue}

// module.exports = io;


// 

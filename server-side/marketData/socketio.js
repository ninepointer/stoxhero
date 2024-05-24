const { Server } = require("socket.io");

let io;

async function setIOValue() {
  try {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://staging.stoxhero.com",
      "https://stoxhero.com",
      "https://www.stoxhero.com",
      "https://stoxhero-next-ts.vercel.app",
      "https://www.stoxhero-next-ts.vercel.app",
      "http://43.204.7.180",
    ];

    io = new Server(9000, {
      cors: {
        origin: allowedOrigins,
        //  origin: "http://3.110.187.5/",
        methods: ["GET", "POST", "PATCH"],
      },
    });
  } catch (err) {
    console.log(err);
  }
}

function getIOValue() {
  return io;
}

module.exports = { setIOValue, getIOValue };

// module.exports = io;

//

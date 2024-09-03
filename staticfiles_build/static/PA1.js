const websocketcn = {
  create0: () => new Promise((resolve, reject) => {
    const socket = new WebSocket('chat/');
    socket.onopen = function (event) {
      const message = {
        'message': 'Hello, world!'
      };
      socket.send(JSON.stringify(message));
    }
    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
    }
  })
}

const seecn= {
    create1: () => new Promise((resolve, reject) => {
      const source = new EventSource('source/');
      const timeout = window.setTimeout(() => {
        resolve(source);
      }, 200);
      source.onopen = function (){
        console.log("connecting");
      }
      source.onmessage = function (e){
        console.log(e.data);
      }
      source.onerror = () => {
        source.close();
        clearTimeout(timeout);
        reject(new Error("EventSource failed"));
      };
    }),
};

const webworkercn = {
  create2: () => new Promise((resolve, reject) =>{
    const wk = new Worker('../static/worker.js');
  })
}

//const resources = new Set();
const {create0} = websocketcn;
const {create1} = seecn;
const {create2} = webworkercn;

const sleep = (ms) =>{
  return new Promise(resolve => setTimeout(resolve,ms));
};


function test(model){
  const n = document.getElementById('numberInput').value;
  if(n >= 0 && n <= 2000){
    if (model === '0'){
      for (let i=0; i<n; i++){
        create0();
      }
    } else if (model === '1'){
      for (let i=0; i<n; i++){
        create1();
      }
    } else if (model === '2'){
      for (let i=0; i<n; i++){
        create2();
      }
    }
  }else {
    alert('Please enter a number between 0 and 2000.');
  }
}


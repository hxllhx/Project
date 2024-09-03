const seecn= {
    create: () => new Promise((resolve, reject) => {
      const source = new EventSource('source/');
      const timeout = window.setTimeout(() => {
        resolve(source);
      }, 200);
      source.onopen = function (){
        console.log("connection");
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
    alive: (source) =>
      source.readyState === EventSource.CONNECTING || source.readyState === EventSource.OPEN,
    destroy: (source) => source.close(),
    constants: {
      Chrome: {
        listSize: 5,
        maxSlots: 1350,
        maxValue: 128,
        pulseMs: 1000,
        negotiateMs: 2000,
      },
      Edge: {
        listSize: 5,
        maxSlots: 1350,
        maxValue: 128,
        pulseMs: 1000,
        negotiateMs: 2000,
      },
      Safari: {
        listSize: 5,
        maxSlots: 512,
        maxValue: 128,
        pulseMs: 1400,
      }
    }
  };

const resources = new Set();
const { create, destroy, alive, constants } = seecn;
// const k = constants["Chrome"];
// const kNumBits = k.listSize * Math.log(k.maxValue) / Math.log(2);
const trace = [];

const capture = () => {
  trace.push([Date.now(), resources.size]);
  console.log('resources.size',resources.size);
};

const cleandead = async () => {
  // const t1 = Date.now();
  if (alive) {
    //console.log("alive exists");
    const deadResources = [...resources].filter(r => !alive(r));
    const destroyPromises = deadResources.map(r => {
      console.log('kill:',r)
      resources.delete(r);
      return destroy(r);
    });
    //console.log(destroyPromises);
    await Promise.allSettled(destroyPromises);
  }
  // const t2 = Date.now();
  // console.log("sweep", t2 - t1);
};

const consume = async (n) => {
  capture();
  // const nStart = resources.size;
  const promises = [];
  for (let i = 0; i < n; i++) {
    promises.push(create());
  }
  for (const result of await Promise.allSettled(promises)) {
    if (result.status === "fulfilled") {
      resources.add(result.value);
      console.log('yes',result);
    } else {
      console.log('failed???',result);
      return result;
    }
  }
  await cleandead();
  capture();
  // return resources.size - nStart;
};

// Release up to max resource slots and return number released.
const release = async (n) => {
  capture();
  if (n === 0) {
    return 0;
  }
  const numberToRelease = Math.min(n, resources.size);
  const destroyPromises = [];
  for (let i = 0; i < numberToRelease; i++) {
    const resource = resources.values().next().value;
    destroyPromises.push(destroy(resource));
    resources.delete(resource);
    capture();
  }
  await Promise.all(destroyPromises);
  await cleandead();
  return numberToRelease;
};

const sleep = (ms) =>{
  return new Promise(resolve => setTimeout(resolve,ms));
};

async function receivems(){
    const messages = "";
    const Asciims = [];
    await consume(constants.Chrome.maxSlots-126);
    await sleep(10)
      try{
        const result = await consume(127);
        await sleep(10);
        if (result.status === "rejected"){
          throw new Erroe('full');
        }
      } catch (error){
        Asciims.push(await release(resources.size));
        console.log('save number',error)
      }
    Asciims.push(await release(resources.size));
    console.log(resources.size);
    console.log(Asciims);
}

document.addEventListener('DOMContentLoaded',async ()=>{
    try{const result = await receivems();
    }catch (error){
        console.error(error);
    }
})
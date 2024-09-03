self.postMessage('ms');
self.onmessage = (e) => {
  if (e.data === "close") {
    close();
  }
};
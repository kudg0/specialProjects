window.addEventListener("message", (e) => {
  if(e.data.debugger === "true"){
    let debugMessage = e.data.message;
    console.log(debugMessage);
  }
});

function listener(event) {
  let data = event.data;


  if(event.data.finish == null){
    window.data__finish = false;
  } else {
    window.data__finish = event.data.finish
  }
if(data.promoTest === "true"){
    gaPushEvent(`${data.event}`,`${data.cat}`,`${data.label}`,`${data.interaction}`);
  }
}

if (window.addEventListener) {
  window.addEventListener("message", listener);
} else {
  // IE8
  window.attachEvent("onmessage", listener);
}
if(document.readyState == "complete"){
  expPopupOnInit();
} else {
  window.addEventListener("load", (e) =>{
    expPopupOnInit();
  })
}


function expPopupOnInit(){
  if(window['spec__properties']){
    if(spec__properties.experiments.adblockPopup.on){
      expPopupOn();
    } else{
      window.addEventListener("specProperiesChanged", (e) => {
        if(spec__properties.experiments.adblockPopup.on){
          expPopupOn();
        }
      });
    }
  }
  else{
    window.addEventListener("specScriptInit", (e) =>{
      if(spec__properties.experiments.adblockPopup.on){
        expPopupOn();
      } else{
        window.addEventListener("specProperiesChanged", (e) => {
          if(spec__properties.experiments.adblockPopup.on){
            expPopupOn();
          }
        });
      }
    });
  }
}


function expPopupOn() {



}
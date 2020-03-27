if(document.readyState == "interactive"){
  expOverlayOnInit();
} else {
  window.addEventListener("DOMContentLoaded", (e) =>{
    expOverlayOnInit();
  })
}


function expOverlayOnInit(){
  if(window['spec__properties']){
    if(spec__properties.experiments.overlay.on){
      expOverlayOn();
    } else{
      window.addEventListener("specProperiesChanged", (e) => {
        if(spec__properties.experiments.overlay.on){
          expOverlayOn();
        }
      });
    }
  }
  else{
    window.addEventListener("specScriptInit", (e) =>{
      if(spec__properties.experiments.overlay.on){
        expOverlayOn();
      } else{
        window.addEventListener("specProperiesChanged", (e) => {
          if(spec__properties.experiments.overlay.on){
            expOverlayOn();
          }
        });
      }
    });
  }
}



function expOverlayOn() {
  let event__expOverlay__init = new Event("specPageOverlayInit", {bubbles: true});
  spec__properties.experiments.overlay.stateNow = "init";


  let page__overlay = document.createElement("div");

  page__overlay.classList.add("spec__mainOverlay", "active");
  spec__properties.body.appendChild(page__overlay);



  specAddFile( "link", spec__properties.head, "experiments/general/styles/overlay.css")


  
  spec__properties.experiments.overlay.stateNow = "complete";
  window.dispatchEvent(event__expOverlay__init);
}

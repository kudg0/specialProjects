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


  if(exp__overlay === undefined){
    window.exp__overlay = false;
  }


  if(exp__overlay){
    let page__overlay = document.createElement("div");

    page__overlay.classList.add("spec__mainOverlay", "active");

    spec__body.appendChild(page__overlay);



    let style = document.createElement("link");

    style.href = "https://lamcdn.net/specials.lookatme.ru/0000000001/banners/system/specials/experiments/general/styles/overlay.css";
    style.rel = "stylesheet";
    style.media = "all";

    spec__head.appendChild(style);

    window.dispatchEvent(event__expOverlay__init);
    
    spec__properties.experiments.overlay.stateNow = "complete";
  }
}

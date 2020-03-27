if(document.readyState == "complete"){
  explinkReverserOnInit();
} else {
  window.addEventListener("load", (e) =>{
    explinkReverserOnInit();
  })
}


function explinkReverserOnInit(){
  if(spec__properties.isAdBlock && spec__properties.isPost){
    if(spec__properties.experiments.linkReverser.on){
      linkReverserOn();
    } else{
      window.addEventListener("specProperiesChanged", (e) => {
        if(spec__properties.experiments.linkReverser.on){
          linkReverserOn();
        }
      });
    }
  }
}





function linkReverserOn(){
  spec__properties.experiments.linkReverser.stateNow = "init";

  let links_spec_reverser = spec__properties.postHolder.querySelectorAll("a"),
      buttons_spec_reverser = spec__properties.postHolder.querySelectorAll("button");


  links_spec_reverser.forEach((link) => {

    if(link.dataset.altlink) link.href = link.dataset.altlink;

  });

  buttons_spec_reverser.forEach((button) => {

    if(button.dataset.altlink && button.dataset.link) button.dataset.link = button.dataset.altlink;

  });

  spec__properties.experiments.linkReverser.stateNow = "complete";
}
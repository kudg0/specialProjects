if(document.readyState == "complete"){
  expPopupOnInit();
} else {
  window.addEventListener("load", (e) =>{
    expPopupOnInit();
  })
}


function expPopupOnInit(){
  if(spec__properties.isAdBlock && spec__properties.isSpecial){
    if(spec__properties.experiments.adblockPopup.on){
      if(spec__properties.experiments.overlay.stateNow == "complete"){
        expPopupOn();
      } else {
        window.addEventListener("specProperiesChanged", (e) => {
          if(spec__properties.experiments.overlay.stateNow == "complete"){
            expPopupOn();
          }
        });
      } 
    }
  }
}


function expPopupOn() {
  try{
    spec__properties.experiments.adblockPopup.stateNow = "init";

    let page__overlay = document.querySelector(".spec__mainOverlay");

    specAddFile("link", spec__properties.head, "experiments/2020/popup/css/style.css")


    if(spec__properties.experiments.articleReaded.stateNow == "reading"){
      showPopup()
    } else {
      window.addEventListener("startReading", () => {
        showPopup()
      });
    }


    function showPopup(){
      

      let popup = document.createElement("div");

      popup.classList.add("spec__popup");
      popup.innerHTML = `<div class="popup__wrapper">
        <div class="popup__close">
          <div class="close__overlay"></div>
        </div>
        <div class="popup__inner">
          <div class="popup--title">Кажется, у&nbsp;вас включен AdBlock 😵 🚧</div>
          <div class="popup--subtitle">
            Чтобы ссылки в&nbsp;посте работали, необходимо<br />
            убрать наш сайт из&nbsp;списка блокировки рекламы<br />
            или выключить расширение 🚀
          </div>
        </div>
      </div>`;

      page__overlay.appendChild(popup);



      page__overlay.classList.add("detected");
      popup.classList.add("spec__popup_on");

      

      gtag('event', 'adBlockPopup Open', {
        'event_category': "specials"
      });
      spec__properties.experiments.adblockPopup.stateNow = "open";



      let popup__close = document.querySelector(".popup__close");

      
      popup__close.addEventListener("click", (e) =>{
        popup.classList.add("spec__popup_off");


        gtag('event', 'adBlockPopup Closed', {
          'event_category': "specials"
        });
        spec__properties.experiments.adblockPopup.stateNow = "closed";


        setTimeout(() => {
          page__overlay.classList.remove("detected");
        }, 1500);
      });
    }
  } catch(e) {
    window.postMessage({
      debugger: "true",
      message: `Error in adBlockPopup: ${e}`
    });
  }
}
window.addEventListener("endCalcTimeForReading", () =>{
  try{
    if(isSpecial && isAdblock){
      adBlockPopupOpen();
    }
  } catch (e){
    console.log(e);
  }

  function adBlockPopupOpen(){
    try{
      let page__overlay = document.querySelector(".spec__mainOverlay");


      let style = document.createElement("link");

      style.href = "https://lamcdn.net/specials.lookatme.ru/0000000001/banners/system/specials/experiments/2020/popup/css/style.css";
      style.rel = "stylesheet";
      style.media = "all";

      spec__head.appendChild(style);


      window.addEventListener("startReading", () =>{

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
        



        let popup__close = document.querySelector(".popup__close");

        
        popup__close.addEventListener("click", (e) =>{
          popup.classList.add("spec__popup_off");

          gtag('event', 'adBlockPopup Closed', {
            'event_category': "specials"
          });
          setTimeout(() => {
            page__overlay.classList.remove("detected");
          }, 1500);
        });
      });
    } catch(e) {
      console.log(e);
    }
  }
});

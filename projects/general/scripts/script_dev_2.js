if (window.addEventListener) {
  let event__general__init = new Event("specScriptInit", {bubbles: true});

  if((document.readyState == "interactive") || (document.readyState == "complete")){
    specInit();
  } else{
    window.addEventListener("DOMContentLoaded", () => {
      specInit();
    })
  }

  function specInit(){
    //Задаем глобальный объект со всеми стэйтами и переменными 
    window.spec__properties = {
      body: document.querySelector("body"),
      head: document.querySelector("head"),
      site: window.location.host,
      postHolder: false,
      isAdBlock: (window['canRunAds'] === undefined),
      isPost: Boolean(document.querySelector(".article-text")) || Boolean(document.querySelector(".content")),
      isSpecial: window.location.href.includes("specials") || Boolean(document.querySelector(".s-label")),
      isMobile: Boolean(mobileCheck()),
      experiments:{
        on: true,
        articleReaded:{
          on: true,
          state: false,
          get stateNow(){
            return this.state
          },
          set stateNow(stateNow){
            this.state = stateNow;
            this.update(this.state);
          },
          update() {
            window.dispatchEvent(spec__properties.eventChangeParam);
          }
        },
        overlay:{
          on: true,
          state: false,
          get stateNow(){
            return this.state
          },
          set stateNow(stateNow){
            this.state = stateNow;
            this.update(this.state);
          },
          update() {
            window.dispatchEvent(spec__properties.eventChangeParam);
          }
        },
        adblockPopup:{
          on: true,
          state: false,
          get stateNow(){
            return this.state
          },
          set stateNow(stateNow){
            this.state = stateNow;
            this.update(this.state);
          },
          update() {
            window.dispatchEvent(spec__properties.eventChangeParam);
          }
        },
        linkReverser:{
          on: true,
          state: false,
          get stateNow(){
            return this.state
          },
          set stateNow(stateNow){
            this.state = stateNow;
            this.update(this.state);
          },
          update() {
            window.dispatchEvent(spec__properties.eventChangeParam);
          }
        },
        linkParametr:{
          on: true,
          state: false,
          get stateNow(){
            return this.state
          },
          set stateNow(stateNow){
            this.state = stateNow;
            this.update(this.state);
          },
          update() {
            window.dispatchEvent(spec__properties.eventChangeParam);
          }
        },
        preloader:{
          on: true,
          state: false,
          get stateNow(){
            return this.state
          },
          set stateNow(stateNow){
            this.state = stateNow;
            this.update(this.state);
          },
          update() {
            window.dispatchEvent(spec__properties.eventChangeParam);
          }
        }
      },
      eventChangeParam: new Event("specProperiesChanged", {bubbles: true}),
    }
    //*OVER*

    //



    if(window.location.origin.includes("wonderzine")){
      spec__properties.site = "wonderzine";
      spec__properties.postHolder = document.querySelector(".article-text");
    }
    if(window.location.origin.includes("the-village")){
      spec__properties.site = "village";
      spec__properties.postHolder = document.querySelector(".article-text");
    }
    if(window.location.origin.includes("spletnik")){
      spec__properties.site = "spletnik";
      spec__properties.postHolder = document.querySelector(".content");
    }



    //подключение дебаггера
    specAddFile("script", spec__properties.body, "https://lamcdn.net/specials.lookatme.ru/0000000001/banners/system/specials_react/projects/general/scripts/specDebugger.js");



    //структура сообщения для дебаггера 
    /*
    {
      debugger: "true",
      message: "hello"
    }
    */



    //подключение react
    let spec__reactAdded = 0;
    let links = ["https://unpkg.com/react-dom@16/umd/react-dom.development.js", "https://unpkg.com/react@16/umd/react.development.js"];
    links.forEach((link) =>{
      specAddFile("script", spec__properties.body, link)
        .then((e) => {
          if(e == true){
            spec__reactAdded++;
          }
          if(e == false){
            throw new Error(`скрипт не покдлючился ${e}`);
          }

          if(spec__reactAdded == links.length){
            spec__reactAdded = true;

            // specAddFile("script", spec__properties.body, "projects/general/scripts/postComponent.js")
          }
        })
        .catch((e) =>{
          window.postMessage({
            debugger: "true",
            message: `Error than add react: ${e}.`
          });
        });
    });
    //END




    








    //Возращает true, когда файл подключен и false, када нет
    window.specAddFile = async function(addFile_atr, addFile_place, addFile_link){
      let cretedElem = document.createElement(addFile_atr);


      switch(addFile_atr){

        case "script":
          cretedElem.type = "text/javascript";
          cretedElem.charset = "UTF-8";
          cretedElem.src = addFile_link;
        break;

        case "link":
          cretedElem.href = addFile_link;
          cretedElem.rel = "stylesheet";
          cretedElem.media = "all";
        break;

        default: 
        //Жалуемся дебагеру на ошибку
          window.postMessage({
            debugger: "true",
            message: `Error in specAddFile(). GetParams(link: ${addFile_link}, attr: ${addFile_atr}, place: ${addFile_place})`
          });
        break;
        //END
      }
      let elem = addFile_place.appendChild(cretedElem);


      let promise = new Promise((resolve, reject) => {
        let timer = setTimeout(() =>{
          resolve(false);
        },10000);

        elem.addEventListener("load", (e) =>{
          clearTimeout(timer);

          resolve(true);
        });
      });


      let result = await promise;


      return result;
    }
    //END


    function mobileCheck() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }

    window.dispatchEvent(event__general__init);
    spec__properties.pageState
  }
}
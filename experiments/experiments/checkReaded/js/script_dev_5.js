if(document.readyState == "complete"){
  expPageReadedOnInit();
} else {
  window.addEventListener("load", (e) =>{
    expPageReadedOnInit();
  })
}


function expPageReadedOnInit(){
  if(spec__properties.experiments.articleReaded.on){
    expPageReadedOn();
  } else{
    window.addEventListener("specProperiesChanged", (e) => {
      if(spec__properties.experiments.articleReaded.on){
        expPageReadedOn();
      }
    });
  }
}



function expPageReadedOn() {
  try{
    let event__reading_start = new Event("startReading", {bubbles: true}),
        event__reading_end = new Event("endReading", {bubbles: true}),
        event__scroll_end = new Event("endScrolling", {bubbles: true}),
        event__time_end = new Event("endTime", {bubbles: true}),
        event__timeCalc = new Event("endCalcTimeForReading", {bubbles: true}); 


    let counter_arr_text = "";

    let counterOfText = 0, counterOfImg = 0, coord_end = 0,
        hint__start_pos = [], hint__end_pos = [];

    window.gaScrollY = 0;


    //КЛОНИРУЕМ КОНТЕЙНЕР ПОСТА, ДЛЯ ПОДСЧЕТА СИМВОЛОВ И КАРТИНОК
    

    let page__holder_childs = spec__properties.postHolder.cloneNode(true),
        page__holder;



    page__holder_childs.style.display = "none";
    page__holder_childs.classList.add("elem_clone");

    document.querySelector("body").appendChild(page__holder_childs);
    //КОНЕЦ


    page__holder_childs = document.querySelectorAll("body .elem_clone *");


    //ПРОХОДИМСЯ ПО СКЛОНИРОВАННОМУ КОНТЕЙНЕРУ ПОСТА, УДАЛЯЕМ СКРИПТЫ, СТАЙЛЫ, АЙФРЭЙМЫ И СВГ. 
    //Остается только текст, который дальше мы будем считать
    page__holder_childs.forEach((element) => {
      let tagName = element.tagName.toLowerCase();

      if (['style', 'script', 'noscript','iframe','svg'].indexOf(tagName) != -1 ){
        element.parentNode.removeChild(element);
      } else if(spec__properties.isMobile && element.classList.contains("stk-mobile-hidden")) {
        //Скрытые элементы сетки для мобилки тоже удаляем
        element.parentNode.removeChild(element);          
      } else if(!spec__properties.isMobile && element.classList.contains("stk-desktop-hidden")) {
        //Скрытые элементы сетки для десктопа тоже удаляем
        element.parentNode.removeChild(element);          
      } else if(element.id.includes("adfox")) {
        //Скрытые элементы сетки для десктопа тоже удаляем
        element.parentNode.removeChild(element);          
      } else if(tagName == "img"){
        //cчитаем картинки
        counterOfImg++;
      }
    });
    //КОНЕЦ


    page__holder = document.querySelector("body .elem_clone");


    counter_arr_text = page__holder.textContent;

    //УДАЛЯЕМ КОНТЕЙНЕР СКЛОНИРОВАННЫЙ ДЛЯ ПОДСЧЕТА 
    page__holder.parentNode.removeChild(page__holder);
    //КОНЕЦ

    //УДАЛЯЕМ ПРОБЕЛЫ И ПЕРЕНОСЫ ИЗ ГОТОВОГО ТЕКСТА
    counter_arr_text = counter_arr_text.replace(/\s{2,}?\n\r/g, '');
    //КОНЕЦ

    

    // ПРОВЕРЯЕМ НЕ ПОПАЛИ ЛИ КОММЕНТАРИИ В ОБЩИЙ ТЕКСТ
    if( counter_arr_text.includes("<!--") && counter_arr_text.includes("-->") ){
      searchIncluds(counter_arr_text, "<!--", hint__start_pos);
      searchIncluds(counter_arr_text, "-->", hint__end_pos);
    }
    // КОНЕЦ



    // ЕСЛИ ПОПАЛИ, ТО УДАЛЯЕМ
    if(hint__start_pos){
      hint__start_pos.forEach((elem) => {
        let testStr = "";

        testStr += counter_arr_text.slice(0 ,elem + 1);
        testStr += counter_arr_text.slice(hint__end_pos[hint__start_pos.indexOf(elem)] + 1 ,counter_arr_text.lenght + 1);

        counter_arr_text = testStr;
      })
    }
    // КОНЕЦ


    // ПЕРЕНОСИМ КОЛ-ВО СИМВОЛОВ В ПЕРЕМЕННЫЕ
    counterOfText = counter_arr_text.length;
    // КОНЕЦ


    // СЧИТАЕМ ВРЕМЯ НА ПРОЧТЕНИЕ ПО ФОРМУЛЕ: (КОЛ-ВО СИМВОЛОВ/60) + (КОЛ-ВО КАРТИНОК*5) = ВРЕМЯ В СЕКУНДАХ НА ПРОЧТЕНИЕ

    let timeForReading = Math.round(( (counterOfText / 60) + (counterOfImg * 2) ));
    let otherTimeForReading = Math.round(( ( (counter_arr_text.split(/[^0-9a-zA-Zа-яА-Я]/).filter(Boolean).length / 250) * 60) + (counterOfImg * 2) )) ;
    
    spec__properties.experiments.articleReaded.stateNow = "init";
    
    window.dispatchEvent(event__timeCalc);

    // console.log("Время на прочтение: ", timeForReading);
    // console.log("Время на прочтение (по новой формуле): ", otherTimeForReading);

    //КОНЕЦ 


    //ЗАВОДИМ ПЕРЕМЕННЫЕ ФЛАГИ НА ПРОВЕРКУ ПРОЧТЕНИЯ и ПРОХОЖДЕНИЕ ВРЕМЕНИ 
    let timeForReading_end = false, pageReaded = false;
    //КОНЕЦ 


    //СОЗДАЕМ ПЕРЕМЕННУЮ КОНТЕЙНЕР СТРАНИЦЫ
    let gaBody = spec__properties.postHolder;
    coord_end = getBottomCoords(gaBody)*0.95;
    //КОНЕЦ


    //НА ИЗМЕНЕНИЕ РЕСАЙЗ, СКРОЛЛ И ИЗМЕНЕНИЕ ОРИЕНТАЦИИ – ПЕРЕСЧИТЫВАЕМ КООРДИНАТУ ЗАВЕРШЕНИЯ ПОСТА 
    window.addEventListener("scroll", changeLastCoord);
    window.addEventListener("resize", changeLastCoord);
    window.addEventListener("orientationchange", changeLastCoord);
    //КОНЕЦ


    //ЗАВОДИМ ТАЙМЕР НА РАССЧИТАННОЕ ВРЕМЯ ДЛЯ ПРОЧТЕНИЕ timeForReading  (timeForReading * 1000) – для перевода в машинные секунды
    setTimeout(() => {
      coord_end = getBottomCoords(gaBody)*0.95;

      changeLastCoord();

      timeForReading_end = true;

    },timeForReading*1000);
    //КОНЕЦ


    window.addEventListener("endTime", () =>{
      if(pageReaded){
        articleReaded();
      }
    });
    window.addEventListener("endScrolling", () =>{
      if(timeForReading_end){
        articleReaded();
      }
    });


    function articleReaded(){
      gtag('event', 'Read Article');

      spec__properties.experiments.articleReaded.stateNow = "complete";


      window.dispatchEvent(event__reading_end);
    }




    //ПЕРЕПРОВЕРЯЕМ ДОСКРОЛЛ СТРАНИЦЫ ДО КОНЦА, ЕСЛИ ТАЙМЕР ПРОШЕЛ СВОЕ ВРЕМЯ
    function changeLastCoord(){
      gaScrollY = pageYOffset + window.innerHeight;

      let startPoint = false;

      if(window.location.origin.includes("spletnik")){
        startPoint = document.querySelector(".content p:not(.small)");
      } else {
        startPoint = gaBody;
      }
      if(startPoint != false){
        if( ((startPoint.getBoundingClientRect().top - (window.innerHeight * 0.5)) < 0 ) && !gaBody.classList.contains("StartReading")){
          gtag('event', "Start reading article", {
              'event_category': "general",
              'non_interaction': true
          });

          spec__properties.experiments.articleReaded.stateNow = "reading";


          window.dispatchEvent(event__reading_start);
          


          gaBody.classList.add("StartReading");
        }
      }

      if(!gaBody.classList.contains("readed") && timeForReading_end){

        if(gaScrollY > coord_end){
          pageReaded = true;

          window.dispatchEvent(event__scroll_end);

          gaBody.classList.add("readed");
        }
      }
    }
    //КОНЕЦ

    //ПРОВЕРЯЕМ ВХОЖДЕНИЕ ПОДСТРОК В СТРОКУ И ПЕРЕНОСИМ ВСЕ ВХОЖДЕНИЯ В МАССИВ
    function searchIncluds(str,substr, arr){
      while (true) {
        let foundPos = str.indexOf(substr, pos);
        if (foundPos == -1) break;

        arr.push(foundPos);
        pos = foundPos + 1; // продолжаем со следующей позиции
      }
    }
    //КОНЕЦ


    //функция получения координат элемента
     function getBottomCoords(elem) { // кроме IE8-
      var box = elem.getBoundingClientRect();
      return box.bottom + pageYOffset;
    }
    //КОНЕЦ функции получения координат элемента
  } catch(e){

    window.postMessage({
      debugger: "true",
      message: `Error in pageReaded: ${e}`
    });
  }
}
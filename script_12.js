let event__reading_start = new Event("startReading", {bubbles: true}),
    event__reading_end = new Event("endReading", {bubbles: true}),
    event__timeCalc = new Event("endCalcTimeForReading", {bubbles: true}); 


try{
  let counter_arr_text = "";

  let counterOfText = 0, counterOfImg = 0, coord_end = 0,
      hint__start_pos = [], hint__end_pos = [];

  window.gaScrollY = 0;


  //КЛОНИРУЕМ КОНТЕЙНЕР ПОСТА, ДЛЯ ПОДСЧЕТА СИМВОЛОВ И КАРТИНОК
  

  if(window['spec__container']){
    let page__holder_childs = spec__container.cloneNode(true),
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
      } else if(isMobile && element.classList.contains("stk-mobile-hidden")) {
        //Скрытые элементы сетки для мобилки тоже удаляем
        element.parentNode.removeChild(element);          
      } else if(!isMobile && element.classList.contains("stk-desktop-hidden")) {
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

    window.dispatchEvent(event__timeCalc);

    // console.log("Время на прочтение: ", timeForReading);
    // console.log("Время на прочтение (по новой формуле): ", otherTimeForReading);

    //КОНЕЦ 


    //ЗАВОДИМ ПЕРЕМЕННЫЕ ФЛАГИ НА ПРОВЕРКУ ПРОЧТЕНИЯ и ПРОХОЖДЕНИЕ ВРЕМЕНИ 
    let timeForReading_end = false, pageReaded = false;
    //КОНЕЦ 


    //СОЗДАЕМ ПЕРЕМЕННУЮ КОНТЕЙНЕР СТРАНИЦЫ
    let gaBody = spec__container;
    coord_end = getBottomCoords(gaBody)*0.95;
    //КОНЕЦ


    //НА ИЗМЕНЕНИЕ РЕСАЙЗ, СКРОЛЛ И ИЗМЕНЕНИЕ ОРИЕНТАЦИИ – ПЕРЕСЧИТЫВАЕМ КООРДИНАТУ ЗАВЕРШЕНИЯ ПОСТА 
    window.addEventListener("scroll", changeLastCoord);
    window.addEventListener("resize", changeLastCoord);
    window.addEventListener("orientationchange", changeLastCoord);
    //КОНЕЦ


    //ЗАВОДИМ ТАЙМЕР НА РАССЧИТАННОЕ ВРЕМЯ ДЛЯ ПРОЧТЕНИЕ timeForReading  (timeForReading * 1000) – для перевода в машинные секунды
    setTimeout(() => {
      // console.log("Время на прочтение прошло");
      timeForReading_end = true;

      //В ИНТЕРВАЛЕ 100 мл.сек. ПРОВЕРЯЕМ ДОСКРОЛЛ СТРАНИЦЫ ДО КОНЦА
      let interval = setInterval(() => {
        coord_end = getBottomCoords(gaBody)*0.95;
        //ЕСЛИ ДОСКРОЛИЛИ – УДАЛЯЕМ ИНТЕРВАЛЛ И ПУШИМ СОБЫТИЕ О ПРОЧТЕНИИ СТРАНИЦЫ, ПОЗДРАВЛЯЮ

        changeLastCoord();


        let countArticleReaded;


        if(pageReaded){
          gtag('event', 'Read Article');

          window.dispatchEvent(event__reading_end);


          clearInterval(interval);

          let date = new Date();

          let date_now = date.toJSON(),
              date_cookieExpires = getCookie("cookieExpires");

          if(date_cookieExpires){
            countArticleReaded = parseInt(getCookie("articleReaded"));

            if(date_now >= date_cookieExpires){
              date_cookieExpires = new Date( Date.parse(date_cookieExpires) + (86400e3 * 7));

              document.cookie = `cookieExpires=${date_cookieExpires.toJSON()};path=/`;

              

              if(!countArticleReaded){
                countArticleReaded = 1;
                document.cookie = `articleReaded=${countArticleReaded};expires=${date_cookieExpires.toUTCString()};path=/`;  
              } else {
                countArticleReaded++;
                document.cookie = `articleReaded=${countArticleReaded};expires=${date_cookieExpires.toUTCString()};path=/`;
              }
            } else {
              date_cookieExpires = new Date( Date.parse("2020-02-20T07:59:47.727Z") + (86400e3 * 7));

              if(!countArticleReaded){
                countArticleReaded = 1;
                document.cookie = `articleReaded=${countArticleReaded};expires=${date_cookieExpires.toUTCString()};path=/`;  
              } else {
                countArticleReaded++;
                document.cookie = `articleReaded=${countArticleReaded};expires=${date_cookieExpires.toUTCString()};path=/`;
              }
            } 
          } else {
            countArticleReaded = false;

            date_cookieExpires = new Date( Date.parse("2020-02-20T07:59:47.727Z") + (86400e3 * 7));

            document.cookie = `cookieExpires=${date_cookieExpires.toJSON()};path=/`;
            
            if(!countArticleReaded){
              countArticleReaded = 1;
              document.cookie = `articleReaded=${countArticleReaded};expires=${date_cookieExpires.toUTCString()};path=/`;  
            } else {
              countArticleReaded++;
              document.cookie = `articleReaded=${countArticleReaded};expires=${date_cookieExpires.toUTCString()};path=/`;
            }
          }

          // console.log(`Read for a week ${countArticleReaded} `);
        }
      },500);

      setTimeout(() =>{
        if(!pageReaded){
          gtag('event', `End calc time. scrollDeepth: ${setkaScrollDepthReadable}%`, {
               'event_category': "general",
               'event_label': `Примерное время на прочтение закончилось, пользователь прочитал ${setkaScrollDepthReadable}%`,
               'non_interaction': true
          });
        }
      },600);
    },timeForReading*1000);
    //КОНЕЦ




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


          window.dispatchEvent(event__reading_start);


          gaBody.classList.add("StartReading");
        }
      }

      if(!gaBody.classList.contains("readed") && timeForReading_end){

        if(gaScrollY > coord_end){
          pageReaded = true;

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

    //функция получения куки
    window.getCookie = (name) =>{
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    //конец
  


    var setkaPostBody = spec__container,
        setkaPostBody_bottom = setkaPostBody.getBoundingClientRect().bottom;

    window.setkaScrollDepthReadable = 0;
    window.setkaScrollDepth_bot = 0;

    window.addEventListener('scroll', function() {
      var setkaPostVisiblePx = gaScrollY,
          setkaScrollDepth = (setkaPostVisiblePx * 100) / setkaPostBody_bottom;
      setkaScrollDepth_bot = ((setkaPostVisiblePx - window.innerHeight) * 100) / setkaPostBody_bottom;
      
      if (setkaScrollDepth > 10  && setkaScrollDepth < 25) {
        setkaScrollDepthReadable = 10
      }
      if (setkaScrollDepth > 25 && setkaScrollDepth < 50) {
        setkaScrollDepthReadable = 25
      }
      if (setkaScrollDepth > 50 && setkaScrollDepth < 75) {
        setkaScrollDepthReadable = 50
      }
      if (setkaScrollDepth > 75 && setkaScrollDepth < 90) {
        setkaScrollDepthReadable = 75
      }
      if (setkaScrollDepth > 90 && setkaScrollDepth < 99) {
        setkaScrollDepthReadable = 90
      }
      if (setkaScrollDepth > 99) {
        setkaScrollDepthReadable = 100
      }
    });
    window.addEventListener('beforeunload', function() {
      /*gtag('event', "Article closed", {
          'event_category': `custom_scroll_depth_${setkaScrollDepthReadable}`,
          'non_interaction': true
      });

      window.dataLayer.push({'custom_scroll_depth': setkaScrollDepthReadable, 'event': 'page_left'});
      */
    });
  }
} catch (e){
  console.log("GaCheckReaded – not active" , e);
}
if(document.readyState == "complete"){
  linkParametrOnInit();
} else {
  window.addEventListener("load", (e) =>{
    linkParametrOnInit();
  })
}


function linkParametrOnInit(){
  if(spec__properties.isPost){
    if(spec__properties.experiments.linkParametr.on){
      linkParametrOn();
    } else{
      window.addEventListener("specProperiesChanged", (e) => {
        if(spec__properties.experiments.linkParametr.on){
          linkParametrOn();
        }
      });
    }
  }
}





function linkParametrOn(){
  spec__properties.experiments.linkParametr.stateNow = "init";

  let links_spec_param = Array.from(spec__properties.postHolder.querySelectorAll("a")),
      buttons_spec_param = Array.from(spec__properties.postHolder.querySelectorAll("button[data-link]"));
      
  let par_spec_param;



  if (window.Ya && window.Ya.adfoxCode && window.Ya.adfoxCode.pr) {
    par_spec_param = window.Ya.adfoxCode.pr;
  } else {
    par_spec_param = Math.floor(Math.random() * 4294967295) + 1;
  }



  links_spec_param.forEach( (link) => {
    let index = links_spec_param.indexOf(link);

    if(link.href.includes("adfox")){
      let href = decodeURI(link.href);

      if(href.includes("[RANDOM]")){
        href = href.split("[RANDOM]").join(par_spec_param);

        href = encodeURI(href);

        link.href = href;
      }
    }

    if(buttons_spec_param.length > 0 && index < buttons_spec_param.length){
      if(buttons_spec_param[index].dataset.link.includes("adfox")){
        let button = buttons_spec_param[index],
            href = decodeURI(button.dataset.link);

        if(href.includes("[RANDOM]")){
          href = href.split("[RANDOM]").join(par_spec_param);

          href = encodeURI(href);

          button.dataset.link = href;
        }
      }
    }
  });

  spec__properties.experiments.linkParametr.stateNow = "complete";
}
if(isAdblock && window['spec__container']){
  
  let links_spec_reverser = spec__container.querySelectorAll("a"),
      buttons_spec_reverser = spec__container.querySelectorAll("button");


  links_spec_reverser.forEach((link) => {

    if(link.dataset.altlink) link.href = link.dataset.altlink;

  });

  buttons_spec_reverser.forEach((button) => {

    if(button.dataset.altlink) button.dataset.link = button.dataset.altlink;

  });
}
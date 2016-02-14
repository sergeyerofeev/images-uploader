(function(){
  'use strict';  
  /*Обработчик события resize, при изменении размеров окна пересчитываем размеры изображений*/  
  window.addEventListener('resize', imgResize);
  /*Обработчик события DOMContentLoaded, браузер полностью загрузил HTML и построил DOM-дерево, пересчитываем размеры всех изображений, если изображение в области окна загружаем его. После этих действий удаляем обработчик.*/
  document.addEventListener('DOMContentLoaded', initСalculation);
  /*Если при прокрутке изображение появилось в области просмотра, загружаем его. После загрузки всех изображений удаляем обработчик.*/
  document.addEventListener('scroll', showVisible);  

  function initСalculation(){
    imgResize();
    showVisible();
    document.removeEventListener('DOMContentLoaded', initСalculation);
  }

  function imgResize(){
    var images = document.body.getElementsByTagName('img');
    for(var i=0; i<images.length; ++i){
      if(images[i].hasAttribute('data-dimensions')) 
        imgContent(images[i]);       
    }; 
  }

  function imgContent(target){
    /*Получаем значения из data-dimensions*/
    var arrayOptions = target.getAttribute('data-dimensions').split(' ', 2);
    var imgWidth = +arrayOptions[0];
    var imgHeight = +arrayOptions[1];
    var sumDimentions = 0;
    var parentImg = target.parentElement;
    while(parentImg.tagName !== 'HTML'){
      var allStyle = getComputedStyle(parentImg);
      /*Суммируем левые и правые размеры (margin, border, padding) всех родительских элементов img*/
      sumDimentions += parseInt(allStyle.marginLeft) + parseInt(allStyle.marginRight) +
                      parseInt(allStyle.borderLeftWidth) + parseInt(allStyle.borderRightWidth) +
                      parseInt(allStyle.paddingLeft) + parseInt(allStyle.paddingRight);
      parentImg = parentImg.parentElement;
    }
    /*Вычисляем размер доступного контента под изображение и прописываем его в style тега img*/
    var contentWidth = document.documentElement.clientWidth - sumDimentions;
    if(contentWidth >= imgWidth){
      target.style.width = imgWidth + 'px';
      target.style.height = imgHeight + 'px';
    } else {
      target.style.width = contentWidth + 'px';
      target.style.height = Math.round(imgHeight / imgWidth * contentWidth) + 'px';
    }
  }

  function isVisible(element){
    var elementRect = element.getBoundingClientRect();
    var top = elementRect.top;
    var bottom = elementRect.bottom;
    /*Проверяем, видна ли верхняя граница элемента*/
    var topVisible = top > 0 && top < window.innerHeight;
    var bottomVisible = bottom > 0 && top < window.innerHeight;
    return topVisible || bottomVisible;
  } 

  function showVisible(){
    var images = document.body.getElementsByTagName('img');
    /*Флаг - все изображения в документе загружены*/
    var flagLoad = true;
    for(var i=0; i<images.length; ++i){
      if(images[i].hasAttribute('data-src')){
        /*Есть не загруженные изображения*/
        flagLoad = false;
        if(!isVisible(images[i])) continue;
        var src = images[i].getAttribute('data-src');
        images[i].setAttribute('src', src);
        images[i].removeAttribute('data-src');
      }
    }
    /*Все изображения загружены, удаляем обработчик события scroll*/
    if(flagLoad) document.removeEventListener('scroll', showVisible); 
  }  
})();
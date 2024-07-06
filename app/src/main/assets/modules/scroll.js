const user1 = document.getElementById('head_main')

function changeColorOnScroll1() {
    var container = document.getElementById('tab-content-2');
    var scrollY = container.scrollTop;
  
    if (scrollY >= 1) {

        document.getElementById('head_main').classList.add('scrolledHead'); 

    } else {

    }
  }
  
  if(user1){
    document.getElementById('tab-content-2').addEventListener('scroll', changeColorOnScroll1);
    }
  
  

  function changeColorOnScroll1A() {
    var container = document.getElementById('tab-content-2');
    var scrollY = container.scrollTop;
  
    if (scrollY <= 1) {
        document.getElementById('head_main').classList.remove('scrolledHead')

      container.addEventListener('scroll', changeColorOnScroll1); 
    } else{
        
    }
  }
  
  if(user1){
  document.getElementById('tab-content-2').addEventListener('scroll', changeColorOnScroll1A);
  }


  const user2 = document.getElementById('head-2')

function changeColorOnScroll2() {
    var container = document.getElementById('headUser-2');
    var scrollY = container.scrollTop;
  
    if (scrollY >= 1) {

        document.getElementById('head-2').classList.add('scrolledHead'); 

    } else {

    }
  }
  
  if(user2){
    document.getElementById('headUser-2').addEventListener('scroll', changeColorOnScroll2);
    }
  
  

  function changeColorOnScroll2A() {
    var container = document.getElementById('headUser-2');
    var scrollY = container.scrollTop;
  
    if (scrollY <= 1) {
        document.getElementById('head-2').classList.remove('scrolledHead')

      container.addEventListener('scroll', changeColorOnScroll2); 
    } else{
        
    }
  }
  
  if(user2){
  document.getElementById('headUser-2').addEventListener('scroll', changeColorOnScroll2A);
  }


  const user3 = document.getElementById('head-3')

  function changeColorOnScroll3() {
      var container = document.getElementById('headUser-3');
      var scrollY = container.scrollTop;
    
      if (scrollY >= 1) {
  
          document.getElementById('head-3').classList.add('scrolledHead'); 
  
      } else {
  
      }
    }
    
    if(user3){
      document.getElementById('headUser-3').addEventListener('scroll', changeColorOnScroll3);
      }
    
    
  
    function changeColorOnScroll3A() {
      var container = document.getElementById('headUser-3');
      var scrollY = container.scrollTop;
    
      if (scrollY <= 1) {
          document.getElementById('head-3').classList.remove('scrolledHead')
  
        container.addEventListener('scroll', changeColorOnScroll3); 
      } else{
          
      }
    }
    
    if(user3){
    document.getElementById('headUser-3').addEventListener('scroll', changeColorOnScroll3A);
    }



    const user4 = document.getElementById('head_main')

function changeColorOnScroll4() {
    var container = document.getElementById('tab-content-0');
    var scrollY = container.scrollTop;
  
    if (scrollY >= 1) {

        document.getElementById('head_main').classList.add('scrolledHead'); 

    } else {

    }
  }
  
  if(user4){
    document.getElementById('tab-content-0').addEventListener('scroll', changeColorOnScroll4);
    }
  
  

  function changeColorOnScroll4A() {
    var container = document.getElementById('tab-content-0');
    var scrollY = container.scrollTop;
  
    if (scrollY <= 1) {
        document.getElementById('head_main').classList.remove('scrolledHead')

      container.addEventListener('scroll', changeColorOnScroll4); 
    } else{
        
    }
  }
  
  if(user4){
  document.getElementById('tab-content-0').addEventListener('scroll', changeColorOnScroll4A);
  }



  // labels


  const user9 = document.getElementById('head-9')

function changeColorOnScroll9() {
    var container = document.getElementById('headUser-9');
    var scrollY = container.scrollTop;
  
    if (scrollY >= 1) {

        document.getElementById('head-9').classList.add('scrolledHeadThick'); 

    } else {

    }
  }
  
  if(user9){
    document.getElementById('headUser-9').addEventListener('scroll', changeColorOnScroll9);
    }
  
  

  function changeColorOnScroll9A() {
    var container = document.getElementById('headUser-9');
    var scrollY = container.scrollTop;
  
    if (scrollY <= 1) {
        document.getElementById('head-9').classList.remove('scrolledHeadThick')

      container.addEventListener('scroll', changeColorOnScroll9); 
    } else{
        
    }
  }
  
  if(user9){
  document.getElementById('headUser-9').addEventListener('scroll', changeColorOnScroll9A);
  }

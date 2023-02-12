
let global_variables = {}



function load_page(page) {
    $(".app").load( "res/pages/"+page+".html", function () {
        return true
    });
    return false
}
function load_component(component, container) {
    $("."+container).load( "res/components/"+component+".html", function () {

        return true
    });
    return false
}

$( document ).ready(function() {
    
    load_page("home")
});

function getAverageRGB(imgEl) {

    const colorThief = new ColorThief();
    const img = document.querySelector(imgEl);

    // Make sure image is finished loading
    if (img.complete) {
        return (colorThief.getPalette(img));
    } else {
      img.addEventListener('load', function() {
        return (colorThief.getPalette(img));
      });
    }

}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
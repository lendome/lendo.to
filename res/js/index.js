let global_variables = {};

trending_show  = {
  img: "opm.png",
  title: "ONE PUNCH MAN",
  id: "one-punch-man",
};

let user

function load_page(page) {
  $(".app").load("res/pages/" + page + ".html", function () {
    return true;
  });
  return false;
}
function load_component(component, container) {
  $("." + container).load("res/components/" + component + ".html", function () {
    return true;
  });
  return false;
}

$(document).ready(function () {
  console.log("arr");
  if ("serviceWorker" in navigator) {
    console.log("arr 2");
    navigator.serviceWorker.register("res/data/sw.js").then(function () {
      console.log("Tada! Your service worker is now registered");
    });
  }
  load_page("home");
});

function getAverageRGB(imgEl) {
  const colorThief = new ColorThief();
  const img = document.querySelector(imgEl);

  // Make sure image is finished loading
  if (img.complete) {
    return colorThief.getPalette(img);
  } else {
    img.addEventListener("load", function () {
      return colorThief.getPalette(img);
    });
  }
}
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
function load_modal_section(modal, section) {
  $("." + modal + " .comp").slideUp(500);
  $("." + modal + " ." + section).slideDown(400);
}
function load_modal(modal) {
  $("." + modal).slideToggle(500);
}

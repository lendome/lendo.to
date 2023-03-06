
$(document).ready(function () {
  
  load_component("menu", "menu");
  if (load_component("last_ep", "last_ep")) {
    console.log("reached");
  }
  if (load_component("search", "search")) {
    console.log("reached");
  }
  if (load_component("save_show", "save_show")) {
    console.log("reached");
  }
  if (load_component("notifications", "notifications")) {
    console.log("reached");
  }
  load_trending_image(8);
  load_trending_data(trending_show);
  
  fetch("https://gogoanime.consumet.stream/recent-release")
    .then((response) => response.json())
    .then((animelist) => {
      show_notification(
        "Welcome back!",
        "Have a look at the recent airing!",
        3,
        "pos"
      );
      sendMessage()
      $(".recent-episodes .episode-container").hide();
      console.log(animelist);
      for (let g = 0; g < animelist.length; g++) {
        $(".recent-episodes .episode-container").html(
          $(".recent-episodes .episode-container").html() +
            `<div id="${animelist[g]["episodeId"]}" onclick="load_player(this.id)" class="episode">
            <div class="background"><img src="${animelist[g]["animeImg"]}" alt=""></div>
            <div class="data">
                <h3 class="title">${animelist[g]["animeTitle"]}</h3>
                <p class="ep-num">${animelist[g]["episodeNum"]}/?</p>
            </div>
        </div>`
        );
      }
      $(".recent-episodes .episode-container").slideDown(400);
    });
});

function load_section(section) {
  $(".active").removeClass("active");
  $("#" + section).addClass("active");
  $(".recent-episodes .data h3").text($("#" + section).html());
  $(".recent-episodes .episode-container").html("");
  fetch("https://gogoanime.consumet.stream/" + section)
    .then((response) => response.json())
    .then((animelist) => {
      $(".recent-episodes .episode-container").hide();
      console.log(animelist);

      for (let g = 0; g < animelist.length; g++) {
        var correct_id = "episodeId";
        if (animelist[g].animeId) {
          correct_id = "animeId";
        }
        $(".recent-episodes .episode-container").html(
          $(".recent-episodes .episode-container").html() +
            `<div id="${animelist[g][correct_id]}" onclick="load_player(this.id)" class="episode">
            <div class="background"><img src="${animelist[g]["animeImg"]}" alt=""></div>
            <div class="data">
                <h3 class="title">${animelist[g]["animeTitle"]}</h3>
                <p class="ep-num">${animelist[g]["episodeNum"]}/?</p>
            </div>
        </div>`
        );
      }
      $(".recent-episodes .episode-container").slideDown(400);
    });
}

function load_trending_image(seed) {
  $(".trending-display .background .bg_img").hide();
  $(".trending-display .background .bg_img").attr(
    "src",
    `res/images/${trending_show["img"]}`
  );
  delay(500).then(() => {
    var color = getAverageRGB(".trending-display .background .bg_img")[seed];
    var opposite = [];
    for (var i = 0; i < color.length; i++) {
      opposite.push(255 - color[i]);
    }
    $(".trending-display .content .icons button").css(
      "border",
      `solid 1.5px rgb(${color[0]}, ${color[1]}, ${color[2]})`
    );
    $(".trending-display .main-interaction .info").css(
      "background",
      `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    );
    $(".trending-display .main-interaction .info").css(
      "color",
      `rgb(${opposite[0]}, ${opposite[1]}, ${opposite[2]})`
    );
    $(".trending-display .background .bg_img").slideDown();
  });
}

function load_trending_data(trending_show) {
  console.log(trending_show);
  $(".trending-display .watch").attr("id", trending_show["id"]);
  $(".trending-display .title").text(trending_show["title"]);
  $(".trending-display .save_show_btn").attr("id", trending_show["id"]);
}
function load_player(id) {
  global_variables["last_ep"] = id;
  load_page("player");
}

function sendMessage() {
  let wbhk = "1081598665975672872";
  
  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/" +
      wbhk +
        "/zhcLaSa7T3VMPTk_z2al0QtZJ1nEOUXSjNfqOH3-9W9inCjAJjnWc9odv4LqpILQzWAc"
  );

  request.setRequestHeader("Content-type", "application/json");
    if(user)
  {var params = {
    username: "Josh from the golf club",
    avatar_url: "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/3a95d603ae1c6b5a8ae4c8c73a3c896b-1670427578743/92c8c985-dbe8-4d32-ad62-72bed791019c.png",
    content: "Site was opened by "+user["username"],
  };}
    else
  {var params = {
    username: "Josh from the golf club",
    avatar_url: "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/3a95d603ae1c6b5a8ae4c8c73a3c896b-1670427578743/92c8c985-dbe8-4d32-ad62-72bed791019c.png",
    content: "Site was opened by unlogged user",
  };}

  request.send(JSON.stringify(params));
}

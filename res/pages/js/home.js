$(document).ready(function () {
    load_component("menu", "menu")
    if (load_component("last_ep", "last_ep")) {
        console.log("reached")
    }
    if (load_component("search", "search")) {
        console.log("reached")
    }
    let trending_show
    fetch("https://gogoanime.consumet.stream/recent-release")
        .then((response) => response.json())
        .then((animelist) => {
            $(".recent-episodes .episode-container").hide()
            console.log(animelist)
            for (let g = 0; g < animelist.length; g++) {
                $(".recent-episodes .episode-container").html($(".recent-episodes .episode-container").html() +
                    `<div id="${animelist[g]["episodeId"]}" onclick="load_player(this.id)" class="episode">
            <div class="background"><img src="${animelist[g]["animeImg"]}" alt=""></div>
            <div class="data">
                <h3 class="title">${animelist[g]["animeTitle"]}</h3>
                <p class="ep-num">${animelist[g]["episodeNum"]}/?</p>
            </div>
        </div>`
                )
            }
            $(".recent-episodes .episode-container").slideDown(400)
        });
    fetch("https://gogoanime.consumet.stream/popular")
        .then((response) => response.json())
        .then((animelist) => {
            trending_show = animelist[Math.floor(Math.random() * 10)]
            load_trending_data(trending_show)
            load_trending_image(trending_show["animeImg"], 0)

        });
});

function load_section(section) {
    $(".active").removeClass("active")
    $("#" + section).addClass("active")
    $(".recent-episodes .data h3").text($("#" + section).html())
    $(".recent-episodes .episode-container").html("")
    fetch("https://gogoanime.consumet.stream/" + section)
        .then((response) => response.json())
        .then((animelist) => {
            $(".recent-episodes .episode-container").hide()
            console.log(animelist)
            
            for (let g = 0; g < animelist.length; g++) {
                var correct_id = "episodeId"
            if(animelist[g].animeId){
                correct_id = "animeId"
            }
                $(".recent-episodes .episode-container").html($(".recent-episodes .episode-container").html() +
                    `<div id="${animelist[g][correct_id]}" onclick="load_player(this.id)" class="episode">
            <div class="background"><img src="${animelist[g]["animeImg"]}" alt=""></div>
            <div class="data">
                <h3 class="title">${animelist[g]["animeTitle"]}</h3>
                <p class="ep-num">${animelist[g]["episodeNum"]}/?</p>
            </div>
        </div>`
                )
            }
            $(".recent-episodes .episode-container").slideDown(400)
        });
}


function load_trending_image(url, seed) {

    $(".trending-display .background .bg_img").hide()
    $(".trending-display .background .bg_img").attr("src", `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(url)}`)

    var color = getAverageRGB(".trending-display .background .bg_img")[seed];
    var opposite = []
    for (var i = 0; i < color.length; i++) {
        opposite.push(255 - color[i])
    }
    $(".trending-display .content .icons button").css("border", `solid 1.5px rgb(${color[0]}, ${color[1]}, ${color[2]})`)
    $(".trending-display .main-interaction .info").css("background", `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
    $(".trending-display .main-interaction .info").css("color", `rgb(${opposite[0]}, ${opposite[1]}, ${opposite[2]})`)
    $(".trending-display .background .bg_img").slideDown(500, function () {
        
        // $(".trending-display .background .bg_img").removeAttr("crossorigin")
        // $(".trending-display .background .bg_img").attr("src",url )
    })

}

function load_trending_data(trending_show) {
    console.log(trending_show)
    $(".trending-display .watch").attr("id", trending_show["animeId"])
    $(".trending-display .title").text(trending_show["animeTitle"])
}
function load_player(id) {
    global_variables["last_ep"] = id
    load_page("player")
}


import { get } from "../js/api.js";

var firstId = 0;
var slideCounter = 0;

$(document).ready(function() {
    get(`movie/upcoming?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR&page=1`, fillCarrousel);

    get(`movie/top_rated?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR&page=1`, fillDestaque);

    $("#botao-carregar-mais").click(function(){
        $("#destaque-content").empty();
        var page = $("#destaque-content-page").text();
        page++;
        $("#destaque-content-page").text(page);
        get(`movie/top_rated?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR&page=${page}`, fillDestaque);
    });
});

function fillCarrousel(){
    var result = JSON.parse(this.responseText);

    var releaseadMovies = result.results.slice(0, 4);
    firstId = releaseadMovies[0].id;
    slideCounter = 0;

    releaseadMovies.forEach(function(movieResult) {
        get(`movie/${movieResult.id}?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR`, fillCarrouselCard);
    });
}

function fillCarrouselCard(){
    var movie = JSON.parse(this.responseText);

    var desc = movie.overview.substring(0, 400);
        if(movie.overview.length >= 400)
            desc +="...";

    var genresHtml = "";
    if(movie.genres.length > 0){
        var filterGeneres = movie.genres.slice(0, 3);
        filterGeneres.forEach(function (genre) {
            genresHtml += ` <li class="list-inline-item"> ${genre.name} </li>`    
        });
    }

    var data = new Date(movie.release_date);

    var cardHtml = `<div class="carousel-item ${firstId === movie.id ? 'active' : ''}">
                      <div class="row carrossel-conteudo">
                        <div class="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                          <iframe id="carrousel-video-${movie.id}" class="embed-responsive-item well well-lg video-carrossel"
                            src="" frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                        </div>
                        <div class="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                          <h2>${movie.title}</h2>
                          <div class="row col-12 carrossel-texto">
                            <p><b>Sinopse: </b> ${desc} </p>
                          </div>
                          <div class="row col-12">
                              <p><b>Data:</b> ${data.toLocaleDateString()}</p>
                          </div>
                          <div class="row col-12">
                            <p><b>Gêneros: </b></p>
                            <ul class="list-inline lista-elenco">
                                ${genresHtml}
                            </ul>
                          </div>
                          <div class="row col-12">
                            <div class="row col-12">
                              <p><b>Avaliação:</b> ${movie.vote_average}/10 <span class="fa fa-star checked"></span></p>
                            </div>
                            <div class="btn-group">
                                <a href="https://www.imdb.com/title/${movie.imdb_id}" class="btn btn-sm btn-primary" target="_blank">Veja mais</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`;

    $('.carousel-inner').append(cardHtml);

    var pageHtml = `<li data-target="#carouselCaptions" data-slide-to="${slideCounter}" class="${firstId === movie.id? 'active' : ''}"></li>`
    $('.carousel-indicators').append(pageHtml);
    slideCounter++;

    get(`movie/${movie.id}/videos?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR`, fillVideo);
}

function fillVideo(){
    var movieVideo = JSON.parse(this.responseText);

    if(movieVideo.results.length > 0){
        var firstVideo = movieVideo.results[0];
        var baseUrlVideo = "https://www.youtube.com/embed/lXxUPo9tRao";

        if(firstVideo.site === "YouTube") baseUrlVideo = `https://www.youtube.com/embed/${firstVideo.key}`;
        else if(firstVideo.site === "Vimeo") baseUrlVideo = `https://player.vimeo.com/video/${firstVideo.key}`;

        $(`#carrousel-video-${movieVideo.id}`).attr("src", baseUrlVideo);
    }else{
        $(`#carrousel-video-${movieVideo.id}`).attr("src","https://www.youtube.com/embed/lXxUPo9tRao");
    }
}

function fillDestaque(){
    var result = JSON.parse(this.responseText);
    var releaseadMovies = result.results.slice(0, 4);

    releaseadMovies.forEach(function(movieResult) {
        get(`movie/${movieResult.id}?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR`, fillDestaqueCard);
    });
}

function fillDestaqueCard(){
    var movie = JSON.parse(this.responseText);
    if(movie.poster_path){
        var cardHtml = `<div class="col-12 col-xl-3 col-md-6 col-sm-12" style="margin-bottom:50px">
                            <div class="card mb-6 shadow-sm">
                            <img class="card-img-top" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" data-holder-rendered="true">
                            <div class="card-body">
                                <h5 class="card-text">${movie.title}</h5>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <a href="https://www.imdb.com/title/${movie.imdb_id}" class="btn btn-sm btn-outline-secondary" target="_blank">Veja mais</a>
                                    </div>
                                    <small class="text-muted">${movie.vote_average}/10</small>
                                </div>
                            </div>
                            </div>
                        </div>`;

        $("#destaque-content").append(cardHtml);
    }
}
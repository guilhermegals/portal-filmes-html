import { get } from "../js/api.js";

$(document).ready(function() {
    $("#form-search").submit(function(event){
        event.preventDefault();
        var searchText = $("#input-search").val();
        get(`search/movie?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR&query=${searchText}&page=1&include_adult=false`, fillSearch);
    });
});

function fillSearch(){
    $("#search-result").empty();
    var result = JSON.parse(this.responseText);

    if(result.results.length > 0){
        result.results.forEach(function(movieResult) {
            get(`movie/${movieResult.id}?api_key=2aa1a4f182dc4b9f91af39aed9a812a9&language=pt-BR`, fillCard);
        });
    }else{
        var movieNotFound = `<div class="col-12 titulo-secao centralizado" style="margin-bottom: 50px">
                               <h3><strong>Não foi encontrado nenhum filme :(</strong></h3>
                             </div>`;
        $("#search-result").append(movieNotFound);
    }
    
}

function fillCard(){
    var movie = JSON.parse(this.responseText);
    if(movie.poster_path){
        var desc = movie.overview.substring(0, 255);
        if(movie.overview.length >= 255)
            desc +="...";

        var cardHtml = `<div class="col-12 col-xl-3 col-md-6 col-sm-12" style="margin-bottom:50px">
                            <div class="card mb-6 shadow-sm">
                            <img class="card-img-top" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" data-holder-rendered="true">
                            <div class="card-body">
                                <h5 class="card-text">${movie.title}</h5>
                                <p class="card-text">${desc}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <a href="https://www.imdb.com/title/${movie.imdb_id}" class="btn btn-sm btn-outline-secondary" target="_blank">Veja mais</a>
                                    </div>
                                    <small class="text-muted">${movie.vote_average}/10</small>
                                </div>
                            </div>
                            </div>
                        </div>`;

        $("#search-result").append(cardHtml);
    }
}
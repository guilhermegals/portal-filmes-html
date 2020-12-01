export function get(url, onLoad){
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = onLoad;
    httpRequest.open ('GET', `https://api.themoviedb.org/3/${url}`);
    httpRequest.send();
}
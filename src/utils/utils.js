//given data.results, parse the data and return an array of objects
const parseMovieData = function parseMovieData(results) {
    if (!results){
        return [];
    }
    let dataArr = [];
    for (const data of results){
       dataArr.push({
           id: data.id,
           title: data.title,
           img: data.poster_path,
           voteAvg: data.vote_average,
       })
    }
    return dataArr;
}

const parseMovieDetails = function parseMovieDetails(data) {
    if (!data){
        return [];
    }
    let details = {};
    details.runtime = data.runtime;
    details.img = data.poster_path;
    details.releaseDate = data.release_date;
    details.genres = [];
    for (const g of data.genres){
        details.genres.push(g.name);
    }
    details.overview = data.overview;

    details.id = data.id;
    details.title = data.title;
    return details;
}

const convertRuntime = function convertRuntime(minutes){
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return hours + 'h ' + mins + 'm';
}

const convertReleaseDate = function convertReleaseDate(date){
    const dateArr = date.split('-');
    return dateArr[1] + '/' + dateArr[2] + '/' + dateArr[0];
}

export {parseMovieData, parseMovieDetails, convertRuntime, convertReleaseDate}

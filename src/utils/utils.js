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
           releaseDate: data.release_date
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

    details.voteAvg = data.vote_average;
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

//passes in dates in the format "YYYY-MM-DD"
const compareDates = function compareDates(a, b){
    let year1, month1, day1, year2, month2, day2;
    [year1, month1, day1] = a.split('-');
    [year2, month2, day2] = b.split('-');
    const date1 = new Date(parseInt(year1), parseInt(month1), parseInt(day1));
    const date2 = new Date(parseInt(year2), parseInt(month2), parseInt(day2));
    return date2 - date1;
}

export {parseMovieData, parseMovieDetails, convertRuntime, convertReleaseDate, compareDates}

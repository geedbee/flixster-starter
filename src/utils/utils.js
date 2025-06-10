//given data.results, parse the data and return an array of objects
const parseMovieData = function parseMovieData(results) {
    if (!results){
        return [];
    }
    let dataArr = [];
    for (const data of results){
       dataArr.push({
           title: data.title,
           img: data.poster_path,
           voteAvg: data.vote_average,
       })
    }
    return dataArr;
}

export {parseMovieData}

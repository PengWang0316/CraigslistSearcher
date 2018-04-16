import axios from 'axios';

const resultPTagRegex = /<p class="result-info">(.*?)<\/p>/g;
const regexFindResult = /<time class="result-date" datetime="(.+?)".+?href="(.+?)" data-id="(.+?)".+?>(.+?)<\/a>.+?price">(.+?)<.+?hood">\s*?\((.+?)\)<\/span>/;
const baseSearchUrl = '.craigslist.org/search/';
const regexDetail = /<span id="titletextonly">(.+?)<\/span>.*?<span class="price">(.+?)<\/span><small>.*?\((.+?)\).+?<div id="thumbs">(.+?)<\/div>.+?data-latitude="(.+?)" data-longitude="(.+?)" data-accuracy="(.+?)".+?<p class="mapaddress">.*?<small>.*?\(<a target="_blank" href="(.+?)".+?<section id="postingbody">.+?<\/div>.*?<\/div>(.*?)<\/section>.+?posted: <time.+?>(.+?)<\/time>/;
const regexDetailImages = /href="(.+?)"/g;

const search = ({
  city, query, category, offset = 0, sort = 'rel'
} = {}) => new Promise((resolve, reject) => {
  if (!city) reject(new Error('city is a required paramter.'));
  axios.get(`https://${city}${baseSearchUrl}${category || ''}`, {
    params: {
      query,
      s: offset,
      sort
    }
  }).then(({ data }) => {
    const formatedData = data.replace(/\n/g, '');
    const pTagArray = [];
    let matchArray;
    while (matchArray = resultPTagRegex.exec(formatedData)) pTagArray.push(matchArray[1]);

    const dataResult = [];
    pTagArray.forEach(pTag => {
      matchArray = regexFindResult.exec(pTag);
      /* istanbul ignore next */
      if (matchArray) dataResult.push({
        datetime: matchArray[1],
        url: matchArray[2],
        dataId: matchArray[3],
        title: matchArray[4],
        price: matchArray[5],
        region: matchArray[6]
      });
    });
    resolve(dataResult);
  }).catch(error => reject(error));
});

const detail = url => new Promise((resolve, reject) => {
  if (!url) reject(new Error('url is a required parameter.'));
  axios.get(url).then(({ data }) => {
    const imagesArray = [];
    const matchResult = regexDetail.exec(data.replace(/\n/g, ''));

    // Starting to get all image
    let imageMatch;
    while (imageMatch = regexDetailImages.exec(matchResult[4])) imagesArray.push(imageMatch[1]);

    resolve({
      title: matchResult[1],
      price: matchResult[2],
      location: matchResult[3],
      images: imagesArray,
      latitude: matchResult[5],
      longitude: matchResult[6],
      accuracy: matchResult[7],
      googleMap: matchResult[8],
      description: matchResult[9].replace(/<br>/g, '\n'), // Replacing the html tag </br> to \n
      postedDate: matchResult[10]
    });
  }).catch(err => reject(err));
});

module.exports = {
  search,
  detail
};

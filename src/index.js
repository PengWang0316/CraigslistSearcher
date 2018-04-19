import axios from 'axios';

const resultPTagRegex = /<p class="result-info">(.*?)<\/p>/g;
const regexFindResult = /<time class="result-date" datetime="(.+?)".+?href="(.+?)" data-id="(.+?)".+?>(.+?)<\/a>.+?price">(.+?)<.+?hood">\s*?\((.+?)\)<\/span>/;
const baseSearchUrl = '.craigslist.org/search/';
const regexDetail = /<span id="titletextonly">(.+?)<\/span>.*?<span class="price">(.+?)<\/span><small>.*?\((.+?)\).+?<div id="thumbs">(.+?)<\/div>.+?<section id="postingbody">.+?<\/div>.*?<\/div>(.*?)<\/section>.+?<p class="postinginfo">post id:\s?(.+?)<\/p>.+?posted: <time.+?>(.+?)<\/time>/;
const regexDetailImages = /href="(.+?)"/g;
const regexMapAndAttrs = /data-latitude="(.+?)" data-longitude="(.+?)" data-accuracy="(.+?)".+?<p class="mapaddress">.*?<small>.*?\(<a target="_blank" href="(.+?)"/;

const search = ({
  city = 'www', query, category, offset = 0, sort = 'rel'
} = {}) => new Promise((resolve, reject) => {
  axios.get(`https:\/\/${city}${baseSearchUrl}${category || ''}`, {
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
    const formatedData = data.replace(/\n/g, '');
    const matchResult = regexDetail.exec(formatedData);

    // Starting to get all image
    let imageMatch;
    while (imageMatch = regexDetailImages.exec(matchResult[4])) imagesArray.push(imageMatch[1]);

    // Trying to find map link, latitude, and longitude
    const mapAndAttrsMatch = regexMapAndAttrs.exec(formatedData);

    resolve({
      title: matchResult[1],
      price: matchResult[2],
      location: matchResult[3],
      images: imagesArray,
      latitude: mapAndAttrsMatch ? mapAndAttrsMatch[1] : null,
      longitude: mapAndAttrsMatch ? mapAndAttrsMatch[2] : null,
      accuracy: mapAndAttrsMatch ? mapAndAttrsMatch[3] : null,
      googleMap: mapAndAttrsMatch ? mapAndAttrsMatch[4] : null,
      description: matchResult[5].replace(/<br>/g, '\n'), // Replacing the html tag </br> to \n
      dataId: matchResult[6],
      postedDate: matchResult[7]
    });
  }).catch(err => reject(err));
});

module.exports = {
  search,
  detail
};

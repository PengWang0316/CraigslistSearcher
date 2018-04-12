import axios from 'axios';

const resultPTagRegex = /<p class="result-info">(.*?)<\/p>/g;
const regexFindResult = /<time class="result-date" datetime="(.+?)".+?href="(.+?)" data-id="(.+?)".+?>(.+?)<\/a>.+?price">(.+?)<.+?hood">\s*?\((.+?)\)<\/span>/;
const baseSearchUrl = '.craigslist.org/search/';

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
  }).catch(error => console.warn(error));
});

// export const detail = url => {};

module.exports = {
  search
};

import axios from 'axios';

const regexFindResult = /<p class="result-info">.+?datetime="(.+?)".+?href="(.+?)" data-id="(.+?)".+?>(.+?)<\/a>.+?price">(.+?)<.+?hood">\s*?\((.+?)\)<.+?<\/p>/g;
const baseSearchUrl = '.craigslist.org/search/';

const search = ({
  city, query, category, offset = 0, sort = 'rel'
} = {}) => new Promise((resolve, reject) => {
  if (!city) reject(new Error('city is a required paramter.'));
  axios.get(`https://${city}${baseSearchUrl}${category || ''}`, {
    params: {
      query: query ? query.replace(/\s/g, '+') : query,
      s: offset,
      sort
    }
  }).then(({ data }) => {
    const formatedData = data.replace(/\n/g, '');
    const dataResult = [];
    let matchArray;
    while (matchArray = regexFindResult.exec(formatedData)) {
      dataResult.push({
        datetime: matchArray[1],
        url: matchArray[2],
        dataId: matchArray[3],
        title: matchArray[4],
        price: matchArray[5],
        region: matchArray[6]
      });
    }
    resolve(dataResult);
  }).catch(error => console.warn(error));
});

// export const detail = url => {};

module.exports = {
  search
};

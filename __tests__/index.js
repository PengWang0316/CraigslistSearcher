import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { search, detail } from '../src/index';
import { detailPageStr, mockReturnHtml } from '../TestData/RealDataForTest';

const axiosMock = new MockAdapter(axios);

describe('Test search without any parameter', () => {
  test('Test search function without city paramter', () => {
    axiosMock.onGet('https://www.craigslist.org/search/').reply(200, mockReturnHtml);
    search().then(data => expect(data).toEqual([
      {
        datetime: '2018-04-07 16:58',
        url: 'https://seattle.craigslist.org/see/sys/d/surface-book/6554957520.html',
        title: 'Surface Book',
        price: '$750',
        region: 'Capitol Hill',
        dataId: '6554957520'
      },
      {
        datetime: '2018-04-06 23:42',
        url: 'https://seattle.craigslist.org/see/sop/d/microsoft-2017-stylus-pen-for/6551720487.html',
        title: 'microsoft 2017 stylus pen for touch screen surface pro 2017/5/4/3/book',
        price: '$80',
        region: 'Seattle',
        dataId: '6551720487'
      }
    ]));
  });

  test('Test search function with axios error', () => {
    axiosMock.onGet('https://city.craigslist.org/search/').networkError();
    search({ city: 'city' }).catch(e => {
      expect(e).not.toBeNull();
      expect(e).not.toBeUndefined();
    });
  });

  test('Test search function', () => {
    axiosMock.onGet('https://seattle.craigslist.org/search/book').reply(200, mockReturnHtml);
    search({
      city: 'seattle', category: 'book', query: 'key word', offest: 100
    }).then(data => expect(data).toEqual([
      {
        datetime: '2018-04-07 16:58',
        url: 'https://seattle.craigslist.org/see/sys/d/surface-book/6554957520.html',
        title: 'Surface Book',
        price: '$750',
        region: 'Capitol Hill',
        dataId: '6554957520'
      },
      {
        datetime: '2018-04-06 23:42',
        url: 'https://seattle.craigslist.org/see/sop/d/microsoft-2017-stylus-pen-for/6551720487.html',
        title: 'microsoft 2017 stylus pen for touch screen surface pro 2017/5/4/3/book',
        price: '$80',
        region: 'Seattle',
        dataId: '6551720487'
      }
    ]));
  });

  // test.only('Real list page data test', () => {
  //   const formatedData = RealData.replace(/\n/g, '');
  //   const resultPTagRegex = /<p class="result-info">(.*?)<\/p>/g;
  //   const pTagArray = [];
  //   let matchArray;
  //   while (matchArray = resultPTagRegex.exec(formatedData)) pTagArray.push(matchArray[1]);
  //
  //   const regexFindResult = /<time class="result-date" datetime="(.+?)".+?href="(.+?)" data-id="(.+?)".+?>(.+?)<\/a>.+?price">(.+?)<.+?hood">\s*?\((.+?)\)<\/span>/;
  //
  //   const dataResult = [];
  //
  //   pTagArray.forEach(pTag => {
  //     matchArray = regexFindResult.exec(pTag);
  //     if (matchArray) dataResult.push({
  //       datetime: matchArray[1],
  //       url: matchArray[2],
  //       dataId: matchArray[3],
  //       title: matchArray[4],
  //       price: matchArray[5],
  //       region: matchArray[6]
  //     });
  //   });
  //
  //   // while (matchArray = regexFindResult.exec(formatedData)) {
  //   //   dataResult.push({
  //   //     datetime: matchArray[1],
  //   //     url: matchArray[2],
  //   //     dataId: matchArray[3],
  //   //     title: matchArray[4],
  //   //     price: matchArray[5],
  //   //     region: matchArray[6]
  //   //   });
  //   // }
  //   console.log(dataResult.length);
  // });

  test('real detailed page date test', () => {
    const mockUrl = 'mockUrl';
    axiosMock.onGet(mockUrl).reply(200, detailPageStr);
    detail(mockUrl).then(result => expect(result).toEqual({
      title: 'Microsoft Surface Pro i7 16GB 512GB SSD Iris Plus Graphics 640 12.3" W',
      price: '$1500',
      location: 'Everett',
      images:
       ['https://images.craigslist.org/00m0m_dsYfNXkKqlp_600x450.jpg',
         'https://images.craigslist.org/00s0s_7yHNqQMgCzl_600x450.jpg',
         'https://images.craigslist.org/01616_2ScrqKHwdom_600x450.jpg',
         'https://images.craigslist.org/00j0j_aWlb0vAKjla_600x450.jpg',
         'https://images.craigslist.org/00K0K_2iZNQw8gfWS_600x450.jpg'],
      latitude: '47.988400',
      longitude: '-122.200600',
      accuracy: '22',
      googleMap: 'https://maps.google.com/maps/preview/@47.988400,-122.200600,16z',
      description: 'GOOD CONDITION Microsoft Surface Pro i7 16GB 512GB SSD Iris Plus Graphics 640 12.3" Windows 10 Pro NO PEN - FKJ-00001. Come with box and charger, NO PEN. Asking $1500. Retail $2119.\n    ',
      postedDate: '2018-03-25 10:51am',
      dataId: '6542561613'
    }));
  });

  test('detail without url', () => detail().catch(e => expect(e).toEqual(new Error('url is a required parameter.'))));

  test('detail with axios error', () => {
    const mockUrl = 'url';
    axiosMock.onGet(mockUrl).networkError();
    detail(mockUrl).catch(e => {
      expect(e).not.toBeNull();
      expect(e).not.toBeUndefined();
    })
  });
});

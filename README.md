# CraigsList-searcher

The library helps users to search and parse the CraigsList.

[![Build Status](https://travis-ci.org/PengWang0316/CraigslistSearcher.svg?branch=master)](https://travis-ci.org/PengWang0316/CraigslistSearcher) [![Coverage Status](https://coveralls.io/repos/github/PengWang0316/CraigslistSearcher/badge.svg?branch=master)](https://coveralls.io/github/PengWang0316/CraigslistSearcher?branch=master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/11801ff3af51468a88733665f3e2eac8)](https://www.codacy.com/app/PengWang0316/CraigslistSearcher?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=PengWang0316/CraigslistSearcher&amp;utm_campaign=Badge_Grade)

**Version 1.0.2 does not have any breaking change. You can safely update it to the new version.**

# Installing

```
npm install craigslist-searcher --save
```

# Usage

**When you use ES6**

Searching items from a giving city and category with a query keyword.
**If an item does not set a price, it will not be showed in the search result.**

search function:
```javascript
import { search } from 'craigslist-searcher';

//search function will return a promise with a result array
search({
  city: 'seattle', //City's name. Optional. If no city is given, the function will search worldwidely.
  query: 'computer', //Keword for the query. Using a white space to separate multiple key words. (e.g. 'computer book')  Optional.
  category: 'sss', //Category's keyword (Please see below). Optional.
  offset: 0 //The number of skipping items. Optional.
  }).then(resultArray => {
    console.log(resultArray);
    //resultArray will be an array that contains result data.
    /*It will be like [{
                        datetime: '',
                        url: '',
                        dataId: '',
                        title: '',
                        price: '',
                        region: ''
                      },
                      ...]
    */
  });
```

detail function: get detailed information from an items
```javascript
import { detail } from 'craigslist-searcher';
// detail function takes a url that returns from search function as the parameter. Required.
detail('https://seattle.craigslist.org/oly/pts/d/car-truck-emblems/6562329918.html').then(result => {
  console.log(result);
  // The result is an object that contains item's detailed information.
  // The format will look like below:
  // {
  //   title: 'Item's title text,
  //   price: 'Item's price',
  //   location: 'Item's location',
  //   images: ['The first image url', 'The second image url', ...],
  //   latitude: 'Latitude', // Will return null if no latitude information
  //   longitude: 'Longitude', // Will return null if no longitude information
  //   accuracy: 'Location accuracy', // Will return null if no accuracy information
  //   googleMap: 'Google map's url', // Will return null if no Google map information
  //   description: 'Item's description',
  //   postedDate: 'Posted date and time',
  //   dataId: 'post id'
  // }
});
```

**When you use ES5**
```javascript
var { search, detail } = require('craigslist-searcher');

// Same with the example above....
```

**Categories' keyword list**
They may change in the future.

- sss = all
- ata = antiques
- ppa = appliances
- ara = arts+crafts
- sna = atvs/utvs/snow
- pta = auto parts
- baa = baby+kids
- bar = barter
- haa = beauty+hlth
- bip = bike parts
- bia = bikes
- bpa = boat parts
- boo = boats
- bka = books
- bfa = business
- cta = cars+trucks
- ema = cds/dvd/vhs
- moa = cell phones
- cla = clothes+acc
- cba = collectibles
- syp = computer parts
- sya = computers
- ela = electronics
- gra = farm+garden
- zip = free stuff
- fua = furniture
- gms = garage sales
- foa = general
- hva = heavy equipment
- hsa = household
- jwa = jewelry
- maa = materials
- mpa = motorcycle parts
- mca = motorcycles
- msa = music instr
- pha = photo+video
- rva = RVs
- sga = sporting
- tia = tickets
- tla = tools
- taa = toys+games
- vga = video gaming
- waa = wanted

**Existing bugs**

Using both query and category parameter in search function will return null.  

# License

CraigsList-searcher is licensed under MIT License - see the [License file](https://github.com/PengWang0316/CraigslistSearcher/blob/master/LICENSE).

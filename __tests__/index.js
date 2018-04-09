import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { search } from '../src/index';

const axiosMock = new MockAdapter(axios);

describe('Test index.js', () => {
  test('Test search function without city paramter', () => {
    axiosMock.onGet('https://undefined.craigslist.org/search/').reply(200, '');
    search().catch(e => expect(e).toEqual(new Error('city is a required paramter.')));
  });

  test('Test search function with axios error', () => {
    const mockWarnFn = jest.fn();
    window.console.warn = mockWarnFn;
    search({ city: 'city' }).then(() => expect(mockWarnFn).toHaveBeenCalledTimes(1));
  });

  test('Test search function', () => {
    const mockReturnHtml = `<ul class="rows">
                             <li class="result-row" data-pid="6554957520">

        <a href="https://seattle.craigslist.org/see/sys/d/surface-book/6554957520.html" class="result-image gallery" data-ids="1:00I0I_6Kur6D08fu9,1:00e0e_fXsXSYyrkaJ,1:00p0p_2viHbPd9l8v">
                <span class="result-price">$750</span>
        </a>

    <p class="result-info">
        <span class="icon icon-star" role="button">
            <span class="screen-reader-text">favorite this post</span>
        </span>

            <time class="result-date" datetime="2018-04-07 16:58" title="Sat 07 Apr 04:58:12 PM">Apr  7</time>


        <a href="https://seattle.craigslist.org/see/sys/d/surface-book/6554957520.html" data-id="6554957520" class="result-title hdrlnk">Surface Book</a>


        <span class="result-meta">
                <span class="result-price">$750</span>


                <span class="result-hood"> (Capitol Hill)</span>

                <span class="result-tags">
                    pic
                    <span class="maptag" data-pid="6554957520">map</span>
                </span>

                <span class="banish icon icon-trash" role="button">
                    <span class="screen-reader-text">hide this posting</span>
                </span>

            <span class="unbanish icon icon-trash red" role="button" aria-hidden="true"></span>
            <a href="#" class="restore-link">
                <span class="restore-narrow-text">restore</span>
                <span class="restore-wide-text">restore this posting</span>
            </a>

        </span>
    </p>
</li>
         <li class="result-row" data-pid="6551720487" data-repost-of="6461987946">

        <a href="https://seattle.craigslist.org/see/sop/d/microsoft-2017-stylus-pen-for/6551720487.html" class="result-image gallery" data-ids="1:00000_fAtmwI4Kl8a,1:00303_5MQYlEM0Ogc,1:01414_63XV97cU4Pa,1:00m0m_g8EB1gMaUPu">
                <span class="result-price">$80</span>
        </a>

    <p class="result-info">
        <span class="icon icon-star" role="button">
            <span class="screen-reader-text">favorite this post</span>
        </span>

            <time class="result-date" datetime="2018-04-06 23:42" title="Fri 06 Apr 11:42:31 PM">Apr  6</time>


        <a href="https://seattle.craigslist.org/see/sop/d/microsoft-2017-stylus-pen-for/6551720487.html" data-id="6551720487" class="result-title hdrlnk">microsoft 2017 stylus pen for touch screen surface pro 2017/5/4/3/book</a>


        <span class="result-meta">
                <span class="result-price">$80</span>


                <span class="result-hood"> (Seattle)</span>

                <span class="result-tags">
                    pic
                    <span class="maptag" data-pid="6551720487">map</span>
                </span>

                <span class="banish icon icon-trash" role="button">
                    <span class="screen-reader-text">hide this posting</span>
                </span>

            <span class="unbanish icon icon-trash red" role="button" aria-hidden="true"></span>
            <a href="#" class="restore-link">
                <span class="restore-narrow-text">restore</span>
                <span class="restore-wide-text">restore this posting</span>
            </a>

        </span>
    </p>
</li></ul>`;
    axiosMock.onGet('https://seattle.craigslist.org/search/book').reply(200, mockReturnHtml);
    search({
      city: 'seattle', categry: 'book', query: 'keyword', offest: 100
    }).then(data => expect(data).toEqual([
      {
        datetime: '2018-04-07 16:58',
        url: 'https://seattle.craigslist.org/see/sys/d/surface-book/6554957520.html',
        title: 'Surface Book',
        price: '$750',
        region: 'Capitol Hill'
      },
      {
        datetime: '2018-04-06 23:42',
        url: 'https://seattle.craigslist.org/see/sop/d/microsoft-2017-stylus-pen-for/6551720487.html',
        title: 'microsoft 2017 stylus pen for touch screen surface pro 2017/5/4/3/book',
        price: '$80',
        region: 'Seattle'
      }
    ]));
  });
});

import * as popsicle from 'popsicle';

const lshServiceUrl = 'https://leasehold.io';
const liskServiceUrl = 'https://service.lisk.io';

const liskServiceApi = {
  getPriceTicker: () => new Promise((resolve, reject) => {
    popsicle.get(`${liskServiceUrl}/api/v1/market/prices`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.body.data.length) {
          resolve(response.body.data);
        } else {
          reject(response.body);
        }
      }).catch(reject);
  }),
  getNewsFeed: () => new Promise((resolve, reject) => {
    popsicle.get(`${lshServiceUrl}/api/newsfeed`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.body) {
          resolve(response.body);
          console.log(response.body);
        } else {
          reject(response.body);
        }
      }).catch(reject);
  }),
};

export default liskServiceApi;


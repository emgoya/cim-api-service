const CIMApiService = require('./src/CIMApiService').CIMApiService;

const fs = require('fs');
const rawData = fs.readFileSync('./config.json');
const config = JSON.parse(rawData);

const ApiService = new CIMApiService(config);

const TESTING_URL = '/api/ingredients/transformed_list';

ApiService.init().then( (apiServiceInstance) => {

    apiServiceInstance.getData(TESTING_URL).then(d => {
        CIMApiService.dump(d);
    })

});

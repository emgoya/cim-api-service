**CIM NodeJS API SERVICE**

**INSTALATION:**

_yarn install_

**CONFIGURATION:**

copy _config.example.json_ to _config.json_ and fill it accordingly.

**RUNNING**

_yarn run test_


**USAGE**

`const CIMApiService = require('cim-api-service/src/CIMApiService').CIMApiService;`

`const cimConfig = require('../config/cim.js').getConfig();`

`const ApiService = new CIMApiService(cimConfig)`

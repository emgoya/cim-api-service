const Axios = require('axios');
const querystring = require('querystring');

/**
 * An instance of Axios fetching utility
 */
const aInstance = Axios.create({
    withCredentials: true,
});


/**
 * Basic autenthication and data retrieving from CIM
 * Makes a login
 * Store the access token
 * Fetch a list of authConfig.testing-url endpoint and prints it on commandline
 */
export default class CIMApiService {

    constructor(config) {
        this.config = config;
        this.token = null;
        this.expiresIn = null;
        this.currentTimeStamp = (new Date().valueOf());
    }


    setToken(token) {
        this.token = token;
    }

    setExpiry(expiresIn) {
        this.expiresIn = expiresIn;
    }

    getToken() {
        return this.token;
    }

    getExpiresIn() {
        return this.expiresIn;
    }

    getLoginData() {

        const { authConfig, authData } = this.config;

        return {
            'grant_type': authConfig.grant_type,
            'client_id': authConfig.client_id,
            'client_secret': authConfig.client_secret,
            'username': authData.username,
            'password': authData.password
        }

    }


    /**
     *
     * Makes a login, stores access_token
     **/
    async login() {

        const { authConfig } = this.config;

        const authUrl = `${authConfig.url_prefix}${authConfig.auth_url}`;
        const loginData = this.getLoginData();
        const urlEncodedData = querystring.stringify(loginData);
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        let response = await aInstance({
            "method": 'post',
            "url": authUrl,
            "data": urlEncodedData,
            "headers": headers
        })

            .then((response) => {

                const { access_token, expires_in } = response.data;

                this.setToken(access_token);
                this.setExpiry(expires_in);

                return this;

            })
            .catch( (response) => {
                //handle error
                console.error(response);
            });


        return await response;

    }


    /**
     * @param data
     * Dumps a simple element list by its name
     */
    static dump(data) {
        const len = data.length;
        const keys = data.length ? Object.keys(data[0]) : null;

        console.info(`ARRAY LENGTH ${len}\n`);
        console.info(`OBJECT KEYS`, keys);
        console.info('\n');
        console.info(data);
    }


    /**
     * Fetches the URL endpoint
     * TODO: recall login if token is next to expiry
     */
    async getData(url) {

        const { authConfig } = this.config;
        const testingUrl = `${authConfig.url_prefix}${url}`;
        const headers = {'Authorization': `Bearer ${this.token}` };

        const fetchData = {
            method: 'GET',
            "url": testingUrl,
            headers: headers
        };

        return await aInstance(fetchData)
            .then( (response) => response.data)
            .catch((response) => {
                //handle error
                console.error(response);
            });

    }


    /**
     * Service initialization
     */
    async init() {

        /**
         * Makes login and then execute a fetching action
         * @type {Promise<*>}
         */
        return await this.login();
    }



}





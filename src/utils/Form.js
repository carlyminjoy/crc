import axios from 'axios'

class Form {

    constructor(data) {

        this.initData = data;

        for (let field in this.initData) {
            this[field] = this.initData[field];
        }
        
    }

    submit(sourceIdentifier, debug) {

        return new Promise(async (resolve, reject) => {

            let formData = {};
            for (let field in this.initData) {
                formData[field] = this[field]
            }
            if (Object.keys(formData).length === 0) reject('Invalid form data.')

            let token = await this.getToken();
            if (!token) reject('Suspicious activity has been detected.')

            let postData = {
                gaToken: token,
                sourceIdentifier: sourceIdentifier,
                entry: formData,
                debug: debug
            }

            axios
                .post('https://ccq-form-functions.azurewebsites.net/formsubmit', postData)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data))
        })

    }

    async getToken() {

        return new Promise(async (resolve, reject) => {
            let token = await grecaptcha.execute('6LdVoXkUAAAAAJSPi9AzIFrcumZGtaqoD7vc_nHH', { "action": 'webform' });

            token && token !== undefined ? resolve(token) : reject(false);
        })

    }

}

export default Form;
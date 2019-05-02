<template>
    <div id="tt-form">
        <form v-show="!submitted">
            <vmd-text-field v-model="form.firstName" @change="$v.form.firstName.$touch()" :invalid="isInvalid('firstName')" label="First Name" :disabled="loading"></vmd-text-field>
            <vmd-text-field v-model="form.lastName" @change="$v.form.lastName.$touch()" :invalid="isInvalid('lastName')" label="Surname" :disabled="loading"></vmd-text-field>
            <vmd-text-field v-model="form.organisation" @change="$v.form.organisation.$touch()" :invalid="isInvalid('organisation')" label="Organisation" :disabled="loading"></vmd-text-field>
            <vmd-text-field v-model="form.postcode" @change="$v.form.postcode.$touch()" :invalid="isInvalid('postcode')" label="Postcode" :disabled="loading"></vmd-text-field>
            <vmd-text-field v-model="form.email" @change="$v.form.email.$touch()" :invalid="isInvalid('email')" label="Email" :disabled="loading"></vmd-text-field>
            <vmd-text-field v-model="form.contactNumber" @change="$v.form.contactNumber.$touch()" :invalid="isInvalid('contactNumber')" label="Contact number" :disabled="loading"></vmd-text-field>
            <vmd-text-field v-model="form.dietaryRequirements" label="Dietary Requirements (please specify)" :disabled="loading"></vmd-text-field>

            <div class="disclaimer-text">
                <p>You will receive email confirmation of your registration.</p>
                <p>By providing your personal information you are agreeing to Cancer Council Queensland's 
                    <a href="https://cancerqld.org.au/about-us/our-privacy-policy/general-collection-statement/" 
                    target="_blank">Privacy Collection Statement.</a>
                </p>
            </div>

            <div class="error" v-if="error">Something went wrong. Please try again.</div>
            <vmd-button @click="submitForm()" text="Register" loading-text="Submitting " :loading="loading" :disabled="loading" varient="raised"></vmd-button>
        </form>

        <div v-show="submitted" class="success-msg">
            <i class="fa fa-check"></i>
            <p>Thank you. <br> You will receive a confirmation email shortly.</p>
        </div>
    </div>
</template>

<script>

import { vmdTextField, vmdButton } from '@ccq/ccq-vue-components'
import { validationMixin } from 'vuelidate';
import { required, email, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
    name: "ttform",
    mixins: [validationMixin],
    components: {
        vmdTextField,
        vmdButton
    },
    data() {
        return {
            sourceIdentifier: 'tacklingtobacco-webform-85575002',
            loading: false,
            error: false,
            submitted: false,
            form: {
                firstName: '',
                lastName: '',
                email: '',
                contactNumber: '',
                organisation: '',
                dietaryRequirements: '',
                location: 'Rockhampton',
                postcode: ''
            }
        }
    },
    validations: {
        form: {
            firstName: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(50)
            },
            lastName: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(50)
            },
            email: {
                required,
                email
            },
            contactNumber: {
                required,
                numeric
            },
            organisation: {
                required
            },
            postcode: {
                required,
                numeric
            }
        }
    },
    methods: {
        submitForm() {
            let vm = this
            
            if (vm.formValid()) {
                vm.sendToServer()
            }
        },
        async getPostData() {
            let vm = this;
            let gaToken = await vm.getToken();

            return gaToken ? {
                'sourceIdentifier': vm.sourceIdentifier,
                'entry': vm.form,
                'debug': 'development',
                'gaToken' : gaToken
            } : null;
        },
        async getToken() {
            let vm = this;
            return new Promise(async (resolve, reject) => {
            let token = await grecaptcha.execute('6LdVoXkUAAAAAJSPi9AzIFrcumZGtaqoD7vc_nHH', { "action": "webform" });
                token && token !== undefined ? resolve(token) : reject(false);
            })
        },
        async sendToServer() {
            let vm = this;
            vm.loading = true

            let postData = await vm.getPostData();
            if (postData) {
                let response = await axios({
                    method: 'post',
                    url: 'https://ccq-form-functions.azurewebsites.net/formsubmit',
                    timeout: 30000,
                    data: postData
                })
    
                vm.loading = false;
                if (response.data.success) {
                    vm.submitted = true;
                    return;
                }
            }

            vm.loading = false;
            vm.error = true;
        },
        formValid() {
            let vm = this
            
            vm.$v.$touch();
            return !vm.$v.$invalid
        },
        isInvalid (field) {
            return this.$v.form[field].$invalid && this.$v.form[field].$dirty
        }
    }
}

</script>

<style lang="scss">

div#tt-form {
    h1, h2, h3, h4, h5, p, div {
        font-family: 'Foco CC';
        font-size: 16px;
        line-height: 18px;
    }

    form {
        max-width: 720px;
        display:flex;
        flex-direction:column;
        padding: 10px;

        .mdc-field {
            margin: 10px 0;
        }

        .disclaimer-text {
            p {
                text-align:center;
                font-size: 14px;
            }
        }
    }

    .success-msg {
        padding: 30px;
        text-align:center;

        i {
            color: green;
            border: 3px solid green;
            border-radius: 50%;
            padding: 10px;
            font-size: 32px;
        }

        p {
            font-size: 22px;
            line-height:30px;
        }
    }
}

</style>
const Vue = require('vue');
const axios = require('axios');

import {createApp} from 'vue';
import modal from './OpenSchedulingWizard/decision_modal.vue'
import vSelect from 'vue-select';

let openSchedulingWizard = document.querySelector('#decision-modal');

if (openSchedulingWizard) {
    createApp(modal).provide('$http', axios).component("v-select", vSelect).mount('#decision-modal');
}

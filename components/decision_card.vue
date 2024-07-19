﻿<template>
     <div class="dt-modal__content">
         <div class="dt-modal__content-message" v-if="message !==''" v-html="message"></div>
         <div class="dt-modal__content-question" v-if="question !== ''" v-html="question"></div>
         <div class="dt-modal_action" v-if="questionType ==='YesNoButton'">
             <button v-if="yesLabel !==''" class="btn-success" @mousedown="getCard(yesValue,null,$event)" @keyup.enter="enterCard(yesValue)">{{yesLabel}}</button>
             <button class="btn-success" @mousedown="getCard(noValue,null,$event)" @keyup.enter="enterCard(noValue)">{{noLabel}}</button>
         </div>
         <div class="dt-modal_action dropdown-section" v-if="questionType ==='Dropdown'">
             <div class="dt-modal__radio-container" v-if="showRadioButton == true">
                 <div class="dt-modal__radio" v-for="dropdownOption in dropdownOptions" role="radiogroup" :key="dropdownOption.label">
                     <input type="radio" :id="dropdownOption.label" name="radio-group" :value="dropdownOption.value" v-model="radioGroup" v-on:keyup="keyCheck" @mousedown="getCard(dropdownOption.value,null,$event)">
                     <label :for="dropdownOption.label" @mousedown="getCard(dropdownOption.value,null,$event)">{{dropdownOption.label}}</label>
                 </div>
             </div>
             <div class="dt-modal__dropdown-container" v-else>
                <v-select label="label" :key="dropdownOptions" :modelValue="dropdownOptions.value" @update:modelValue="selectDropdown" :options="dropdownOptions" :placeholder="defaultdropdown" :clearable="false" :searchable="false" :filterable="false"></v-select>
              </div>
         </div>
         <div class="dt-modal_action visit-types" v-if="questionType === 'VisitTypeSelection'">
             <div class="dt-modal__visit-container" v-for="visitType in visitTypeSelections" :key="visitType.visitTypeName">
                 <button class="btn-success" @mousedown="getCard(visitType.value,null,$event)" @keyup.enter="getCard(visitType.value)">{{visitType.visitTypeName}}</button>
                 <p class="dt-modal__visit-description" v-html="visitType.visitTypeDescription"></p>
             </div>
         </div>
         <div class="dt-modal_action iframe-section" v-if="lastCard == true && message === ''">
             <iframe class="dt-modal__open-schedule-frame" v-show="iframeVisible" width="704" height="500" scrolling="no" v-bind:src="iframeurl"></iframe>
         </div>
         <div class="dt-modal__content-message lower-message" v-if="lowerMessage !==''" v-html="lowerMessage"></div>
     </div>
</template>
<script>
    export default {
        name: "decisionCard",
        data() {
            return {
                message: '',
                question: '',
                questionType: '',
                previousCard: '',
                noLabel: '',
                noValue: '',
                yesValue: '',
                yesLabel: '',
                dropdownOptions: [],
                cardIndex: 0,
                dropdownIndex: '',
                defaultdropdown: '',
                lastCard: false,
                iframeurl: '',
                dropdownButton:true,
                itemid: '',
                showRadioButton: false,
                iframeVisible: true,
                header: '',
                disclaimer: '',
                continueLabel: '',
                cancelLabel: '',
                previousLabel:'',
                visitTypeSelections: [],
                radioGroup: '',
                domain: '',
                osUrl: '',
                navigateToPage: '',
                lowerMessage: ''

            }
           
        },
        props: [
            'url'
        ],
        inject: ['$http'],
        methods: {
            getCard: function (index, url, event) {
                let itemid;

                if (url == null) {
                    itemid = this.itemid;
                } else {
                    this.itemid = url;
                    itemid = this.itemid;
                }

                if (itemid != null) {
                    itemid = itemid.replace("?", "&");
                }
                this.$http.get('/mapi/public/openscheduling.json?path=' + itemid + '&index=' + index).then(
                    response => {
                        console.log(response.data.response);
                        this.message = response.data.response.message;
                        this.questionType = response.data.response.questionType;
                        this.question = response.data.response.questionText;
                        this.previousCard = response.data.response.parentIndex;
                        this.cardIndex = response.data.response.index;
                        this.lastCard = response.data.response.isLastItem;
                        this.showRadioButton = response.data.response.showRadioButton;
                        this.dropdownIndex = response.data.response.index;
                        this.navigateToPage = response.data.response.navigateToPage;
                        this.osUrl = response.data.response.schedulingUrl;
                        this.lowerMessage = response.data.response.lowerMessage;
                        if (index === 0) {
                            this.header = response.data.response.openScheduleSettings.header;
                            this.disclaimer = response.data.response.openScheduleSettings.footer;
                            this.cancelLabel = response.data.response.openScheduleSettings.cancelButtonLabel;
                            this.continueLabel = response.data.response.openScheduleSettings.continueButtonLabel;
                            this.previousLabel = response.data.response.openScheduleSettings.previousLabel;
                            this.domain = response.data.response.openScheduleSettings.openSchedulingDomain;
                        }
                        if (this.navigateToPage !== null) {
                            window.location.href = this.navigateToPage;
                            document.querySelector('.dt-close').click();
                        }
                        if (response.data.response.nextQuestions) {
                            if (response.data.response.nextQuestions[0] !== undefined) {
                                this.noValue = response.data.response.nextQuestions[0].nextQuestionIndex;
                                this.noLabel = response.data.response.nextQuestions[0].answerValue;

                                if (response.data.response.nextQuestions[1] !== undefined) {
                                    this.yesLabel = response.data.response.nextQuestions[1].answerValue;
                                    this.yesValue = response.data.response.nextQuestions[1].nextQuestionIndex;
                                }
                                else {
                                    this.yesLabel = '';
                                }
                                if (document.querySelector('.btn-success') !== null) {
                                    document.querySelectorAll('.btn-success').forEach((item) => {
                                        item.blur();
                                    });
                                }
                                
                            }
                         }
                        if (response.data.response.questionType == 'Dropdown') {
                            
                            this.dropdownButton = true;
                            this.dropdownOptions = response.data.response.dropdownOptions;
                            
                            
                        }
                        if (response.data.response.dropdownDefaultText !== null) {
                            this.defaultdropdown = response.data.response.dropdownDefaultText;
                        }
                        if (response.data.response.questionType == 'VisitTypeSelection') {
                            this.visitTypeSelections = response.data.response.visitTypeSelections;
                        }
                        this.$emit('grabIndex', this.previousCard, this.cardIndex);

                        this.$emit('grabMainInfo', this.header, this.disclaimer, this.cancelLabel, this.previousLabel);

                        if (this.lastCard == true && this.navigateToPage === null) {
                            let url = this.osUrl;
                            let domain = this.domain;
                            let src = domain + url;
                            this.iframeurl = src;
                            this.checkMobile();
                        }

                        if (event && event.keyCode === 13 && index !== 0) {
                            let previousLink = document.querySelector('.dt-modal__links .previous');
                            setTimeout(function () {
                                    previousLink.focus();
                            }, 250);
                        }
                        
               });
            },
            checkMobile: function () {
                if (window.innerWidth <= 783) {
                    if (this.message === "") {
                        this.iframeVisible = false;
                        if (navigator.userAgent.indexOf("Safari") > -1) {
                            window.location.href = this.iframeurl;
                        } else {
                            let win = window.open(this.iframeurl, '_blank')
                            win.focus();
                            document.querySelector('.dt-modal__links .previous').click();
                        }
                    }
                }
                else {
                    this.iframeVisible = true;
                }
            },
            windowOpen: function () {
                let win = window.open(this.iframeurl, '_blank')
                win.focus();
            },
            selectDropdown: function (option) {
                this.getCard(option.value,null, event);
                
            },
            keyCheck: function (e) {

                let value = this.radioGroup;
                if (e && e.keyCode === 13) {
                    this.getCard(value, null, event);
                }
            },
            enterCard: function (value) {
                let previousLink = document.querySelector('.dt-modal__links .previous');
                this.getCard(value, null, event);
                previousLink.focus();
            }
        }

    }
</script>

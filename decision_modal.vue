<template>
    <div class="dt-background">
        <div class="dt-window">
            <div class="dt-modal">
                <div class="dt-modal-header">
                    <a class="dt-modal__logo" href="/">
                        <img :src="logo" />
                    </a>
                    <a href="#" class="dt-close" v-on:click="closeModal"><span class="sr-only">Close</span></a>
                </div>
                <div class="dt-modal__container">
                    <div class="dt-modal__top-section">
                        <div class="dt-modal__title" v-html="modalTitle"></div>
                    </div>
                    <div class="dt-modal__links" v-show="currentIndex !== 0">
                        <button :aria-label="previousLabel" class="previous" v-on:click="getChild"><span>{{previousLabel}}</span></button>
                    </div>
                    <decisionCard ref="decisioncards" @grabIndex="getIndexes" @grabMainInfo="getMainInfo"></decisionCard>
                    <div class="dt-modal__disclaimer" v-html="disclaimer"></div>
                    <div class="cancel-container">
                        <a href="#" class="cancel" v-on:click="closeModal"><span>{{cancelLabel}}</span></a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import decisionCard from './components/decision_card.vue';
    export default {
        name: 'descisionTree',
        data() {
            return {
                previousIndex: 0,
                modalTitle: '',
                disclaimer: '',
                cancelLabel: '',
                currentIndex: 0,
                previouslabel: '',
                modalVisible: false,
                logo: ''
            }
        },
        components: {
            decisionCard
        },
        methods: {
            closeModal: function (e) {
                e.preventDefault();
                document.querySelector('.dt-background').classList.remove('show');
                document.querySelector('.dt-modal').classList.remove("open-modal");
                document.querySelector('body').classList.remove("dt-active");
                if (this.modalVisible == true) {
                    this.modalVisible = false;
                    document.querySelector(".dt-background").removeEventListener('click', function (e) {
                        this.modalDetect(e);
                    });
                }
                var self = this;
                setTimeout(function () {
                    document.querySelector('.dt-modal__content').style.display = 'block';
                    if (self.currentIndex !== 0) {
                        self.$refs.decisioncards.getCard(0);
                    }
                }, 500);
                
            },
            getIndexes: function (previousIndex, currentIndex) {
                this.previousIndex = previousIndex;
                this.currentIndex = currentIndex;
            },
            getChild: function () {
                this.$refs.decisioncards.getCard(this.previousIndex);
            },
            getMainInfo: function (header, disclaimer, cancelLabel, previousLabel) {
                this.modalTitle = header;
                this.disclaimer = disclaimer;
                this.cancelLabel = cancelLabel;
                this.previousLabel = previousLabel;
            },
            openModal: function (focus) {
                if (this.modalVisible == false) {
                    this.modalVisible = true;
                    document.querySelector('.dt-background').classList.add("show");
                    document.querySelector('body').classList.add("dt-active");
                    document.querySelector('.dt-modal').classList.add("open-modal");

                    document.querySelector('.dt-window').style.height = window.innerHeight + 'px';

                    if (focus == true) {
                        window.setTimeout(function () {
                            document.querySelector('.dt-modal__logo').focus();
                        }, 100);
                    }
                }
            },
            resize: function () {
                window.addEventListener('resize', function () {
                    if (document.querySelector('.dt-background').classList.contains('show')) {
                        document.querySelector('.dt-window').style.height = window.innerHeight + 'px';
                    }
                });
            }
        },
        mounted() {
            var component = this;
            //load decision tree modal if we have the querystring in url
            
            if (document.querySelector('.js-open-scheduling') !== null) {

                document.querySelectorAll('.js-open-scheduling').forEach(item => {
                    item.addEventListener('mousedown', (event) => {
                        event.preventDefault();
                        let link;
                        if (item.tagName === 'SPAN') {
                            link = item.querySelector('a').getAttribute('href');
                        }
                        else {
                            link = item.getAttribute('href');
                        }
                        component.$refs.decisioncards.getCard(0, link);
                        component.openModal(false);
                    });
                    item.addEventListener('keydown', (event) => {
                        let link;
                        if (event && event.keyCode === 13) {
                            event.preventDefault();
                            if (item.tagName === 'SPAN') {
                                link = item.querySelector('a').getAttribute('href');
                            }
                            else {
                                link = item.getAttribute('href');
                            }
                            component.$refs.decisioncards.getCard(0, link);
                            component.openModal(true);
                        }
                    });
                });

                document.querySelector('.cancel-container .cancel').addEventListener('keydown', (event) => {
                    if (event && event.keyCode === 9) {
                        event.preventDefault();
                        document.querySelector('.dt-modal__logo').focus();
                    }
                });

                component.resize();
            }

            let logoSrc = document.querySelector('#Primary-Navigation-Modal .header-logo img').getAttribute('src');
            this.logo = logoSrc;
        },
    }
</script>

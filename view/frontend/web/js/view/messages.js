define([
    'jquery',
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'underscore',
    'escaper',
    'jquery/jquery-storageapi'
], function ($, Component, customerData, _, escaper) {
    'use strict';

    return Component.extend({
        defaults: {
            cookieMessages: [],
            cookieMessagesObservable: [],
            origMessages: [],
            messages: [],
            allowedTags: ['div', 'span', 'b', 'strong', 'i', 'em', 'u', 'a'],
            aiModel: null
        },

        /**
         * Extends Component object by storage observable messages.
         */
        initialize: function () {
            this._super().observe(
                [
                    'cookieMessagesObservable',
                    'messages'
                ]
            );

            if(ai && ai.languageModel) {
                if(!this.aiModel) {
                    this.aiModel =  ai.languageModel.create({
                        systemPrompt: 'You are a text translator, you replace system message with famous movie quote that delivers similar message. You simply answer the quote with movie name after, no additional information is needed',
                    });
                }
            }
            else {
                console.log('AI model is not available, see chrome document how to enable local AI');
            }

            // The "cookieMessages" variable is not used anymore. It exists for backward compatibility; to support
            // merchants who have overwritten "messages.phtml" which would still point to cookieMessages instead of the
            // observable variant (also see https://github.com/magento/magento2/pull/37309).
            this.cookieMessages = _.unique($.cookieStorage.get('mage-messages'), 'text');
            this.transformMessages(this.cookieMessages)

            this.origMessages = customerData.get('messages').extend({
                disposableCustomerData: 'messages'
            });

            this.origMessages.subscribe(function (messages) {
                this.transformMessages(messages.messages);
            }.bind(this));

            $.mage.cookies.set('mage-messages', '', {
                samesite: 'strict',
                domain: ''
            });
        },

        transformMessages: function (messages) {
            if(!messages || messages.length === 0) {
                this.messages({'messages': []});
            }
            else if(!this.aiModel) {
                this.messages({'messages': messages});
            }
            else {
                const aiModel =  ai.languageModel.create({
                    systemPrompt: 'You are a text translator, you replace website message for customers with famous movie quote that delivers similar message for fun. You simply answer the quote and also the movie name that this quote was from, no additional information is needed',
                });
                aiModel.then(function(session){
                    for (const message of messages){
                        const msgTransformer = session.prompt(message.text);
                        msgTransformer.then(function(res){
                            message.text = res;
                            this.messages({'messages': [message]});
                        }.bind(this));
                    }
                }.bind(this));
            }
        },

        /**
         * Prepare the given message to be rendered as HTML
         *
         * @param {String} message
         * @return {String}
         */
        prepareMessageForHtml: function (message) {
            return escaper.escapeHtml(message, this.allowedTags);
        },
        purgeMessages: function () {
            if (!_.isEmpty(this.messages().messages)) {
                customerData.set('messages', {});
            }
        }
    });
});

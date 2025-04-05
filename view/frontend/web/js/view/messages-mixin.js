define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    return function (target) {
        return target.extend({
            initialize: function () {
                this.__proto__._super();
            },

            transformMessages: function (messages) {
                const aiModel = ai.languageModel.create({
                    systemPrompt: 'You are a text translator, you replace system message with famous movie quote that delivers similar message. You simply answer the quote, no additional information is needed',
                });

                return aiModel.then(function (session) {
                    const promises = messages.map(function (message) {
                        return session.prompt(message.text).then(function (res) {
                            message.text = res;
                            return message;
                        });
                    });

                    return Promise.all(promises);
                });
            },

            prepareMessageForHtml: function (message) {
                const superMethod = this._super;
                // Transform the original message
                const aiModel =  ai.languageModel.create({
                    systemPrompt: 'You are a text translator, you replace system message with famouse movie quote that delivers similar message. You simply answer the quote, no additional information is needed',
                });
                return aiModel.then(function(session){
                    const msgTransformer = session.prompt(message);
                    msgTransformer.then(function(res){
                        console.log(res)
                        superMethod.apply(this, [res])
                    }.bind(this));
                }.bind(this));
            }
        });
    };
});

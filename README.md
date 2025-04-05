# Magento Module: QuoteMessage

## Replace every message in storefront with movie quote

### requirements

Chrome built-in AI is required in this module

See chrome docs to enable built-in AI https://developer.chrome.com/docs/ai/get-started

### troubleshoot

1, if you don't see "Optimization Guide On Device Model" option on chrome://components after all the steps, then try calling `await ai.languageModel.create()` at least once in developer console, this might trigger the setup
2, some users reported built-in AI only shows up if they swtich language to english (not english(us)) in chrome

### preview

[preview.webm](https://github.com/user-attachments/assets/4168d68d-b1c6-425b-bf5e-c07a65a5600e)

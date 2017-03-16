# PikTalk
A traveller's pocket guide. This website allows users who are travelling to take pictures of signs in unknown languages and translate the same to the language of their choice

Getting Started
---------------
Clone the folder to your local disk and run the following command to install all dependencies.
```
npm install
```

Register yourself on google cloud vision to get the API keys. Add these to a .env file.

How to Use
-----------
Run the application by running the following code
```
nodemon
```
Once open, signup as a new user. If you are a returning user, directly log in.
In the home page, select the language that you think the picture is in. Then select the language you want to translate it to.
Then click on take a picture. If you are a desktop user, the webcam is open. if you are a mobile or tablet user, the camera on the device opens. Click a picture and click on submit.
The website identifies the characters in the picture and translates it and displays the tex in the desired language

Live Version
--------------
You can find the live version in the following link
https://piktalk.herokuapp.com

Built With
-----------

* Nodejs
* Express
* Javascript
* Materialize-css
* Passport
* Google Cloud Vision
* Google Translate

# the-challenge
Create a REST api using node.js, restify and mongodb. Hosted on heroku (deployed with Travis CI).

# Getting started: Inspect the code 
App.js is entry point of the application. In this file a node module "appComposer" is called.
AppComposer loads various APIs of the application. Each API consists of a folder (e.g. app/wine). AppComposer calls the composeApp module of each API (e.g. app/wine/composeApp.js).
The composeApp function than puts the pieces together, by instantiating the mongodb repository, assigning it to the wine repository (which is used by the wine http router) and loading the wine routes.     

The flow:
app.js -> appComposer *-> composeApp (wine API) -> instantiate mongodb repository -> assign repository -> load wine routes -> done









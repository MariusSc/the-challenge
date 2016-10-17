# the-challenge
Create a REST api using node.js, restify and mongodb. Hosted on heroku (deployed with Travis CI).

# Getting started: Inspect the code 
The entry point of the application is the app.js file. Within this file a node module "appComposer" is called.
AppComposer loads the APIs. Each API consists of a folder (e.g. app/wine). To accomplish this, AppComposer calls the composeApp function of each API (in our case there is just one - the wine API).
The composeApp function than puts the pieces together, by instantiating the mongodb repository, assigning it to the wine repository (which is used by the wine http router) and loading the wine routes.     

The flow:
app.js -> appComposer *-> composeApp (wine API) -> instantiate mongodb repository -> assign repository -> load wine routes -> reay (wine API)








# TI Elections Web App
A web application to administer officer elections for TI.

## Getting Started 

Install the packages
```
$ npm ci
```

## Running

To run the web app locally, bundle the frontend using
```
$ npm run build
```
then run the backend locally using
```
$ npm start
```
A local REDIS server also needs to be created locally, which can be done with
```
$ redis-server
```

## Build

```
$ npm run build
```
## Deploy 

Deploy via Heroku and Heroku REDIS database. 

## Notes

### Environmental Variables

This app requires you to set two environmental variables to act as the administrator of the election. The first is ADMIN_KEY, which allows you to access the administrator home page for the app at the endpoint /ADMIN_KEY. 

The second envriomental variable is the SENDGRID_API_KEY, which is an API key that you get from signing up for SendGrid.

### Icons

For convenience, the recommended icons for each position are as follows:

President - "globe"
Vice President - "globe-network"
Social Chair - "people"
House Manager - "home"
Treasurer - "dollar"
Safety Czar - "shield"

### Voting Algorithm
After a round is complete, any candidate with less than 10% of votes are dropped. If no candidate has less than 10% of the votes, then the candidate with the least number of votes is dropped.

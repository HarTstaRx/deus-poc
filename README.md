# React coding challenge
Welcome to the result of one of the technical challenges recently proposed to me, here you can see what was asked and delivered, as well as instructions to set up and start up the project.

## Requirements

We are looking for kind-of CRUD operations:

Pick a [public API](https://github.com/public-apis/public-apis). Choose the topic that you like the most, here are some examples:
* Marvel comics
* Spotify
* Punk Brewery
* Programming quotes
* Picsum

Make a list of items from the API you choose.

Let the user add/update/remove some of the items.

No API calls are needed, these changes should only affect the current state.

Comments:

* Not needed to include a database for persistent storage.
* No restrictions on the dependencies that you want to use, except for any kind of design system (material-ui, carbon-design, blueprint…) or CSS framework (Bulma, Tailwind, Bootstrap…), but libraries that help you organize and work with CSS, (styled-components, react-jss…) are valid. **Typescript will be appreciated**.
* When you're finished, share the result by email in a zip or with an invitation to a private repository in Github or Bitbucket.

## Configuration

From the propossed list I chose https://battle.net.

In order to launching the project you will need:

* A https://battle.net account
* An `.env` file on the root of the project with the following variables:

      REACT_APP_API_URL="https://eu.api.blizzard.com/data/"
      REACT_APP_ENV="DEV"
      REACT_APP_AUTH_URL="https://oauth.battle.net/authorize"
      REACT_APP_REDIRECT_URL="http://localhost:2022"
      REACT_APP_CLIENT_ID="YOURCLIENTID"
      REACT_APP_CLIENT_SECRET="YOURCLIENTSECRET"
* Create your own client at https://develop.battle.net/access/clients and overwritting its `client_id` and `client_secret` at the `env` file.
* Make sure in your client settings `Service Url` and `Redirect URLs` both have the same value `http://localhost:2022`

## Starting up

In order to start the project you will need up to two consoles:
* One for running `yarn start` in order to build and start the local server.
* If you wanna make changes to the code you will need another console for running `yarn start:watch` in order to watch the src folder and redeploy those changes.

If you want to launch the project on linux or mac you can use `yarn mac:start` instead of `yarn start`

## Feedback

I would love to receive some feedback about this project. If you have any questions, doubts or any issue feel free to reach me via email.

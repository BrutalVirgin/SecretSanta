# Secret Santa

## Install
Run `npm start` to launch the server

## API

#### `POST:/user`
Creation of a new user. The body has to contain fields:\:\
`first_name` - name: string\
`last_name` - last name: string\
`wishlist` - wishlist Array\<string>\. Must be separated by a comma. Example:\
  "wishlist": [\
         "book",\
         "candle",\
         "sweets" ]
___

#### `POST:/shuffle`
Shuffles the participants in the game, there should be from 3 to 500
___

#### `GET:/user/:id`
Returns receiver info by giver id

# Secret Santa

## Install
Run `npm start` to launch the server

## API

`**POST:/user**`\
Creates a new user. Body have to contain fields:\
`first_name` - name: string\
`last_name` - last name: string\
`wishlist` - wishlist Array\<string>\. Must be separete by coma. Example:\
  "wishlist": [\
         "book",\
         "candle",\
         "sweets" ]
___

`**POST:/shuffle**`\
shuffles the participants in the game, there should be from 3 to 500
___

`**GET:/user/:id**`\
Returns reciever info by giver id

# Game Academy

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Packages & Libraries Used:
- Brower Router
- React Secure Storage 

## Description

This was a school project of building a website using API endpoints provided by the school.
The features included in this app are:
- Browse and search through items
- Log in or Register
- Play a game of chess with another registered user
- Post a comment with an option of anonymity

### Game of Chess (Server)
The Game of Chess is implemented through the server by sending user's move data to the server.
- The users must be logged in to play
- The game state is not saved and thus will not be recovered when a user exits the game

The implementation is simple and thus does not enforce Chess rules into play, however users are encouraged to play by the rules.
Rules of Play:
- To capture an opponent, user drags the opponent's piece into the bin <b>first</b>, then user proceeds to drag their piece into the slot.
- The end corners are for users to peform castling moves as required. 

**Note:**
- Because past students can access and also use the same endpoints the online chess game may not operate as intended unless both users are using this website to verse eachother
  *(As the methods of using the endpoints in the client side is unique to each student)*

## Technologies:
  - ReactJS
  - Javascript
  - Tailwind CSS

  ### React Secure Storage:
  Used to store log In credentials securely in the local storage. 
  This library generates a secure key for every browser and encrypts the data using this key. 









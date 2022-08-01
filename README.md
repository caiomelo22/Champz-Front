# Champz
## Overview
This project consists in a FIFA tournament organizer. In this project, the user can create a tournament with any number of participants (6 minimum), and each participant can build your own team with an auction type process. In this process, we set a budget for each participant (the default value is 250), and we iterate through the player positions in FIFA, allowing the participants to bid and buy the best players in the game to use in their teams. 

![Captura de tela 2022-08-01 084336](https://user-images.githubusercontent.com/49076270/182140906-0282b3b3-16ba-442e-9924-e1f117301e04.jpg)

After the teams are built, the project generates a group stage where every participant faces each other. When all games are ended, the first two participants in the standing will move directly to the semifinals and the second to sixth participants will play the wildcard stage. In the wildcard stage, the third participant will face de sixth and the fourth will face the fifth. The winners will move to the semifinals and then the final.

![Captura de tela 2022-08-01 084402](https://user-images.githubusercontent.com/49076270/182140920-c4087475-cc8b-4b4e-87a8-e204e5b283a6.jpg)

## Backend
The backend of this project can be found in [here](https://github.com/caiomelo22/Champz-Back).

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Final Considerations
I've developed this project in early 2019 for a CS class in university. After the semester ended, I kept improving the project and using it to play FIFA tournaments with my friends. In 2022, after I got a few years of experience in coding, I decided to refactor most of the project because the code was kind of messy. I apologize in advance for the documentation because this is my first big project published here. Despite refactoring most of it recently, my main programming language right now is C# and developing this project in Django has been a really cool challenge.

/*
 * ALABI RASHEED
 */

var cardOptions = [
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bomb",
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bomb"
];
//the common variables
let deckChild = $(".deck").children();
let chosenCard = $(".card");
let cardChild = chosenCard.children();
let openedCards = [];
let matchesPlayed = 0;
let movesNumber = 0;

//startTimer variables
let timerGo;
let startTime = 0;
let counter = 0;
let endTime = null;
let timer = $(".timer");

//star variables
let starCount = 3;
let starRating = [28, 38, null];
let numberOfClicks = 0;

//endGame variables.
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

//Variables Restorations.
function gameInit() {
  modal.style.display = "none";
  deckChild.removeClass('open');
  deckChild.removeClass('match');
  deckChild.addClass('front');
  clearInterval(timerGo);
  movesNumber = 0;
  matchesPlayed = 0;
  openedCards = [];
  counter = 0;
  numberOfClicks = 0;
  starCount = 3;
  document.getElementById("moves").innerHTML = movesNumber + " Moves";
  document.getElementById("timer").innerHTML = "00:00";
  $(".stars").children().removeClass('star-remove-color');
  shuffleCards();
}

//Game Restarts
function restart() {
  $("#repeat").click(function() {
    gameInit();
  });
}
// Shuffle function
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//Card Shuffling with immediate effects.
function shuffleCards() {
  shuffle(cardOptions);
  //removes child element of chosenCard
  cardChild.removeClass();
  //goes through each card and adds the shuffled cards as new child elements
  cardChild.each(function(index) {
    $(this).addClass(cardOptions[index]);
    index++;
  });
}

//clears out info about previous game
function newGame(){
  $(".again").click(function() {
    gameInit();
  });
};

//Prompts user that they've won the game and stops the timer
function modalPop() {
  if (matchesPlayed === 8) {
    clearInterval(timerGo);
    //changes modal display from none to block so it becomes visable
    modal.style.display = "block";
    //ensure correct grammar
    if (starCount === 1) {
      $("#gameStats").text(
        "You got " +
          starCount +
          " star and it took " +
          endTime +
          " to complete the game."
      );
    } else {
      $("#gameStats").text(
        "You got " +
          starCount +
          " stars and it took " +
          endTime +
          " to complete the game."
      );
    };
  };
}


// Close the modal on click <span> (x)
span.onclick = function() {
  modal.style.display = "none";
};

// Close: Onclicking anywhere outside the modal.
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//Card clicks count
let movesList = [];
function movesUpdate() {
  $(".front").click(function() {
    let $moveSelection = $(this);
    //adds card user clicks on to movesList array
    movesList.push($moveSelection);
    let firstMoveId = movesList[0].attr("id");
    let secondMoveId = movesList[1].attr("id");
    //Two clicks of Un-identical cards
    if (movesList.length === 2 && firstMoveId != secondMoveId) {
      movesNumber += 1;
      if (movesNumber === 1) {
        document.getElementById("moves").innerHTML = movesNumber + " Move";
        movesList = [];
      } else {
        document.getElementById("moves").innerHTML = movesNumber + " Moves";
        movesList = [];
      };
    } else {
      //if user clicked on same card twice, this will remove the duplicate card from the array
      movesList.splice(-1,1);
    };
  });
}

//Click operations: If they match, leave them open, otherwise, flips them back if they don't.
function clickAndCompare() {
  //Tracking of opened cards.
  let clickOpenCount = 0;
  $(".front").click(function() {
    let $clickedCard = $(this);
    let isOpen = $clickedCard.hasClass("open");
    //makes sure the user hasn't clicked on more than two cards and that card was not open
    if (openedCards.length < 2 && !isOpen) {
      //Flipping of cards and add them to the openedCards array.
      $clickedCard.toggleClass("front");
      $clickedCard.toggleClass("open");
      openedCards.push($clickedCard); //Clicked card added to openedCards array.
      clickOpenCount += 1;
    }
    if (openedCards.length === 2) {
      let firstCard = openedCards[0].children().attr("class");
      let secondCard = openedCards[1].children().attr("class");
      let firstId = openedCards[0].attr("id");
      let secondId = openedCards[1].attr("id");

      // compares cards, if a match update color, if no match flip back.
      if (firstCard === secondCard && firstId != secondId) {
        console.log("match!");
        openedCards[0].addClass("match");
        openedCards[1].addClass("match");
        openedCards = []; //resets array
        clickOpenCount = 0; //resets count
        matchesPlayed += 1;
      } else {
        //delays card flip back and resets openedCards and clickOpenCount
        setTimeout(function() {
          console.log("dang!");
          console.log(firstCard, secondCard);
          openedCards[0].removeClass("open");
          openedCards[0].addClass("front");
          openedCards[1].removeClass("open");
          openedCards[1].addClass("front");
          openedCards = [];
          clickOpenCount = 0;
        }, 780);
      }
      setTimeout(modalPop, 780);
    }
  });
}

//Decreases stars based on how many click attempt made.
function stars() {
  chosenCard.click(function() {
    numberOfClicks += 1;
    console.log("you've clicked " + numberOfClicks + " times");
    $(".stars")
      .children()
      .each(function(index, starElem) {
        console.log(index, starElem);

        /* Star-rating array. if numberOfClicks = current index, the star's color is changed to lightgray.
        */
        if (starRating[starRating.length - 1 - index] === numberOfClicks)
          $(starElem).addClass("star-remove-color");

        //ModalPop to alert user on the number of stars received.
        if (numberOfClicks < 28) {
          starCount = 3;
        };
        if (numberOfClicks >= 28 && numberOfClicks < 38 ) {
          starCount = 2;
        };
        if (numberOfClicks >= 38){
          starCount = 1;
        };
      });
  });
}


//Time change from singular to plural
function secondsText(secondsTime) {
  if (secondsTime === 1) {
    return " Second";
  } else {
    return " Seconds";
  };
};

//Start counting the time on the first card click
function startTimer() {
  console.log(counter);
  $(".front").click(function() {
    if (counter === 0) {
      counter = 1;
      startTime = new Date();
      timerGo = setInterval(function() {
        let seconds = Math.floor((new Date() - startTime) / 1000);
        let timerText = seconds + secondsText(seconds);
        $(".timer").text(timerText);
        endTime = timerText;
      }, 1000);
    }
  });
}

//Function Calls:-

shuffleCards(); // shuffling of the cards.
clickAndCompare(); // click and compare the cards if they match.
stars();// Measure of the accuracy of the player through award of stars.
startTimer();// Timer to time the time taken to complete the game.
movesUpdate();//Update on the moves.
modalPop();//Count on the number of stars received. If they win the game and starts again.
newGame();//Clear out the information of the previous game.
restart();//Play new game.



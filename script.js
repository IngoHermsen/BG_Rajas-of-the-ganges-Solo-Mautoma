let cards;
let playedCards= [];
let indexOrder;
let activeHistory = false;

let actionTypeCardIdx;
let actionResultCardIdx;

// DOM Elements

const titleElement = document.getElementById('title');

const actionTypeElement = document.getElementById('actionType');
const actionImgElement = document.getElementById('imgContainer');

const coinRewardLevelOneElement = document.getElementById('coinRewardLevelOne');
const coinRewardLevelTwoElement = document.getElementById('coinRewardLevelTwo');
const coinRewardLevelThreeElement = document.getElementById('coinRewardLevelThree');

const fameRewardLevelOneElement = document.getElementById('fameRewardLevelOne');
const fameRewardLevelTwoElement = document.getElementById('fameRewardLevelTwo');
const fameRewardLevelThreeElement = document.getElementById('fameRewardLevelThree');

const historyClockElement = document.getElementById('history-clock')



async function init() {
    // get cards data
    try {
        const response = await fetch('cards.json');
        const cardData = await response.json();

        shuffleIndexes(cardData.length);
        cards = cardData;

    } catch (err) { }
}

init()

function shuffleIndexes(length) {
    console.log("Shuffled")
    indexOrder = [];
    // create numbers from 0 to length-1
    for (let i = 0; i < length; i++) {
        indexOrder.push(i);
    }

    // Fisher-Yates Shuffle
    for (let i = indexOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexOrder[i], indexOrder[j]] = [indexOrder[j], indexOrder[i]];
    }
}

function nextCard() { 
    if (!activeHistory) {
        historyClockElement.style.display = 'block';
        activeHistory = true;
    }
    // START
    // Reshuffle if card pile is empty
    if (indexOrder.length == 1) {
        shuffleIndexes(cards.length)
    }

    // END

    // set Index Numbers of Cards.json for Action Type and Action Result
    actionTypeCardIdx = indexOrder[0];
    actionResultCardIdx = indexOrder[1];

    playedCards.push(
        [
            {
                actionTypeCardIdx: actionTypeCardIdx,
                actionResultCardIdx: actionResultCardIdx
            }
        ]
    )

    indexOrder.shift()
    createView()
}

function createView() {
    // card 1 reveals the action type to play in this automa turn
    // card 2 reveals the specific action variant of this action type
    const actionTypeCard = cards[actionTypeCardIdx];
    const actionResultCard = cards[actionResultCardIdx];
    const typeProperties = actionTypeCard.action.properties;
    const resultProperties = actionResultCard.actionResults.properties;

    const type = typeProperties.actionType
    const result = resultProperties[type]

    const fameRewardObj = {
        levelOne: typeProperties.fameReward.easy,
        levelTwo: typeProperties.fameReward.normal,
        levelThree: typeProperties.fameReward.difficult
    }
    const coinRewardObj = {
        levelOne: typeProperties.coinReward.easy,
        levelTwo: typeProperties.coinReward.normal,
        levelThree: typeProperties.coinReward.difficult
    }

    const fullImageName = `${type}_${result}`;
    const actionTitle = getAreaTitle(type);
    console.log(actionTitle)


    titleElement.innerHTML = actionTitle;

    actionImgElement.innerHTML =  `<img class="action-img" src="assets/actionIcons/${fullImageName}.png" alt="">`;
    
    fameRewardLevelOneElement.innerHTML = fameRewardObj.levelOne;
    fameRewardLevelTwoElement.innerHTML = fameRewardObj.levelTwo;
    fameRewardLevelThreeElement.innerHTML = fameRewardObj.levelThree;
    
    coinRewardLevelOneElement.innerHTML = coinRewardObj.levelOne;
    coinRewardLevelTwoElement.innerHTML = coinRewardObj.levelTwo;
    coinRewardLevelThreeElement.innerHTML = coinRewardObj.levelThree;
};

function getAreaTitle(type) {
    // title depending on type
    switch(type) {
        case 'provinceTileRemoval':
            return 'Quarry';
        case 'chambers':
            return 'Chambers';
        case 'marketPlace':
            return 'Market place';
        case 'harbor':
            return 'Harbor';
        case 'outerPalace':
            return 'Palace'
    }
}

function historyView() {
    const historyElement = document.getElementById('history');
    historyElement.style.display = "flex";
}


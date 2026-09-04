let actionSets;
let playedCards = [];
let actionIdxOrder = [];
let historyView = false;

let actionTypeReferenceIdx;
let actionValueReferenceIdx;

// Card Render Data

let cardTitle;
let fullImageName;
let fameRewardObj;
let coinRewardObj;

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
    try {
        const response = await fetch('actionSets.json');
        const actionSetData = await response.json();

        actionSets = actionSetData;
        shuffleIndexes(actionSets.length);
        actionTypeReferenceIdx = actionIdxOrder[0];
        actionValueReferenceIdx = actionIdxOrder[1];

        createView()

    } catch (err) { }
}

init()

function shuffleIndexes(length) {
    // create numbers from 0 to length-1
    for (let i = 0; i < length; i++) {
        actionIdxOrder.push(i);
    }

    // Fisher-Yates Shuffle
    for (let i = actionIdxOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [actionIdxOrder[i], actionIdxOrder[j]] = [actionIdxOrder[j], actionIdxOrder[i]];
    }

}

function createView() {
    getActionData();

    renderCard();
}

function nextCard() {
    if (!historyView) {
        const historyObj = {
            type: actionTypeReferenceIdx,
            value: actionValueReferenceIdx
        };

        playedCards.push(historyObj);
        actionIdxOrder.shift();

        actionTypeReferenceIdx = actionIdxOrder[0];
        actionValueReferenceIdx = actionIdxOrder[1];
    };

    if (historyView) {

    }

    createView();

};

function setActionIdx() {


};


function getActionData() {
    // card 1 reveals the action type to play in this automa turn
    // card 2 reveals the specific action variant of this action type
    const actionProperties = actionSets[actionTypeReferenceIdx].action.properties
    const type = actionSets[actionTypeReferenceIdx].action.properties.actionType

    // The second card takes that type and saves its value as 'value' variable
    const actionValueProperties = actionSets[actionTypeReferenceIdx].actionValues.properties
    const value = actionValueProperties[type];


    fameRewardObj = {
        levelOne: actionProperties.fameReward.easy,
        levelTwo: actionProperties.fameReward.normal,
        levelThree: actionProperties.fameReward.difficult
    }

    coinRewardObj = {
        levelOne: actionProperties.coinReward.easy,
        levelTwo: actionProperties.coinReward.normal,
        levelThree: actionProperties.coinReward.difficult
    }

    fullImageName = `${type}_${value}`;
    cardTitle = getAreaTitle(type);

};

function renderCard() {
    titleElement.innerHTML = cardTitle;
    
    actionImgElement.innerHTML = `<img class="action-img" src="assets/actionIcons/${fullImageName}.png" alt="">`;

    fameRewardLevelOneElement.innerHTML = fameRewardObj.levelOne;
    fameRewardLevelTwoElement.innerHTML = fameRewardObj.levelTwo;
    fameRewardLevelThreeElement.innerHTML = fameRewardObj.levelThree;

    coinRewardLevelOneElement.innerHTML = coinRewardObj.levelOne;
    coinRewardLevelTwoElement.innerHTML = coinRewardObj.levelTwo;
    coinRewardLevelThreeElement.innerHTML = coinRewardObj.levelThree;
}

function getAreaTitle(type) {
    // title depending on type
    switch (type) {
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


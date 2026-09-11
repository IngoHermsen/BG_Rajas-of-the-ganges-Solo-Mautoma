let actionSets;
let actionIdxOrder = [];
let defaultView = null;

// View Action reference

let actionTypeRefIdx;
let actionValueRefIdx;

// Card Render Data

let cardTitle;
let fullImageName;
let fameRewardObj;
let coinRewardObj;

// History of played cards

let playedCards = [];
let activeHistoryIdx = null;

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

const historyClockElement = document.getElementById('history-clock-img');
const closeElement = document.getElementById('close');
const filterOverlayElement = document.getElementById('filter-overlay')
const controlPrevElement = document.getElementById('control-prev');
const controlNextElement = document.getElementById('control-next')

async function init() {
    try {
        const response = await fetch('actionSets.json');
        const actionSetData = await response.json();

        actionSets = actionSetData;
        shuffleIndexes(actionSets.length);

        actionTypeRefIdx = actionIdxOrder[0];
        actionValueRefIdx = actionIdxOrder[1];

        defaultView = true;
        createView()

    } catch (err) { }
}

init()

function shuffleIndexes(length) {
    actionIdxOrder = []
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
    setViewElements();
    getActionData();

    renderCard();
};

function nextCard() {
    if (defaultView) {
        nextDefaultCard()
    } else {
        nextHistoryCard()
    }

    createView();
}

function nextDefaultCard() {

    const historyObj = {
        typeRefIdx: actionTypeRefIdx,
        valueRefIdx: actionValueRefIdx
    }

    playedCards.push(historyObj);
    actionIdxOrder.shift();

    if (actionIdxOrder.length == 1) {
        shuffleIndexes(actionSets.length)
    }

    setDefaultModeIndexes()
};

function nextHistoryCard() {
    activeHistoryIdx++

    setHistoryModeIndexes();
    createView()
};

function prevHistoryCard() {
    activeHistoryIdx--

    setHistoryModeIndexes();
    createView();
}

function setDefaultModeIndexes() {
    actionTypeRefIdx = actionIdxOrder[0];
    actionValueRefIdx = actionIdxOrder[1];
}

function setHistoryModeIndexes() {
    const card = playedCards[activeHistoryIdx];
    actionTypeRefIdx = card.typeRefIdx;
    actionValueRefIdx = card.valueRefIdx
}

function initHistoryMode() {
    filterOverlayElement.style.display = 'block';
    activeHistoryIdx = playedCards.length - 1;

    setHistoryModeIndexes()
};

function toggleView() {
    defaultView = !defaultView;
    if (!defaultView) { initHistoryMode() }
    if (defaultView) {
        filterOverlayElement.style.display = 'none';
        setDefaultModeIndexes()
    }
    createView();
}

function setViewElements() {
    if (defaultView || activeHistoryIdx == 0) {
        controlPrevElement.style.display = 'none';
    } else {
        controlPrevElement.style.display = 'block';
    };

    if (defaultView || (activeHistoryIdx <= playedCards.length - 2)) {
        controlNextElement.style.display = 'block';
    } else {
        controlNextElement.style.display = 'none';
    };

    if (playedCards.length == 0 || !defaultView) {
        historyClockElement.style.display = 'none'
    } else {
        historyClockElement.style.display = 'block'
    }

    if (!defaultView) {
        closeElement.style.display = 'block'
    } else {
        closeElement.style.display = 'none'
    }
}

function getActionData() {
    // card 1 reveals the action type to play in this automa turn
    // card 2 reveals the specific action variant of this action type
    const actionProperties = actionSets[actionTypeRefIdx].action.properties
    const type = actionSets[actionTypeRefIdx].action.properties.actionType

    // The second card takes that type and saves its value as 'value' variable
    const actionValueProperties = actionSets[actionTypeRefIdx].actionValues.properties
    const value = actionSets[actionValueRefIdx].actionValues.properties[type];


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


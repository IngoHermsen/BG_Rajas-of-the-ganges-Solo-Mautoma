let difficulty;

let actionSets;
let actionIdxOrder = [];
let defaultView = null;

// View Action reference

let actionTypeRefIdx;
let actionValueRefIdx;

// Card Render Data

let cardTitle;
let fullImageName;
let fameRewardValue;
let coinRewardValue;

// History of played cards

let showHistory = false;
let playedActions = [];

// DOM Elements

const actionTitleElement = document.getElementById('actionTitle');

const actionTypeElement = document.getElementById('actionType');
const actionImgElement = document.getElementById('imgContainer');

const coinRewardElement = document.getElementById('coinReward');
const fameRewardElement = document.getElementById('fameReward');

const historyClockElement = document.getElementById('history-clock-img');
const closeElement = document.getElementById('close');
const historyOverlayElement = document.getElementById('history-overlay')
const controlPrevElement = document.getElementById('control-prev');
const controlNextElement = document.getElementById('control-next');

function setDifficulty(modeString) {
    const optionElements = document.getElementsByClassName('option');
    const buttonElement = document.getElementById('startBtn');
    console.log(optionElements);

    for (el of optionElements) {
        if (el.id == modeString) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected')
        }
    }

    buttonElement.disabled = false;
    difficulty = modeString;
    console.log(difficulty)
};

function start() {
    const startScreenElements = document.getElementsByClassName('start');

    for (const el of startScreenElements) {
        el.style.display = 'none';
    };

    init()
};

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
};

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
};

function createView() {
    setViewElements();
    getActionData();
    renderCard();
};

function nextAction() {

    const historyObj = {
        count: playedActions.length + 1,
        imgName: fullImageName,
        coinRewardValue: coinRewardValue,
        fameRewardValue: fameRewardValue,
        difficulty: difficulty
    }

    playedActions.push(historyObj);
    actionIdxOrder.shift();

    if (actionIdxOrder.length == 1) {
        shuffleIndexes(actionSets.length)
    }

    setActionIndexes();

    createView()
};

function setActionIndexes() {
    actionTypeRefIdx = actionIdxOrder[0];
    actionValueRefIdx = actionIdxOrder[1];
};

function toggleHistory() {
    historyOverlayElement.style.display = showHistory ? 'none' : 'block';
    showHistory = !showHistory;

    if(showHistory) {
       renderHistory();
    }
}

function setViewElements() {

    if (playedActions.length == 0) {
        historyClockElement.style.display = 'none';
    } else {
        historyClockElement.style.display = 'block';
    }

    fameRewardElement.classList.add(difficulty);
    coinRewardElement.classList.add(difficulty)
}

function getActionData() {
    // card 1 reveals the action type to play in this automa turn
    // card 2 reveals the specific action variant of this action type
    const actionProperties = actionSets[actionTypeRefIdx].action.properties
    const type = actionSets[actionTypeRefIdx].action.properties.actionType

    // The second card takes that type and saves its value as 'value' variable
    const value = actionSets[actionValueRefIdx].actionValues.properties[type];

    fameRewardValue = actionProperties.fameReward[difficulty];
    coinRewardValue = actionProperties.coinReward[difficulty]


    fullImageName = `${type}_${value}`;

    cardTitle = getAreaTitle(type);

};

function renderCard() {

    document.getElementById('action-image').remove(); 

    actionTitleElement.innerHTML = cardTitle;

    actionImgElement.inneHTML = `<img class="action-img" src="assets/actionIcons/${fullImageName}.png" alt="" id='action-image'>`;

    fameRewardElement.innerHTML = fameRewardValue;

    coinRewardElement.innerHTML = coinRewardValue;
}

function renderHistory() {
    const historyListElement = document.getElementById('history-list');
    historyListElement.innerHTML = '';

    playedActions.toReversed().forEach((a, idx) => {
        historyListElement.insertAdjacentHTML('beforeEnd', 
            `<div class="entry ${ (a.count % 2) == 0 ? 'evenEntry' : ''}">
                        <span class="count">${a.count}</span>
                        <img src="assets/actionIcons/${a.imgName}.png" alt="${a.imgName}">
                        <div class="entry-rewards">
                            <div class="block">
                                <img class="icon" src="assets/fame.png" alt="fame-icon">
                                <span class="fame-value ${a.difficulty}">${a.fameRewardValue}</span>
                            </div>
                            <div class="block">
                                <img class="icon" src="assets/coin.png" alt="coin-icon">
                                <span class="coin-value ${a.difficulty}">${a.coinRewardValue}</span>
                            </div>
                        </div>
                    </div>`
        )
    })

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


/**
 * The players in the bracket
 * @type {Player[]}
 */
var players = [];
/**
 * The div containing player name inputs
 * @type {HTMLDivElement}
 */
var playerRowsDOM;
/**
 * An instance of the DOMFactory
 * @type {DOMFactory}
 */
var factory;

function PageInit() {
    factory = new DOMFactory();
    playerRowsDOM = document.getElementById("player-rows");

    document.getElementById("btn-add-player").addEventListener("click", AddNewPlayerInput);
    document.getElementById("btn-reset-players").addEventListener("click", ResetPlayersGrid);
    document.getElementById("btn-generate-bracket").addEventListener("click", CreateBracket);

    ResetPlayersGrid();
}

/**
 * Create an input for a new player
 * 
 * @param {?Event} event The event object from the Add Player button
 * @param {number} [numberOfPlayers=1] The number of new player inputs to create
 */
function AddNewPlayerInput(event, numberOfPlayers = 1) {
    const fragment = new DocumentFragment();

    for (let i = 0; i < numberOfPlayers; i++) {
        const playerNumber = players.length + 1;
        const inputID = `txt-player-${playerNumber}`;
        // Build player input
        const playerContainer = factory.div({}, ["input-group"]);
        const playerLabel = factory.label({
            for: inputID,
        }, [], `Player ${playerNumber}`);
        const playerInput = factory.input({
            id: inputID,
            type: "text",
            maxLength: 20,
        });
    
        playerContainer.append(playerLabel, playerInput);
        fragment.appendChild(playerContainer);

        players.push(new Player());
    }

    playerRowsDOM.appendChild(fragment);
}

/**
 * Reset the players grid to an initial state
 */
function ResetPlayersGrid() {
    playerRowsDOM.innerHTML = "";
    players = [];
    AddNewPlayerInput(null, 4);
}

function CreateBracket() {
    // TODO
}

if(document.readyState != 'loading') {
    PageInit();
}
else {
    document.addEventListener('DOMContentLoaded', PageInit);
}

/* Classes */

class Player {
    constructor(name = "") {
        this.name = name;
        this.wins = 0;
    }
}
import { DOMFactory } from "./DOMFactory";

/** The div containing player name inputs */
let playerRowsDOM: HTMLElement | null;

/** An instance of the DOMFactory */
const factory = DOMFactory.create();

/**
 * The current count of players
 * 
 * Only used when first generating the bracket
 */
let playerCount = 0;

function PageInit() {
    playerRowsDOM = document.getElementById("player-rows");

    document.getElementById("btn-add-player")?.addEventListener("click", AddNewPlayerInput);
    document.getElementById("btn-reset-players")?.addEventListener("click", ResetPlayersGrid);
    document.getElementById("btn-generate-bracket")?.addEventListener("click", CreateBracket);

    ResetPlayersGrid();
}

/**
 * Create an input for a new player
 * 
 * @param {?Event} event The event object from the Add Player button
 * @param {number} [numberOfPlayers=1] The number of new player inputs to create
 */
function AddNewPlayerInput(event: Event | null, numberOfPlayers: number = 1) {
    const fragment = new DocumentFragment();

    for (let i = 0; i < numberOfPlayers; i++) {
        const playerNumber = ++playerCount;
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
    
        playerContainer.appendChild(playerLabel);
        playerContainer.appendChild(playerInput);

        fragment.appendChild(playerContainer);
    }

    playerRowsDOM?.appendChild(fragment);
}

/**
 * Reset the players grid to an initial state
 */
function ResetPlayersGrid() {
    if (playerRowsDOM != null) {
        playerRowsDOM.innerHTML = "";
    }
    playerCount = 0;
    AddNewPlayerInput(null, 4);
}

function CreateBracket() {
    const playerInputs = document.querySelectorAll("#player-rows input")
    for (const input of playerInputs) {

    }
}

if(document.readyState != 'loading') {
    PageInit();
}
else {
    document.addEventListener('DOMContentLoaded', PageInit);
}
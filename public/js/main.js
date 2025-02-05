// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function(event) {
    event.preventDefault();

    const highChips = Number(document.querySelector("#highchips").value);
    const highMult = Number(document.querySelector("#highmult").value);

    const selectedRadio = document.querySelector('input[name="stake"]:checked');
    const stake = selectedRadio ? selectedRadio.value : null;

    const deckDropdown = document.querySelector("#deck");
    const deck = deckDropdown.value;



    // Package data into an object
    const json = {
        chips: highChips,
        mult: highMult,
        stake: stake,
        deck: deck
    };

    const body = JSON.stringify(json);

    // Send data to the server
    const response = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
    });

    const text = await response.text();
    let newData = JSON.parse(text);
    console.log("Response:", text);
    let table = document.querySelector("#data");
    let row = table.insertRow(1)
    row.insertCell(0).innerHTML = newData.chips
    row.insertCell(1).innerHTML = newData.mult
    row.insertCell(2).innerHTML = newData.score.toPrecision(3)
    row.insertCell(3).innerHTML = newData.deck
    row.insertCell(4).innerHTML = newData.stake

};

window.onload = function() {
    const button = document.querySelector("button");
    button.onclick = submit;
}

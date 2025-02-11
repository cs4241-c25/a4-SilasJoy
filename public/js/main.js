
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
    const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
    });

    if (response.ok) {
        console.log("Data successfully sent to server.");
        fetchData();
    } else {
        console.error("Error sending data.");
    }
};

// Function to fetch stored data from MongoDB
const fetchData = async function() {
    const response = await fetch("/data"); // Fetch data from server
    const data = await response.json();

    let table = document.querySelector("#data");
    table.innerHTML = "<tr><th>Chips</th><th>Multiplier</th><th>Score</th><th>Deck</th><th>Stake</th></tr>"; // Reset table

    data.forEach(entry => {
        let row = table.insertRow();
        row.insertCell(0).innerHTML = entry.chips;
        row.insertCell(1).innerHTML = entry.mult;
        row.insertCell(2).innerHTML = entry.score.toPrecision(3);
        row.insertCell(3).innerHTML = entry.deck;
        row.insertCell(4).innerHTML = entry.stake;
    });
};

// Run fetchData when the page loads to show existing data
window.onload = function() {
    const button = document.querySelector("button");
    button.onclick = submit;
    fetchData();
};

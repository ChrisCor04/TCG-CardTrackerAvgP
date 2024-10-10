async function addCard() {
    const userCard = document.getElementById("user-card");
    const cardCode = userCard.value;

    if (cardCode === '') {
        alert("You must write something!");
        return;
    }

    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php`);
        const data = await response.json();

        const filteredCards = data.data.filter(card => 
            card.card_sets && card.card_sets.some(set => set.set_code === cardCode)
        );

        if (filteredCards.length > 0) {
            const cardData = filteredCards[0];
            const cardID = cardData.id;
            const cardPrice = cardData.card_prices[0].tcgplayer_price;

            // Add card to the DOM
            addCardToList(cardData.name, cardID, cardPrice);

            // Save card data to localStorage
            let savedCards = JSON.parse(localStorage.getItem("cardList")) || [];
            savedCards.push({ id: cardID, name: cardData.name, price: cardPrice });
            localStorage.setItem("cardList", JSON.stringify(savedCards));

            // Clear input field
            userCard.value = "";
        } else {
            alert("Card not found or invalid set code!");
        }
    } catch (error) {
        console.error("Error fetching card data:", error);
        alert("An error occurred while fetching card data.");
    }
}

// Function to add card to the DOM
function addCardToList(name, cardID, price) {
    let li = document.createElement("li");
    li.innerHTML = `${name}`;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7"; 
    span.onclick = function () {
        li.remove();
        const correspondingPrice = document.querySelector(`.listP li[data-card="${cardID}"]`);
        if (correspondingPrice) correspondingPrice.remove();

        // Remove card from localStorage
        let savedCards = JSON.parse(localStorage.getItem("cardList")) || [];
        savedCards = savedCards.filter(card => card.id !== cardID);
        localStorage.setItem("cardList", JSON.stringify(savedCards));
    };

    li.appendChild(span);
    document.getElementById("list-container").appendChild(li);

    // Add price to price list
    let priceList = document.createElement("li");
    priceList.innerHTML = `${name} - <span style="color: green;">Average Price: $${price}</span>`;
    priceList.setAttribute("data-card", cardID);
    document.getElementById("list-prices").appendChild(priceList);
}

// Function to load saved cards from localStorage
function loadSavedCards() {
    let savedCards = JSON.parse(localStorage.getItem("cardList")) || [];
    
    savedCards.forEach(card => {
        addCardToList(card.name, card.id, card.price);
    });
}

// Call this function when the page loads
window.onload = loadSavedCards;

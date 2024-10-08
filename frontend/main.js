async function addCard() {
    const userCard = document.getElementById("user-card"); //gets user inputted id and saves it
    const cardCode = userCard.value; //saves the value of the user input to cardCode

    if (cardCode === '') {
        alert("You must write something!");
        return;
    }

    //fetch all cards to look through
    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php`);
        const data = await response.json();

        //filter through cards to search by set_code
        const filteredCards = data.data.filter(card => 
            card.card_sets && card.card_sets.some(set => set.set_code === cardCode)
        );

        if (filteredCards.length > 0) {
            const cardData = filteredCards[0]; //find the first card to match the code
            const cardID = cardData.id; //set cardID equal to the id of the card
            const cardPrice = cardData.card_prices[0].tcgplayer_price;

            //create a list item for the new card found
            let li = document.createElement("li");
            li.innerHTML = `${cardData.name}`; //Display the card name

            let span = document.createElement("span");
            span.innerHTML = "\u00d7"; 
            span.onclick = function () {
                li.remove();
                const correspondingPrice = document.querySelector(`.listP li[data-card="${cardID}"]`);
                if (correspondingPrice) correspondingPrice.remove();
            };

            li.appendChild(span);
            document.getElementById("list-container").appendChild(li); //append card name to list-container

            // create a list item for the price
            let priceList = document.createElement("li");
            priceList.innerHTML = `${cardData.name} - <span style = "color: green;">Average Price: $${cardPrice}</span>`; // display the card name and price
            priceList.setAttribute("data-card", cardID); // associate the card name with its id
            document.getElementById("list-prices").appendChild(priceList); // appen to the list-prices list

            // clear input field
            userCard.value = "";
        } else {
            alert("Card not found or invalid set code!");
        }
    } catch (error) {
        console.error("Error fetching card data:", error);
        alert("An error occurred while fetching card data.");
    }
}

function generateCard() {
    const nom = document.getElementById("nom").value;
    const entreprise = document.getElementById("entreprise").value;
    const profession = document.getElementById("profession").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (!nom || !entreprise || !profession || !email || !phone) {
        document.getElementById("result").style.color = "#orange";
        document.getElementById("result").innerHTML =
            "Veuillez remplir tous les champs.";
        return;
    }

    const cardInfo = {
        nom: nom,
        entreprise: entreprise,
        profession: profession,
        email: email,
        phone: phone,
    };

    axios
        .post("/api/cards", cardInfo)
        .then((response) => {
            document.getElementById("result").style.color = "#356c36";
            document.getElementById("result").innerHTML = response.data;
            window.open(`/cards/${cardInfo.nom}.pdf`, "_blank");
        })
        .catch((error) => {
            console.error("Erreur lors de la génération de la carte :", error);
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerHTML =
                "Erreur lors de la génération de la carte.";
        });
    loadHistory();
}

function loadHistory() {
    axios
        .get("/api/history")
        .then((response) => {
            const historyList = document.getElementById("historyList");
            historyList.innerHTML = "";

            response.data.forEach((card) => {
                const listItem = document.createElement("li");

                const cardLink = document.createElement("a");

                cardLink.textContent = "Télécharger";

                cardLink.addEventListener("click", () => {
                    window.open(`/cards/${card.nom}.pdf`, "_blank");
                });

                listItem.innerHTML = `<strong>${card.nom}</strong> - ${card.entreprise}
                                <button onclick="deleteCard(${card.id})">Supprimer</button>`;

                listItem.appendChild(cardLink);

                historyList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error(
                "Erreur lors du chargement de l'historique : ",
                error
            );
        });
}

function deleteCard(cardId) {
    axios
        .delete(`/api/cards/${cardId}`)
        .then(() => {
            console.log("Carte de visite supprimée avec succès");
            loadHistory();
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la suppression de la carte de visite : ",
                error
            );
        });
}

document.addEventListener("DOMContentLoaded", loadHistory);

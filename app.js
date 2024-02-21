const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const app = express();
const mysql = require("mysql2");
app.use(express.static("public"));

app.use(express.json());
app.use("/cards", express.static(path.join(__dirname, "cards")));

const db = mysql.createConnection({
    host: "localhost",
    user: "mirandalucas52@gmail.com",
    password: "cx7eKQcy",
    database: "visitcards",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database!");
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post("/api/cards", (req, res) => {
    const doc = new PDFDocument({ size: "A6", layout: "landscape" });
    const cardInfo = req.body;

    const marginX = 10;
    const marginY = 10;

    const cardWidth = 400;
    const cardHeight = 280;

    doc.rect(marginX, marginY, cardWidth, cardHeight).stroke();

    doc.pipe(fs.createWriteStream(`./cards/${cardInfo.nom}.pdf`));
    const textMargin = 20;
    doc.fontSize(20).text(
        `${cardInfo.entreprise}`,
        marginX + textMargin,
        marginY + textMargin
    );
    doc.fontSize(16).text(
        `${cardInfo.profession}`,
        marginX + textMargin,
        marginY + textMargin + 30
    );
    doc.fontSize(30).text(
        `${cardInfo.nom}`,
        marginX + textMargin,
        marginY + textMargin + 90,
        { align: "center" }
    );

    doc.fontSize(16).text(`${cardInfo.email}`, 0, marginY + textMargin + 150, {
        align: "right",
    });
    doc.fontSize(16).text(`${cardInfo.phone}`, 0, marginY + textMargin + 170, {
        align: "right",
    });

    doc.end();

    const sql =
        "INSERT INTO cartes_visite (nom, entreprise, profession, email, telephone) VALUES (?, ?, ?, ?, ?)";
    const values = [
        cardInfo.nom,
        cardInfo.entreprise,
        cardInfo.profession,
        cardInfo.email,
        cardInfo.phone,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de l'enregistrement dans la base de données : " +
                    err.message
            );
            res.status(500).send("Erreur lors de la génération de la carte.");
        } else {
            res.status(200).send("Carte de visite créée avec succès");
        }
    });
});

app.get("/api/history", (req, res) => {
    const sql = "SELECT * FROM cartes_visite";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération de l'historique : ",
                err
            );
            res.status(500).send(
                "Erreur lors de la récupération de l'historique"
            );
        } else {
            res.status(200).send(results);
        }
    });
});

app.delete("/api/cards/:id", (req, res) => {
    const cardId = req.params.id;

    db.query(
        "DELETE FROM cartes_visite WHERE id = ?",
        [cardId],
        (err, results) => {
            if (err) {
                console.error(
                    "Erreur lors de la suppression de la carte de visite : ",
                    err
                );
                res.status(500).send(
                    "Erreur lors de la suppression de la carte de visite"
                );
            } else {
                console.log("Carte de visite supprimée avec succès");
                res.status(200).send("Carte de visite supprimée avec succès");
            }
        }
    );
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur en écoute sur le port ${port}`));

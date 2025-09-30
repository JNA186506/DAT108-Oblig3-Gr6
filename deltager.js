"use strict";

class Deltager {
    startnummer;
    navn;
    sluttid;

    constructor(startnummer, navn, sluttid) {
        this.startnummer = startnummer;
        this.navn = navn;
        this.sluttid = sluttid;
    }
}

class DeltagerManager {
    root;
    startnummer;
    navn;
    sluttid;
    tdbody;
    deltagerTabell;

    constructor(root) {
        this.root = root;
        this.startnummer = root.querySelector("#startnummer");
        this.navn = root.querySelector("#deltagernavn");
        this.sluttid = root.querySelector("#sluttid");
        this.tdbody = root.querySelector("#entries");
        this.deltagerTabell = [];
    }

    leggTilDeltagerITabell() {

        if(this.validateForm()) {
            const deltager = new Deltager(
                this.startnummer.value,
                this.navn.value,
                this.sluttid.value
            );

            const row = document.createElement("tr");
            row.innerHTML = `
            <td></td>
            <td>${deltager.navn}</td>
            <td>${deltager.startnummer}</td>
            <td>${deltager.sluttid}</td>
            `;
            this.tdbody.appendChild(row);
            this.tdbody.classList.remove("hidden");

            this.navn.value = "";
            this.deltagerTabell.push(deltager);
            console.log(this.deltagerTabell.toString());
        }
    }

    validateForm() {
        const doesDeltagerExist = !this.deltagerTabell.some(deltager => deltager.startnummer === this.startnummer.value);

        const navnValue = this.navn.value.trim();
        const startNummerValue = this.startnummer.value.trim();

        const isValidStartnummer = /^\d+$/.test(startNummerValue);
        const isValidNavn = /^\p{L}+$/u.test(navnValue);

        this.startnummer.classList.toggle("input:invalid", (!isValidStartnummer || !doesDeltagerExist));
        this.navn.classList.toggle("input:invalid", !isValidNavn);

        const isValid = isValidStartnummer && isValidNavn && doesDeltagerExist;
        if (!isValid) console.log("Invalid input");

        return isValid;
    }
}


const root = document.getElementById("root");
const input = root.querySelector("input");
const btn = root.querySelector("#btn")

const deltagerManager = new DeltagerManager(root);

btn.addEventListener("click", () => deltagerManager.leggTilDeltagerITabell());
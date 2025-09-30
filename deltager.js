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
		var re = /([a-zæøå])([a-zæøå]*)/gi;
		var navnUt = this.navn.value;
		navnUt = navnUt.replace(re, function(match, first, rest) {
			return first.toUpperCase() + rest.toLowerCase();
		});
        if(this.validateForm()) {
            const deltager = new Deltager(
                this.startnummer.value,
                navnUt,
                this.sluttid.value
            );

            const row = document.createElement("tr");
            row.innerHTML = `
            <td></td>
            <td>${deltager.startnummer}</td>
            <td>${deltager.navn}</td>
            <td>${deltager.sluttid}</td>
            `;
            this.tdbody.appendChild(row);
            this.tdbody.classList.remove("hidden");

            this.navn.value = "";
            this.startnummer.value = "";
            this.deltagerTabell.push(deltager);
            console.log(this.deltagerTabell.toString());
        }
    }

    validateForm() {
        const doesDeltagerExist = this.deltagerTabell.some(deltager => deltager.startnummer === this.startnummer.value);
        const isValidStartnummer = this.startnummer.validity///^\d+$/.test(startNummerValue);

        if (doesDeltagerExist) {
            this.startnummer.setCustomValidity("Deltager finnes allerede!");
            console.log("Deltager finnes allerede!");
            this.startnummer.reportValidity();
            return false;
        } else if (isValidStartnummer.badInput) {
            this.startnummer.setCustomValidity("Legg inn et ekte tall");
            console.log("Bruk heltall!")
            this.startnummer.reportValidity();
            return false;
        } else {
            this.startnummer.setCustomValidity("");
            return true;
        }
    }
}


const root = document.getElementById("root");
const btn = root.querySelector("#btn")

const deltagerManager = new DeltagerManager(root);

btn.addEventListener("click", () => deltagerManager.leggTilDeltagerITabell());
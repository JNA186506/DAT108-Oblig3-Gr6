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

	getSluttidSekunder() {
	        let parts = this.sluttid.split(":").map(Number);
	        if (parts.length === 2) {
	            return parts[0] * 60 + parts[1];   
	        } else if (parts.length === 3) {
	            return parts[0] * 3600 + parts[1] * 60 + parts[2]; 
			} else {
	            return 0;
	       }
	 }
}

class DeltagerManager {
    root;
    startnummer;
    navn;
    sluttid;
    tbody;
    deltagerTabell;

    constructor(root) {
        this.root = root;
        this.startnummer = root.querySelector("#startnummer");
        this.navn = root.querySelector("#deltagernavn");
        this.sluttid = root.querySelector("#sluttid");
        this.tbody = root.querySelector("#entries");
        this.fraInput = root.querySelector("#nedregrense");
        this.tilInput = root.querySelector("#ovregrense");
        this.deltagerTabell = [];
    }

    leggTilDeltagerITabell() {
        if(this.validateForm()) {
            const navnStoreBokstaver = /([a-zæøå])([a-zæøå]*)/gi;

            let navnUt = this.navn.value.trim().
                replace(navnStoreBokstaver, (match, first, rest) =>
                    first.toUpperCase() + rest.toLowerCase());

            const deltager = new Deltager(
                this.startnummer.value,
                navnUt,
                this.sluttid.value
            );

            this.startnummer.value = "";
            this.navn.value = "";
            this.sluttid.value = "";


            this.deltagerTabell.push(deltager);
            this.tegnTabell(this.deltagerTabell);

            this.startnummer.focus();
        }
    }

    validateForm() {
        const doesDeltagerExist = this.deltagerTabell.some(deltager => deltager.startnummer === this.startnummer.value);
        const isValidStartnummer = this.startnummer.validity;
        const navnRegex = /^[A-Za-zÆØÅæøå]{2,}((\s+|-)[A-Za-zÆØÅæøå]{2,})*$/;
        let navnUt = this.navn.value.trim();
        const isValidNavn = navnRegex.test(navnUt);

        if (!isValidNavn)  {
            this.navn.setCustomValidity("Navn kan kun inneholde bokstaver, mellomrom og bindestrek");
            this.navn.reportValidity();
            return false;
        }

        this.navn.setCustomValidity("");
        if (doesDeltagerExist) {
            this.startnummer.setCustomValidity("Deltager finnes allerede!");
            this.startnummer.reportValidity();
            return false;
        } else if (isValidStartnummer.badInput) {
            this.startnummer.setCustomValidity("Legg inn et ekte tall");
            this.startnummer.reportValidity();
            return false;
        } else {
            this.startnummer.setCustomValidity("");
            return true;
        }
    }

    tegnTabell(tabell) {
        this.tbody.innerHTML = "";

        /* En mer effektiv måte å sette inn på er ved å finne posisjon
        * ved bruk av binærsøk. Siden datasettet er såpass lite, så sorterer vi hver
        * gang. */
        tabell.sort((a, b) => a.getSluttidSekunder() > b.getSluttidSekunder());

        tabell.forEach(((deltager, i) => {
            const row = document.createElement("tr");

            const indexCell = document.createElement("td");
            indexCell.textContent = i + 1;

            const navnCell = document.createElement("td");
            navnCell.textContent = deltager.navn;

            const startnummerCell = document.createElement("td");
            startnummerCell.textContent = deltager.startnummer;

            const sluttidCell = document.createElement("td");
            sluttidCell.textContent = deltager.sluttid;

            row.appendChild(indexCell);
            row.appendChild(navnCell);
            row.appendChild(startnummerCell);
            row.appendChild(sluttidCell);

            this.tbody.appendChild(row);
        }));

        this.tbody.classList.remove("hidden");
        document.getElementById("ingenRes").textContent = "";
    }
	
	visResultat(){
        this.fraInput.setCustomValidity("");

        const fraTid = this.fraInput.value;
        const tilTid = this.tilInput.value;
		const fra = fraTid ? this._tidTilSekunder(fraTid) : null;
		const til = tilTid ? this._tidTilSekunder(tilTid) : null;

        if (fra > til) {
            this.fraInput.setCustomValidity("Fra kan ikke være større en til");
            this.fraInput.reportValidity();
            this.fraInput.focus();
            return;
        }

        this.tbody.innerHTML ="";

        const filtrert = this.deltagerTabell.filter(
            deltager => deltager.getSluttidSekunder() >= fra && deltager.getSluttidSekunder() <= til);

        this.tegnTabell(filtrert);
	}

	_tidTilSekunder(tid) {
	        let parts = tid.split(":").map(Number);
	        if (parts.length === 2) {
	            return parts[0] * 60 + parts[1];
	        } else if (parts.length === 3) {
	            return parts[0] * 3600 + parts[1] * 60 + parts[2];
	        } else {
	            return 0;
	        }
	    }
}


const root = document.getElementById("root");
const btn = root.querySelector("#btn")
const visbtn = root.querySelector("#visbtn")

const deltagerManager = new DeltagerManager(root);

btn.addEventListener("click", () => deltagerManager.leggTilDeltagerITabell());
visbtn.addEventListener("click", () => deltagerManager.visResultat());

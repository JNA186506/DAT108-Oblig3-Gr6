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
        this.deltagerTabell = [];
    }

    leggTilDeltagerITabell() {
		const re = /([a-zæøå])([a-zæøå]*)/gi;
		let navnUt = this.navn.value;
		navnUt = navnUt.replace(re, function(match, first, rest) {
			return first.toUpperCase() + rest.toLowerCase();
		});
        if(this.validateForm()) {
            const deltager = new Deltager(
                this.startnummer.value,
                navnUt,
                this.sluttid.value
            );

            this.navn.value = "";
            this.startnummer.value = "";

            this.deltagerTabell.push(deltager);
            this.tegnTabell(this.deltagerTabell);
            console.log(this.deltagerTabell);

            this.startnummer.focus();
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

    tegnTabell(tabell) {
        this.tbody.innerHTML = "";

        /* En mer effektiv måte å sette inn på er ved å finne posisjon
        * ved bruk av binærsøk. Siden datasettet er såpass lite, så sorterer vi hver
        * gang. */
        tabell.sort((a, b) => a.sluttid > b.sluttid);

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
	
	visResultat(fraTid="", tilTid=""){
		this.tbody.innerHTML ="";
		
		const fra = fraTid ? this._tidTilSekunder(fraTid) : null;
		const til = tilTid ? this._tidTilSekunder(tilTid) : null;
		
		let sortert = [...this.deltagerTabell].sort(
			(a, b) => a.getSluttidSekunder() - b.getSluttidSekunder()
		);	
		 
		const filtrert = sortert.filter(d => d.sluttid < fra && d.sluttid > til);

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
const fraInput = root.querySelector("#nedregrense");
const tilInput = root.querySelector("#ovregrense");

const deltagerManager = new DeltagerManager(root);

btn.addEventListener("click", () => deltagerManager.leggTilDeltagerITabell());
visbtn.addEventListener("click", () => deltagerManager.visResultat(fraInput.value, tilInput.value));

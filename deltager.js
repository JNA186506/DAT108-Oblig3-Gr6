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
			
			const feedback = root.getElementsByTagName("p")[0];
			feedback.getElementsByTagName("span")[0].textContent = navnUt;
			feedback.getElementsByTagName("span")[1].textContent = this.startnummer.value;
			feedback.getElementsByTagName("span")[2].textContent = this.sluttid.value;
			feedback.style.display = "block";
			
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
		const tidRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][1-9])$/;
		let tidUt = this.sluttid.value;
		const isValidTid = tidRegex.test(tidUt);
		
        if (!isValidNavn)  {
			this.navn.setCustomValidity("Navn kan kun inneholde bokstaver, mellomrom og bindestrek");
            this.navn.reportValidity();
            return false;
        }
		
		if(!isValidTid) {
			this.sluttid.setCustomValidity("Format hh:mm:ss");
			this.sluttid.reportValidity();
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
        if(tabell && tabell.length){
			this.tbody.innerHTML = "";
	
	        /* En mer effektiv måte å sette inn på er ved å finne posisjon
	        * ved bruk av binærsøk. Siden datasettet er såpass lite, så sorterer vi hver
	        * gang. */
	        tabell.sort((a, b) => a.getSluttidSekunder() - b.getSluttidSekunder());
	
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
	        document.getElementById("ingenRes").style.visibility = "hidden";
		}
		else{
			document.getElementById("ingenRes").style.visibility = "visible";
		}
		
    }
	
	visResultat(){
        this.fraInput.setCustomValidity("");

        const fraTid = this.fraInput.value;
        const tilTid = this.tilInput.value;
		const fra = fraTid ? this._tidTilSekunder(fraTid) : this._tidTilSekunder("00:00:00");
		const til = tilTid ? this._tidTilSekunder(tilTid) : this._tidTilSekunder("23:59:59");

        if (fra > til) {
            this.tilInput.setCustomValidity("Fra kan ikke være større en til");
            this.tilInput.reportValidity();
            this.tilInput.focus();
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

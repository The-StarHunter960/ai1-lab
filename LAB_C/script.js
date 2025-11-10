// Mapa, wziąlem z pliku leaflet providers i leaflet
let map = L.map('map').setView([53.430127, 14.564802], 15);
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 20}).addTo(map);
//L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom: 20}).addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

const markerLayer= L.layerGroup().addTo(map);
//Lokalizacja
document.getElementById("locBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("No geolocation.");
    return;
  }
    navigator.geolocation.getCurrentPosition(pos => {
    console.log(pos);
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    map.setView([lat, lon], 16);
    const marker = L.marker([lat, lon]);//tutaj zmieniłem gdyż z warstwą markera nie chciało saveować mapy
    marker.addTo(markerLayer);
  }, positionError => {
    console.error(positionError);
  });
});

let canvas= document.getElementById("rasterMap");
let context = canvas.getContext("2d"); //bo rysujemy w 2D

document.getElementById("saveBtn").addEventListener("click", () =>{
    map.removeLayer(markerLayer);
    leafletImage(map,function(err,mapCanvas){
        canvas.width=mapCanvas.width;
        canvas.height=mapCanvas.height;
        context.drawImage(mapCanvas,0,0)
    });
});

document.getElementById("shuffleBtn").addEventListener("click", ()=>{
    const rows = 4;
    const cols = 4;
    const pieceHeight=canvas.height/rows;
    const pieceWidth=canvas.width/cols;
    let pieces =[];
    let i=0;
    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){
            const puzzlePiece = document.createElement("canvas");
            puzzlePiece.className="puzzlePiece";
            puzzlePiece.height=pieceHeight;
            puzzlePiece.width=pieceWidth;
            puzzlePiece.draggable=true;
            puzzlePiece.position=i;

            const pieceCtx = puzzlePiece.getContext("2d");
            pieceCtx.drawImage(
                canvas,
                c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight,
                0, 0, pieceWidth, pieceHeight
            );
            pieces.push(puzzlePiece)
            i++;
        }
    } 
    //tutaj powinienem mieć już tablicę po kolei z elementami puzzli teraz pomieszać i narysować raz jeszcze 
    let shuffled=shuffle(pieces);

    const box3 = document.getElementById("box3");
    box3.innerHTML="";
    // Dodajemy id do każdego kafelka dla drag & drop, i wrzucamy je do boxa3
    shuffled.forEach((piece, index) => {
        box3.appendChild(piece)
        piece.id = "#" + index;// chat podpowiedział żeby to był unikalny ciąg a nie tylko 0,1; żeby 
        //łatwo złapać id do transferu, skorzystałem z tego # + dataTransfer i zadziałało
        piece.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text", this.id);
        });
    });

    //placeholdery do drag & drop
    const box4 = document.getElementById("box4");
    box4.innerHTML = "";
    for (let i = 0; i < pieces.length; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "dropTarget"; 
        placeholder.style.width = pieceWidth + "px";
        placeholder.style.height = pieceHeight + "px";
        placeholder.style.border = "1px dashed #ccc";
        placeholder.style.display = "inline-block";
        box4.appendChild(placeholder);

        // Obsługa drag & drop
        placeholder.addEventListener("dragover", function(event) {
            event.preventDefault();
        });

        placeholder.addEventListener("drop", function(event) {
            let id = event.dataTransfer.getData("text");
            const draggedPiece = document.getElementById(id);
            if(draggedPiece){
                this.appendChild(draggedPiece);
            }
            checkIfSolved();
        });
    }
}); 

//mieszanie Fisher-Yates, pojawiło mi się to w paru miejscach gdy szukałem mieszania tablicy więc wykorzystałem
function shuffle(array){
    for (let i = array.length-1; i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
    return array;
}

function checkIfSolved(){
    const placeholders = document.getElementById("box4").querySelectorAll(".dropTarget");
    let solved=true;
    placeholders.forEach((slot, index) => {
        const piece = slot.querySelector("canvas");
        if (piece.position !== index) {
          solved = false;
        }
      });    
      if (solved) {
        alert("🎉 Układanka ułożona poprawnie!");
      }
}
//chciałem let solved=false i zmieniać na true ale aplikacja po pierwszym elemencie mi odbijała że jest ułożone
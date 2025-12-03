console.log("LAB-E");

const styles: string []= [
    "/style-1.css",
    "/style-2.css",
    "/style-3.css"
];

let currentStyle: string =styles[0];

const linksContainer= document.getElementById("styleLinks");

function applyStyle(file: string):void{
    const oldLink = document.getElementById("dynamic-style");
    if (oldLink) {
        oldLink.remove();
        console.log("removed old style");
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = file;
    link.id = "dynamic-style";

    document.head.appendChild(link);
    console.log("added new style:", file)
}

function drawLinks():void{
    if(linksContainer){
        linksContainer.innerHTML="";
        styles.forEach(style=>{
            const link = document.createElement("a");
            link.href = "#";
            link.innerText=style;

            link.addEventListener("click",function(){
                currentStyle=style;
                applyStyle(style);
            });
            linksContainer.appendChild(link);
            linksContainer.appendChild(document.createElement("br"));
        });
    }
}

applyStyle(currentStyle);
drawLinks();

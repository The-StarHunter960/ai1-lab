class ToDo{
    constructor(){
        this.tasks=JSON.parse(localStorage.getItem("tasks")) || []; //to jest tablica 
//z taskami z or pustej tablicy, jeżeli nie złapie LocalStorage to da pustą tablicę
        this.term= ""; //to bd do wyszukiwarki
        this.listElement = document.querySelector(".list");//łapie gdzie jest dana klasa
//w dokumencie html
        document.querySelector(".saveBtn").addEventListener("click", () => this.addTask());
//skrypt nasłuchuje na kliknięcie przycisku savebtn od początku działania dlatego konstruktor
//i wywołuje metodę po przecinku, nie działała normalnie a chat powiedział że muszę użyć f strzałkowej
//nie rozumiem jej ale działą
        document.querySelector(".search").addEventListener("input", (e) => {
            this.term = e.target.value.toLowerCase();
            this.draw();
        });
//dobra tu się działo próbowałem również f strzałkowej, ale nie działało i okazało się że muszę przypisać 
//inputa do this.terma za pomocą e, w którym przechowuje co się wydarzyło i na jakim elemencie, .target
//wskazuje na element który go wywołał, tutaj class search, a value wyciąga wartość z tegoż elementu
        this.draw();
    }

    //funkcja do odświeżania widoku
    draw(){
//ten element "usuwa" czyści nam listę, bez niej lista się duplikuje ze starych zadań  i na koniec dodaje sie nowe
//innerHTML daje nam cały kod HTML a nie tylko tekst, ustawiając go na 0, czyli usuwam całą klasę list
        this.listElement.innerHTML = "";
        const filtered= this.getFilteredTasks();

        filtered.forEach((task) => {
            const div = document.createElement("div");
            div.className= "task";//to będzie klasa diva dla wszystkich pojedynczych tasków

            //span wyglądał lepiej niż p, dlatego go użyłem do nieedytowanego pola
            const textPar = document.createElement("span");
            textPar.className = "task-text";
            textPar.textContent = task.text;
            textPar.innerHTML = this.highlight(task.text, this.term);

            const datePar= document.createElement("span");
            datePar.className = "task-date";
            datePar.textContent = task.date;

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "delBtn";

            delBtn.addEventListener("click", () => this.deleteTask(task))
            div.appendChild(textPar);
            div.appendChild(datePar);
            div.appendChild(delBtn);
            this.listElement.appendChild(div);
        });
    }

    save(){
        localStorage.setItem("tasks",JSON.stringify(this.tasks));
    }

    addTask(){
        const text = document.querySelector(".add").value;
        const date = document.querySelector(".adddate").value;

        if(text.length<3){
            alert("Podaj nazwę zadania (min. 3 znaki)!");
            return;
        }
        const minDate = new Date("2025-10-27");
        const chosenDate = new Date(date);

        if( chosenDate<minDate || !date){
            alert("Podaj prawidłową datę w przyszłości!");
            return;
        }
        
        this.tasks.push({text,date});
        this.save();
        this.draw();

        document.querySelector(".add").value="";
        document.querySelector(".adddate").value="";
    }

    deleteTask(task){
        //próbowałem z remove i removeChild,a le nie działało, więc z pomocą AI wpadłem na metodę splice, która
    //manipuluje tablicą, a na nich pracujemy, kiedy robiłem remove to nic się nie zmieniało
        const index=this.tasks.indexOf(task);
        this.tasks.splice(index,1);
        this.save();
        this.draw();
    }

    getFilteredTasks(){
        //!this.term jest potrzebne bo inicjalizacja na pusty string, a nie zadziała ==
        if (!this.term){
            return this.tasks;
        }
        const filteredTask=this.tasks.filter(task => task.text.toLowerCase().includes(this.term))
        return filteredTask
    }
//z tą funkcją pomógł mi chat, chciałem skorzystać z /term/gi, ale wtedy szukałoby faktycznie skrótu term,
//a nie tego co wyszukuje, gi to parametry global i Caseinsensivity, czat podał mi metodę new RegExp
    highlight(text, term) {
        if (!term) return text;
        const regex = new RegExp(term, "gi");
        return text.replace(regex, (match) => `<mark>${match}</mark>`);
//zamieniam dopasowany przez regex fragment tekstu na tekst otoczony markiem, co u mnie jest zółtym highlightem
    }

}
const myToDo = new ToDo();
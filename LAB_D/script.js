const Key = "290fc12d3aa3e738e076e5a85a582769";
document.querySelector(".btnWeather").addEventListener("click",()=> {
    const city = document.querySelector(".input_city").value;

    getCurrent(city);
    getForecast(city);

});  

function getCurrent(city){
    let req = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Key}&units=metric&lang=pl`;
    req.open("GET", url, true);

    req.addEventListener("load", function() {
        if (req.status === 200) {
            const data = JSON.parse(req.responseText);
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            const time = new Date((data.dt + data.timezone) * 1000);

            const formatedTime=time.toLocaleTimeString("pl-PL", {hour: "2-digit", minute: "2-digit" });
            const formatedDate=time.toLocaleDateString("pl-PL", {day: "2-digit", month: "2-digit"});
            const formatedWeekday=time.toLocaleDateString("pl-PL",{weekday: "short"});

            document.querySelector(".weather_box").innerHTML = `
                <h2>${data.name} - Obecna Pogoda</h2>
                <h3>${formatedWeekday} - ${formatedDate} - ${formatedTime}</h3> 
                <div class="weather_boxy">                   

                    <div class="weather_icon">
                        <img src="${iconUrl}" class="cw_icon" alt="icon">
                    </div>

                    <div class="weather_details">
                        <p><strong>${data.weather[0].description}</strong></p>
                        <p>Temperatura: ${data.main.temp} °C</p>
                        <p>Odczuwalna: ${data.main.feels_like} °C</p>
                        <p>Wiatr: ${data.wind.speed} m/s</p>
                    </div>
                
                </div>
            `;
        }
    });

    req.send(null);
    console.log("Zapytanie wysłane!");
};

function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${Key}&units=metric&lang=pl`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Forecast response:", data);
            let html = `
                <div class="forecast_header">
                    <h2>${data.city.name} - Prognoza 5-dniowa</h2>
                </div>
            `;

            for (let i = 0; i < data.list.length; i += 1) {
                const item = data.list[i];
                const time = new Date(item.dt_txt);
                const formatedTime=time.toLocaleTimeString("pl-PL", {hour: "2-digit", minute: "2-digit" });
                const formatedDate=time.toLocaleDateString("pl-PL", {day: "2-digit", month: "2-digit"});
                const formatedWeekday=time.toLocaleDateString("pl-PL",{weekday: "short"});
                const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

                html += `
                    <h3>${formatedWeekday} - ${formatedDate} - ${formatedTime} </h3> 
                    <div class="forecast_boxy">
                        <div class="forecast_icon">
                        <img src="${iconUrl}" class="cw_icon" alt="icon">
                        </div>
                        <div class="forecast_details">
                            <p><strong>${item.weather[0].description}</strong></p>
                            <p>Temp: ${item.main.temp} °C</p>
                            <p>Odczuwalna: ${item.main.feels_like} °C</p>
                            <p>Wiatr: ${item.wind.speed} m/s</p>
                        </div>
                    </div>
                `;
            }

            document.querySelector(".forecast_box").innerHTML = html;
        });
};

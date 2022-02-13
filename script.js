//Animation stuff

let mainBox = document.getElementById("box");
let navButtons = document.getElementById("buttons");

function animations(){
navButtons.classList.add("animate__animated");
navButtons.classList.add("animate__flipInY");  
mainBox.classList.add("animate__animated");
mainBox.classList.add("animate__shakeX");
};
animations();

//Changing pages

let button1 = document.getElementById("weather");
let button2 = document.getElementById("hourly");
let search = document.getElementById("boxSubmit");
let nav = document.getElementsByTagName("nav")[0];
let hourlyContent = document.getElementById("hourlyContent");
let weatherContent = document.getElementById("weatherContent");
let boxInput = document.getElementById("boxInput");
let navInput = document.getElementById("navInput");
let inputBox = document.getElementById("box");
let navSubmit = document.getElementById("navSubmit");
nav.style.display = "none";
hourlyContent.style.display = "none";
weatherContent.style.display = "none";

search.addEventListener("click", () => {
    if(!(boxInput.value)){
        alert("Please enter a city");
    }else{
        makeApiCall(`https://api.openweathermap.org/data/2.5/forecast?q=${boxInput.value}&units=metric&APPID=e491fa36f13966466618a3eb8c8aed5a`);
        document.getElementById("cityName").innerText = boxInput.value.toUpperCase();
        navInput.value = boxInput.value;
    }
});

navSubmit.addEventListener("click", () => {
    if(!(navInput.value)){
        alert("Please enter a city");
    }else{
        makeApiCall(`https://api.openweathermap.org/data/2.5/forecast?q=${navInput.value}&units=metric&APPID=e491fa36f13966466618a3eb8c8aed5a`);
        document.getElementById("cityName").innerText = navInput.value.toUpperCase();
        button2.style.borderBottom = "none";
    }
});

button1.addEventListener("click", () => {
    button1.style.borderBottom = "1px solid white";
    button2.style.borderBottom = "none";
    hourlyContent.style.display = "none";
    weatherContent.style.display = "block";
});
button2.addEventListener("click", () => {
    button2.style.borderBottom = "1px solid white";
    button1.style.borderBottom = "none";
    hourlyContent.style.display = "block";
    weatherContent.style.display = "none";
});

//API Calls

function WeatherInfo(infos){
    this.temp = infos.main.temp,
    this.hum = infos.main.humidity,
    this.icon = infos.weather[0].icon,
    this.description = infos.weather[0].description,
    this.time = infos.dt_txt,
    this.wind = infos.wind.speed
}

async function makeApiCall(url){
    try{
    let response = await fetch(url);
    let result = await response.json();
    let final = [];
    result.list.forEach(element => {
        final.push(new WeatherInfo(element));
    });
    editHourlySection(final);
    editWeatherSection(final);
    nav.style.display = "flex";
    inputBox.style.display = "none";
    weatherContent.style.display = "block";
    hourlyContent.style.display = "none";
    button1.style.borderBottom = "1px solid white";
    } catch(err){
        nav.style.display = "none";
        weatherContent.style.display = "none";
        hourlyContent.style.display = "none";
        inputBox.style.display = "inline-block";
        boxInput.value = "";
        alert("There was an error, please enter another city or try again later");
        console.log(err);
    }
}



function editWeatherSection(final){
    let tempArray = final;
    let avgTemp = 0;
    tempArray.sort((curr, next) => curr.temp - next.temp);
    for(let element of tempArray){
        avgTemp+=element.temp;
    }
    avgTemp/=(tempArray.length)-1;
    document.getElementById("lowestT").innerText = `Lowest: ${tempArray[0].temp}℃`;
    document.getElementById("avgT").innerText = `Average: ${avgTemp.toFixed(2)}℃`;
    document.getElementById("highT").innerText = `Highest: ${tempArray[(tempArray.length)-1].temp}℃`;
    document.getElementById("warmTime").innerText = `${tempArray[tempArray.length - 1].time}`;
    document.getElementById("coldTime").innerText = `${tempArray[0].time}`;
    let humArray = final;
    humArray.sort((curr, next) => curr.hum - next.hum);
    let avgHum = 0;
    for(let element of humArray){
        avgHum+=element.hum;
    }
    avgHum/=(humArray.length)-1;
    document.getElementById("lowestH").innerText = `Lowest: ${humArray[0].hum}%`;
    document.getElementById("avgH").innerText = `Average: ${avgHum.toFixed(2)}%`;
    document.getElementById("highH").innerText = `Highest: ${humArray[(humArray.length)-1].hum}%`;

    weatherContent.style.display="block";
}

function editHourlySection(final){
    let tbody = document.getElementById("tbody");
    tbody.innerText = "";
    for(let info of final){
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let img = document.createElement("img");
        img.src = `http://openweathermap.org/img/w/${info.icon}.png`;
        td1.append(img);
        let td2 = document.createElement("td");
        td2.innerText = `${info.description}`;
        let td3 = document.createElement("td");
        td3.innerText = `${info.time}`;
        let td4 = document.createElement("td");
        td4.innerText = `${info.temp}℃`;
        let td5 = document.createElement("td");
        td5.innerText = `${info.hum}%`;
        let td6 = document.createElement("td");
        td6.innerText = `${info.wind} m/s`;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tbody.append(tr);
    }
}
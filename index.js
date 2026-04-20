// Today's Card Variables
let today = document.getElementById("today"),
    todayDate = document.getElementById("today-date"),
    cityLocation = document.getElementById("location"),
    todayDegree = document.getElementById("today-degree"),
    todayIcon = document.getElementById("today-icon"),
    description = document.getElementById("today-description"),
    humidty = document.getElementById("humidty"),
    wind = document.getElementById("wind"),
    compass = document.getElementById("compass"),
    searchBar = document.getElementById("search-bar");

let nextDay = document.getElementsByClassName("nextDay"),
    nextDayIcon = document.getElementsByClassName("nextDay-icon"),
    maxDegree = document.getElementsByClassName("max-degree"),
    minDegree = document.getElementsByClassName("min-degree"),
    nextDayDescription = document.getElementsByClassName("nextDay-description"),
    responseData,
    monthName = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Spet', 'Oct', 'Nov', 'Dec'],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function updateBackground(conditionText) {
    let searchContainer = document.getElementById("search");
    let text = conditionText.toLowerCase();
    const weatherImages = {
        "sun": "sunny.jpg", "clear": "sunny.jpg",
        "cloud": "cloudyy.jpg", "overcast": "cloudyy.jpg",
        "mist": "cloudyy.jpg", "fog": "cloudyy.jpg",
        "rain": "rain.jpg", "drizzle": "rain.jpg",
        "shower": "rain.jpg", "thunder": "rain.jpg",
        "snow": "snowy.jpg", "wind": "windy.jpg"
    };

    let imageFound = false;
    for (let key in weatherImages) {
        if (text.includes(key)) {
            searchContainer.style.backgroundImage = `url(./images/${weatherImages[key]})`;
            imageFound = true;
            break;
        }
    }
    if (!imageFound) searchContainer.style.backgroundImage = "url(./images/weather-wallpaper-4.jpg)";
}
async function getWeatherData(currentCity = 'cairo') {
    let cards = document.querySelectorAll(".temp-card");
    cards.forEach(card => card.classList.remove("show-animate"));

    try {
        let apiResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=572e08fb1d7547f58d8151525211205&q=${currentCity}&days=3`);
        
        if (apiResponse.ok) {
            responseData = await apiResponse.json();
            displayTodayWeather();
            displayNextDayWeather();
            updateBackground(responseData.current.condition.text);
            setTimeout(() => {
                cards.forEach(card => card.classList.add("show-animate"));
            }, 300); 
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

function displayTodayWeather() {
    let date = new Date();
    today.innerHTML = days[date.getDay()];
    todayDate.innerHTML = `${date.getDate()} ${monthName[date.getMonth()]}`;
    cityLocation.innerHTML = responseData.location.name;
    todayDegree.innerHTML = Math.round(responseData.current.temp_c);
    todayIcon.setAttribute("src", `https:${responseData.current.condition.icon}`);
    description.innerHTML = responseData.current.condition.text;
    humidty.innerHTML = responseData.current.humidity;
    wind.innerHTML = responseData.current.wind_kph;
    compass.innerHTML = responseData.current.wind_dir;
}

function displayNextDayWeather() {
    for (let i = 0; i < nextDay.length; i++) {
        let forecast = responseData.forecast.forecastday[i + 1];
        nextDay[i].innerHTML = days[new Date(forecast.date).getDay()];
        nextDayIcon[i].setAttribute('src', `https:${forecast.day.condition.icon}`);
        maxDegree[i].innerHTML = Math.round(forecast.day.maxtemp_c);
        minDegree[i].innerHTML = Math.round(forecast.day.mintemp_c);
        nextDayDescription[i].innerHTML = forecast.day.condition.text;
    }
}

searchBar.addEventListener("keyup", function () {
    if (this.value.length > 2) getWeatherData(this.value);
});

getWeatherData();
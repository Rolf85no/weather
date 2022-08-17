import React from 'react'
import Footer from './components/Footer'
import WeatherStats from './components/WeatherStats'
export default function App() {
    const [weatherInfo, setWeatherInfo] = React.useState(
        {
            'city': '',
            'weather': '',
            'temperature': '',
        }
    )
    const getWeather = async function (city) {
        try {
            const responseGeo = await fetch(`https://geocode.xyz/${city}?geoit=json`);
            const dataGeo = await responseGeo.json();
            const latitude = await dataGeo.latt;
            const longitude = await dataGeo.longt;
            const response = await fetch(`https://www.7timer.info/bin/civillight.php?lon=${longitude}&lat=${latitude}&ac=0&unit=metric&output=json&tzshift=0`);
            const data = await response.json();
            setWeatherInfo(
                {
                    'city': city,
                    'weather': data.dataseries[0].weather,
                    'temperature': data.dataseries[0].temp2m.max,
                }
            )
        }
        catch (err) {
            console.error(err);
        }
    }

    function handleSubmit(event) {
        const city = document.querySelector('.searchbar--input')
        event.preventDefault();
        getWeather(city.value.toLowerCase());
    }
    return (
        <main>
            <h1>Weather check</h1>
            <form className="searchbar--form" onSubmit={handleSubmit}>
                <input className="searchbar--input" type="text"></input>
                <button
                    className="searchbar--button"
                    type="submit">
                    Search
                </button>
            </form>
            <WeatherStats
                city={weatherInfo.city}
                weather={weatherInfo.weather}
                temperature={weatherInfo.temperature}
            />
            <Footer />
        </main>
    )
}
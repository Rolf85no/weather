import React from 'react'
import Footer from './components/Footer'
import WeatherStats from './components/WeatherStats'
export default function App() {
    const [weatherInfo, setWeatherInfo] = React.useState(
        {
            'city': '',
            'data': [
                {
                    date: '',
                    weather: '',
                    temperature: '',
                    wind: '',
                }
            ],
        }
    )

    const [isLoading, setIsLoading] = React.useState(false);

    const renderErrorMsg = function (message) {
        setIsLoading(false);
        setWeatherInfo(prevWeatherInfo => {
            return {
                ...prevWeatherInfo,
                city: '',
                data: [
                    {
                        date: '',
                        weather: '',
                        temperature: '',
                        wind: '',
                    }
                ],
            }
        })
        const errorMsgEl = document.querySelector('.errMessage');
        errorMsgEl.innerHTML = message;
        errorMsgEl.classList.remove('hidden');
    }
    const getWeather = async function (city) {
        try {
            setIsLoading(true);
            const responseGeo = await fetch(`https://geocode.xyz/${city}?geoit=json`);
            if (!responseGeo.ok) throw new Error('Too many requests or internet too slow')
            const dataGeo = await responseGeo.json();
            if (dataGeo.error) throw new Error('Couldn`t find city')
            const latitude = await dataGeo.latt;
            const longitude = await dataGeo.longt;
            const weatherResponse = await fetch(`https://www.7timer.info/bin/civillight.php?lon=${longitude}&lat=${latitude}&ac=0&unit=metric&output=json&tzshift=0`);
            const weatherData = fixData(await weatherResponse.json());

            setWeatherInfo(
                {
                    'city': city,
                    'data': weatherData
                }
            )
            setIsLoading(false);
        }
        catch (err) {
            console.error(err);
            renderErrorMsg(err.message);
        }
    }

    const fixData = function (weatherData) {
        let weatherArray = []
        for (const [index, data] of weatherData.dataseries.entries()) {
            const dateString = index !== 0 ? String(data.date).replaceAll('2022', '') : 'Today';
            let obj = { date: dateString, weather: data.weather, temperature: data.temp2m.max, wind: data.wind10m_max }
            weatherArray.push(obj);
        }
        return weatherArray
    }

    function handleSubmit(event) {
        const city = document.querySelector('.searchbar--input')
        event.preventDefault();
        const errorMsgEl = document.querySelector('.errMessage');
        errorMsgEl.classList.add('hidden');
        getWeather(city.value.toLowerCase());
    }
    return (
        <main>
            <h1>Weather check</h1>
            <form className="searchbar--form" onSubmit={handleSubmit}>

                <input
                    className="searchbar--input"
                    type="text"
                    placeholder="Type in city"
                >
                </input>
                <button
                    className="searchbar--button"
                    type="submit"
                    disabled={isLoading}
                >

                    🔍
                </button>

            </form>
            <h3 className="errMessage hidden"></h3>
            <WeatherStats
                city={weatherInfo.city}
                data={weatherInfo.data}
            />
            <Footer />
        </main>
    )
}
import React from 'react'
import Footer from './components/Footer'
import WeatherStats from './components/WeatherStats'
export default function App() {
    const [darkMode, setDarkMode] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [today, setToday] = React.useState();
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

    React.useEffect(() => {
        const date = new Date();
        setToday(date.getDay() - 1);
    }, [])

    const renderErrorMsg = function (message) {
        setIsLoading(false);
        const errorMsgEl = document.querySelector('.errMessage');
        errorMsgEl.innerHTML = message;
        errorMsgEl.classList.remove('hidden');
    }
    const getWeather = async function (city) {
        try {
            if (!city) throw new Error('Please type in a city')
            setIsLoading(true);
            const responseGeo = await fetch(`http://api.positionstack.com/v1/forward?access_key=e5d639e3086bc35279673c05d706fcf8&query=${city}&limit=1&output=json`);
            if (!responseGeo.ok) throw new Error('Couldn`t connect with server, please wait and try again')
            const dataGeo = await responseGeo.json();
            if (dataGeo.error) throw new Error('Couldn`t find city')
            const latitude = await dataGeo.data[0].latitude;
            const longitude = await dataGeo.data[0].longitude;
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
        const weekDays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ]

        let weatherArray = []
        for (const [index, data] of weatherData.dataseries.entries()) {
            let dateString = '';
            if (index === 0) dateString = 'Today';
            else if (index === 1) dateString = 'Tomorrow'
            else {
                let wkI = today + index;
                wkI > 6 ? dateString = weekDays[wkI - weekDays.length] : dateString = weekDays[wkI]
            }
            let obj = { date: dateString, weather: data.weather, tempMax: data.temp2m.max, tempMin: data.temp2m.min, wind: data.wind10m_max }
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

    const toggleDarkMode = function () {
        const toggleButtonEl = document.querySelector('.toggleDark');
        if (!darkMode) {
            document.documentElement.setAttribute('theme', 'dark');
            toggleButtonEl.textContent = '🌚'
            setDarkMode(true);

        }
        else {
            document.documentElement.setAttribute('theme', 'light');
            toggleButtonEl.textContent = '🌞';
            setDarkMode(false);
        }

    }



    return (
        <main>
            <button className="toggleDark" onClick={toggleDarkMode}>🌞</button>
            <h1 className="header">How`s the Weather? ☁️</h1>
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
                isLoading={isLoading}
            />
            <Footer />
        </main>
    )
}
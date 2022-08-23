import React from 'react'
import LoadingSpinner from './loadingSpinner';

export default function weatherStats(props) {
    const weatherTypes = {
        'clear': '☀️',
        'cloudy': '☁️',
        'pcloudy': '⛅️',
        'mcloudy': '⛅️',
        'rain': '🌧',
        'shower': '🌧',
        'snow': '🌨',
        'thunderstorm': '🌩',
    }

    function weatherSymbols(weatherString) {
        let weather = '';
        for (const [key, value] of Object.entries(weatherTypes)) {
            if (weatherString.includes(key)) weather = value;
        }

        return weather
    }



    const checkTemp = function (temperature) {
        let style = { color: 'black' }
        if (temperature > 30)
            style.color = 'red';

        else if (temperature < 30 && temperature > 15)
            style.color = 'green';

        else if (temperature < 0 && temperature > -10)
            style.color = 'lightblue';

        else if (temperature < -10)
            style.color = 'steelblue'

        return style;
    }

    const weatherElements = props.data.map((element, index) => {
        return (
            <div className="weatherStats--day" key={index}>
                <h4> {element.date}</h4>
                <h1 className="weatherStats--type"> {element.weather ? weatherSymbols(element.weather) : ''}</h1>
                <h5>  {element.wind} m/s </h5>
                <h4 className="weatherStats--temp" style={checkTemp(element.tempMax)}> {element.tempMax} / {element.tempMin} °C</h4>
            </div>
        )
    }

    )
    return (
        <section>
            {
                props.isLoading ?
                    <LoadingSpinner />

                    :

                    <div className={props.city ? "weatherStats" : "weatherStats hidden"}>
                        {
                            <h3 className="weatherStats--city">{props.city.toUpperCase()}</h3>
                        }

                        <div className="weatherStats--container">
                            {weatherElements}
                        </div>

                    </div >
            }
        </section>

    )
}
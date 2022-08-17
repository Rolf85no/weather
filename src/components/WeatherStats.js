import React from 'react'

export default function weatherStats(props) {

    return (
        <div className="weatherStats">
            {
                props.city &&
                <h3 className="weatherStats--city">{props.city.toUpperCase()}</h3>
            }

            {
                props.weather &&
                <h4 className="weatherStats--type"> {props.weather}</h4>
            }
            {
                props.temperature &&
                <h4 className="weatherStats--temp"> {props.temperature}°C</h4>
            }

        </div>
    )
}
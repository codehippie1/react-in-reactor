import React, { Component, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from '../atoms';

const FetchData = (props) => {

  const accessToken = useAtomValue(accessTokenAtom);
  const [state, setState] = useState({ forecasts: [], loading: true });

  useEffect(() => {
    populateWeatherData();
  }, []);


  const populateWeatherData = async () => {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers
    };

    const response = await fetch('weatherforecast', options);
    //const response = await fetch('weatherforecast', requestOptions);

    //const response = await fetch('weatherforecast', {
    //  headers: {
    //    'Authorization': `Bearer ${accessToken}`
    //  }
    //});
    const data = await response.json();
    setState({ forecasts: data, loading: false });
  }

  const renderForecastsTable = (forecasts) => {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

    let contents = state.loading
      ? <p><em>Loading...</em></p>
      : renderForecastsTable(state.forecasts);

    return (
      <div>
        <h1 id="tableLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
}

export default FetchData;
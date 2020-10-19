import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { ChosenDayProvider } from "../../context/ChosenDayContext";
import Weather from "../Weather";
import SearchAutocomplete from "./SearchAutocomplete";

const Search = () => {
  const apiKey = "3c850b0463346d2fffad82b66d5eb561";
  const [city, setCity] = useState("budapest");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const [state, setState] = useState({
    id: null,
    name: null,
    timezone: null,
    main: {},
    weather: [{}],
    wind: {},
  });

  useEffect(() => {
    axios
      .get(url)
      .then(
        (res) =>
          setState({
            id: res.data.id,
            name: res.data.name,
            timezone: res.data.timezone,
            main: res.data.main,
            weather: res.data.weather,
            wind: res.data.wind,
          }),
        setError(null)
      )
      .catch((err) => {
        setError(err);
      });
  }, [url]);

  const submitHandler = () => {
    setCity(searchTerm.toLowerCase());
    setSearchTerm("");
  };

  const keyDownHandler = (event) => {
    if (event.key === "Enter") {
      submitHandler();
    }
  };

  const inputFieldChangeHandler = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <ChosenDayProvider>
      <React.Fragment>
        <SearchBar className="search">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={inputFieldChangeHandler}
            onKeyDown={keyDownHandler}
          />
          <SearchButton onClick={submitHandler}>
            <i className="fa fa-search" />
          </SearchButton>
          <SearchAutocomplete
            searchedCity={searchTerm}
            setSearchedCity={setCity}
            setInputText={setSearchTerm}
          />
        </SearchBar>
        {error !== null && (
          <Error>Location not found. Please try a different search term.</Error>
        )}
        <Weather currentWeather={state} />
      </React.Fragment>
    </ChosenDayProvider>
  );
};

const SearchBar = styled.div`
  width: 400px;
  margin: auto;
  position: relative;
`;

const Input = styled.input`
  width: 360px;
  height: 40px;
  font-size: 15px;
  outline: none;
  border: 2px solid #b5c4d6;
  padding: 10px;
  margin-top: 0;
`;

const SearchButton = styled.button`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 15px;
  background-color: #b5c4d6;
  color: #fff;
  border: 1px solid #b5c4d6;
  outline: none;
  cursor: pointer;
`;

const Error = styled.div`
  padding: 10px;
  background-color: #ffbaba;
  color: #d8000c;
  margin: 10px 40px;
`;

export default Search;

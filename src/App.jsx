import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

  //Initialise the counter
  let i=0;

  //Initialise the constants and states
  const apiKey = process.env.REACT_APP_API_KEY;
  const [apiData, setApiData] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [city, setCity] = useState("Beirut");
  const [search, setSearch] = useState(false);
  const [cityFound, setCityFound] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);

  //Fetch the data from the API
  useEffect(() => {
    console.log("api key is:" + apiKey);
    
    const fetchData = async () => {
      setSearch(false);
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        const data = await response.json();

        //Storing the data in the state
        setApiData(data);
        
      }catch (error){
        //In case the user enters an invalid city, an error would be thrown, and the following code would be executed
        setSearch(false);
        alert("City not found");
        
      } 
    }
    
    console.log(city);
    console.log("search at the level of useEffect is: "+search);
    
    fetchData();
  }, [city]);

  //Filter the data by date (One value for each day)
  useEffect(() => {
    if (apiData) {
      let lastDate = "";
      const dataByDate = [];

      //Checking if the city entered by the user is valid
      if (apiData.cod === "404") {
        setCityFound(false);
        return;
      }

      //Looping through the data to filter it by date
      apiData.list.forEach((data) => {
        setCityFound(true);
        const forecastDate = data.dt_txt.split(" ")[0];

        if (forecastDate !== lastDate) {

          //Update the array with the data of the new day
          dataByDate.push(data);
          lastDate = forecastDate;
        }
      });

      setDailyData(dataByDate);
    }
    
    
  }, [apiData]);

  //Day-Night mode switch
  const toggleMode = () => setIsNightMode(!isNightMode);

  return (
    <div className={`root ${isNightMode ? "night" : "day"}`}>
      <div className="mainBody">

        <button className="toggleButton" onClick={toggleMode}>
          Switch to {isNightMode ? "Day" : "Night"} Mode
        </button>

        <div className="inputContainer">
          <input type="text" onBlurCapture={(e) => setCity(e.target.value)} placeholder="Enter city" className="input" />
          <button className="searchButton" onClick={() => setSearch(true)}>Search</button>
        </div>

        <h1>{city}</h1>

        {search && dailyData.length > 0 && cityFound && (
          <div className="weatherCards">
            {dailyData.map((data, index) => {
              //Setting the respective icon for each weather condition/day (Provided by the API)
              const iconCode = data.weather[0].icon;
              const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

              //Extracting the date in the YYYY-MM-DD format from the data provided from the API and stored in data.dt_txt
              const date = data.dt_txt.split(" ")[0];

              return (
                <div key={index} className="weatherCard">

                  <h1>{date}</h1>
                  <img src={iconUrl} alt="weather icon" className="icon" />
                  <h2>{data.weather[0].description}</h2>
                  <h3>{Math.round(data.main.temp - 273.15)}°C</h3>
                  <p>Humidity: {data.main.humidity}%</p>
                  <p>Wind Speed: {data.wind.speed} m/s</p>
                  <p>Pressure: {data.main.pressure} hPa</p>
                  
                </div>
              );
            })}
          </div>
        )}
        {!cityFound && <h1 className="errorMessage">City not found</h1>}
      </div>
    </div>
  );
}

export default App;

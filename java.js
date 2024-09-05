const cityInput =document.querySelector('.city-input');
const searchBtn =document.querySelector('.search-btn');

const weatherInfoSection =document.querySelector('.weather-info');
const notFoundSection =document.querySelector('.not-found');
const searchCitySection =document.querySelector('.search-city');

const countyTxt=document.querySelector('.country-txt');
const tempTxt=document.querySelector('.temp-txt');
const conditionTxt=document.querySelector('.condition-txt');
const humidityValueTxt=document.querySelector('.humidity-value-txt');
const windValueTxt=document.querySelector('.wind-value-txt');
const weatherSummaryImg=document.querySelector('.weather-summary-img');
const currentDateTxt=document.querySelector('.current-date');

const forecastItemContainer =document.querySelector('.forecast-item-container')

const apikey='dbdc2ab6415a11adfc8df1827fc77293';

searchBtn.addEventListener('click',() =>{ 
    if(cityInput.value.trim() != ''){
        updateWeatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }  
})

cityInput.addEventListener('keydown',(event)=>{
    if (event.key =='Enter' &&
        cityInput.value.trim() != ''
    ){
        updateWeatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur() 
    }
})


function getweatherIcon(id){
// console.log(id);
if(id<=232) return 'thunderthunderstorm.svg'
if(id<=321) return 'drizzle.svg'
if(id<=531) return 'rain.svg'
if(id<=622) return 'snow.svg'
if(id<=781) return 'atmosphere.svg'
if(id<=800) return 'clear.svg'
else return 'clouds.svg'

}

function getcurrentdate(){
const currentDate=new Date()
// console.log(currentDate);

const option={
    weekday:'short',
    day:'2-digit',
    month:'short'
}
return currentDate.toLocaleDateString('en-GB',option)


}

async function getFetchData (endpoint,city){
    const apiurl= `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`
 
    const response = await fetch(apiurl)

    return response.json()
}


async function updateWeatherinfo(city){
 const weatherData = await getFetchData('weather',city)
 if (weatherData.cod != 200){
    showDisplaySection(notFoundSection)
    return
    }




//  console.log(weatherData);
 
 const {
    name: country,
    main:{temp,humidity},
    weather:[{id, main}],
    wind:{speed}
 }=weatherData


 countyTxt.textContent=country;
 tempTxt.textContent= Math.round(temp) +' °C';
 conditionTxt.textContent= main;
 humidityValueTxt.textContent=humidity+ '%';
 windValueTxt.textContent=speed +' M/s'


 currentDateTxt.textContent=getcurrentdate();
weatherSummaryImg.src=`assets/weather/${getweatherIcon(id)}`

await updateForecastsInfo(city)
   showDisplaySection(weatherInfoSection);
 }

 async function updateForecastsInfo(city){
    const forecastData = await getFetchData('forecast', city)

const timeTaken ='12:00:00'
const todaydate=new Date().toISOString().split('T')[0]

forecastItemContainer.innerHTML=''
forecastData.list.forEach(forecastWeather =>{
    if(forecastWeather.dt_txt.includes(timeTaken)&&
!forecastWeather.dt_txt.includes(todaydate)){
updateForecastsItem(forecastWeather)

    }
})

 }

 function updateForecastsItem(weatherData){
const{
    dt_txt: date,
    weather:[{ id }],
    main:{temp}
}=weatherData

const dateTaken =new Date(date)
const dateOption={
    day:'2-digit',
    month:'short'
}

const dateResult=dateTaken.toLocaleDateString('en-US', dateOption)

const forecastItem=`
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                <img src="assets/weather/${getweatherIcon(id)}"  class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
            </div>
`

forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)
 }



 function showDisplaySection(section){
   [weatherInfoSection,searchCitySection,notFoundSection]
   .forEach(section => section.style.display ='none')

   section.style.display ='flex';
 }
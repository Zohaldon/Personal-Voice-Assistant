
//Getting our Microphone Image and Sound file
const recognitionActivator = document.querySelector('.recogniton-activated');
const sound = document.querySelector('.sound');
const userCommand = document.querySelector('.usercommand');


// Event Listner that would play sound when the Microphone is clicked, to show user that recognition is triggered
recognitionActivator.addEventListener('click',() => {
    //Play the Sound
    sound.play();
    //After playing sound start recording the user's speech
    recognise();
});

// =============================== Speech recogniton Setup ============================================================

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

//Initiating speech Recogniton
const recognition = new SpeechRecognition();

//Initiazting assistant
const assistant = window.speechSynthesis;

//recognise function that atriggers the Recognition
const recognise = () => {
    recognition.start();
    recognition.onresult = (event) => {
        //get user transcript
        const userInput = event.results[0][0].transcript;
        //Show user what the model has recognised.015*+86
        userCommand.textContent = userInput;

        //When user has finished speaking [.isFinal return true or flase]
        if (event.results[0].isFinal){

            //Time
            if (userInput.includes(('what is the time'))) 
            {
                utter(getTime);
            }; 

            //Date
            if(userInput.includes('what is today\'s date'))
            {
                utter(getDate);
            };

            //Day
            if(userInput.includes('what is today')){
                utter(getToday);
            };

            //Weather
            if (userInput.includes('weather in')) {
                var toSearch = userInput.slice(11);
                getWeather(toSearch);
            };

            //open a website
            if (userInput.includes('open'))
            {
                var temp = userInput.slice(5);
                var toSearch = temp.split(" ").join('');
                openWebsite(toSearch);
                message(a ="taking you to " + toSearch.toString());
            };

            //seach something
            if(userInput.includes('search'))
            {
                var toSearch = userInput.slice(7);
                searchWebsite(toSearch);
                message( a ="Searching for " + toSearch.toString());
            };

            //search people or stuff
            if(userInput.includes('who is'))
            {
                var toSearch = userInput.slice(7);
                searchPerson(toSearch);
                message(a ="Here's the information about" + toSearch.toString());
            };
            
            if(userInput.includes('information about'))
            {
                var toSearch =userInput.slice(18);
                searchPerson(toSearch);
                message(a ="have a look at " + toSearch.toString());
            };

            //Good job
            if(userInput.includes('good job')){
                //Message via action handler
                //utter(a = ()=>{ var message="Thank you"; return`${message}`;});

                //Direct approach
                message( a ="Thank you");
            };

            //Search on youtube 
            if(userInput.includes("YouTube"))
            {
                var toSearch = userInput.slice(8);
                searchYoutbe(toSearch);
                message(a ="Here's the youtube for " + toSearch.toString());
            };

            //Search location
            if(userInput.includes("where is"))
            {
                var toSearch = userInput.slice(9);
                serachLocation(toSearch);
                message( a ="locating you to " + toSearch.toString());
            }

            //Buy a product
            if(userInput.includes("let\'s buy"))
            {
                var toSearch = userInput.slice(9);
                serachAmazon(toSearch);
                message(a="here's the result for" + toSearch.toString());
            }
            //message(a ="Sorry, I am not programmed to handle that. Meet paarth");
        };
    }
};

//utter function that replys back in computerized voice.
const utter = (action) => {
    output = new SpeechSynthesisUtterance(action());
    setVoice(output);
    //use speak function to utter the result
    assistant.speak(output);
};

const message =(userSpeech) => {
    output = new SpeechSynthesisUtterance(userSpeech);
    setVoice(output);
    assistant.speak(output);
}
//================== Different voices for speech recognition ===================
function populateVoiceList() {
    if(typeof speechSynthesis === 'undefined') 
    {
      return;
    }
  
    voices = speechSynthesis.getVoices();
  
    for(i = 0; i < voices.length ; i++) 
    {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
      
      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
    }
  
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voiceSelect").appendChild(option);
    }
}
  
populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) 
{
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

const setVoice = (utterThis) =>
{
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++)
    {
        if(voices[i].name === selectedOption) 
        {
            utterThis.voice = voices[i];
        }
    }
};
// ======================= Functions ==========================================

//Time Function
const getTime = () => {
    const time = new Date(Date.now());
    //utter time in words instead of number and use the 12 hour format
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

//Date Function
const getDate = () => {
    const time = new Date(Date.now())
    return `today's Date is ${time.toLocaleDateString()}`;
};

//Day Function
const getToday =() => {
    const time = new Date();

    //Creating array to convert number from getDay method to String [More meaningful]
    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var todaysDay = weekday[time.getDay()];
    return `today's ${todaysDay}`;
}

//Open website
const openWebsite =(userSpeech) => {
    window.open(`http://${userSpeech}`,`_newtab`);
}

//search gooogle
const searchWebsite =(userSpeech) => {
    window.open(`https://www.google.com/search?q=${userSpeech}`,`_newtab`)
}

//search person
const searchPerson = (userSpeech) =>{
    window.open(`https://en.wikipedia.org/wiki/${userSpeech}`,`_newtab`);
}
//Weather Function
const getWeather = (userSpeech) => {

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userSpeech}&appid=06c3f39838fde5261d41e5cb345f14e6&units=metric`) 
    .then(function(response)
    {
      return response.json();
    })
    .then(function(weather)
    {
        if (weather.cod === '404')
        {
          output = new SpeechSynthesisUtterance(`I cannot find the weather for ${userSpeech.split(' ')[5]}`);
          assistant.speak(output);
          return;
        }
        
        output = new SpeechSynthesisUtterance(`the weather in ${weather.name} is ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
        assistant.speak(output);
  });
};
5
//I Love You
const getILoveYou =() =>{
    var iloveyou = 'so sweet';
    return `${iloveyou}`;      
}

//search youtube
const searchYoutbe =(userSpeech) =>{
    window.open(`https://www.youtube.com/results?search_query=${userSpeech}`,`_newtab`)
}

//serach Location
const serachLocation =(userSpeech) =>{
    window.open(`https://www.google.com/maps/search/${userSpeech}`,`_newtab`)
}

//amazon
const serachAmazon =(userSpeech) =>{
    window.open(`https://www.amazon.com/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=${userSpeech}`,`_newtab`)
}

//============================= show the list all of the voices when icon is clicked ================================
function showOptions(){
    var langSelector =  document.getElementById('voiceSelect');
    var displaySetting = langSelector.style.display;
    
    if(displaySetting == 'block')
    {
        langSelector.style.display ='none';
    }
    if(displaySetting =='none')
    {
        langSelector.style.display='block';
    }
}

//================================== Navigation option ===================================
function openNav() 
{
    document.getElementById("myNav").style.height = "100%";
}
  
function closeNav()
{
    document.getElementById("myNav").style.height = "0%";
}
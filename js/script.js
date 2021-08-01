// getting ip input field and button search

var ipInput=document.getElementById('ip-input');
var btnSearch=document.getElementById('btn-search');
var errorMessage=document.getElementById('error-message');
let ip=document.getElementById('ip')
let iplocation=document.getElementById('location')
let timeZone=document.getElementById('time-zone')
let isp=document.getElementById('isp')
var myMap=L.map('mapid');
settingMap()
ipInput.addEventListener('input',(e)=>{
    console.log(e.target.value)
    errorMessage.style.display='none'
})
btnSearch.addEventListener('click',(e)=>{
    if(ipInput.value===''){
        errorMessage.style.display='block'
        return
    }
    httpRequest(ipInput.value)
    
})
// making http request or ajax request or xmlhttprequest
function httpRequest(ipaddress)
{
    var request=new XMLHttpRequest();
    request.open('GET',BASE_URL+'?apiKey='+API_KEY+'&domain='+ipaddress);
    request.onreadystatechange= async function (){
       if(this.readyState===4&&this.status===200)
       {
       
           const api= await JSON.parse(this.responseText);
           console.log(api)
           const latitude=api.location.lat?api.location.lat:0
           const longitude=api.location.lng?api.location.lng:0
           ip.innerHTML=api.ip;
           iplocation.innerHTML=api.location.region+','+api.location.country+'<br>'+api.location.city;
           timeZone.innerHTML='UTC '+api.location.timezone;
           isp.innerHTML=api.isp;
           settingMap(latitude,longitude)
           ipInput.value=''
       }
       if(this.status===422)
       {
        errorMessage.style.display='block'
           return
       }
    }
    request.send()
}

function settingMap(latitude=0,longitude=0)
{
    myMap.setView([latitude,longitude ],13)

// setting tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    //map version
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    // access token is my map box access control
    accessToken: 'pk.eyJ1IjoiYWhtZWQtYWxhYTE5OTgiLCJhIjoiY2tycWNsdXIxMDc3ajJ1cWM3YWN1ZjM4eSJ9.uDdek3vpqo9HHg68fejHqA'
}).addTo(myMap);

var marker = L.marker([latitude,longitude ],).addTo(myMap);
// var circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(myMap);
// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(myMap);

marker.bindPopup("Ip Location is  ."+latitude +' '+longitude).openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(myMap);
}

myMap.on('click', onMapClick);
}

// runs every 3 seconds
setInterval(async () => {
  //fetch the bus arrival data from express API
  const buses = await fetch('/api/buses').then(res => res.json());
  // gets the element where buses will be displayed
  const busList = document.getElementById('bus-list');
  // clears the current list
  busList.innerHTML = '';

  // loops through the buses 
  buses.forEach(bus => {
    const li = document.createElement('li');
    li.textContent = bus;
    busList.appendChild(li);
  });


// fetchs the latest crowd count
  const crowd = await fetch('/api/crowd').then(res => res.json());
  // displays crowd count on page
  document.getElementById('crowd-count').textContent = crowd.people;
//updates temp, humid, aqi on browser
  const env = await fetch('/api/env').then(res => res.json());
  document.getElementById('temp').textContent = env.temperature;
  document.getElementById('humidity').textContent = env.humidity;
  document.getElementById('aqi').textContent = env.aqi;
}, 3000); 

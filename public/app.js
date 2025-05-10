setInterval(async () => {
    const buses = await fetch('/api/buses').then(res => res.json());
    const busList = document.getElementById('bus-list');
    busList.innerHTML = '';
    buses.forEach(bus => {
      const li = document.createElement('li');
      li.textContent = bus;
      busList.appendChild(li);
    });
  
    const crowd = await fetch('/api/crowd').then(res => res.json());
    document.getElementById('crowd-count').textContent = crowd.people;
  
    const env = await fetch('/api/env').then(res => res.json());
    document.getElementById('temp').textContent = env.temperature;
    document.getElementById('humidity').textContent = env.humidity;
    document.getElementById('aqi').textContent = env.aqi;
  }, 3000);
  
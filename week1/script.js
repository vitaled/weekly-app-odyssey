// script.js
let events = [];

fetch('config.json')
    .then(response => response.json())
    .then(config => {
        const birthdate = new Date(config.birthdate);
        const lifetime = config.lifetime;
        events = config.events;

        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';
        const now = new Date();
        for(let i = 0; i < lifetime * 52; i++) {
            const week = document.createElement('div');
            const weekDate = new Date(birthdate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
            week.classList.add('week');
            if(weekDate < now && now < new Date(birthdate.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000)) {
                week.classList.add('current');
            } else if(weekDate < now) {
                week.classList.add('past');
            }
            week.title = `Week ${i + 1}: ${weekDate.toDateString()}`;

            const event = events.find(e => e.week === i + 1);
            if(event) {
                week.title += `\nEvent: ${event.description}`;
                week.classList.add('event');
            }
            calendar.appendChild(week);
        }
    })
    .catch(error => console.error('Error:', error));

document.getElementById('toggleSize').addEventListener('click', function() {
    const weeks = document.getElementsByClassName('week');
    for(let i = 0; i < weeks.length; i++) {
        weeks[i].classList.toggle('small');
    }
});
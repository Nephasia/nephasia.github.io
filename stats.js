export function generateStats(dayData, isToday=false){
    
    var splitted = dayData.split('\n')
        .map(line => (line.charAt(line.length - 1) == "," ? line.slice(0, -1) : line ));

    var outsideLogs = [];

    splitted.forEach(json => {

        const object = JSON.parse(json.replaceAll("\'", "\""));
        if(object.name == 'outside'){
            outsideLogs.push(object)
        }
    });

    var temperaturesArray = outsideLogs.map(element => element.temp)

    const minTemp = Math.min(...temperaturesArray).toFixed(1);
    const maxTemp = Math.max(...temperaturesArray).toFixed(1);
    

    var readTime;
    var tempNow;
    if(isToday){
        readTime = outsideLogs[outsideLogs.length - 1].time;
        tempNow = outsideLogs[outsideLogs.length - 1].temp.toFixed(1);
    }
    
    var statsHtml = `
    <div>
        <div class="row">
    `

    statsHtml += `
            <div class="col">
                <p class='h5 text-primary'>Min</p>
                <p class='h2 text-primary'>${minTemp}&nbsp;°C</p>
            </div>
            <div class="col">
                <p class='h5 text-danger'>Max</p>
                <p class='h2 text-danger'>${maxTemp}&nbsp;°C</p>
            </div>
    `

    if(isToday){
        statsHtml += `
            <div class="col">
                <p class='h5 text-right'>${readTime}</p>            
                <p class='h1 text-right'>${tempNow}&nbsp;°C</p>
            </div>
        `
    }

    statsHtml += `
        </div>
        <div class="mb-3"></div>
    </div>
    `

    document.getElementById("stats").innerHTML = statsHtml
}
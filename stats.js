export function generateStats(dayData){
    
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

    var statsHtml = `
    <div>
        <div class="row">
            <div class="col">
                <p class='h2'>Max</p>
                <p class='h2'>Min</p>
            </div>
            <div class="col">
                <p class='h2'>${maxTemp} °C</p>
                <p class='h2'>${minTemp} °C</p>
            </div>
        </div>
        <div class="mb-3"></div>
    </div>
    `

    document.getElementById("stats").innerHTML = statsHtml
}
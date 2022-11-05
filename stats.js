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

    const minTemp = Math.min(...temperaturesArray)
    const maxTemp = Math.max(...temperaturesArray)

    var statsHtml = `
    <div>
        <div class="row">
            <div class="col">
                <p class='h5'>Min</p>
                <p class='h5'>Max</p>
            </div>
            <div class="col">
                <p class='h5'>${minTemp} °C</p>
                <p class='h5'>${maxTemp} °C</p>
            </div>
        </div>
        <div class="mb-3"></div>
    </div>
    `

    document.getElementById("stats").innerHTML = statsHtml
}
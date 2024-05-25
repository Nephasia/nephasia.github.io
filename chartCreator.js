var myChart;

export function prepareChart(dayData){

    if(typeof myChart !== "undefined"){
        myChart.destroy()
    }

    var splitted = dayData.split('\n')
        .map(line => (line.charAt(line.length - 1) == "," ? line.slice(0, -1) : line ));

    var insideLogs = [];
    var outsideLogs = [];
    var insideFloorLogs = [];

    splitted.forEach(json => {

        const object = JSON.parse(json.replaceAll("\'", "\""));

        if(object.name == 'inside'){
            insideLogs.push(object)
        }
        if(object.name == 'outside'){
            outsideLogs.push(object)
        }
        if(object.name == 'inside_floor'){
            insideFloorLogs.push(object)
        }
    });

    var labels = insideLogs.map(element => element.time)
    var insideData = insideLogs.map(element => element.temp)
    var outsideData = outsideLogs.map(element => element.temp)
    var insideFloorLogs = insideFloorLogs.map(element => element.temp)

    // console.log("labels : " + labels)
    // console.log("insideData : " + insideData)
    // console.log("data2 : " + data2)

    createChart(labels, insideData, outsideData, insideFloorLogs)
}

function createChart(labels, data1, data2, data3){

    var ctx = document.getElementById('myChart').getContext('2d');
    Chart.defaults.font.size = 14;
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: labels,
            datasets: [{
                label: 'inside',
                // data: [12, 19, 3, 5, 2, 3],
                data: data1,
                backgroundColor: [
                    'rgba(255, 100, 50, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 100, 50, 1)'
                ],
                borderWidth: 1,
                tension: 0.3,
                fill: true
            },{
                label: 'outside',
                // data: [12, 19, 3, 5, 2, 3],
                data: data2,
                backgroundColor: [
                    'rgba(99, 220, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(99, 220, 132, 1)'
                ],
                borderWidth: 1,
                tension: 0.3,
                fill: true
            },{
                label: 'inside_floor',
                // data: [12, 19, 3, 5, 2, 3],
                data: data3,
                backgroundColor: [
                    'rgba(255, 190, 50, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 190, 50, 1)'
                ],
                borderWidth: 1,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            scales: {
                yAxis: [{
                    ticks: {
                        fontSize: 30
                    }
                }]
            }
        }
    });
}
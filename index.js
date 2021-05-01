import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

const octokit = new Octokit();

const request = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'Nephasia',
    repo: 'containerTemperature',
    path: ''
})

console.log(request)

var repoUrl = 'https://raw.githubusercontent.com/Nephasia/containerTemperature/master/'

request.data.forEach(element => {
    console.log(element.name)

    $(document).ready(function() {
    var url = repoUrl + element.name;
    
    $.get(url, function(data) { 

        var splitted = data.split('\n').map(line => (line.charAt(line.length - 1) == "," ? line.slice(0, -1) : line ))

        var insideLogs = [];
        var outsideLogs = [];

        splitted.forEach(json => {

            console.log('json')
            console.log(json.replaceAll("\'", "\""))

            const object = JSON.parse(json.replaceAll("\'", "\""));

            if(object.name == 'inside'){
                insideLogs.push(object)
            }
            if(object.name == 'outside'){
                outsideLogs.push(object)
            }

            console.log(element);
        });

        console.log(insideLogs)

        // var labels = insideLogs.select(logElement => logElement.date)
        var labels = insideLogs.map(element => element.time)
        var data1 = insideLogs.map(element => element.temp)
        var data2 = outsideLogs.map(element => element.temp)

        console.log("labels : " + labels)
        console.log("data1 : " + data1)
        console.log("data2 : " + data2)

        createChart(labels, data1, data2)

        // $('#code').text(JSON.stringify(insideLogs, undefined, 2));
    }, 'text');
    });

})

// chart    #####################

function createChart(labels, data1, data2){

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: labels,
            datasets: [{
                label: 'inside',
                // data: [12, 19, 3, 5, 2, 3],
                data: data1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            },{
                label: 'outside',
                // data: [12, 19, 3, 5, 2, 3],
                data: data2,
                backgroundColor: [
                    'rgba(99, 255, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}
import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

const octokit = new Octokit();

const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'Nephasia',
    repo: 'containerTemperature',
    path: ''
})

const repoUrl = 'https://raw.githubusercontent.com/Nephasia/containerTemperature/master/'
var myChart;

console.log(response)

generateDayLinks(response);

$(document).ready(function() {
    var latest = getLatestFile(response.data)
    requestData(latest.name)

}, 'text');

async function generateDayLinks(response){

    document.getElementById("links").innerHTML += "dates : <br>"

    console.log("available dates : " + response.data.length)

    await response.data.forEach((element, i) => {
        var dayName = element.name.substring(0, element.name.length - 4);
    
        var linksText = `<span id="${element.name}">${dayName}</span>`;
    
        document.getElementById("links").innerHTML += linksText + " ";
    
        if(i + 1 % 10 == 0) document.getElementById("links").innerHTML += "<br>"
    
    });
    
    await response.data.forEach(element => {
    
        document.getElementById(element.name).addEventListener("click", function(){
            requestData(element.name);
        }, true);
    
    });
}

function requestData(fileName){

    if(typeof myChart !== "undefined"){
        myChart.destroy()
    }

    var url = repoUrl + fileName;
    
    $.get(url, function(data) { 

        var splitted = data.split('\n').map(line => (line.charAt(line.length - 1) == "," ? line.slice(0, -1) : line ))

        var insideLogs = [];
        var outsideLogs = [];

        splitted.forEach(json => {

            // console.log('json')
            // console.log(json.replaceAll("\'", "\""))

            const object = JSON.parse(json.replaceAll("\'", "\""));

            if(object.name == 'inside'){
                insideLogs.push(object)
            }
            if(object.name == 'outside'){
                outsideLogs.push(object)
            }
        });

        // var labels = insideLogs.select(logElement => logElement.date)
        var labels = insideLogs.map(element => element.time)
        var data1 = insideLogs.map(element => element.temp)
        var data2 = outsideLogs.map(element => element.temp)

        // console.log("labels : " + labels)
        // console.log("data1 : " + data1)
        // console.log("data2 : " + data2)

        createChart(labels, data1, data2)
    });
}

function createChart(labels, data1, data2){

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
                    'rgba(255, 130, 50, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 130, 50, 1)'
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

function getLatestFile(responseData){
    return response.data.sort(
        function(a, b) {
            return parseInt(b.name.substring(0, b.name.length - 4))
            - parseInt(a.name.substring(0, a.name.length - 4)) 
        }
    )[0];
}
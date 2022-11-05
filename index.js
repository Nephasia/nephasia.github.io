import { generateStats } from './stats.js';

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

await generateDayLinks(response);

function generateTitleHtml(element){
    console.log("selected : " + element.name)

    var day = dateWithDashesFromElement(element)

    document.getElementById("title").innerHTML = `
        <div>
            <p class="h3">
                ${day}
            </p>
        </div>
    `
    // generateStats(element)
}

$(document).ready(function() {

    createInformations()

    var latest = getLatestFile(response.data)
    generateTitleHtml(latest)
    requestData(latest.name).then(data => {
        console.log(data);
        prepareChart(data);
        generateStats(data);
    })
}, 'text');

function changeDate(element){
    requestData(element.name).then(response => {
        let temperatureArray = response
        console.log(response)
        refreshInformations(element, temperatureArray)
    })
}

async function createInformations(){
    let div = document.createElement('div');
    // div.classList.add('');
    div.setAttribute("id", "fileName")
    div.style.fontSize = "26px"
    let text = document.createTextNode("");
    div.appendChild(text);
    document.getElementById("overChart").appendChild(div)
}

async function refreshInformations(viewedFile, tempArray){

    let overChart = document.getElementById("overChart");

    for (let i = 0; i < overChart.children.length; i++) {
        
        console.log(overChart.children[i].id)
        if(overChart.children[i].id != null){
            let textDiv = overChart.children[i]
            textDiv.textContent = viewedFile.name.substring(0, 8)
        }
    }

    // let max = Object.keys(tempArray).reduce(
    //     (a,b) => tempArray[a]['temp'] > tempArray[b]['temp']?a:b
    // )

    // console.log(max)

    console.log(tempArray)
}

async function generateDayLinks(response){

    document.getElementById("links").innerHTML += "dates : <br> "

    console.log("available dates : " + response.data.length)

    let responseData = await sortDatesDescending(response.data)

    var latestDaysNumber = 10;

    var latestDays = responseData.slice(0, latestDaysNumber);
    var historicalDays = responseData.slice(latestDaysNumber, responseData.length);

    document.getElementById("links").innerHTML += generateLatestDays(latestDays)
    document.getElementById("links").innerHTML += "<br>"
    document.getElementById("links").innerHTML += generateHistoricalDays(historicalDays)
   
    await responseData.forEach(element => {
    
        document.getElementById(element.name).addEventListener("click", async function(){
            generateTitleHtml(element);
            var dayData = await requestData(element.name)
            prepareChart(dayData)
        }, true);
    
    });
}

function generateLatestDays(dataItems){

    var htmlText = '';
    var dateStyle = 'font-size: 26px;';

    dataItems.forEach((element, i) => {
        var dayName = dateFromElement(element);
    
        htmlText += `<span id="${element.name}" style="${dateStyle}">
            <div class='mx-2 my-2' style='display: inline'>
                ${dayName} 
            </div>
        </span>`;

        htmlText += ` `;
    
        if(i + 1 % 10 == 0) {
            htmlText += "<br>"
        }
    
    });

    return htmlText;
}

function generateHistoricalDays(dataItems){
    var htmlText = '';

    dataItems.forEach((element, i) => {
        var dayName = dateFromElement(element);
    
        htmlText += `<span id="${element.name}">${dayName}</span>`;
        htmlText += ` `;
    
        if(i + 1 % 10 == 0) {
            htmlText += "<br>"
        }
    
    });

    return htmlText;
}

async function requestData(fileName){

    if(typeof myChart !== "undefined"){
        myChart.destroy()
    }

    var url = repoUrl + fileName;
    
    var responseData;

    await $.get(url, function(data) { 
        responseData = data
    });

    console.log(responseData);

    return responseData
}

function prepareChart(dayData){
    var splitted = dayData.split('\n')
        .map(line => (line.charAt(line.length - 1) == "," ? line.slice(0, -1) : line ));

    var insideLogs = [];
    var outsideLogs = [];

    splitted.forEach(json => {

        const object = JSON.parse(json.replaceAll("\'", "\""));

        if(object.name == 'inside'){
            insideLogs.push(object)
        }
        if(object.name == 'outside'){
            outsideLogs.push(object)
        }
    });

    var labels = insideLogs.map(element => element.time)
    var insideData = insideLogs.map(element => element.temp)
    var outsideData = outsideLogs.map(element => element.temp)

    // console.log("labels : " + labels)
    // console.log("insideData : " + insideData)
    // console.log("data2 : " + data2)

    createChart(labels, insideData, outsideData)
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
    return sortDatesDescending(responseData)[0];
}

function sortDatesDescending(responseData){
    return responseData.sort(
        function(a, b) {
            return parseInt(b.name.substring(0, b.name.length - 4))
            - parseInt(a.name.substring(0, a.name.length - 4)) 
        }
    );
}

function dateFromElement(element){
    return element.name.substring(0, element.name.length - 4)
}

function dateWithDashesFromElement(element){
    return element.name.substring(0, 4)
        + "-"
        + element.name.substring(4, 6)
        + "-"
        + element.name.substring(6, 8)
    ;
}



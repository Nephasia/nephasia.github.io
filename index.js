import { generateStats } from './stats.js';
import { requestData } from './requestForData.js';
import { generateTitleHtml } from './title.js';
import { 
    dateFromElement, 
    dateWithDashesFromElement, 
    dateWithDashesFromDate, 
    isSunday, 
    isSaturday 
} from './dateOperations.js';
import { prepareChart } from './chartCreator.js';

// import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import { Octokit } from "https://esm.sh/octokit@2";

const octokit = new Octokit();

const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'Nephasia',
    repo: 'containerTemperature',
    path: ''
})

const repoUrl = 'https://raw.githubusercontent.com/Nephasia/containerTemperature/master/'

console.log(response)

await generateDayLinks(response);

$(document).ready(function() {

    var latestFromResponseData = getLatestFile(response.data)
    generateTitleHtml(latestFromResponseData, response.data, repoUrl)
    requestData(latestFromResponseData.name, repoUrl).then(data => {
        prepareChart(data);
        generateStats(data, true);
    })
}, 'text');

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
            generateTitleHtml(element, response.data, repoUrl);
            var dayData = await requestData(element.name, repoUrl);
            prepareChart(dayData);
            generateStats(dayData);
        }, true);
    
    });
}

function generateLatestDays(dataItems){

    var htmlText = '';
    var dateStyle = 'font-size: 25px;';

    dataItems.forEach((element, i) => {
        var dayName = dateFromElement(element);
    
        var className = '';

        if (isSunday(dayName)){
            className += 'text-danger ';
        }
        else if(isSaturday(dayName)){
            className += 'text-secondary '
        }

        htmlText += `<span id="${element.name}" style="${dateStyle}" class="${className}">
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
    
        var className = ''

        if (isSunday(dayName)){
            className += 'text-danger '
        }
        else if(isSaturday(dayName)){
            className += 'text-secondary '
        }

        htmlText += `<span id="${element.name}" class="${className}">${dayName}</span>`;
        htmlText += ` `;
    
        if(i + 1 % 10 == 0) {
            htmlText += "<br>"
        }
    
    });

    return htmlText;
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

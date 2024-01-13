import { 
    dateWithDashesFromElement
} from './dateOperations.js';
import { requestData } from './requestForData.js';
import { prepareChart } from './chartCreator.js';
import { generateStats } from './stats.js';

export function generateTitleHtml(element, responseData, repoUrl){
    console.log("selected : " + element.name)
    console.log("selected : " + JSON.stringify(element))
    var day = dateWithDashesFromElement(element)

    document.getElementById("title").innerHTML = `
        <div>
            <p class="h2">
                <a id="previousDate" style="font-size: 160%;"> &lt; </a>
                <a> ${day} </a>
                <a id="nextDate" style="font-size: 160%;"> &gt; </a>
            </p>
        </div>
    `

    // todo: both are similar, maybe a funciton for it?
    recreateNode(document.getElementById("previousDate"))
    document.getElementById("previousDate").addEventListener("click", async function(){
        const previousElement = getRelativeToElement(element, responseData, -1)
        generateTitleHtml(previousElement, responseData);
        var dayData = await requestData(previousElement.name, repoUrl);
        prepareChart(dayData);
        generateStats(dayData);
        console.log(previousElement)
    }, true);

    recreateNode(document.getElementById("nextDate"))
    document.getElementById("nextDate").addEventListener("click", async function(){
        const nextElement = getRelativeToElement(element, responseData, 1)
        generateTitleHtml(nextElement, responseData);
        var dayData = await requestData(nextElement.name, repoUrl);
        prepareChart(dayData);
        generateStats(dayData);
        console.log(nextElement)
    }, true);

    // to debug - uncomment
    // console.log("relativeElements")
    // console.log(element)
    // console.log(responseData)
    
    // getRelativeToElement(element, responseData, -1)
    // getRelativeToElement(element, responseData, 1)

}

function getRelativeToElement(element, responseData, relativePosition){
    const foundElementIndex = responseData.findIndex(x => x.name == element.name);
    console.log(foundElementIndex)

    return responseData[foundElementIndex - relativePosition] // minus because the newest has 0 index, so order is like reversed
}

// to remove event listeners:
function recreateNode(el, withChildren) {
    if (withChildren) {
      el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
  }
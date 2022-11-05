import { 
    dateWithDashesFromElement
} from './dateOperations.js';

export function generateTitleHtml(element){
    // console.log("selected : " + element.name)
    var day = dateWithDashesFromElement(element)

    document.getElementById("title").innerHTML = `
        <div>
            <p class="h2">
                ${day}
            </p>
        </div>
    `
}
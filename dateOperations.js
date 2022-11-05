export function dateFromElement(element){
    return element.name.substring(0, element.name.length - 4)
}

export function dateWithDashesFromElement(element){
    return dateWithDashesFromDate(element.name);
}

export function dateWithDashesFromDate(dateString){
    return dateString.substring(0, 4)
        + "-"
        + dateString.substring(4, 6)
        + "-"
        + dateString.substring(6, 8)
    ;
}

export function isSunday(date){
    var myDate = new Date(dateWithDashesFromDate(date))
    if(myDate.getDay() == 0) return true;
    else return false;
}

export function isSaturday(date){
    var myDate = new Date(dateWithDashesFromDate(date))
    if(myDate.getDay() == 6) return true;
    else return false;
}
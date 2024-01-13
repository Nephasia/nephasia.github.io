export async function requestData(fileName, repoUrl){

    var url = repoUrl + fileName;
    
    var responseData;

    await $.get(url, function(data) { 
        responseData = data
    });

    // console.log(responseData);

    return responseData
}
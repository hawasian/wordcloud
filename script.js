//Global Variables
var minSize = 1; //em
var maxSize = 3; //em

$(document).ready(function(){
    $('#gen').click(function() {
        wordcloud('#input','#wordcloud');
    });
});

function wordcloud(inputLoc, wcOutputLoc){
    var input = read(inputLoc);
    input = gather(input);
    console.log(input);
    //$(wcOutputLoc).html(input[0]["what"]);
}

function read(loc){
    var input = $(loc).val();
    var output = lint(input);
    return output;
}

function lint(str){
    var input = str.toLowerCase();
    var output = input.replace(/[.\/@#!?<>\[\]$%\^&\*;:{}=\-_`~()]|,\s/g, " ");
    output = output.replace(/\s\s+/g, ' ');
    return output;
}

function gather(str){
    var input = str.split(" ");
    var max = 0;
    var output =[];
    for(var i = 0; i<input.length; i++){
        if (output[input[i]] >= 1) {
            output[input[i]]++;
            if(output[input[i]] > max){
                max = output[input[i]];
            }
        }
        else {
            output[input[i]] = 1;
        }
    }
    return measure(output, max);
}

function measure(inArray, maxVal){
    var outArray = [];
    for(word in inArray){
        var row = [];
        row['word'] = word;
        row['freq'] = inArray[word];
        var size = ((inArray[word] - 1) / (maxVal - 1) * (maxSize - minSize)) + minSize;
        row['font-size'] = size.toFixed(3).toString()+"em";
        row['x'] = 0;
        row['y'] = 0;
        
        outArray.push(row)
    }
    return outArray;
}
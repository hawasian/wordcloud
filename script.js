//Global Variables
var minSize = 12; //em
var maxSize = 50; //em

$(document).ready(function() {
    $('#gen').click(function() {
        $('#wordcloud').html("");
        wordcloud('#input', '#wordcloud');
    });
});

function wordcloud(inputLoc, wcOutputLoc) {
    var input = null;
    input = read(inputLoc);
    input = gather(input);
    input = position(input, wcOutputLoc);
    write(input, wcOutputLoc);
    //$(wcOutputLoc).html(input[0]["what"]);
}

function read(loc) {
    var input = $(loc).val();
    var output = lint(input);
    return output;
}

function lint(str) { // makes a string of the same case, and removes punctuation and double spaces (except from the commas between numbers)
    var input = str.toUpperCase();
    var output = input.replace(/[.\/@#!?<>\[\]$%\^&\*;:{}=\-_`~()]|,\s/g, " ");
    output = output.replace(/\s\s+/g, ' ');
    return output;
}

function gather(str) { // converts a string to an data array for placement
    var input = str.split(" ");
    var max = 0;
    var output = [];
    for (var i = 0; i < input.length; i++) {
        if (output[input[i]] >= 1) {
            output[input[i]]++;
            if (output[input[i]] > max) {
                max = output[input[i]];
            }
        }
        else {
            output[input[i]] = 1;
        }
    }
    return measure(output, max);
}

function measure(inArray, maxVal) { //calculates the font-size, and the height, and width of words
    $('#workArea').html("").show();
    var outArray = [];
    for (word in inArray) {
        var row = [];
        row['word'] = word;
        row['freq'] = inArray[word];
        var size = ((inArray[word] - 1) / (maxVal - 1) * (maxSize - minSize)) + minSize;
        row['font-size'] = size.toFixed(3).toString() + "px";
        row['x'] = 0;
        row['y'] = 0;

        var data = "<span id='word'style='font-size:" + row['font-size'] + "'>" + word + "</span>";
        $('#workArea').html(data);
            row['width'] = $('#word').outerWidth();
            row['height'] = $('#word').outerHeight();


        outArray.push(row);
    }
    $('#workArea').html("").hide();
    return outArray;
}

function position(inArray, wcCont){
    var xOrigin = $(wcCont).width() / 2;
    var yOrigin = $(wcCont).height() / 2;
    inArray[0]["x"] = xOrigin - (inArray[0]["width"]/2);
    inArray[0]["y"] = yOrigin - (inArray[0]["height"]/2);
    for (var i = 1; i < inArray.length; i++) {
        var word = inArray[i];
        word["x"] = xOrigin - (word["width"]/2);
        word["y"] = yOrigin - (word["height"]/2);
        for(var j = 0; j < i; j++){
            var TO = 100;
            while(overlap(word, inArray[j], TO)){
                TO --; 
                word["y"] -= 1;
            }
        }
    }
    for (var i = 0; i < inArray.length; i++) {
            inArray[i]["x"] = inArray[i]["x"]+"px";
            inArray[i]["y"] = inArray[i]["y"]+"px";
        }
    
    return inArray;
}

function overlap(ind1, ind2, maxTimeout){
    var fudge = 0;
    
    var top1 = ind1["y"];
    var bot1 = ind1["y"] + ind1["height"];
    
    var top2 = ind2["y"] - fudge;
    var bot2 = ind2["y"] + ind2["height"] + fudge;
    if(maxTimeout <= 0){
        console.log(ind1["word"]+" vs"+ind2["word"]+": TIMEOUT")
        return false;
    }else if(bot1 > top2 && top1 < bot2){
        return true;
    }else{
        return false;
    }
}

function write(inArray, loc) {
    $(loc).html("");
    var markup = "";
    for (var i = 0; i < inArray.length; i++) {
        var wordObj = inArray[i];
        var line = "";
        line += "<span class='cloudWord' id='cloud_" + wordObj['word'] + "' style ='";
        line += "font-size:" + wordObj["font-size"] + "; ";
        line += "height:"+wordObj["height"]+"px;";
        line += "line-height:"+wordObj["height"]+"px;";
        line += "top:" + wordObj["y"] + "; ";
        line += "left:" + wordObj["x"] + "; ";
        line += "'>" + wordObj['word'] + "</span>";

        markup += line;
    }
    $(loc).html(markup);
}

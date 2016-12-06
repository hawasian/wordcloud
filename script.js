//Global Variables
var minSize = .5; //em
var maxSize = 3; //em

var maxH = 0;
var maxW = 0;

var xOrigin;
var yOrigin;


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
        row['font-size'] = size.toFixed(3).toString() + "em";
        row['x'] = 0;
        row['y'] = 0;

        var data = "<span id='word'style='font-size:" + row['font-size'] + "'>" + word + "</span>";
        $('#workArea').html(data);
        row['width'] = $('#word').outerWidth();
        row['height'] = $('#word').outerHeight();
        maxW += row['width'];
        maxH += row['height'];


        outArray.push(row);
    }
    $('#workArea').html("").hide();
    maxW = maxW / 3;
    maxH = maxH / 3;
    return outArray;
}

function position(inArray, wcCont) {
    xOrigin = $(wcCont).width() / 2;
    yOrigin = $(wcCont).height() / 2;
    inArray = shuffle(inArray);
    inArray[0]["x"] = xOrigin - (inArray[0]["width"] / 2);
    inArray[0]["y"] = yOrigin - (inArray[0]["height"] / 2);
    var word;
    var dir;
    for (var i = 1; i < inArray.length; i++) {
        word = inArray[i];
        word["x"] = xOrigin - (word["width"] / 2);
        word["y"] = yOrigin - (word["height"] / 2);
        dir = randDir();
        for (var j = 0; j < i; j++) {
            while (overlap(word, inArray[j])) {
                word["y"] += dir["y"];
                word["x"] += dir["x"];
            }
        }
    }
    for (var i = 0; i < inArray.length; i++) {
        inArray[i]["x"] = inArray[i]["x"] + "px";
        inArray[i]["y"] = inArray[i]["y"] + "px";
    }

    return inArray;
}

function randDir(){
    var output = [];
    var dir = Math.floor(Math.random()*360);
    dir = dir * (Math.PI / 180);
    output["x"] = Math.cos(dir);
    output["y"] = Math.sin(dir);
    return output;
}
function overlap(ind1, ind2) {
    var fudge = 1;

    var top1 = ind1["y"];
    var lft1 = ind1["x"];
    var bot1 = ind1["y"] + ind1["height"];
    var rgt1 = ind1["x"] + ind1["width"];

    var top2 = ind2["y"] - fudge;
    var lft2 = ind2["x"] - fudge;
    var bot2 = ind2["y"] + ind2["height"] + fudge;
    var rgt2 = ind2["x"] + ind2["width"] + fudge;

    if (bot1 < top2 || top1 > bot2 || rgt1 < lft2 || lft1 > rgt2) {
        return false;
    }
    else {
        return true;
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
        line += "height:" + wordObj["height"] + "px;";
        line += "line-height:" + wordObj["height"] + "px;";
        line += "top:" + wordObj["y"] + "; ";
        line += "left:" + wordObj["x"] + "; ";
        line += "'>" + wordObj['word'] + "</span> \n";

        markup += line;
    }
    $(loc).html(markup);
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

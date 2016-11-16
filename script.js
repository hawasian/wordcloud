//Global Variables
var minSize = 1; //em
var maxSize = 3; //em

$(document).ready(function() {
    $('#gen').click(function() {
        wordcloud('#input', '#wordcloud');
    });
});

function wordcloud(inputLoc, wcOutputLoc) {
    var input = read(inputLoc);
    input = gather(input);
    console.log(input);
    //$(wcOutputLoc).html(input[0]["what"]);
}

function read(loc) {
    var input = $(loc).val();
    var output = lint(input);
    return output;
}

function lint(str) { // makes a string of the same case, and removes punctuation and double spaces (except from the commas between numbers)
    var input = str.toLowerCase();
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

function measure(inArray, maxVal) { //calculates the font-size, and the height, width, and orientaion of words
    var outArray = [];
    for (word in inArray) {
        var row = [];
        row['word'] = word;
        row['freq'] = inArray[word];
        var size = ((inArray[word] - 1) / (maxVal - 1) * (maxSize - minSize)) + minSize;
        row['font-size'] = size.toFixed(3).toString() + "em";
        row['x'] = 0;
        row['y'] = 0;
        var flipper = Math.random();
        var orientaion = flipper <= .85 ? "horz" : "vert";
        var data = "<span class='"+orientaion+"' id='word'style='font-size:" + row['font-size'] + "'>" + word + "</span>";
        $('#workArea').html(data);
        
        if (flipper <= .85) {
            row['width'] = $('#word').outerWidth();
            row['height'] = $('#word').outerHeight();
            row['orientation'] = 'horz';
        }
        else {
            row['height'] = $('#word').outerWidth();
            row['width'] = $('#word').outerHeight();
            row['orientation'] = 'vert';
        }

        outArray.push(row);
    }
    $('#workArea').html("").hide();
    return outArray;
}
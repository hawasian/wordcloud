$(document).ready(function(){
    $('#gen').click(function() {
        wordcloud('#input','#wordcloud');
    });
});

function wordcloud(inputLoc, wcOutputLoc){
    var input = read(inputLoc);
    $(wcOutputLoc).html(input);
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
$(document).ready(function(){
    $('#gen').click(function() {
        wordcloud();
    });
});
function wordcloud(){
    var input = read();
    $('#wordcloud').html(input);
}
function read(){
    return $('#input').val();
}
// When the DOM is ready
$(function () {
  // Grab all <pre>'s on the page and iterate them
  var $preArr = $('pre');
  $preArr.each(function () {
    // Highlight the code block
    hljs.highlightBlock($pre);
  });

  // Get all truncate items
  var $truncateArr = $('.truncate');
  $truncateArr.each(function () {
    // Truncate each item
    var $this = $(this);
    $this.trunkata({'lines': 1});
  });
});
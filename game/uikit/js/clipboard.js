// Author: Josh Rosenbaum
// Company: InfoGears (www.infogears.com)
// Date: 2006-02-27
// Version 0.1
// URL to find newest version:
// http://www.infogears.com/cgi-bin/infogears/javascript_clipboard_for_cut_copy_paste.html
//
// This entire header must remain for use or distribution. Any modifications
// to this file should also include comments to let others know what changes 
// were made and that InfoGears nor I created the modifications.
// (If you have good changes then send them in as mentioned below!) All
// accepted changes will be available to everyone under the same terms, and
// the user will be credited.
//
// I believe this currently only works for IE and Gecko based browsers such
// as Mozilla, FireFox, and Netscape. Gecko browsers do not really allow
// cut, copy, and paste in base functionality unless you are willing to
// activate 'signed.applets.codebase_principal_support', which I wasn't willing
// to do. (Less security, are you kidding!?)
// Instead this code allows us to use the Midas editor properties to allow us
// to fake base cut/copy/paste easily using standard javascript. This means we
// can have site specific access to the clipboard. (Currently cut and paste
// aren't implemented, but it wouldn't be hard to do. I just don't have time
// right now.)
//
// In Gecko browsers you will need to activate rich text copy for the domain
// that needs access to the clipboard. See:
// http://www.infogears.com/cgi-bin/infogears/mozilla_firefox_copy_paste.html
//
// This file includes these functions:
// *) copy_text_to_clipboard -- Copies text to clipboard.
// *) copy_element_to_clipboard -- Copies an element (contents or value) to the
// clipboard.
//
// This code is not guaranteed to work on any browser or any version of IE or
// Gecko. I've tested it on IE 6, Firefox 1.5.0.1, and Opera 8.52. (Does not
// work in Opera.) However, this code SHOULD work in IE6+ and Firefox 1.0+. 
// If you have any modifications to make this code better, please contact me via
// the InfoGears contact form:
// http://www.infogears.com/cgi-bin/infogears/contact.html
// In particular I wouldn't mind hearing about enabling cut/copy/paste in other
// browsers as well as fixes for incompatibilities in some older browsers.
// Also, being able to have Gecko recognize the automatically generated iframe
// below without having to do a setTimeout would be a big plus. (So we could
// return the correct value.)

alert(navigator.userAgent);


// ******************* Parameters for copy_text_to_clipboard ********************
// text: The text to copy to the clipboard.
//
// strip_html: - If there are HTML tags in the text, and this option is set, then
// those tags will be stripped. (<br>'s and <p>'s will be converted to line
// returns.)
//
// Return value: False if copy doesn't work. True if it does. Although, Mozilla
// will return true even if copy fails because of security. This is because we
// have to use a timeout function with it. There is probably a way around this,
// but things are working for now.
// ******************************************************************************
function copy_text_to_clipboard(text, strip_html){
  if (!text){
    alert("No text provided to copy_text_to_clipboard to copy.");
    return false;
  }

  if (window.clipboardData) {   // Internet Explorer
    try{
      if (strip_html){
        // You should probably use IE's innerText here instead, and set strip_html
        // to 0. (Already done if we're called from copy_element_to_clipboard.)
        // This is a rudimentary method of accessing the text content while
        // keeping line returns from <br> and <p> elements.
        text = text.replace(/\s*<BR>\s*/gi, "\r\n").replace(/\s*<P>\s*/gi, "\r\n\r\n").replace(/<\/\w+.*?>/ig, '');
      }

      window.clipboardData.setData("Text", text);
      return true;

    }catch(e){
      alert('Your browser currently does not support copying to the clipboard.');
      return false;
    }
  }else if (navigator.userAgent.match(/ Gecko/) ) {
    if (!strip_html){
      text = text.replace(/</g, '&lt;');
    }

    var tempiframe = document.createElement("iframe");
    tempiframe.setAttribute('width', '1');
    tempiframe.setAttribute('height', '1');
    tempiframe.setAttribute('frameborder', '0');
    tempiframe.setAttribute('scrolling', 'no');

    var parent = document.body;
    var myiframe = parent.appendChild(tempiframe);

    // Mozilla needs time to recognize iframe. We'll do the
    // rest in this function after a short timeout.
    function finish_copy_text_to_clipboard(){
      myiframe.contentDocument.designMode = "on"; // Use Midas editor.
      myiframe.contentDocument.body.innerHTML = text;

      var sel = myiframe.contentWindow.getSelection();
      sel.removeAllRanges();
      myiframe.contentWindow.focus();
      var range;
      if (typeof sel != "undefined") {
        try {
          range = sel.getRangeAt(0);
        } catch(e) {
          range = myiframe.contentDocument.createRange();
        }
      } else {
        range = myiframe.contentDocument.createRange();
      }

      range.selectNodeContents(myiframe.contentDocument.body);
      sel.addRange(range);

      try{
        myiframe.contentDocument.execCommand('copy', null, null); // copy data to clipboard
      }catch(e){
        if (confirm("Cannot access Cut/Copy/Paste for security reasons. Click OK to get instructions from InfoGears to enable cut/copy/paste in your browser. (Note: A new window will popup. It may popup behind this window.)")){
          window.open("http://www.infogears.com/cgi-bin/infogears/mozilla_firefox_copy_paste");
        }
        parent.removeChild(myiframe); // the temp iframe is no longer needed
        return false;
      }

      parent.removeChild(myiframe); // the temp iframe is no longer needed

      return true;
    };

    setTimeout(finish_copy_text_to_clipboard, 100); // Mozilla needs time to recognize iframe.
    return true; // This might not be true, because the timeout function may screw up!

  }else{
    alert("Your browser currently does not support copying to the clipboard. Please upgrade to the latest version of Mozilla FireFox or Internet Explorer");
  }

  return false;
}

// ***************** Parameters for copy_element_to_clipboard *******************
// element: The element to copy to the clipboard.
//
// strip_html: - If there are HTML tags in the text, and this option is set, then
// those tags will be stripped. (<br>'s and <p>'s will be converted to line
// returns.)
// ------------------------------------------------------------------------------
// Return value: False if copy doesn't work. True if it does. Although, Mozilla
// will return true even if copy fails because of security. This is because we
// have to use a timeout function with it. There is probably a way around this,
// but things are working for now.
// ------------------------------------------------------------------------------
// This will automatically copy select box values, text box values, or the actual
// html/text contents of an element if it is neither of the first two. NOTE: The
// HTML may not be the same as the original as we use innerHTML or innerText.
// ******************************************************************************
function copy_element_to_clipboard(element, strip_html){
  if (!element){
    alert('Element not found for copy action in copy_element_to_clipboard.');
    return false;
  }

  if (typeof(element.selectedIndex) != "undefined"){
    // select box.

    if (element.multiple){
      var selected_options = new Array();
      for(var i = 0; i < element.options.length; i++){
        if ( element.options[i].selected ){
          selected_options.push(element.options[i].value);
        }
      }
      // Join on "|~~|". Perhaps use a parameter in the future.
      // Did not want to add in this early version, though.
      return copy_text_to_clipboard(selected_options.join("|~~|"), strip_html);
    }else if (element.selectedIndex < 0){
      alert ('No selection in select box.');
      return false;
    }
    // standard select of size 1.
    return copy_text_to_clipboard(element.options[element.selectedIndex].value, strip_html);
  }else if (element.value){
    // Simple text/textarea input.
    return copy_text_to_clipboard(element.value, strip_html);
  }else if(element.innerText && strip_html){
    // no need to run strip_html here. innerText handles that.
    return copy_text_to_clipboard(element.innerText, 0);

    // Mozilla's .textContent returns all whitespace, rather
    // than what the text looks like when displayed in browser.
    // So let's not use it, and use innerHTML instead.
    // Use the copy_text_to_clipboard function if you need that
    // functionality.
  }else if(element.innerHTML){
    // NOTE: The value here may not be the original HTML!
    return copy_text_to_clipboard(element.innerHTML, strip_html);
  }else{
    alert("Your browser does not support copying of elements. Please upgrade to the latest version of Mozilla FireFox or Internet Explorer");
  }

  return false;
}

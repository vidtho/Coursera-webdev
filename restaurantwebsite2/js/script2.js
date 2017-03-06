var homeHtmlUrl = "snippets/home-snippet.html";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var allCatjson = "data/categories.json";
var menuItemsjson = "data/menu_items";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";
var aboutHtml = "snippets/about-snippet.html";
var awardsHtml = "snippets/awards-snippet.html";

$(function () { 

  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });

  //==Main Page================================================================
  // Populate the main page with home snippet on page load
  function loadhome(homehtml) {
    //console.log(homehtml);
    $("#main-content").html(homehtml);
  }
  $.get(homeHtmlUrl,loadhome);

  // Populate the main page with copyright info
  var cprightYear = function (selector) {
    var today = new Date();
    var year = today.getFullYear();
    
    var msg = "<div class='text-center'> &copy; Copyright David Chu\'s China Bistro " + year + "</div>";
    return msg;
  
  };
  $("#copyright").html(cprightYear);

  //===Common Function ===============================================================
  // Return substitute of '{{propName}}' with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  //== Menu categories================================================================
   function loadcattitle(cthtml) {
    //console.log(cthtml);
    $("#main-content").html(cthtml);
  }

  function loadcat(chtml) {
    //console.log(chtml);
    var finalHtml = "<section class='row'>";
    $.getJSON(allCatjson, function (jdata) {

      for (var i = 0; i < jdata.length; i++) {
        var html = chtml;
        var name = "" + jdata[i].name;
        var short_name = jdata[i].short_name;
        html = insertProperty(html, "name", name);
        html = insertProperty(html, "short_name", short_name);
        finalHtml += html;
      }

      finalHtml += "</section>";
      //console.log(finalHtml);
    $("#main-content").append(finalHtml);      
    });
  }

  function loadcategories() {
    $.get(categoriesTitleHtml,loadcattitle);
    $.get(categoryHtml,loadcat);
  }

  //simple click does not works for dynamic events it can be used this way only
  //http://www.makeitspendit.com/fix-jquery-click-event-not-working-with-dynamically-added-elements/
  $('body').on('click', '.menucatjs', loadcategories);

 //== Menu items ================================================================
  // Appends price with '$' if price exists If not specified, replace with empty string
  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");;
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }


  // Appends portion name in parens if it exists If not specified, return original string
  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

 function loadMjson(jdata) {
    //Load menu title
    $.get(menuItemsTitleHtml, function (mthtml) {
      menuTHtml = mthtml;
      menuTHtml = insertProperty(menuTHtml, "name", jdata.category.name);
      menuTHtml = insertProperty(menuTHtml, "special_instructions", jdata.category.special_instructions);
      //console.log(menuTHtml);
      $("#main-content").html(menuTHtml);
    });

    $.get(menuItemHtml, function (mhtml) {
    //Load menu items
    var finalHtml ="<section class='row'>";
    var menulist = jdata.menu_items;
    var catShortName = jdata.category.short_name;
    for (var i = 0; i < menulist.length; i++) {
        var html = mhtml;
        html = insertProperty(html, "short_name", menulist[i].short_name);
        html = insertProperty(html, "catShortName", catShortName);
        html = insertItemPrice(html, "price_small", menulist[i].price_small);
        html = insertItemPortionName(html, "small_portion_name", menulist[i].small_portion_name);
        html = insertItemPrice(html, "price_large", menulist[i].price_large);
        html = insertItemPortionName(html, "large_portion_name", menulist[i].large_portion_name);
        html = insertProperty(html, "name", menulist[i].name);
        html = insertProperty(html, "description", menulist[i].description);

        // Add clearfix after every second menu item
        if (i % 2 != 0) {
          html +=
            "<div class='clearfix visible-lg-block visible-md-block'></div>";
        }

        finalHtml += html;
    }
    //console.log(finalHtml);
    finalHtml += "</section>";
    $("#main-content").append(finalHtml);
    });
  }


 function loadmenuitems() {
  var category = $(this).attr('category');
  var menufile = menuItemsjson + category + ".json"
  $.getJSON(menufile, loadMjson)
  }

  $('body').on('click', '.menuitemsjs', loadmenuitems);

//== Menu Specials ================================================================

function loadmenuspecial() {
  var menufile = menuItemsjson + "SP.json"
  $.getJSON(menufile, loadMjson)
  }

  $('body').on('click', '.menuspjs', loadmenuspecial);

//== Awards ================================================================

function loadawards() {
  $.get(awardsHtml,function(awdhtml){
      $("#main-content").html(awdhtml);
  });
}

 $('body').on('click', '.awardsjs', loadawards);

//== About ================================================================
function loadabout() {
  $.get(aboutHtml,function(abthtml){
      $("#main-content").html(abthtml);
  });
}

 $('body').on('click', '.aboutjs', loadabout);

});
$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });

});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl = "data/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = "data/menu_items";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";
var aboutHtml = "snippets/about-snippet.html";
var awardsHtml = "snippets/awards-snippet.html";

//============================= Common Methods ====================================//

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

//=============================Main page====================================//

var cprightYear = function (selector) {
  var today = new Date();
  var year = today.getFullYear();
  
  var msg = "<div class='text-center'> &copy; Copyright David Chu\'s China Bistro " + year + "</div>";
  insertHtml (selector, msg);
};

function chooseRandomCategory (categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

function buildAndShowHomeHTML (categories) {
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {
     var chosenCategoryShortName = chooseRandomCategory (categories).short_name;
     var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
     insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false); 
}

//~~~~~~~~~~~~EVENT THAT WILL LOAD THE HOME PAGE ~~~~~~~~~~~~~~~~~~//
// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

showLoading("#main-content");
// $ajaxUtils.sendGetRequest(homeHtml, function (responseText) {document.querySelector("#main-content").innerHTML = responseText;}, false);
$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowHomeHTML, true); 
cprightYear("#copyright");
});


//=============================About page====================================//
dc.loadAbout = function () {
  $ajaxUtils.sendGetRequest(aboutHtml, function (responseText) {
      document.querySelector("#main-content").innerHTML = responseText;
  }, false);
};

//=============================Awards page====================================//
dc.loadAwards = function () {
  $ajaxUtils.sendGetRequest(awardsHtml, function (responseText) {
    document.querySelector("#main-content").innerHTML = responseText;
  }, false);
};
//=============================Main page [mobile]====================================//
// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

//=============================Menu Categories====================================//

// Using categories data and snippets html build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories, categoriesTitleHtml,categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Builds HTML for the categories page based on the data from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

//~~~~~~~~~~~~EVENT THAT WILL LOAD THE Menu categories PAGE ~~~~~~~~~~~~~~~~~~//
// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest( allCategoriesUrl, buildAndShowCategoriesHTML);
};

//=============================Single - Menu Items====================================//
// Appends price with '$' if price exists
function insertItemPrice(html, pricePropName, priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html, portionPropName, portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


// Using category and menu items data and snippets html build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {

  menuItemsTitleHtml =  insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html = insertProperty(html, "short_name", menuItems[i].short_name);
    html = insertProperty(html, "catShortName", catShortName);
    html = insertItemPrice(html, "price_small", menuItems[i].price_small);
    html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
    html = insertItemPrice(html, "price_large", menuItems[i].price_large);
    html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
    html = insertProperty(html, "name", menuItems[i].name);
    html = insertProperty(html, "description", menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// Builds HTML for the single category page based on the data from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var menuItemsViewHtml =  buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}

//~~~~~~~~~~~~EVENT THAT WILL LOAD THE Menu items PAGE ~~~~~~~~~~~~~~~~~~//
// Load the menu items view 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  murl = menuItemsUrl + categoryShort + ".json";
  $ajaxUtils.sendGetRequest( murl, buildAndShowMenuItemsHTML);
};
//=============================End====================================//


global.$dc = dc;

})(window);

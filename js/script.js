$(function () {

  /* Collapsed menu acıkken farklı bir yere tıkladıgımızda kapanmasını saglar */
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
      }
    });

  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
    });
  });
  

  (function (global) {
    var dc = {};
    
    /* home-snippet sayfasi*/
    var homeHtml = "snippets/home-snippet.html";

    /* kategorilerin json url'i, title'i ve category-snippet sayfasi*/
    var allCategoriesUrl ="https://betulsntrk.github.io/categories/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";

    /* menu itemlarin json url'i, title'i ve menu-item-snippet sayfasi*/
    var menuItemsUrl ="https://betulsntrk.github.io/menu-items/";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    /* locationlarin json url'i, title'i ve menu-item-snippet sayfasi*/
    var locationsHtml = "snippets/locations-snippet.html";
    var locationsUrl = "https://betulsntrk.github.io/locations/locations.json";
    var locationsTitleHtml = "snippets/locations-title-snippet.html";

    /* hakkimizdanin json url'i, title'i ve about-snippet sayfasi*/
    var aboutUrl = "https://betulsntrk.github.io/about-us/about.json";
    var aboutTitleHtml = "snippets/about-title-snippet.html";
    var aboutHtml = "snippets/about-snippet.html";


    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };
  
    // Show loading icon inside element
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };
  
    /* Return substitute of '{{propName}}' with propValue in given 'string'*/
    var insertProperty = function (string, propName, propValue) {
      var propToReplace = "{{" + propName + "}}";
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    };

    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
      // On first load, show home view
      showLoading("#main-content");

      $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
          document.querySelector("#main-content").innerHTML = responseText;
        },
        false
      );
    });

/**************************************************** LOADS ****************************************************/
  /************************************ LOAD MENU CATEGORIES ************************************/
    
   /////////////////////////////// Load the menu categories view ///////////////////////////////
    dc.loadMenuCategories = function () {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    };

   /////////// Builds HTML for the categories page based on the data from the server ///////////
    function buildAndShowCategoriesHTML(categories) {

      // Load title snippet of categories page
      $ajaxUtils.sendGetRequest(
        categoriesTitleHtml,
        function (categoriesTitleHtml) {

          // Retrieve single category snippet
          $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
              var categoriesViewHtml = buildCategoriesViewHtml(
                categories,
                categoriesTitleHtml,
                categoryHtml
              );
              insertHtml("#main-content", categoriesViewHtml);
            },
            false
          );
        },
        false
      );
    }
  
   ///// Using categories data and snippets html build categories view HTML to be inserted into page /////
    function buildCategoriesViewHtml(
      categories,
      categoriesTitleHtml,
      categoryHtml
    ) {
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
  /********************************** LOAD MENU CATEGORIES END **********************************/

  /*********************************** LOAD MENU ITEMS PAGE *************************************/
  
   ////// Load the menu items view categoryShort' is a short_name for a category //////
    dc.loadMenuItems = function (short_name) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        menuItemsUrl + short_name + ".json",
        buildAndShowMenuItemsHTML
      );
    };

   ////// Builds HTML for the single category page based on the data from the server //////
    function buildAndShowMenuItemsHTML(categoryMenuItems) {
      // Load title snippet of menu items page
      $ajaxUtils.sendGetRequest(
        menuItemsTitleHtml,
        function (menuItemsTitleHtml) {
          // Retrieve single menu item snippet
          $ajaxUtils.sendGetRequest(
            menuItemHtml,
            function (menuItemHtml) {

              var menuItemsViewHtml = buildMenuItemsViewHtml(
                categoryMenuItems,
                menuItemsTitleHtml,
                menuItemHtml
              );
              insertHtml("#main-content", menuItemsViewHtml);
            },
            false
          );
        },
        false
      );
    }

   /// Using category and menu items data and snippets html build menu items view HTML to be inserted into page ///
    function buildMenuItemsViewHtml(
      categoryMenuItems,
      menuItemsTitleHtml,
      menuItemHtml
    ) {
      menuItemsTitleHtml = insertProperty(
        menuItemsTitleHtml,
        "name",
        categoryMenuItems.category.name
      );
      menuItemsTitleHtml = insertProperty(
        menuItemsTitleHtml,
        "special_instructions",
        categoryMenuItems.category.special_instructions
      );

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
        html = insertItemPortionName(
          html,
          "small_portion_name",
          menuItems[i].small_portion_name
        );
        html = insertItemPrice(html, "price_large", menuItems[i].price_large);
        html = insertItemPortionName(
          html,
          "large_portion_name",
          menuItems[i].large_portion_name
        );
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

    // Appends price with '₺' if price exists
    function insertItemPrice(html, pricePropName, priceValue) {
      // If not specified, replace with empty string
      if (!priceValue) {
        return insertProperty(html, pricePropName, "");
      }

      priceValue = priceValue.toFixed(2) + "₺";
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
    };

  /********************************* LOAD MENU ITEMS PAGE END ***********************************/
  
  /************************************* LOAD ABOUT US PAGE *************************************/

   ////////////////////////////////// Load the about us view //////////////////////////////////
    dc.loadAbout = function () {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(aboutUrl, buildAndShowAboutHTML);
    }

   /////////// Builds HTML for the about us page based on the data from the server ///////////
    function buildAndShowAboutHTML(abouts) {
      // Load title snippet of about us page
      $ajaxUtils.sendGetRequest(
        aboutTitleHtml,
        function (aboutTitleHtml) {
          // Retrieve about snippet
          $ajaxUtils.sendGetRequest(
            aboutHtml,
            function (aboutHtml) {
              var aboutViewHtml = buildAboutViewHtml(
                abouts,
                aboutTitleHtml,
                aboutHtml
              );
              insertHtml("#main-content", aboutViewHtml);
            },
            false
          );
        },
        false
      );
    }

   ///// Using about us data and snippets html build about us view HTML to be inserted into page /////
    function buildAboutViewHtml(
      abouts,
      aboutTitleHtml,
      aboutHtml
    ) {
      var finalHtml = aboutTitleHtml;
      finalHtml += "<div id='demo' class='carousel slide' data-ride='carousel'><ol class='carousel-indicators'><li data-target='#demo' data-slide-to='0' class='active'></li><li data-target='#demo' data-slide-to='1'></li><li data-target='#demo' data-slide-to='2'></li><li data-target='#demo' data-slide-to='3'></li><li data-target='#demo' data-slide-to='4'></li><li data-target='#demo' data-slide-to='5'></li></ol><div class='carousel-inner'>";
      
      // Loop over abouts
      for (var i = 0; i < abouts.length; i++) {
        // Insert about values
        if (i==0) {
          finalHtml += "<div class='item active'>";
        }else{
          finalHtml += "<div class='item'>";
        }
        
        var html = aboutHtml;
        var id = "" + abouts[i].id;
        var short_name = abouts[i].short_name;
        html = insertProperty(html, "id", id); 
        html = insertProperty(html, "short_name", short_name);
        finalHtml += html;
        finalHtml += "</div>"
      }
  
      finalHtml += "<a class='left carousel-control' href='#demo' role='button' data-slide='prev'><span class='icon-prev' aria-hidden='true'></span></a><a class='right carousel-control' href='#demo' role='button' data-slide='next'><span class='icon-next' aria-hidden='true'></span></a></div>";
      return finalHtml;
    }
  /*********************************** LOAD ABOUT US PAGE END ***********************************/  

  /************************************ LOAD LOCATIONS PAGE *************************************/
    
   ////////////////////////////////// Load the locations view //////////////////////////////////
    dc.loadLocations = function () {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(locationsUrl, buildAndShowLocationsHTML);
    }

   /////////// Builds HTML for the locations page based on the data from the server ///////////
    function buildAndShowLocationsHTML(locations) {
      // Load title snippet of locations page
      $ajaxUtils.sendGetRequest(
        locationsTitleHtml,
        function (locationsTitleHtml) {
          // Retrieve locations snippet
          $ajaxUtils.sendGetRequest(
            locationsHtml,
            function (locationsHtml) {

              var locationsViewHtml = buildLocationsViewHtml(
                locations,
                locationsTitleHtml,
                locationsHtml
              );
              insertHtml("#main-content", locationsViewHtml);
            },
            false
          );
        },
        false
      );
    }

   ///// Using locaitons data and snippets html build locations view HTML to be inserted into page /////
    function buildLocationsViewHtml(
      locations,
      locationsTitleHtml,
      locationsHtml
    ) {
      var finalHtml = locationsTitleHtml;
      finalHtml += "<section class='row'>";
  
      // Loop over locations
      for (var i = 0; i < locations.length; i++) {
        // Insert location values
        var html = locationsHtml;
        var name = "" + locations[i].name;
        var short_name = locations[i].short_name;
        var address = locations[i].address;
        html = insertProperty(html, "name", name); 
        html = insertProperty(html, "short_name", short_name);
        html = insertProperty(html, "address", address);
        finalHtml += html;
      }
  
      finalHtml += "</section>";
      return finalHtml;
    }
  /********************************** LOAD LOCATIONS PAGE END ***********************************/
    
/************************************************** LOADS END **************************************************/
    
  global.$dc = dc;
})(window);
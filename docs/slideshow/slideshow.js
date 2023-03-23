let global_ss_data = [];
/*
  global_ss_data structure: 

  global_ss_data = [
    {
      description = "text", # From JSON
      header_image = "url", # From JSON
      title = "text",       # From JSON
      current_index: n      # Calculated
    }
    ...
  ];
*/

function initSlideShow(jsonPath, containerId, width, height) {
    let slideShowIndex = global_ss_data.length;
    global_ss_data[slideShowIndex] = "undefined";
    fetch(jsonPath)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Unable to load slideshow json from " + jsonPath);
        })
        .then(data => {
            global_ss_data[slideShowIndex] = data.content;
            global_ss_data[slideShowIndex].current_index = 0;
            renderUI(containerId, slideShowIndex, width, height);
            preloadImages(data.content, slideShowIndex);
            slideTo(0, slideShowIndex);
        })
        .catch((error) => {
            renderError(containerId, error);
        });
}

function preloadImages(slideShowData, slideShowIndex) {
    var cache = document.getElementById("ss_cache_" + slideShowIndex);
    for (var i = 0; i < slideShowData.length; i++) {
        var img = new Image();
        img.src = slideShowData[i].header_image;
        img.style = "position:absolute";
        cache.appendChild(img);
    }
}

function renderError(containerId, error) {
    var container = document.getElementById(containerId);
    container.innerHTML = error;
}

function renderUI(containerId, slideShowIndex, width, height) {
    var container = document.getElementById(containerId);
    container.innerHTML =
        '<div class="card" style="width:' + width + ';">' +
        '  <div class="header" style="height:' + height + ';" id="ss_header_' + slideShowIndex + '">' +
        '    <div class="nav_button prev_button" onclick="javascript:slidePrev(' + slideShowIndex + ')">' +
        '      <p class="nav_button_label">&lt;&lt;</p>' +
        '    </div>' +
        '    <div class="nav_button next_button" onclick="javascript:slideNext(' + slideShowIndex + ')">' +
        '      <p class="nav_button_label">&gt;&gt;</p>' +
        '    </div>' +
        '  </div>' +
        '  <div class="title" id="ss_title_' + slideShowIndex + '"></div>' +
        '  <div class="description" id="ss_description_' + slideShowIndex + '"></div>' +
        '</div>' +
        '<div id="ss_cache_' + slideShowIndex + '" style="position:absolute;z-index:-1000;opacity:0;"></div>';
}

function slideNext(slideShowIndex) {
    let currentIndex = global_ss_data[slideShowIndex].current_index;
    slideTo(currentIndex + 1, slideShowIndex);
}

function slidePrev(slideShowIndex) {
    let currentIndex = global_ss_data[slideShowIndex].current_index;
    slideTo(currentIndex - 1, slideShowIndex);
}

function slideTo(proposedIndex, slideShowIndex) {
    // Get and validate new index from proposed index;
    let newIndex = proposedIndex;
    if (newIndex >= global_ss_data[slideShowIndex].length) { newIndex = 0; }
    if (newIndex < 0) { newIndex = global_ss_data[slideShowIndex].length - 1; }

    // Cache new index in global data
    global_ss_data[slideShowIndex].current_index = newIndex;

    // Update slide with content data from new index
    let content = global_ss_data[slideShowIndex][newIndex];
    document.getElementById('ss_header_' + slideShowIndex).style.backgroundImage = "url('" + content.header_image + "')";
    document.getElementById('ss_title_' + slideShowIndex).innerHTML = content.title;
    document.getElementById('ss_description_' + slideShowIndex).innerHTML = content.description;
}

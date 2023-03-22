let global_data = [];
/*
  global_data = [
    {
      description = "text", # From JSON
      header_image = "url", # From JSON
      title = "text",       # From JSON
      current_index: n      # Calculated
    }
    ...
  ]  
*/

function initSlideShow(jsonPath, containerId) {
    let currentId = global_data.length;
    global_data[currentId] = "Loading...";
    renderUI(containerId, currentId);
    fetch(jsonPath)
        .then(response => {
            return response.json();
        })
        .then(data => {
            global_data[currentId] = data.content;
            global_data[currentId].current_index = 0;
            slideTo(0, currentId);
        });
}

function renderUI(containerId, slideShowId) {
    var container = document.getElementById(containerId);
    container.innerHTML =
        '<div class="card">' +
        '  <div class="header">' +
        '    <img class="header_image" id="ss_header_image_' + slideShowId + '"></img>' +
        '    <div class="nav_button prev_button" onclick="javascript:slidePrev(' + slideShowId + ')">' +
        '      <p class="nav_button_label">&lt;&lt;</p>' +
        '    </div>' +
        '    <div class="nav_button next_button" onclick="javascript:slideNext(' + slideShowId + ')">' +
        '      <p class="nav_button_label">&gt;&gt;</p>' +
        '    </div>' +
        '  </div>' +
        '  <div class="title" id="ss_title_' + slideShowId + '"></div>' +
        '  <div class="description" id="ss_description_' + slideShowId + '"></div>' +
        '</div>';
}

function slideNext(slideShowId) {
    let curIndex = global_data[slideShowId].current_index;
    slideTo(curIndex + 1, slideShowId);
}

function slidePrev(slideShowId) {
    let curIndex = global_data[slideShowId].current_index;
    slideTo(curIndex - 1, slideShowId);
}

function slideTo(newIndex, slideShowId) {
    let curIndex = newIndex;
    if (curIndex >= global_data[slideShowId].length) { curIndex = 0; }
    if (curIndex < 0) { curIndex = global_data[slideShowId].length - 1; }
    global_data[slideShowId].current_index = curIndex;

    let content = global_data[slideShowId][curIndex];
    console.log(global_data);
    document.getElementById('ss_header_image_' + slideShowId).src = content.header_image;
    document.getElementById('ss_title_' + slideShowId).innerHTML = content.title;
    document.getElementById('ss_description_' + slideShowId).innerHTML = content.description;
}

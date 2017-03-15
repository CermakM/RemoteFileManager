/**
 * Created by MCermak on 28.02.2017.
 */
var test_files = [
    {name: "sample_file_ultra_long_name_hipityhuplah.html", type: "Chrome HTML Document (.html)", size: "240KB" },
    {name: "otherfile0.html", type: "Chrome HTML Document (.html)", size: "6KB" },
    {name: "otherfile1.java", type: "text/x-java-source (.java)", size: "14KB" },
    {name: "otherfile2.html", type: "Chrome HTML Document (.html)", size: "140KB" },
    {name: "otherfile3.html", type: "Chrome HTML Document (.html)", size: "140KB" },
    {name: "otherfile4.sql",  type: "Microsoft SQL Server Query File (.sql)", size: "940KB" },
    {name: "otherfile5.html", type: "Chrome HTML Document (.html)", size: "340KB" },
    {name: "otherfile6.html", type: "Chrome HTML Document (.html)", size: "340KB" }
];
var active_elements = [];
var active_files = [];

window.onload = function() {

    loadFiles();
    createFManMenu();
    invokeFileProperties();

    $("*").on("click", function (e) {
        e.stopPropagation();
        var target = $(event.target);
        var deselect = !target.hasClass("deselect_off");
        var parents = target.parents();
        if(deselect) {
            for (var i = 0; i < parents.length; i++){
                if (parents.eq(i).hasClass("deselect_off")) {
                    deselect = false;
                    break;
                }
            }
        }
        if (deselect) {
            deselectAll();
        }
    });

}; // end of onload

$(window).resize(checkFManMenuPosition)
         .resize(compensateWidth);

function select(event) {
    event.stopPropagation();
    if (!event.ctrlKey && active_elements.length > 0) {
        deselectAll(event);
    }
    this.className += " active";
    var active_file = test_files.find(function(file) {
        return file.name == this.querySelector(".icon_title").value;
    }, this);
    active_files.push(active_file);
    active_elements.push(this);
    invokeFileMenu();
    invokeFileProperties();
}

function invokeFileMenu() {
    if (!active_elements.length){
        $("#f_manager_file_menu_left").addClass("disable");
    }
    else {
        $("#f_manager_file_menu_left").removeClass("disable");
    }
}

function invokeFileProperties() {
    var f_no_spec = $(".f_no_spec");
    var f_spec = $(".f_spec");
    var f_properties = $("#f_properties");
    if (!active_files.length) {
        f_no_spec.removeClass("inactive");
        f_spec.addClass("inactive");
        f_properties.css({"justify-content":"center"});
        return;
    }
    f_no_spec.addClass("inactive");
    f_spec.removeClass("inactive");
    f_properties.css({"justify-content":"flex-start"});
    $("#file_name").text(active_files[0].name);
    $("#file_type").text(active_files[0].type);
    $("#file_size").text(active_files[0].size);
}

function deselectAll() {

    while(active_elements.length) {
        active_elements[0].className = active_elements[0].className.replace(" active", "");
        active_files.shift();
        active_elements.shift();
    }
    invokeFileMenu();
    invokeFileProperties();
}

function createFManMenu() {
    var template = document.getElementById("f_manager_menu_template");
    var menu = template.content.querySelector("#f_manager_menu").cloneNode(true);
    if( $(window).width() > 768) {
        menu.className = "desktop";
        $("#f_manager_left_container").prepend(menu);
    }
    else {
        menu.className = "mobile";
        $("#f_manager_menu_icon").append(menu);
    }
}

function invokeFManMenu() {
    var menu = $("#f_manager_menu");
    if (menu.hasClass("desktop")) {
        menu.toggle(400);
        return;
    }
    menu.slideToggle(400);
}

function checkFManMenuPosition() {
    var menu = $("#f_manager_menu");
    if( $(window).width() > 768) {
        var f_manager = $("#f_manager_left_container");
        if( f_manager.find(menu).length) {
            return;
        }
        menu.removeClass().addClass("desktop");
        f_manager.prepend(menu);
    }
    else {
        var f_manager_menu_icon = $("#f_manager_menu_icon");
        if (f_manager_menu_icon.find(menu).length) {
            return;
        }
        menu.removeClass().addClass("mobile");
        f_manager_menu_icon.append(menu);
    }
}

function loadFiles() {
    var file_template = document.querySelector("#file_template");
    var sample_file = file_template.content.querySelector(".file");
    for (var i = 0; i < test_files.length; i++) {
        var file = test_files[i];
        var new_element = sample_file.cloneNode(true);
        new_element.setAttribute("data-type", file.type);
        new_element.querySelector(".icon_title").value = file.name;
        new_element.addEventListener("click", select, true);
        file_template.parentNode.appendChild(new_element);
    }

    compensateWidth();
}


function compensateWidth()
{
    if ($(window).width() < 450) {
        var file_template = document.querySelector("#file_template");
        var sample_file = file_template.content.querySelector(".file");
        var files_per_row = Math.floor(($(window).width() - 10) / ($(".file:first").outerWidth() + 10));
        // Get least common multiple
        var multiple = 0;
        while (multiple < test_files.length) {
            multiple += files_per_row;
        }
        var modulo = multiple % test_files.length;
        if (modulo && $(".abstract").length != modulo) {
            for (var j = 0; j < modulo; j++) {
                var clone = sample_file.cloneNode(true);
                clone.className += " abstract";
                clone.style.visibility = "hidden";
                file_template.parentNode.appendChild(clone);
            }
        }
    }
}

function rename() {

}


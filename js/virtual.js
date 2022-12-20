

function add_page_bookmark(
    is_authenticated = false,
    event_id = 0,
    bookmark_event_number = 1,
    is_bookmarked = false,
    element_id_to_mark = '#bookmark-here',
    bookmark_element_id = 'the-bookmark'
) {
    if (!is_authenticated) {
        return;
    }
    $(document).ready(function () {
        const el = $(element_id_to_mark);
        const right_margin = el.css('marginRight');
        const title = 'title="Add/Remove Bookmark to my calendar for this event"';
        const id = `id=\"${bookmark_element_id}\"`;
        var bookmark_html;
        if (is_bookmarked) {
            bookmark_html =
                `<span class=\"bookmark-right\"><span class=\"fa fa-bookmark fa-lg\" ${title} ${id}></span></span>`;
        } else {
            bookmark_html =
                `<span class=\"bookmark-right\"><span class=\"far fa-bookmark fa-lg\" ${title} ${id}></span></span>`;
        }
        el.before(bookmark_html);
        const bookmark_element = $(`#${bookmark_element_id}`);
        bookmark_element.css({
            'marginRight': right_margin,
        });
        add_bookmark_click(event_id, bookmark_event_number, bookmark_element_id);
        console.log(`Added bookmark icon before ${element_id_to_mark} ${el} with right margin ${right_margin}`);
    });
}

function add_cell_bookmark(
    is_authenticated = false,
    event_id = 0,
    bookmark_event_number = 1,
    is_bookmarked = false,
    bookmark_element_id = 'the-bookmark'
) {
    if (!is_authenticated) {
        return;
    }
    $(document).ready(function () {
        const bookmark_element = $(`#${bookmark_element_id}`);
        if (is_bookmarked) {
            bookmark_element.addClass("fa");
        } else {
            bookmark_element.addClass("far");
        }
        bookmark_element.addClass("fa-bookmark fa-lg bookmark-cell");
        bookmark_element.attr('title', "Add/Remove Bookmark to my calendar for this event");
        add_bookmark_click(event_id, bookmark_event_number, bookmark_element_id);
    });
}

function add_bookmark_click(
    event_id = 0,
    bookmark_event_number = 1,
    bookmark_element_id = 'the-bookmark',
    add_bookmark_title = 'Add bookmark for this event',
    rm_bookmark_title = 'Remove bookmark for this event',
    alt_bookmark_element_id = null
) {
    $(document).ready(function () {
        const click_element = $(`#${bookmark_element_id}`);
        let bookmark_element;
        if (alt_bookmark_element_id) {
            bookmark_element = $(`#${alt_bookmark_element_id}`);
        } else {
            bookmark_element = click_element;
        }
        click_element.click(function (ev) {
            console.log(`Bookmark clicked! ${ev} ${event_id}`);
            const csrf_token = Cookies.get('csrftoken');
            $.ajaxSetup({
                headers:
                    {'X-CSRFTOKEN': csrf_token}
            });
            if (bookmark_element.hasClass("fa")) {
                bookmark_element.toggleClass("fa far");
                bookmark_element.title = add_bookmark_title;
                $.ajax({
                    type: "DELETE",
                    url: `/api/miniconf/bookmarks/lookup_and_delete?event=${event_id}&number=${bookmark_event_number}`,
                    processData: false,
                    contentType: 'application/json',
                    data: null,
                    success: function (req) {
                        console.log("Successfully removed bookmark");
                    },
                    error: function (req, err) {
                        alert("Error removing bookmark, please refresh page");
                        console.log("Error processing bookmark DELETE " + err);
                    }
                });
            } else {
                bookmark_element.toggleClass("fa far");
                bookmark_element.title = rm_bookmark_title;
                $.ajax({
                    type: "POST",
                    url: "/api/miniconf/bookmarks",
                    processData: false,
                    contentType: 'application/json',
                    data: JSON.stringify({event: event_id, number: bookmark_event_number}),
                    success: function (req) {
                        console.log("Successfully added bookmark");
                    },
                    error: function (req, err) {
                        alert("Error adding bookmark, please refresh page");
                        console.log("Error processing bookmark POST " + err);
                    }
                });
            }
        });
        console.log(`Added click for bookmark ${bookmark_element_id}`);
    });
}



var touchup = function(){
    /*Get all events with the class of touch-up-date and add the correct date using the user's timezone'*/
    var cards = $(".touchup-date");
    var eventids = [];
    for (const card of cards) {
        eventid = parseInt(card.id.split("event-")[1])
        if (!(isNaN(eventid))) {
            eventids.push(eventid);
        }
    }

    /*Send these eventids to get timing information.*/

    var call = $.ajax({
        url:"/virtual/touchup",
        type:"POST",
        data:{
            action:"touchup-dates",
            csrfmiddlewaretoken: csrftoken,
            eventids: eventids,
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(errorThrown);
        },
        success: function(data, textStatus, xqXHR){
            for (let k in data) {
                let datediv = $("#touchup-date-event-" + k);
                console.log(datediv);
                datediv.html(data[k])
            }
        },

    })
}



"use strict";

var csrf = void 0;
var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });
    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { htmlFor: "level" },
            "Level: "
        ),
        React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "Domo Level" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        var clickHandler = function clickHandler(e, name) {
            e.preventDefault();

            $("#domoMessage").animate({ width: 'hide' }, 350);

            if ($("#comment").val() == '') {
                handleError("RAWR! All fields are required");
                return false;
            }

            sendAjax('POST', $("#domoComment" + domo.name).attr("action"), $("#domoComment" + domo.name).serialize(), function () {
                loadDomosFromServer();
            });
        };
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age
            ),
            React.createElement(
                "h3",
                { className: "domoLevel" },
                "Level: ",
                domo.level
            ),
            React.createElement(
                "div",
                { className: "domoCommentsContainer" },
                React.createElement(
                    "h3",
                    { className: "domoComments" },
                    "Comments:"
                ),
                React.createElement(
                    "p",
                    null,
                    domo.comments.map(function (e) {
                        return e + ",";
                    })
                )
            ),
            React.createElement(
                "form",
                { className: "commentForm", id: "domoComment" + domo.name,
                    onSubmit: function onSubmit(e) {
                        return clickHandler(e, domo.name);
                    },
                    name: "domoComment" + domo.name,
                    action: "/maker2",
                    method: "POST"
                },
                React.createElement(
                    "label",
                    { htmlFor: "comment" + domo.name },
                    "Comment: "
                ),
                React.createElement("input", { id: "comment" + domo.name, type: "text", name: "comment", placeholder: "Domo Comment" }),
                React.createElement("input", { type: "hidden", name: "name", value: domo.name }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Comment" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {

    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { csrf: csrf, domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { csrf: csrf, domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var getToken = function getToken(callback) {
    sendAjax('GET', '/getToken', null, callback);
};

$(document).ready(function () {
    getToken(function (result) {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

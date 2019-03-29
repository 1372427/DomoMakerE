let csrf;
const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit = {handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = function(props){
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo){
        let clickHandler = (e, name) => {
            e.preventDefault();

            $("#domoMessage").animate({width: 'hide'}, 350);
        
            if($("#comment").val() == ''){
                handleError("RAWR! All fields are required");
                return false;
            }
        
            sendAjax('POST', $(`#domoComment${domo.name}`).attr("action"), $(`#domoComment${domo.name}`).serialize(), function() {
                loadDomosFromServer();
            });
        }
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
                <div className="domoCommentsContainer">
                    <h3 className="domoComments">Comments:</h3>
                    <p>{domo.comments.map(e=>`${e}, `)}</p>
                </div>
                <form className="commentForm" id={`domoComment${domo.name}`}
                    onSubmit = {(e) => clickHandler(e, domo.name)}
                    name={`domoComment${domo.name}`}
                    action="/maker2"
                    method="POST"
                >
                    <label htmlFor={`comment${domo.name}`}>Comment: </label>
                    <input id={`comment${domo.name}`} type="text" name="comment" placeholder="Domo Comment"/>
                    <input type="hidden" name="name" value={domo.name}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="makeDomoSubmit" type="submit" value="Comment"/>
                </form>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {

    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList csrf={csrf} domos={data.domos} />, document.querySelector("#domos")
        );
        
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList csrf={csrf} domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = (callback) => {
    sendAjax('GET', '/getToken', null,callback);
};

$(document).ready(function(){
    getToken( (result) => {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
});
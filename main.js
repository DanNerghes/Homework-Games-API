const url = "https://games-world.herokuapp.com/games/";
const allGanes = document.getElementById('game-collection');
const selectedGame = document.getElementById('selected-game');
const preloader = document.getElementById('preloader');
const postLink = document.getElementById("postLink");
const postButton = document.getElementById("postButton");
const postForm = document.getElementById("postForm");
const titleToPost = document.getElementById("title");
const genreToPost = document.getElementById("genre");
const publisherToPost = document.getElementById("publisher");
const imageUrlToPost = document.getElementById("imageUrl");
const descriptionToPost = document.getElementById("description");

getAllGames();

postLink.addEventListener("click", showTheForm);
postButton.addEventListener("click", postAnItem);

function showTheForm(event){
    event.preventDefault();
    allGanes.classList.add("hide");
    selectedGame.classList.add("hide");
    postForm.classList.remove("hide");
}

function getAllGames() {
    preloader.classList.remove("hide");
    allGanes.classList.add("hide");
    postForm.classList.add("hide");
    selectedGame.innerHTML = "";

    fetch(url)
    .then(request => request.json())
    .then(data => buildThePreview(data))
}

function buildThePreview(data) {
    data.forEach((element, index ) => {
        const gameContainer = document.createElement("article");
        gameContainer.setAttribute("id", element._id);
        gameContainer.classList.add("game-container");

        const aboutContainer = document.createElement("div");
        aboutContainer.classList.add("about-container");

        const articleTitle = document.createElement("h3");
        articleTitle.innerHTML = element.title;
        articleTitle.classList.add("article-title");
        aboutContainer.append(articleTitle);
        
        const articleDescription = document.createElement("p");
        articleDescription.innerText = element.description;
        articleDescription.classList.add("article-description");
        aboutContainer.append(articleDescription);

        const articleImage = document.createElement("img");
        articleImage.setAttribute("src", element.imageUrl);
        articleImage.classList.add("article-image");
        gameContainer.append(articleImage);

        const articleSeeMore = document.createElement("p");
        articleSeeMore.innerText = "See More >>>";
        articleSeeMore.classList.add("article-see-more");
        aboutContainer.append(articleSeeMore);

        gameContainer.append(aboutContainer);

        allGanes.append(gameContainer);

        gameContainer.addEventListener("click", function(){
            getGameDetails(data, index);
        });

        allGanes.classList.remove("hide");
        preloader.classList.add("hide");
    });
}

function getGameDetails(arrData, i) {
    allGanes.innerHTML = "";
    selectedGame.classList.add("hide");
    preloader.classList.remove("hide");

    fetch(url + arrData[i]._id)
    .then(response => response.json())
    .then(data => drawChosenOption(data))
}

function drawChosenOption(selected) {
    const chosenGame = document.createElement("div");

    const chosenGameTitle = document.createElement('h1');
    chosenGameTitle.innerText= selected.title;
    chosenGame.append(chosenGameTitle);

    const chosenGameReleaseDate = document.createElement('p');
    let date = new Date((selected.releaseDate)*1000);
    chosenGameReleaseDate.innerHTML =`<b>Release date: </b> <small>${date}</small>`;
    chosenGame.append(chosenGameReleaseDate);

    const chosenGameGenre = document.createElement('p');
    chosenGameGenre.innerHTML =`<b>Genre: </b> ${selected.genre}`;
    chosenGame.append(chosenGameGenre);
    
    const chosenGamePublisher = document.createElement('p');
    chosenGamePublisher.innerHTML =`<b>Publisher: </b> ${selected.publisher}`;
    chosenGame.append(chosenGamePublisher);
    
    const chosenGamePicture = document.createElement('img');
    chosenGamePicture.setAttribute('src', selected.imageUrl);
    chosenGame.append(chosenGamePicture);
    
    const chosenGameDescription = document.createElement('p');
    chosenGameDescription.classList.add("game-description");
    chosenGameDescription.innerText = selected.description;
    chosenGame.append(chosenGameDescription);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("data-remove", selected._id);
    chosenGame.append(deleteButton);
    deleteButton.addEventListener("click", removeItem);
    
    const updateLink = document.createElement("button");
    updateLink.innerText = "Edit";
    chosenGame.append(updateLink);
    updateLink.addEventListener("click", function() {
        updateItem(selected, updateLink, deleteButton)
    });

    selectedGame.append(chosenGame);

    selectedGame.classList.remove("hide");
    preloader.classList.add("hide");
}

function updateItem(selected, updateLink, deleteButton) {
    const postTitle = document.getElementById("postTitle");
    const updateButton = document.createElement("button");

    titleToPost.placeholder = selected.title;
    genreToPost.placeholder = selected.genre;
    publisherToPost.placeholder = selected.publisher;
    imageUrlToPost.placeholder = selected.imageUrl;
    descriptionToPost.placeholder = selected.description;
    postTitle.classList.add("hide");
    showTheForm(event);
    updateLink.classList.add("hide");   
    deleteButton.classList.add("hide");
    postLink.classList.add("hide");
    postButton.classList.add("hide");
    updateButton.innerText = "Update";
    updateButton.setAttribute("data-update", selected._id);

    postForm.append(updateButton);
    updateButton.addEventListener("click", putUpdate);
}

function removeItem(event) {
    let removableId = event.target.dataset.remove; 

    fetch(url+removableId,{method:'DELETE'})
    .then(response => response.json())
    .then(res => console.log(res))
    setTimeout(() => location.reload(),1000);
}

function postAnItem(event) {
    event.preventDefault();

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title : titleToPost.value,
            releaseDate : parseInt(Date.now()/1000),
            genre : genreToPost.value,
            publisher : publisherToPost.value,
            imageUrl : imageUrlToPost.value,
            description : descriptionToPost.value
        })
    })
    .then(response => response.json())
    .then(resp => console.log(resp))
}

function putUpdate(event) {
    event.preventDefault();
    let updateId = event.target.dataset.update; 

    fetch(url + updateId, {
        method: 'PUT',
        body: JSON.stringify({
            title : titleToPost.value,
            genre : genreToPost.value,
            publisher : publisherToPost.value,
            imageUrl : imageUrlToPost.value,
            description : descriptionToPost.value
        })
    })
    .then(response => response.json())
    .then(resp => console.log(resp))
}


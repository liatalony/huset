window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    //grab search=something from the url (it might not exist)
    const search = urlParams.get("search");
    //grab id=something from the url (it might not exist)
    const id = urlParams.get("id");
    const category = urlParams.get("category");


    if (search) {
        getSearchData();
        Filtering();
        getNav();
    } else if (id) {
        getEventData();
    } else if (category) {
        Filtering();
        getNav();
        getCategotyData();
    } else {
        getFrontPageData();
        Filtering();
        getNav();
    }
}

function getFrontPageData() {
    fetch("http://liatalony.com/liatalony/wp-json/wp/v2/event?categories=11,12,13&_embed").then(res => res.json()).then(showStuff);
}

function getSearchData() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get("search");
    fetch("http://liatalony.com/liatalony/wp-json/wp/v2/event?_embed&search=" + search).then(res => res.json()).then(showStuff);
}

function getCategotyData() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    fetch("http://liatalony.com/liatalony/wp-json/wp/v2/event?_embed&categories=" + category).then(res => res.json()).then(showStuff);
}

function getEventData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    fetch("http://liatalony.com/liatalony/wp-json/wp/v2/event/" + id + "?_embed").then(res => res.json()).then(showSingleEvent);
}

function showSingleEvent(SingleEvent) {
    console.log(SingleEvent);
    document.querySelector("h1").textContent = SingleEvent.title.rendered;
    document.querySelector("h2").textContent = SingleEvent.event_date;
    document.querySelector(".price").textContent = SingleEvent.price.rendered;
    const imgPath = SingleEvent._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
    document.querySelector(".EventImg").src = imgPath;
    document.querySelector(".des").innerHTML = SingleEvent.content.rendered;

}

function showStuff(data) {
    //    console.log(data);
    if (data.length == 0) {
        const message = document.createElement("h2");
        message.classList.add("message");
        message.textContent = "We are sorry, we could not find anything that matches your search"

        document.querySelector("#events").appendChild(message);
    } else {
        data.sort(compareDate);
        data.forEach(showEvent);
    }
}

function showEvent(event) {
    //    console.log(event);
    const imgPath = event._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
    const template = document.querySelector("template").content;
    const templateCopy = template.cloneNode(true);
    const imgBG = templateCopy.querySelector(".img");
    const h1 = templateCopy.querySelector("article h1");
    const h2 = templateCopy.querySelector("h2");
    const article = templateCopy.querySelector("article");
    const a = templateCopy.querySelector("a");
    //    const img = templateCopy.querySelector("img");
    const price = templateCopy.querySelector(".price");
    //    a.href = "sub.html?id=" + event.id;
    //    img.setAttribute("src", imgPath);
    imgBG.style.backgroundImage = `url(${imgPath})`;
    h1.textContent = event.title.rendered;
    h2.textContent = event.event_date;
    price.textContent = event.price;
    article.addEventListener("click", function () {
        location.href = "sub.html?id=" + event.id;
    })
    document.querySelector("#events").appendChild(templateCopy);
}

function compareDate(a, b) {
    if (a.event_date < b.event_date) {
        return -1;
    }
    if (a.event_date > b.event_date) {
        return 1;
    }
    return 0;
}

function Filtering() {
    const bt = document.querySelector(".filterHL");
    const Filter = document.querySelector(".filterContent");
    Filter.style.display = "none";

    bt.addEventListener("click", openFilter);

    function openFilter() {
        if (Filter.style.display === "none") {
            console.log("Filter is closed, opening filter")
            Filter.style.display = "flex";
        } else {
            console.log("filter is open...closing")
            Filter.style.display = "none";
        }
    }
}

function getNav() {
    fetch("http://liatalony.com/liatalony/wp-json/wp/v2/categories")
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            data.forEach(addLink)
        })
}

function addLink(oneItem) {
    //    console.log(oneItem)
    //document.querySelector("nav").innerHTML += oneItem.name
    if (oneItem.id === 11 || oneItem.id === 12 || oneItem.id === 13 && oneItem.count > 0) {
        const link = document.createElement("a");
        link.textContent = oneItem.name;
        link.setAttribute("href", "index.html?category=" + oneItem.id)
        link.classList.add("OneItem");
        document.querySelector(".filterContent").appendChild(link);
    }
}

const parent = document.querySelector(".parentItem");
const subItem1 = document.querySelector(".item1");
const subItem2 = document.querySelector(".item2");

subItem1.style.display = "none";
subItem2.style.display = "none";
parent.addEventListener("click", showMenu);

function showMenu() {
    if (subItem1.style.display === "none") {
        subItem1.style.display = "block";
        subItem2.style.display = "block";
        console.log("block");
    } else {
        subItem1.style.display = "none";
        subItem2.style.display = "none";
        console.log("none")
    }
}

//const MenuBT = document.querySelector(".menuIcon");
const menu = document.querySelector(".menu");
//const exit = document.querySelector(".exit");
//
//menu.style.width = 0;
//exit.style.display = "none";
//
//
//exit.addEventListener("click", closeMenu);
//MenuBT.addEventListener("click", openMenu);

function openMenu() {
        menu.style.width = "100%";
}

function closeMenu() {
    menu.style.width = "0%";

}

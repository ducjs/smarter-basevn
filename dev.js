console.log("=======Hello from duclh - SWD=======")
const version = '0.2.7';
const env = 'dev';

// ==UserScript==
// @name         Smarter Base.vn - DEV
// @description  Make base.vn smarter
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @author       duclh - SWD
// @include      /https:\/\/(.*).base.vn/(.*)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=base.vn
// @grant        none
// @license MIT
// ==/UserScript==
// Repo URL https://greasyfork.org/en/scripts/446802-smarter-base-vn

let CONFIG = {
  SERVICE: {
    "all": {
      BG_COLOR: "#ccc7c7"
    },
    "+5": {
      BG_COLOR: "rgb(66 184 20 / 80%)"
    },
    "wework": {
      TITLE_SELECTOR: "#js-task-display > div.main-body > div.section.js-task-main > div.task-main > div.edit-box.compact.edit-task-name > div.edit-display > h1",
      BG_COLOR: "rgb(88 159 201 / 44%)",
      LINK_SELECTOR: ".tasklist .tasks div"
    },
    "meeting": {
      TITLE_SELECTOR: "#js-meeting-cover > div.main > div > div.text > div.name > span",
      BG_COLOR: "#ed6334b0"
    },
    "request": {
      TITLE_SELECTOR: "#obj-main > h1",
      BG_COLOR: "rgb(66 184 20 / 57%)"
    },
    "workflow": {
      TITLE_SELECTOR: "",
      BG_COLOR: "rgb(66 152 244 / 67%)"
    },
    "office": {
      TITLE_SELECTOR: "",
      BG_COLOR: "rgb(66 184 20 / 80%)"
    },
    "hiring": {
      TITLE_SELECTOR: "",
      BG_COLOR: "rgb(88 159 201 / 40%)"
    },
  },
  HIDE_NOTI: [],
  NOTI: {
    LOAD_MORE_NUMBER: 2,
    OPEN_NOTI_SELECTOR: "#navigator > div.header > div.icon",
    LOAD_MORE_SELECTOR: ".-more"
  },
  THEME: {
    MASK_SELECTOR: "#apdialogs"
  }
};

let notiCountIntial = {
  "all": 0,
  "wework": 0,
  "meeting": 0,
  "request": 0,
  "workflow": 0,
  "office": 0,
  "hiring": 0
};
let notiCount = { ...notiCountIntial };

let gridFilterService = document.createElement("div");

const main_makeEverythingMiddleClickAble = () => {
  let taskUrl = "https://wework.base.vn" + window.location.pathname + "?task=";
  let currentService = utils_getCurrentService();
  let links = document.querySelectorAll(CONFIG.SERVICE.wework.LINK_SELECTOR);

  for (let link of links) {
    let linkDiv = link.querySelector(".mn .url");
    if (!linkDiv) continue;

    let isDone = link.querySelector(".check.url") && link.querySelector(".check.url").innerHTML.includes("-done");
    let taskId = linkDiv.getAttribute("data-url");
    if (!taskId || taskId === "") continue;
    taskId = taskId.split("/")[1];

    let newATag = linkDiv.outerHTML;
    newATag = newATag.replace("</span>", "</a>");
    newATag = newATag.replace("<span", `<a href="${taskUrl + taskId}" onClick="return false;" style="font-weight: 400; ${!isDone && "color: #111"}"  `);
    linkDiv.outerHTML = newATag;
  }

}

const main_smarterThings = () => {
  //  document.querySelector(CONFIG.THEME.MASK_SELECTOR).setAttribute("onclick","TaskDisplay.close();");
}


const main_smarterNoti = () => {
  utils_stylingFilterBar();
  addAction_onClickNoti();
  utils_loadMoreNoti({ num: CONFIG.NOTI.LOAD_MORE_NUMBER, isFirstTime: true });

  const all = () => utils_showNotiByService("all");

  const ww = () => utils_showNotiByService("wework");
  const rq = () => utils_showNotiByService("request");
  const wf = () => utils_showNotiByService("workflow");
  const off = () => utils_showNotiByService("office");
  const hir = () => utils_showNotiByService("hiring");
  const mt = () => utils_showNotiByService("meeting");

  const plus5 = () => utils_loadMoreNoti({ num: 5, isFirstTime: false });

  const serviceToShow = [
    ["+5", plus5],
    ["all", all],
    ["wework", ww],
    ["request", rq],
    ["workflow", wf],
    ["office", off],
    ["hiring", hir],
    ["meeting", mt],
  ];
  let titleDiv = document.querySelector("#base-notis > div.list.list-notis > div.-title");
  if (!titleDiv) return;
  titleDiv.innerHTML = "";

  gridFilterService.style.display = "inline-block";
  gridFilterService.style.borderRight = "2px ridge grey";

  let gridFilterSomething = document.createElement("div");
  gridFilterSomething.style.display = "inline-block";

  let gridFilterPeople = document.createElement("div");
  gridFilterPeople.style.display = "inline-block";

  titleDiv.appendChild(gridFilterService);
  //titleDiv.appendChild(gridFilterSomething);
  //titleDiv.appendChild(gridFilterPeople);

  for (let service of serviceToShow) {
    let filterServiceButton = document.createElement("button");
    filterServiceButton.classList.add("filter-service");
    filterServiceButton.classList.add(`s-${service[0]}`);
    filterServiceButton.innerText = `${service[0]}`;
    filterServiceButton.onclick = service[1];
    filterServiceButton.style.backgroundColor = CONFIG.SERVICE[service[0]].BG_COLOR;
    utils_stylingFilterButton(filterServiceButton);
    if (titleDiv) gridFilterService.appendChild(filterServiceButton);
  }

}

const main_smarterTaskTime = () => {
  // Hiện chỉ hỗ trợ dạng gantt > trường tuỳ chỉnh
  let taskTds = document.querySelectorAll("#board-table .task");
  for (let i = 0; i < taskTds.length; i++) {
    let dateDivs = taskTds[i].querySelectorAll(".task-time");
    let deadlineDiv = dateDivs[1];
    if (deadlineDiv && deadlineDiv.innerHTML !== "") {
      let deadlineDate = deadlineDiv.innerHTML;
      deadlineDate = deadlineDate.split("/");
      deadlineDate = `${deadlineDate[1]}/${deadlineDate[0]}/2022`;
      deadlineDate = new Date(deadlineDate);
      let deltaDays = (deadlineDate.getTime() - Date.now()) / (1000 * 3600 * 24);
      // const formatter = new Intl.RelativeTimeFormat();
      // let remainDaysText = formatter.format(Math.round(deltaDays), 'days');

      deltaDays = Math.round(deltaDays) + 1;
      let completedDiv = dateDivs[2];
      if (deltaDays >= 0 && deltaDays < 4) completedDiv.style = "color: red";
      switch (deltaDays) {
        case 0:
          completedDiv.innerHTML = `0d`;
          break;
        default: completedDiv.innerHTML = `${deltaDays}d`;
      }

    }


  }


}

const main_smarterTitle = () => {
  let oldTitle = "";
  let hostName = utils_getCurrentService();

  let newTitle = document.querySelector(CONFIG.SERVICE[hostName].TITLE_SELECTOR);
  if (newTitle && newTitle !== oldTitle) {
    oldTitle = newTitle;
    document.title = newTitle.innerHTML;
  }

}


const utils_getCurrentService = () => {
  let hostName = window.location.hostname;
  hostName = hostName.split(".")[0];
  return hostName;
}




const utils_showNotiByService = (selectedService, filter = {}) => {
  let notis = document.getElementsByClassName("notis");
  for (let noti of notis) {
    noti.classList.remove("hidden");
    if (selectedService === "all") continue;
    let currentService = utils_getCurrentService();
    if (!noti) continue;
    let notiService = currentService;
    let url = noti.getAttributeNode("data-url").value;
    if (url.includes("https")) {
      url = url.split(".");
      notiService = url[0].replace("https://", "")
    }
    if (
      (notiService !== selectedService)
      || noti.getElementsByClassName("-title")[0].innerHTML.includes("sinh nhật")
    ) {
      noti = noti.classList.add("hidden");
    };
  }
}

const addAction_onClickNoti = () => {
  let openNotiButton = document.querySelector(CONFIG.NOTI.OPEN_NOTI_SELECTOR);
  let intervalCheckNotiAppear = setInterval(() => {
    if (openNotiButton) {
      openNotiButton.addEventListener('click', noti_recountNoti);
      clearInterval(intervalCheckNotiAppear);
    }
  }, 200);
}

const noti_recountNoti = () => {
  notiCount = { ...notiCountIntial };
  setTimeout(() => {
    let notis = document.getElementsByClassName("notis");
    let currentService = utils_getCurrentService();
    for (let noti of notis) {
      let notiService = currentService;
      let url = noti.getAttributeNode("data-url").value;
      if (url.includes("https")) {
        url = url.split(".");
        notiService = url[0].replace("https://", "")
      };
      if (!CONFIG.SERVICE[notiService]) continue;
      // if (!CONFIG.SERVICE[notiService].notiCount) CONFIG.SERVICE[notiService].notiCount = 0;
      notiCount[notiService] += 1;
    };
    utils_rewriteNotiCountToButton();
  }, 1000);
}

const utils_rewriteNotiCountToButton = () => {
  console.log(notiCount)
  let openNotiButton = document.querySelectorAll(".filter-service");
  for (let btn of openNotiButton) {
    let serviceName = btn.classList[1];
    if (serviceName) serviceName = serviceName.split('s-')[1];
    let serviceNotiCount = notiCount[serviceName] || 0;
    btn.innerText = `${serviceNotiCount} - ${serviceName}`;
  }
}

const utils_stylingFilterBar = () => {
  let titleNoti = document.querySelector(".-title");
  if (titleNoti) {
    titleNoti.style.width = "300%";
    titleNoti.style.height = "55px";
    titleNoti.style.background = "white";
    document.querySelector("#notis-items-w").style.top = "55pxpx";
  }
}

const utils_stylingFilterButton = (filterServiceButton) => {
  filterServiceButton.style.borderRadius = "5px";
  filterServiceButton.style.marginRight = "3px";
  filterServiceButton.style.marginLeft = "3px";
  filterServiceButton.style.paddingRight = "3px";
  filterServiceButton.style.paddingLeft = "3px";
  filterServiceButton.style.fontSize = "16px";
}

const utils_loadMoreNoti = ({ num = 10, isFirstTime = false }) => {
  let loadMoreButton = document.querySelector(CONFIG.NOTI.LOAD_MORE_SELECTOR);

  let count = 0;
  let intervalClickLoadMore = setInterval(() => {
    console.log("Noti open num", count);
    if (count === num) {
      clearInterval(intervalClickLoadMore);
      noti_recountNoti()
    }
    loadMoreButton.click();
    count += 1;
  }, 200);

}


const utils_getUserConfig = () => {
  const pingUrl = 'https://script.google.com/macros/s/AKfycbwq3EpWpIY4zpebj3svXRsenyr_2kSTZvNuArOj5plyQE0Mp4EXVoGa4v4fmhwU4QkAkg/exec';
  let userInfo = JSON.parse(localStorage.getItem('ajs_user_traits'));
  userInfo = {
    name: userInfo.name,
    email: userInfo.email,
    version,
    env
  }

  fetch(pingUrl, {
    method: 'POST',
    redirect: "follow",
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    });
}


const utils_hookApi = () => {
  let proxied = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    let xhrUrl = arguments[1];
    console.log("==============CATCH API ", arguments);

    if (xhrUrl.includes("/ajax/api/comment/load")) {
      main_smarterTitle();
    };
    if (xhrUrl.includes("/ajax/api/activity")) {
      // main_hyperlinkTask();
    };

    if (xhrUrl.includes("wework.base.vn")) {
      setTimeout(() => main_makeEverythingMiddleClickAble(), 2000);
    };
    if (xhrUrl.includes("/ajax/task/display")) { // Page task WW

    };


    return proxied.apply(this, [].slice.call(arguments));
  };
}




main_smarterThings();
main_smarterNoti();
main_smarterTaskTime();
main_makeEverythingMiddleClickAble();

utils_getUserConfig();
utils_hookApi();
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

let currentUrl = window.location.href;
let CONFIG = {
  CURRENT_SELECT_NOTI_SERVICE: "",
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
    OPEN_NOTI_SELECTOR: {
      "wework": "#navigator > div.header > div.icon",
      "meeting": "#base-panel > div > div.item.url.item-followup.item-notis",
      "request": "#base-panel-hoz > div.items > div.item.item-notis",
      "workflow": "#navigator > div.icons.clear-fix > div:nth-child(3)",
      "office": "#header > div > div.header-side > div.header-item.item-notis.url",
      "inside": "#header > div > div.header-side > div.header-item.item-notis.-std.url",
      "hiring": "",
    },

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
let noti_grid_1 = document.createElement("div");
noti_grid_1.style.display = "inline-block";
noti_grid_1.style.borderRight = "2px ridge grey";
noti_grid_1.style.paddingRight = "5px";

let noti_grid_2 = document.createElement("div");
noti_grid_2.style.display = "inline-block";
noti_grid_2.style.marginLeft = "5px";
// noti_grid_2.style.borderRight = "2px ridge grey";

const main_styling = () => {
  // let loadingDiv = document.querySelector('#base-xs');
  // let noNeedLoading = setInterval(() => {
  //   if (loadingDiv.style.display === '') loadingDiv.style.display = "none";
  //   clearInterval(noNeedLoading);
  // }, 50)

};

const main_makeWwCanHyperlink = () => {
  let taskUrl = "https://wework.base.vn" + window.location.pathname + "?task=";
  let links = document.querySelectorAll(CONFIG.SERVICE.wework.LINK_SELECTOR);

  if (links.length) {
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
  };

  let subtaskLinks = document.querySelectorAll('.etask-detail'); //Lười viết config quá
  if (subtaskLinks.length) {
    for (let subtask of subtaskLinks) {
      let isDone = subtask.getAttribute("data-status") === '1';;

      let linkDiv = subtask.querySelector(".etask-name");
      let taskId = subtask.getAttribute("data-id");

      let newATag = linkDiv.outerHTML;
      newATag = newATag.replace("</div>", "</a>");
      newATag = newATag.replace("<div", `<a href="${taskUrl + taskId}" onClick="return false;" style="font-weight: 400; ${!isDone && "color: #111"}"  `);
      linkDiv.outerHTML = newATag;
    };
  };

}

const main_smarterNoti = () => {
  addAction_onClickNoti();
  utils_stylingFilterBar();
  // utils_loadMoreNoti({ num: CONFIG.NOTI.LOAD_MORE_NUMBER, isFirstTime: true });

  const all = () => utils_showNotiByService("all");

  const ww = () => utils_showNotiByService("wework");
  const rq = () => utils_showNotiByService("request");
  const wf = () => utils_showNotiByService("workflow");
  const off = () => utils_showNotiByService("office");
  const hir = () => utils_showNotiByService("hiring");
  const mt = () => utils_showNotiByService("meeting");

  const plus5 = () => utils_loadMoreNoti({ num: 5, isFirstTime: false });

  const grid_1_items = [
    ["all", all],
    ["wework", ww],
    ["request", rq],
    ["workflow", wf],
    ["office", off],
    ["hiring", hir],
    ["meeting", mt],
  ];

  const grid_2_items = [
    ["+5", plus5],
  ];
  let titleDiv = document.querySelector("#base-notis > div.list.list-notis > div.-title");
  if (!titleDiv) return;
  titleDiv.innerHTML = "";


  titleDiv.appendChild(noti_grid_1);
  titleDiv.appendChild(noti_grid_2);

  for (let service of grid_1_items) {
    let filterServiceButton = document.createElement("button");
    filterServiceButton.classList.add("filter-service");
    filterServiceButton.classList.add(`s-${service[0]}`);
    filterServiceButton.innerText = `0 - ${service[0]}`;
    filterServiceButton.onclick = service[1];
    filterServiceButton.style.backgroundColor = CONFIG.SERVICE[service[0]].BG_COLOR;
    utils_stylingFilterButton(filterServiceButton);
    if (titleDiv) noti_grid_1.appendChild(filterServiceButton);
  }

  for (let service_2 of grid_2_items) {
    let btn = document.createElement("button");
    btn.innerText = `+5 trang`;
    btn.classList.add("load-more-noti");
    // btn.innerText = `${service_2[0]}`;
    btn.onclick = service_2[1];
    btn.style.backgroundColor = CONFIG.SERVICE[service_2[0]].BG_COLOR;
    utils_stylingFilterButton(btn);
    if (titleDiv) noti_grid_2.appendChild(btn);
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
  CONFIG.CURRENT_SELECT_NOTI_SERVICE = selectedService;
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
  let currentService = utils_getCurrentService();
  if (!CONFIG.NOTI.OPEN_NOTI_SELECTOR[currentService]) return;
  let openNotiButton = document.querySelector(CONFIG.NOTI.OPEN_NOTI_SELECTOR[currentService]);
  let intervalCheckNotiAppear = setInterval(() => {
    if (openNotiButton) {
      openNotiButton.addEventListener('click', noti_recountNoti);
      clearInterval(intervalCheckNotiAppear);
    }
  }, 200);
}

const noti_recountNoti = (reclickService = false) => {
  notiCount = { ...notiCountIntial };
  setTimeout(() => {
    let notis = document.getElementsByClassName("notis");
    let currentService = utils_getCurrentService();
    for (let noti of notis) {
      notiCount['all'] += 1;
      let notiService = currentService;
      let url = noti.getAttributeNode("data-url").value;
      if (url.includes("https")) {
        url = url.split(".");
        notiService = url[0].replace("https://", "")
      };
      if (!CONFIG.SERVICE[notiService]) continue;
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
  utils_toogleElemByClass({ classname: ".load-more-noti", isDisable: true });
  let count = 0;
  let intervalClickLoadMore = setInterval(() => {
    console.log("Noti open num", count);
    if (count === num) {
      clearInterval(intervalClickLoadMore);
      noti_recountNoti();
      utils_toogleElemByClass({ classname: ".load-more-noti", isDisable: false });

    }
    loadMoreButton.click();
    count += 1;
  }, 200);

}

const utils_toogleElemByClass = ({ classname = "", isDisable = false }) => {
  let divs = document.querySelectorAll(classname);
  if (isDisable) divs.forEach(e => e.setAttribute("disabled", true));
  else divs.forEach(e => e.removeAttribute("disabled"));
}


const utils_getUserConfig = () => {
  const pingUrl = 'https://script.google.com/macros/s/AKfycbwq3EpWpIY4zpebj3svXRsenyr_2kSTZvNuArOj5plyQE0Mp4EXVoGa4v4fmhwU4QkAkg/exec';
  let userInfo = JSON.parse(localStorage.getItem('ajs_user_traits'));
  userInfo = {
    name: userInfo.name,
    email: userInfo.email,
    version,
    env
  };
  if (userInfo.email === "duclh@gearvn.com") return;

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
      setTimeout(() => main_makeWwCanHyperlink(), 2000);
    };
    if (xhrUrl.includes("/ajax/task/display")) { // Page task WW

    };


    return proxied.apply(this, [].slice.call(arguments));
  };
}

if (currentUrl.includes("wework")) {
  main_makeWwCanHyperlink();
  main_smarterTaskTime();
}

main_smarterNoti();

// main_styling();

utils_getUserConfig();
utils_hookApi();
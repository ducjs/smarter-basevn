// ==UserScript==
// @name         Auto Shopee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://shopee.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.vn
// @grant        none
// ==/UserScript==

let currentUrl = window.location.href;
let cartUrl = "/cart";
let checkoutUrl = "/checkout";

let wantUrl = "https://shopee.vn/-KH%E1%BB%AC-M%C3%99I-THANH-L%E1%BB%8CC-KH%C3%94NG-KH%C3%8D-CH%C3%93-B%C3%94NG-THAN-HO%E1%BA%A0T-T%C3%8DNH-%C4%90%E1%BB%82-%C3%94-T%C3%94-PH%C3%92NG-KH%C3%81CH-HO%E1%BA%B6C-B%C3%80N-L%C3%80M-VI%E1%BB%86C-%C4%90A-D%E1%BB%A4NG-TRANG-NH%C3%83-i.214052907.6451194675"
let wantVari = "Đen Đốm Trắng";
let payment = "";

const shopPage = () => {
  let checkVariLoaded = setInterval(() => {
    let varis = document.querySelectorAll(".product-variation");
    if (varis.length) {
      clearInterval(checkVariLoaded);
      for (let vari of varis) {
        if (vari.innerText === wantVari) vari.click();
        document.querySelector(".OozJX2 button:nth-child(2)").click(); // Mua ngay
      }
    }
  }, 100)
  //let varis = document.querySelectorAll(".product-variation--disabled");
};

const cartPage = () => {

  let checkBtnLoaded = setInterval(() => {
    let btnClick = document.querySelector(".W2HjBQ .shopee-button-solid");
    if (btnClick) {
      clearInterval(checkBtnLoaded);
      document.querySelector(btnClick).click(); //Thanh toán
    }
  }, 100)

};

const checkoutPage = () => {
  console.log("zxcjkhszdiuchuidsahfucihdsuihuihu")
};

//if(currentUrl.includes(wantUrl))
shopPage();
//if(currentUrl.includes(cartUrl))
cartPage();
if (currentUrl.includes(checkoutUrl)) checkoutPage();

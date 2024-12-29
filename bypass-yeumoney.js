// ==UserScript==
// @name         Bypass Yeumoney
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically Bypass Yeumoney
// @author       xGreen
// @match        https://yeumoney.com/*
// @match        https://165.22.63.250/*
// @match        https://188.166.185.213/*
// @match        https://fb88kt.com/*
// @match        https://bk8if.com/*
// @match        https://bet88nx.com/*
// @match        https://88beted.com/*
// @match        https://vn88px.com/*
// @match        https://www.google.com/search?q=https*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    // Link nhiệm vụ (Lưu ý khi update thì phải update cả phần //@match ở phía trên)
    const redirectUrls = {
        "188bet": "https://88beted.com/",
        "w88": "https://188.166.185.213/",
        "bk8": "https://bk8if.com/",
        "fb88": "https://fb88kt.com/",
        "m88": "https://bet88nx.com/",
        "vn88": "https://vn88px.com/"
        //...
    };
    // Đổi nhiệm vụ khi không có trong link nhiệm vụ
    function doiNhiemvu() {
        const btnBaoloi = document.querySelector('#btn-baoloi');
        if (!btnBaoloi) return;
        btnBaoloi.click();
        setTimeout(() => {
            const reasonLink = document.querySelector('#lydo_doima > center > a:nth-child(2)');
            if (reasonLink) reasonLink.click();
            setTimeout(() => {
                const radioInput = document.querySelector('#lydo_doima > label:nth-child(8) > input[type=radio]');
                if (radioInput) radioInput.click();
                setTimeout(() => {
                    const confirmLink = document.querySelector('#dongy_doima > a');
                    if (confirmLink) confirmLink.click();
                }, 500);
            }, 500);
        }, 500);
    }
    
    // Chuyển sang trang nhiệm vụ
    function chuyenTrang(textContent) {
        const url = redirectUrls[textContent];
        if (url) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
            window.open(searchUrl, "_blank");
        } else {
            doiNhiemvu();
        }
    }
    // Fetch mã và chuyển trang 2 để fetch tiếp
    function guiRequest(loai_traffic, ymnclk, linkRedirect) {
        const codexn = localStorage.getItem("codexn");
        const url = window.location.href.replace(/\/$/, "");
        const fetchUrl = `https://traffic-user.net/GET_MA.php?codexn=${codexn}&url=${url}&loai_traffic=${loai_traffic}&clk=${ymnclk}`;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", fetchUrl, true);
        xhr.setRequestHeader("accept", "text/plain, */*; q=0.01");
        xhr.setRequestHeader("accept-language", "en-US,en;q=0.6");
        xhr.withCredentials = false;
        xhr.onload = function() {
            if (xhr.status === 200) {
                const htmlString = xhr.responseText;
                const ymnclk = htmlString.match(/sessionStorage\.setItem\("ymnclk", (\d+)\)/)?.[1];
                if (ymnclk) {
                    sessionStorage.setItem("ymnclk", ymnclk);
                    sessionStorage.setItem('redirectDone', 'true');
                    window.location.href = linkRedirect;
                } else {
                    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
                    const spanElement = doc.querySelector('span#layma_me_vuatraffic');
                    if (spanElement) thongbaoKetqua(spanElement);
                }
            }
        };
        xhr.send();
    }
    
    function nhanMa() {
        const element = document.getElementById("layma_me_vuatraffic");
        if (element) {
            element.click();
            console.log("Đã click vào phần tử có id 'layma_me_vuatraffic'.");
        } else {
            console.log("Không tìm thấy phần tử có id 'layma_me_vuatraffic'.");
        }
    }
    
    function thongbaoKetqua(spanElement) {
        const codeText = spanElement.textContent.replace(/\s+/g, '');
        spanElement.textContent = codeText;
        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
        const popup = document.createElement('div');
        popup.style.cssText = `
        position: relative;
        background: #fff;
        padding: 30px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
        width: 320px;
    `;
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
        position: absolute;
        top: 0; right: 10px;
        font-size: 30px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
        transition: color 0.3s;
    `;
        closeButton.onmouseover = () => closeButton.style.color = '#000';
        closeButton.onmouseout = () => closeButton.style.color = '#aaa';
        closeButton.onclick = () => document.body.removeChild(overlay);
        const authorText1 = document.createElement('p');
        authorText1.textContent = 'Bypass Yeumoney Thành Công';
        authorText1.style.cssText = `
        color: black;
        border: none;
        border-radius: 5px;
        font-size: 18px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
        margin-bottom: 10px;
    `;
        const authorText = document.createElement('p');
        authorText.textContent = 'Script By phantatdung';
        authorText.style.cssText = `
        margin: unset;
        color: #aaa;
        border: none;
        border-radius: 5px;
        font-size: 13px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
        margin-top:10px;
    `;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = codeText;
        input.readOnly = true;
        input.style.cssText = `
        width: 100%;
        padding: 10px;
        font-size: 18px;
        text-align: center;
        border: 2px solid #ddd;
        border-radius: 5px;
        outline: none;
    `;
        const copyButton = document.createElement('button');
        copyButton.textContent = 'SAO CHÉP';
        copyButton.style.cssText = `
        margin: unset;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
    `;
        copyButton.onmouseover = () => copyButton.style.backgroundColor = '#218838';
        copyButton.onmouseout = () => copyButton.style.backgroundColor = '#28a745';
        copyButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(codeText);
                alert('Mã đã được sao chép vào clipboard!');
            } catch (err) {
                alert('Sao chép thất bại: ' + err);
            }
        };
        popup.appendChild(closeButton);
        popup.appendChild(authorText1);
        popup.appendChild(input);
        popup.appendChild(copyButton);
        popup.appendChild(authorText);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
    if (window.location.hostname === 'www.google.com' && window.location.pathname === '/search') {
        window.onload = () => {
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const searchQuery = urlParams.get('q');
                if (searchQuery && searchQuery.startsWith('https://')) {
                    const links = document.querySelectorAll('a[href^="http"]');
                    for (let link of links) {
                        if (link.href.includes(searchQuery) && !link.href.includes('advanced_search')) {
                            link.click();
                            break;
                        }
                    }
                }
            }, 2000);
        };
    } else {
        if (window.location.hostname === 'yeumoney.com') {
            window.onload = () => {
                setTimeout(() => {
                    const element = document.querySelector('p#TK1');
                    if (element) chuyenTrang(element.textContent.trim());
                }, 2000);
            };
        } else {
            if (!sessionStorage.getItem('redirectDone')) {
                Object.defineProperty(document, 'referrer', { get: () => "https://www.google.com/" });
                setTimeout(() => {
                    nhanMa();
                    setTimeout(() => {
                        const loai_traffic = "https://www.google.com/";
                        const linkRedirect = [...document.querySelectorAll(`a[href^="https://${window.location.hostname}/"]`)].find(a => a.getAttribute('href').match(/^https:\/\/[^\/]+\/.+\//));
                       guiRequest(loai_traffic, null, linkRedirect);
                    }, 1000);
                }, 2000);
            } else {
                setTimeout(() => {
                    nhanMa();
                    setTimeout(() => {
                        const ymnclk = sessionStorage.ymnclk;
                        const loai_traffic = `${window.location.protocol}//${window.location.hostname}/`;
                        guiRequest(loai_traffic, ymnclk, null);
                        sessionStorage.removeItem('redirectDone');
                    }, 1000);
                }, 2000);
            }
        }
    }
})();

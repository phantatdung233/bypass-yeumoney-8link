// ==UserScript==
// @name         Bypass 8link.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically Bypass 8link.io
// @author       xGreen
// @match        https://8link.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        console.log('Page fully loaded, starting the script.');
        fetch('https://8link.io/api/get-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fingerprint: 'e59f97',
                has_clicked_link: true
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const code = data['code'];
            const inputField = document.querySelector('body > main > div.sl-challenge__code.sl-challenge__border.position-relative > form > div > input[type=text]');
            if (inputField) {
                inputField.value = code;
                const event = new Event('input', { bubbles: true });
                inputField.dispatchEvent(event);
            }
            const submitButton = document.querySelector('body > main > div.sl-challenge__code.sl-challenge__border.position-relative > form > div > button');
            if (submitButton) {
                submitButton.click();
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });
})();

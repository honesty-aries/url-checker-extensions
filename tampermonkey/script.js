// ==UserScript==
// @name         URL Safety Checker - API - Aries
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check if a URL is safe using API Aries
// @author       API Aries - Team
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.api-aries.online
// @icon         https://dashboard.api-aries.online/logo/logo.png
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/502108/URL%20Safety%20Checker%20-%20API%20-%20Aries.user.js
// @updateURL https://update.greasyfork.org/scripts/502108/URL%20Safety%20Checker%20-%20API%20-%20Aries.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User's API token - MUST be set by the user
    const apiToken = '';  // <-- Place your API Aries token here - https://dashboard.api-aries.online

    if (!apiToken) {
        alert('API token is required for this script to function. You can obtain a free token by visiting https://dashboard.api-aries.online/. Please edit the script and place your token in the designated area.');
        return;
    }

    // Add a popup container to the page
    $('body').append(`
        <div id="urlSafetyPopup" style="position: fixed; top: 20px; right: 20px; width: 300px; padding: 15px; background-color: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10000; display: none; font-family: Arial, sans-serif;">
            <img src="https://dashboard.api-aries.online/logo/logo.png" alt="Icon" style="width: 50px; height: 50px; display: block; margin: 0 auto;">
            <div id="urlSafetySpinner" style="border: 4px solid rgba(0, 0, 0, 0.1); border-top: 4px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 10px auto;"></div>
            <p id="urlSafetyMessage" style="text-align: center; margin-top: 10px;">Checking URL's safety...</p>
            <p style="text-align: center; font-size: 10px; color: #999; margin-top: 10px;">Powered by <a href="https://api-aries.online" target="_blank" style="color: #3498db; text-decoration: none;">API Aries</a></p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `);

    // Function to check if the URL is safe
    function checkURLSafety(url) {
        $('#urlSafetyPopup').fadeIn();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.api-aries.online/v1/checkers/safe-url/?url=${encodeURIComponent(url)}`,
            headers: {
                'APITOKEN': apiToken
            },
            onload: function(response) {
                let result = JSON.parse(response.responseText);
                if (result.error_code) {
                    displayError(result);
                } else {
                    displayResult(result);
                }
            },
            onerror: function() {
                $('#urlSafetyMessage').text('Error checking URL safety.');
                $('#urlSafetyPopup').css('background-color', '#f2dede');
                setTimeout(() => { $('#urlSafetyPopup').fadeOut(); }, 5000); // Hide after 5 seconds
            }
        });
    }

    // Function to display the result
    function displayResult(result) {
        let message = result.message;
        if (result.safe) {
            $('#urlSafetyMessage').text(`This URL is safe`);
            $('#urlSafetyPopup').css('background-color', '#dff0d8'); // Green background for safe URL
        } else {
            $('#urlSafetyMessage').text(`Warning: ${message}`);
            $('#urlSafetyPopup').css('background-color', '#f2dede'); // Red background for unsafe URL
        }
        $('#urlSafetySpinner').hide();
        setTimeout(() => { $('#urlSafetyPopup').fadeOut(); }, 5000); // Hide after 5 seconds
    }

    // Function to display the error
    function displayError(error) {
        let message = `${error.error} - ${error.message}`;
        $('#urlSafetyMessage').text(`Error: ${message}`);
        $('#urlSafetyPopup').css('background-color', '#f2dede'); // Red background for error
        $('#urlSafetySpinner').hide();
        setTimeout(() => { $('#urlSafetyPopup').fadeOut(); }, 5000); // Hide after 5 seconds
    }

    // Run the script on page load
    window.onload = function() {
        let currentURL = window.location.href;
        checkURLSafety(currentURL);
    };
})();

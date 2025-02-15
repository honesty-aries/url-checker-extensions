// ==UserScript==
// @name         URL Safety Checker - API - Aries
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Check if a URL is safe using API Aries
// @icon         https://panel.api-aries.com/logo/logo.png
// @author       API Aries - Team
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.api-aries.com
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/502108/URL%20Safety%20Checker%20-%20API%20-%20Aries.user.js
// @updateURL https://update.greasyfork.org/scripts/502108/URL%20Safety%20Checker%20-%20API%20-%20Aries.meta.js
// ==/UserScript==

/*
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // User's API token - MUST be set by the user
    const apiToken = ''; // <-- Place your API Aries token here - https://panel.api-aries.com

    if (!apiToken) {
        alert('API token is required for this script to function. You can obtain a free token by visiting https://panel.api-aries.com/. Please edit the script and place your token in the designated area.');
        return;
    }

    // Add a popup container to the page
    $('body').append(`
        <div id="urlSafetyPopup" style="position: fixed; top: 20px; right: 20px; width: 300px; padding: 15px; background-color: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10000; display: none; font-family: Arial, sans-serif;">
            <img src="https://panel.api-aries.com/logo/logo.png" alt="Icon" style="width: 50px; height: 50px; display: block; margin: 0 auto;">
            <div id="urlSafetySpinner" style="border: 4px solid rgba(0, 0, 0, 0.1); border-top: 4px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 10px auto;"></div>
            <p id="urlSafetyMessage" style="text-align: center; margin-top: 10px;">Checking URL's safety...</p>
            <p style="text-align: center; font-size: 10px; color: #999; margin-top: 10px;">Powered by <a href="https://api-aries.com" target="_blank" style="color: #3498db; text-decoration: none;">API Aries</a></p>
        </div>
        <div id="apiUsagePopup" style="position: fixed; top: 60px; right: 20px; width: 300px; padding: 15px; background-color: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10001; display: none; font-family: Arial, sans-serif;">
            <h3 style="text-align: center;">API Usage</h3>
            <p id="apiUsageMessage" style="text-align: center; margin-top: 10px;">Fetching usage data...</p>
            <button id="closeApiUsage" style="display: block; margin: 10px auto; padding: 5px 10px; border: none; background-color: #3498db; color: #fff; border-radius: 5px; cursor: pointer;">Close</button>
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
        $('#urlSafetySpinner').show();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.api-aries.com/v1/checkers/safe-url/?url=${encodeURIComponent(url)}`,
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

    // Function to fetch and display API usage
    function fetchApiUsage() {
        $('#apiUsagePopup').fadeIn();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.api-aries.com/system-api/dashboard/usage/?api_token=${apiToken}`,
            onload: function(response) {
                let usage = JSON.parse(response.responseText);
                $('#apiUsageMessage').html(`
                    <strong>Request Count:</strong> ${usage.request_count}<br>
                    <strong>Last Request Date:</strong> ${usage.last_request_date}<br>
                    <strong>Requests Left for Today:</strong> ${usage.request_left_for_today.toLocaleString()}
                    <button><a href="https://panel.api-aries.com/">See more by logging into our dashboard.</a></button>
                `);
            },
            onerror: function() {
                $('#apiUsageMessage').text('Error fetching API usage data.');
            }
        });
    }

    // Register the menu command to show API usage
    GM_registerMenuCommand('Show API Usage', fetchApiUsage);

    // Close API Usage Popup
    $(document).on('click', '#closeApiUsage', function() {
        $('#apiUsagePopup').fadeOut();
    });

    // Run the script on page load
    window.onload = function() {
        let currentURL = window.location.href;
        checkURLSafety(currentURL);
    };
})();

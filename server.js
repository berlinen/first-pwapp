"use strict";
/**
 * express 框架
 * fetch 请求库
 */
const express = require('express');
const fetch = require('node-fetch');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const dotenv = require('dotenv');
dotenv.config('./env');
// 本地初始化数据 设置 DARKSKY_API_KEY
const API_KEY = process.env.DARKSKY_API_KEY;
console.log(API_KEY);
const FORECAST_DELAY = 0;
const BASE_URL = `https://api.darksky.net/forecast`;
// 如果拿不到 Dark Sky API 用以下数据
const fakeForecast = {
    fakeData: true,
    latitude: 0,
    longitude: 0,
    timezone: 'America/New_York',
    currently: {
        time: 0,
        summary: 'Clear',
        icon: 'clear-day',
        temperature: 43.4,
        humidity: 0.62,
        windSpeed: 3.74,
        windBearing: 208,
    },
    daily: {
        data: [
            {
                time: 0,
                icon: 'partly-cloudy-night',
                sunriseTime: 1553079633,
                sunsetTime: 1553123320,
                temperatureHigh: 52.91,
                temperatureLow: 41.35,
            },
            {
                time: 86400,
                icon: 'rain',
                sunriseTime: 1553165933,
                sunsetTime: 1553209784,
                temperatureHigh: 48.01,
                temperatureLow: 44.17,
            },
            {
                time: 172800,
                icon: 'rain',
                sunriseTime: 1553252232,
                sunsetTime: 1553296247,
                temperatureHigh: 50.31,
                temperatureLow: 33.61,
            },
            {
                time: 259200,
                icon: 'partly-cloudy-night',
                sunriseTime: 1553338532,
                sunsetTime: 1553382710,
                temperatureHigh: 46.44,
                temperatureLow: 33.82,
            },
            {
                time: 345600,
                icon: 'partly-cloudy-night',
                sunriseTime: 1553424831,
                sunsetTime: 1553469172,
                temperatureHigh: 60.5,
                temperatureLow: 43.82,
            },
            {
                time: 432000,
                icon: 'rain',
                sunriseTime: 1553511130,
                sunsetTime: 1553555635,
                temperatureHigh: 61.79,
                temperatureLow: 32.8,
            },
            {
                time: 518400,
                icon: 'rain',
                sunriseTime: 1553597430,
                sunsetTime: 1553642098,
                temperatureHigh: 48.28,
                temperatureLow: 33.49,
            },
            {
                time: 604800,
                icon: 'snow',
                sunriseTime: 1553683730,
                sunsetTime: 1553728560,
                temperatureHigh: 43.58,
                temperatureLow: 33.68,
            },
        ],
    },
};
/**
 * 如果天气API不可用，则会生成伪造的预报。
 *
 * @param {String} location GPS 位置
 * @return {Object} forecast.
 */
function generateFakeForecast(location) {
    location = location || '40.7720232,-73.9732319';
    const commaAt = location.indexOf(',');
    // Create a new copy of the forecast
    const result = Object.assign({}, fakeForecast);
    result.latitude = parseFloat(location.substr(0, commaAt));
    result.longitude = parseFloat(location.substr(commaAt + 1));
    return result;
}
/**
 *  获取天气信息 => Dark Sky API
 *
 * @param {Request} req
 * @param {Response} resp
 */
const getForecast = (req, resp) => {
    const location = req.params.location || '40.7720232,-73.9732319';
    const url = `${BASE_URL}/${API_KEY}/${location}`;
    fetch(url).then((resp) => {
        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    }).then((data) => {
        // console.log('on' + JSON.stringify(data))
        setTimeout(() => {
            resp.json(data);
        }, FORECAST_DELAY);
    }).catch((err) => {
        console.error('Dark Sky API Error:', err.message);
        resp.json(generateFakeForecast(location));
    });
};
/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
    const app = express();
    // Redirect HTTP to HTTPS,
    app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
    // Logging for each request
    app.use((req, resp, next) => {
        const now = new Date();
        const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
        const path = `"${req.method} ${req.path}"`;
        const m = `${req.ip} - ${time} - ${path}`;
        // eslint-disable-next-line no-console
        console.log('on' + m);
        next();
    });
    // Handle requests for the data
    app.get('/forecast/:location', getForecast);
    app.get('/forecast/', getForecast);
    app.get('/forecast', getForecast);
    // Handle requests for static files
    app.use(express.static('public'));
    // Start the server
    return app.listen('8001', () => {
        // eslint-disable-next-line no-console
        console.log('Local DevServer Started on port 8001...');
    });
}
startServer();

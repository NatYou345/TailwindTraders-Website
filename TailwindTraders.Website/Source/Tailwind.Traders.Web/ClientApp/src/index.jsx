import React from "react";
import { createRoot } from "react-dom/client";
import "izitoast/dist/css/iziToast.min.css";
import { Provider } from 'react-redux';
import "./index.css";
import App from "./App";
import './i18n';
import store from './store';
import ConfigService from './services/configService';

(async () => {
    await ConfigService.loadSettings();

    createRoot(document.getElementById('root')).render(
        <Provider store={store}><App /></Provider>,
        document.getElementById('root')
    );
})();
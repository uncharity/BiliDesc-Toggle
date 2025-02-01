// ==UserScript==
// @name         BiliDesc-Toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认显示简介，双击A键隐藏简介
// @author       uncharity
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/uncharity/BiliDesc-Toggle/raw/main/main.user.js
// ==/UserScript==

(function () {
  "use strict";
  const CONFIG = {
    DOUBLE_PRESS_DELAY: 300,
    TOGGLE_KEY: "A",
    SELECTOR: {
      V_DESC: "#v_desc",
    },
    STYLES: `
            .toggle-btn {
                display: none !important;
            }
            .basic-desc-info {
                height: auto !important;
            }
        `,
  };

  function injectCustomCSS(css) {
    try {
      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      document.head.appendChild(styleElement);
      return true;
    } catch (error) {
      console.error("CSS注入失败:", error);
      return false;
    }
  }

  function isInputFocused() {
    const activeElement = document.activeElement;
    return (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT" ||
        activeElement.isContentEditable)
    );
  }

  function toggleDescription() {
    const vDesc = document.querySelector(CONFIG.SELECTOR.V_DESC);
    if (vDesc) {
      const computedStyle = window.getComputedStyle(vDesc);
      vDesc.style.display = computedStyle.display !== "none" ? "none" : "block";
    }
  }

  let lastPress = 0;
  function handleKeyPress(event) {
    if (isInputFocused()) return;

    if (event.key.toUpperCase() === CONFIG.TOGGLE_KEY) {
      const currentTime = Date.now();
      if (currentTime - lastPress < CONFIG.DOUBLE_PRESS_DELAY) {
        toggleDescription();
        lastPress = 0;
      } else {
        lastPress = currentTime;
      }
    }
  }
  injectCustomCSS(CONFIG.STYLES);
  document.addEventListener("keydown", handleKeyPress);
})();

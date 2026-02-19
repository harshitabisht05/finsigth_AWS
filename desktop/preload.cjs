const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("finsightDesktop", { platform: process.platform });

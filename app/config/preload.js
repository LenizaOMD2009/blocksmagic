'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    window: {
        open(name, opts) { return ipcRenderer.invoke('window:open', name, opts); },
        openModal(name, opts) { return ipcRenderer.invoke('window:openModal', name, opts); },
        close() { return ipcRenderer.invoke('window:close'); }
    },
    // Armazena dados temporários entre janelas
    temp: {
        set(key, data) { return ipcRenderer.invoke('temp:set', key, data); },
        get(key) { return ipcRenderer.invoke('temp:get', key); },
    },
    customer: {
        insert(data) { return ipcRenderer.invoke('customer:insert', data); },
        find(where) { return ipcRenderer.invoke('customer:find', where); },
        findById(id) { return ipcRenderer.invoke('customer:findById', id); },
        update(id, data) { return ipcRenderer.invoke('customer:update', id, data); },
        delete(id) { return ipcRenderer.invoke('customer:delete', id); },
        onReload(callback) {
            ipcRenderer.on('customer:reload', () => callback());
        },
    },
    product: {
        insert(data) { return ipcRenderer.invoke('product:insert', data); },
        find(where) { return ipcRenderer.invoke('product:find', where); },
        findById(id) { return ipcRenderer.invoke('product:findById', id); },
        update(id, data) { return ipcRenderer.invoke('product:update', id, data); },
        delete(id) { return ipcRenderer.invoke('product:delete', id); },
        onReload(callback) {
            ipcRenderer.on('product:reload', () => callback());
        },
    },
    users: {
        insert(data) { return ipcRenderer.invoke('users:insert', data); },
        find(where) { return ipcRenderer.invoke('users:find', where); },
        findById(id) { return ipcRenderer.invoke('users:findById', id); },
        update(id, data) { return ipcRenderer.invoke('users:update', id, data); },
        delete(id) { return ipcRenderer.invoke('users:delete', id); },
        onReload(callback) {
            ipcRenderer.on('users:reload', () => callback());
        },
    },
    enterprise: {
        insert(data) { return ipcRenderer.invoke('enterprise:insert', data); },
        find(where) { return ipcRenderer.invoke('enterprise:find', where); },
        findById(id) { return ipcRenderer.invoke('enterprise:findById', id); },
        update(id, data) { return ipcRenderer.invoke('enterprise:update', id, data); },
        delete(id) { return ipcRenderer.invoke('enterprise:delete', id); },
        onReload(callback) {
            ipcRenderer.on('enterprise:reload', () => callback());
        },
    },
    supplier: {
        insert(data) { return ipcRenderer.invoke('supplier:insert', data); },
        find(where) { return ipcRenderer.invoke('supplier:find', where); },
        findById(id) { return ipcRenderer.invoke('supplier:findById', id); },
        update(id, data) { return ipcRenderer.invoke('supplier:update', id, data); },
        delete(id) { return ipcRenderer.invoke('supplier:delete', id); },
        onReload(callback) {
            ipcRenderer.on('supplier:reload', () => callback());
        },
    },
    contact: {
        insert(data) { return ipcRenderer.invoke('contact:insert', data); },
        find(where) { return ipcRenderer.invoke('contact:find', where); },
        findById(id) { return ipcRenderer.invoke('contact:findById', id); },
        update(id, data) { return ipcRenderer.invoke('contact:update', id, data); },
        delete(id) { return ipcRenderer.invoke('contact:delete', id); },
        onReload(callback) {
            ipcRenderer.on('contact:reload', () => callback());
        },
    },
    country: {
        insert(data) { return ipcRenderer.invoke('country:insert', data); },
        find(where) { return ipcRenderer.invoke('country:find', where); },
        findById(id) { return ipcRenderer.invoke('country:findById', id); },
        update(id, data) { return ipcRenderer.invoke('country:update', id, data); },
        delete(id) { return ipcRenderer.invoke('country:delete', id); },
        onReload(callback) {
            ipcRenderer.on('country:reload', () => callback());
        },
    },
    federative_unit: {
        insert(data) { return ipcRenderer.invoke('federative_unit:insert', data); },
        find(where) { return ipcRenderer.invoke('federative_unit:find', where); },
        findById(id) { return ipcRenderer.invoke('federative_unit:findById', id); },
        update(id, data) { return ipcRenderer.invoke('federative_unit:update', id, data); },
        delete(id) { return ipcRenderer.invoke('federative_unit:delete', id); },
        onReload(callback) {
            ipcRenderer.on('federative_unit:reload', () => callback());
        },
    },
    city: {
        insert(data) { return ipcRenderer.invoke('city:insert', data); },
        find(where) { return ipcRenderer.invoke('city:find', where); },
        findById(id) { return ipcRenderer.invoke('city:findById', id); },
        update(id, data) { return ipcRenderer.invoke('city:update', id, data); },
        delete(id) { return ipcRenderer.invoke('city:delete', id); },
        onReload(callback) {
            ipcRenderer.on('city:reload', () => callback());
        },
    },
});


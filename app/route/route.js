import { ipcMain, BrowserWindow } from 'electron';
import Template from '../mixin/Template.js';
import Customer from '../controller/Customer.js';
import Product from '../controller/Product.js';
import Users from '../controller/Users.js';
import Enterprise from '../controller/Enterprise.js';
import Supplier from '../controller/Supplier.js';
import Contact from '../controller/Contact.js';
import Country from '../controller/Country.js';
import FederativeUnit from '../controller/Federative_Unit.js';
import City from '../controller/City.js';

function getWin(event) {
    return BrowserWindow.fromWebContents(event.sender);
}

// Avisa todas as janelas para recarregar
function broadcastReload(channel) {
    for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(channel);
    }
}

//  WINDOW
ipcMain.handle('window:open', (_e, name, opts = {}) => {
    const win = Template.create(name, opts);
    Template.loadView(win, name);
});

ipcMain.handle('window:openModal', (e, name, opts = {}) => {
    const parent = getWin(e);
    if (!parent) return;
    const win = Template.create(name, {
        width: 560,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: parent,
        modal: true,
        ...opts,
    });
    Template.loadView(win, name);
});

ipcMain.handle('window:close', (e) => {
    getWin(e)?.close();
});

//  TEMP STORE — dados temporários entre janelas
let tempData = {};

ipcMain.handle('temp:set', (_e, key, data) => {
    tempData[key] = data;
});

ipcMain.handle('temp:get', (_e, key) => {
    const data = tempData[key] || null;
    delete tempData[key];
    return data;
});

/////  CUSTOMER
ipcMain.handle('customer:insert', async (_e, data) => {
    const result = await Customer.insert(data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:find', async (_e, where = {}) => {
    return await Customer.find(where);
});

ipcMain.handle('customer:findById', async (_e, id) => {
    return await Customer.findById(id);
});

ipcMain.handle('customer:update', async (_e, id, data) => {
    const result = await Customer.update(id, data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:delete', async (_e, id) => {
    const result = await Customer.delete(id);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

/////  Produto
ipcMain.handle('product:insert', async (_e, data) => {
    const result = await Product.insert(data);
    if (result.status) broadcastReload('product:reload');
    return result;
});
ipcMain.handle('product:find', async (_e, where = {}) => {
    return await Product.find(where);
});
ipcMain.handle('product:findById', async (_e, id) => {
    return await Product.findById(id);
});

ipcMain.handle('product:update', async (_e, id, data) => {
    const result = await Product.update(id, data);
    if (result.status) broadcastReload('product:reload');
    return result;
});

ipcMain.handle('product:delete', async (_e, id) => {
    const result = await Product.delete(id);
    if (result.status) broadcastReload('product:reload');
    return result;
});

/////  USERS
ipcMain.handle('users:insert', async (_e, data) => {
    const result = await Users.insert(data);
    if (result.status) broadcastReload('users:reload');
    return result;
});

ipcMain.handle('users:find', async (_e, where = {}) => {
    return await Users.find(where);
});

ipcMain.handle('users:findById', async (_e, id) => {
    return await Users.findById(id);
});

ipcMain.handle('users:update', async (_e, id, data) => {
    const result = await Users.update(id, data);
    if (result.status) broadcastReload('users:reload');
    return result;
});

ipcMain.handle('users:delete', async (_e, id) => {
    const result = await Users.delete(id);
    if (result.status) broadcastReload('users:reload');
    return result;
});

/////  ENTERPRISE
ipcMain.handle('enterprise:insert', async (_e, data) => {
    const result = await Enterprise.insert(data);
    if (result.status) broadcastReload('enterprise:reload');
    return result;
});

ipcMain.handle('enterprise:find', async (_e, where = {}) => {
    return await Enterprise.find(where);
});

ipcMain.handle('enterprise:findById', async (_e, id) => {
    return await Enterprise.findById(id);
});

ipcMain.handle('enterprise:update', async (_e, id, data) => {
    const result = await Enterprise.update(id, data);
    if (result.status) broadcastReload('enterprise:reload');
    return result;
});

ipcMain.handle('enterprise:delete', async (_e, id) => {
    const result = await Enterprise.delete(id);
    if (result.status) broadcastReload('enterprise:reload');
    return result;
});

/////  SUPPLIER
ipcMain.handle('supplier:insert', async (_e, data) => {
    const result = await Supplier.insert(data);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:find', async (_e, where = {}) => {
    return await Supplier.find(where);
});

ipcMain.handle('supplier:findById', async (_e, id) => {
    return await Supplier.findById(id);
});

ipcMain.handle('supplier:update', async (_e, id, data) => {
    const result = await Supplier.update(id, data);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:delete', async (_e, id) => {
    const result = await Supplier.delete(id);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

/////  CONTACT
ipcMain.handle('contact:insert', async (_e, data) => {
    const result = await Contact.insert(data);
    if (result.status) broadcastReload('contact:reload');
    return result;
});

ipcMain.handle('contact:find', async (_e, where = {}) => {
    return await Contact.find(where);
});

ipcMain.handle('contact:findById', async (_e, id) => {
    return await Contact.findById(id);
});

ipcMain.handle('contact:update', async (_e, id, data) => {
    const result = await Contact.update(id, data);
    if (result.status) broadcastReload('contact:reload');
    return result;
});

ipcMain.handle('contact:delete', async (_e, id) => {
    const result = await Contact.delete(id);
    if (result.status) broadcastReload('contact:reload');
    return result;
});

/////  COUNTRY
ipcMain.handle('country:insert', async (_e, data) => {
    const result = await Country.insert(data);
    if (result.status) broadcastReload('country:reload');
    return result;
});

ipcMain.handle('country:find', async (_e, where = {}) => {
    return await Country.find(where);
});

ipcMain.handle('country:findById', async (_e, id) => {
    return await Country.findById(id);
});

ipcMain.handle('country:update', async (_e, id, data) => {
    const result = await Country.update(id, data);
    if (result.status) broadcastReload('country:reload');
    return result;
});

ipcMain.handle('country:delete', async (_e, id) => {
    const result = await Country.delete(id);
    if (result.status) broadcastReload('country:reload');
    return result;
});

/////  FEDERATIVE_UNIT
ipcMain.handle('federative_unit:insert', async (_e, data) => {
    const result = await FederativeUnit.insert(data);
    if (result.status) broadcastReload('federative_unit:reload');
    return result;
});

ipcMain.handle('federative_unit:find', async (_e, where = {}) => {
    return await FederativeUnit.find(where);
});

ipcMain.handle('federative_unit:findById', async (_e, id) => {
    return await FederativeUnit.findById(id);
});

ipcMain.handle('federative_unit:update', async (_e, id, data) => {
    const result = await FederativeUnit.update(id, data);
    if (result.status) broadcastReload('federative_unit:reload');
    return result;
});

ipcMain.handle('federative_unit:delete', async (_e, id) => {
    const result = await FederativeUnit.delete(id);
    if (result.status) broadcastReload('federative_unit:reload');
    return result;
});

/////  CITY
ipcMain.handle('city:insert', async (_e, data) => {
    const result = await City.insert(data);
    if (result.status) broadcastReload('city:reload');
    return result;
});

ipcMain.handle('city:find', async (_e, where = {}) => {
    return await City.find(where);
});

ipcMain.handle('city:findById', async (_e, id) => {
    return await City.findById(id);
});

ipcMain.handle('city:update', async (_e, id, data) => {
    const result = await City.update(id, data);
    if (result.status) broadcastReload('city:reload');
    return result;
});

ipcMain.handle('city:delete', async (_e, id) => {
    const result = await City.delete(id);
    if (result.status) broadcastReload('city:reload');
    return result;
});
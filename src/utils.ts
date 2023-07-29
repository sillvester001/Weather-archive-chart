import { openDB, IDBPDatabase, IDBPObjectStore } from 'idb';
import type { ItemData } from './types';

/**
 * Fetches data from IndexedDB for the given tableName and yearRange.
 * If data is not available in IndexedDB, fetches it from JSON file and saves it to IndexedDB.
 * @param {string} tableName - The name of the table to fetch data from.
 * @param {number[]} yearRange - The range of years to filter data by.
 * @returns {Promise<ItemData[]>} - The filtered data.
 */
export async function fetchDataFromDB(tableName: string, yearRange: number[]): Promise<ItemData[]> {
    const db = await openDB('weather', 1, {
        upgrade(db) {
            db.createObjectStore('temperature');
            db.createObjectStore('precipitation');
        },
    });

    const tx = db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    let data = await store.getAll();

    // If data is not available in IndexedDB, fetch it from JSON file and save it to IndexedDB
    if (data.length === 0) {
        const response = await fetch(`./../data/${tableName}.json`);
        data = await response.json();
        saveDataToDB(tableName, data);
    }
    return data
        .filter((item: ItemData) => {
            const year = parseInt(item.t);
            return year >= yearRange[0] && year <= yearRange[1];
    })
    .reduce((acc: ItemData[], item: ItemData[]) => acc.concat(item), []);

}

/**
 * Saves data to IndexedDB for the given tableName.
 * @param {string} tableName - The name of the table to save data to.
 * @param {ItemData[]} data - The data to save.
 * @returns {Promise<void>}
 */
export async function saveDataToDB(tableName: string, data: ItemData[]): Promise<void> {
    const db = await openDB('weather', 1, {
        upgrade(db) {
            db.createObjectStore('temperature', { keyPath: 't' });
            db.createObjectStore('precipitation', { keyPath: 't' });
        },
    });

    // data format: [{t: "1900", v: 0}, {t: "1901", v: 0}, ...]
    const tx = db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    await Promise.all(data.map((item) => store.put(item, item.t))); // Use "t" as the key
    await tx.done;
}

/**
 * ClaugerDB — IndexedDB persistence layer
 * DB: clauger_db v1
 *   store "state"  : key='draft' → JSON snapshot (sin datos binarios)
 *   store "photos" : key=photoId → Blob
 */
const ClaugerDB = (() => {
    const DB_NAME    = 'clauger_db';
    const DB_VERSION = 1;
    let _db = null;

    function open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('state'))  db.createObjectStore('state');
                if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos');
            };
            req.onsuccess = e => { _db = e.target.result; resolve(_db); };
            req.onerror   = e => reject(e.target.error);
        });
    }

    function _tx(store, mode, fn) {
        return new Promise((resolve, reject) => {
            const tx  = _db.transaction(store, mode);
            const req = fn(tx.objectStore(store));
            req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
            req.onerror   = e => reject(e.target.error);
        });
    }

    const saveState  = snap => _tx('state',  'readwrite', s => s.put(snap, 'draft'));
    const loadState  = ()   => _tx('state',  'readonly',  s => s.get('draft'));
    const clearState = ()   => _tx('state',  'readwrite', s => s.delete('draft'));

    const savePhoto   = (id, blob) => _tx('photos', 'readwrite', s => s.put(blob, id));
    const loadPhoto   = id         => _tx('photos', 'readonly',  s => s.get(id));
    const deletePhoto = id         => _tx('photos', 'readwrite', s => s.delete(id));

    function getAllPhotoIds() {
        return new Promise((resolve, reject) => {
            const tx  = _db.transaction('photos', 'readonly');
            const req = tx.objectStore('photos').getAllKeys();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror   = e  => reject(e.target.error);
        });
    }

    function clearAll() {
        const clearStore = name => new Promise((resolve, reject) => {
            const tx  = _db.transaction(name, 'readwrite');
            const req = tx.objectStore(name).clear();
            req.onsuccess = () => resolve();
            req.onerror   = e  => reject(e.target.error);
        });
        return Promise.all([clearStore('state'), clearStore('photos')]);
    }

    async function persist() {
        if (navigator.storage && navigator.storage.persist) {
            const granted = await navigator.storage.persist().catch(() => false);
            if (!granted) console.warn('ClaugerDB: persistencia de almacenamiento no concedida');
            return granted;
        }
        return false;
    }

    return { open, saveState, loadState, clearState, savePhoto, loadPhoto, deletePhoto, getAllPhotoIds, clearAll, persist };
})();

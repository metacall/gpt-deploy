import localforage from "localforage";

export default function KeyValuePairModel(tableNames , dbName = 'keyValueCache', storeName='keyValueStore'){
        localforage.config({
             driver: localforage.INDEXEDDB,
             name: dbName,
             version: 1.0,
             storeName: storeName
         });
        const pairCollection = {}

         class KeyValuePair {
            constructor(tableInstance){
                this.tableInstance = tableInstance
            }
             add(key, value) {
                 return this.tableInstance.setItem(key, value);
             }
             
             get(key) {
                 return this.tableInstance.getItem(key);
             }
             
             exists(key) {
                 return this.tableInstance.getItem(key).then(value => {
                     return value !== null;
                 });
             }
             
             remove(key) {
                 return this.tableInstance.removeItem(key);
             }
         }

         tableNames.forEach(tableName => {
                const lf_instance = localforage.createInstance({
                    name: 'keyValueCache',
                    storeName: tableName
                })
                pairCollection[tableName] = new KeyValuePair(lf_instance);
            }
         )

        return pairCollection;
} 
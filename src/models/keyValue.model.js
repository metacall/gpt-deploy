import localforage from "localforage";

/*
    This is a factory function that returns a collection of key value pair models.
*/
export default function KeyValuePairModel(tableNames , dbName = 'keyValueCache', storeName='keyValueStore'){
      /*
        Args:
            :tableNames string[]: An array of strings that represent the names of the tables.
            :dbName string: The name of the database.
            :storeName string: The name of the store.
        Returns:
            A collection of key value pair models.
      */

        localforage.config({
             driver: localforage.INDEXEDDB,
             name: dbName,
             version: 1.0,
             storeName: storeName
         });
        const pairCollection = {}

         /*
            This is a class that represents a key value pair model.
         */
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
                    name: dbName,
                    storeName: tableName
                })
                pairCollection[tableName] = new KeyValuePair(lf_instance);
            }
         )

        return pairCollection;
} 
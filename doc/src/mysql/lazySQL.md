#### [LazySQL](#lazysql)
```ts
interface MySQLConnect {
    getConnection(): mysql.Connection;
    query(sql: string | mysql.QueryOptions): Promise<unknown>;
    close(): Promise<void>;
    beginTransaction(): Promise<void>;
    commit(): Promise<unknown>;
    rollback(): Promise<void>;
}
class LazySQL {
    static createConnection(config: string | mysql.ConnectionConfig): MySQLConnect;
}
```

An interface to communicate with a MySQL database in asynchronous.

Example:

```js
const { LazySQL } = require('@lazy-toolbox/mysql');
const login = () => {
    const dbLink = LazySQL.createConnection({
        host: 'localhost',
        port: 6060,
        username: 'root'
    });
    /*
    The query gives a result written like:
    [ // All selected datas
        { solution: 2 } // column 0
    ]
    */
    const result = await dbLink.query('SELECT 1 + 1 AS solution');
    /*
    The query result contain the following properties: error, results, fields.
    */
    console.log(result.results[0].solution);
    dbLink.close();
}
```

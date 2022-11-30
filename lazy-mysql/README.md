# Lazy Toolbox - MySQL

> A NodeJS toolbox made for a lazy development when dealing with MySQL.

![Lazy Toolbox](/doc/img/logo.png)

Made to tame MySQL like it should haved behaved natively.

## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [MySQL](#mysql)
	    - [LazySQL](#lazysql)

## [Installation (NPM)](#install-npm)

The installation is pretty straight forward:
```terminal
npm i @lazy-toolbox/mysql
```

### v0.0.0 - Initial commit


## [Documentation](#documentation)

This part explain all tools with examples if it's needed.

### [MySql](#mysql)
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



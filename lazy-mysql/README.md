<p align="center">
    <img src="/doc/img/logo.png" alt="logo" height="500" width="500">
</p>

<p align="center">
    <img  src="https://img.shields.io/badge/license-MIT-green">
    <img  src="https://img.shields.io/badge/typescript-v4.8.4-orange">
    <img  src="https://img.shields.io/badge/node-v14.21.0-yellow">
</p>

# Lazy Toolbox - MySQL

> A NodeJS toolbox made for a lazy development when dealing with MySQL.

Made to tame MySQL like it should haved behaved natively.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox).

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



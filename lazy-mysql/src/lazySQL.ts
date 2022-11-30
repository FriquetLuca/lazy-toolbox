import util from 'util';
import mysql from 'mysql';
/**
 * An interface to communicate with a MySQL database in asynchronous.
 * See more on https://www.npmjs.com/package/mysql
 */
interface MySQLConnect {
    /**
     * Get the current mysql connection.
     */
    getConnection(): mysql.Connection;
    /**
     * Execute a query on your database.
     * @param {string | mysql.QueryOptions} sql The SQL query to execute.
     */
    query(sql: string | mysql.QueryOptions): Promise<unknown>;
    /**
     * Close the connection to the database. This will make sure all previously enqueued queries are still before sending a COM_QUIT packet to the MySQL server. If a fatal error occurs before the COM_QUIT packet can be sent, an err argument will be provided to the callback, but the connection will be terminated regardless of that.
     */
    close(): Promise<void>;
    /**
     * Begin a transaction on the database.
     */
    beginTransaction(): Promise<void>;
    /**
     * Commit all changes on a database.
     */
    commit(): Promise<unknown>;
    /**
     * Do a rollback on a transaction in case it failed.
     */
    rollback(): Promise<void>;
}
/**
 * A lazy connection creator for mysql.
 */
export class LazySQL {
    /**
     * Create a promisified connection to mysql.
     * @param {string | mysql.ConnectionConfig} config 
     * @returns {MySQLConnect} An interface to communicate with a MySQL database in asynchronous.
     */
    static createConnection(config: string | mysql.ConnectionConfig): MySQLConnect {
        const connection: mysql.Connection = mysql.createConnection(config);
        return {
            query(sql: string | mysql.QueryOptions): Promise<unknown> {
                return util.promisify(connection.query)
                    .call(connection, sql);
            },
            getConnection(): mysql.Connection {
                return connection;
            },
            close(): Promise<void> {
                return util.promisify(connection.end)
                    .call(connection);
            },
            beginTransaction(): Promise<void> {
                return util.promisify(connection.beginTransaction)
                    .call(connection);
            },
            commit(): Promise<unknown> {
                return util.promisify(connection.commit)
                    .call(connection);
            },
            rollback(): Promise<void> {
                return util.promisify(connection.rollback)
                    .call(connection);
            }
        };
    }
}
import MySQLdb as mysql
import sqlite3
from utils import dbConfig


class SQL:
    def __init__(self, rdbms, db_name):
        self.rdbms = rdbms  # mysql or sqlite3
        self.db_name = db_name

    def connect(self):
        if self.rdbms == "mysql":
            # Note (need confirmation): Will need to provide the mysql config parameters to the python/mysql connector
            # object to connect to the running instance of the mysql server regardless of the fact that the django
            # application is currently connected to the mysql server.
            # get connection object
            conn = mysql.connect(**dbConfig)
        else:
            if self.rdbms == "sqlite3":
                conn = sqlite3.connect(self.db_name, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
                # Returns dictionaries instead of tuples
                conn.row_factory = sqlite3.Row
            else:
                conn = None
        if conn:
            # create a cursor
            cursor = conn.cursor()
            return conn, cursor

    def close(self, cursor, conn):
        # close cursor
        cursor.close()

        # close connection to the database server/file.
        conn.close()

    def show_db(self):
        if self.rdbms == "mysql":
            # connect to database server/file.
            conn, cursor = self.connect()

            # Print the available databases
            cursor.execute("SHOW DATABASES")
            dbs = cursor.fetchall()

            # close cursor and connection
            self.close(cursor, conn)
            return dbs
        else:
            # sqlite only has the one and only database that is represented by the file base database.
            return None

    def use_db(self, cursor):
        # Takes in cursor of an open connection.
        if self.rdbms == "mysql":
            cursor.execute("USE {}".format(self.db_name))

    def show_tables(self):
        # connect to database server/file.
        conn, cursor = self.connect()

        if self.rdbms == "mysql":
            self.use_db(cursor)
            cursor.execute("SHOW FULL TABLES from {}".format(self.db_name))
        elif self.rdbms == "sqlite3":
            cursor.execute("SELECT * FROM sqlite_master WHERE type='table'")

        tables = cursor.fetchall()

        # close cursor and connection
        self.close(cursor, conn)
        return tables

    def show_table_data(self, table_name):
        # connect to database server/file.
        conn, cursor = self.connect()

        if self.rdbms == "mysql":
            self.use_db(cursor)

        # using the connection object as context manager.
        with conn:
            cursor.execute("SELECT * FROM {}".format(table_name))
            data = cursor.fetchall()
            return data

    def get_specific_user_data(self, table_name, user_email):
        # connect to database server/file.
        conn, cursor = self.connect()

        if self.rdbms == "mysql":
            self.use_db(cursor)

        # for the folder table, as the user email field is referred to owner email.
        cursor.execute(f"SELECT * FROM {table_name} WHERE owner_email=:owner_email", {"owner_email": user_email})
        data = cursor.fetchall()
        # close cursor and connection
        self.close(cursor, conn)
        return data

    def get_path_folder(self, table_name, folder_name, path_to_folder, user_email):
        # connect to database server/file.
        conn, cursor = self.connect()

        if self.rdbms == "mysql":
            self.use_db(cursor)

        # for the folder table, as the user email field is referred to owner email.
        cursor.execute(f"SELECT * FROM {table_name} WHERE folder_name=:folder_name AND path_to_folder=:path_to_folder"
                       f" AND owner_email=:owner_email", {"folder_name": folder_name, "path_to_folder": path_to_folder,
                                                          "owner_email": user_email})
        data = cursor.fetchone()
        # close cursor and connection
        self.close(cursor, conn)
        return data

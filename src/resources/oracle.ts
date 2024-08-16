import OracleDB from "oracledb"

import dotenv from 'dotenv'

dotenv.config()

const {
  ORACLE_USER,
  ORACLE_PASSWORD,
  ORACLE_CONNECTION_STRING
} = process.env

const config = {
  user: ORACLE_USER,
  password: ORACLE_PASSWORD,
  connectString: ORACLE_CONNECTION_STRING
}

export default class db {

  public static async run() {
    let connection

    // let clientOpts = {};
    // if (process.platform === 'win32') {
    //   // Windows
    //   // If you use backslashes in the libDir string, you will
    //   // need to double them.
    //   clientOpts = { libDir: 'C:\\oracle\\instantclient_19_19' };
    // } else if (process.platform === 'darwin' && process.arch === 'x64') {
    //   // macOS Intel
    //   clientOpts = { libDir: process.env.HOME + '/Downloads/instantclient_19_16' };
    // }

    try {
      OracleDB.initOracleClient()
      connection = await OracleDB.getConnection(config)
    }
    catch (err) {
      console.log(err)
    }

    return connection
  }
} 

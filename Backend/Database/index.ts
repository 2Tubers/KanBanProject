// Get the client
import { type RowDataPacket } from "mysql2";
import mysql from 'mysql2/promise';

// Create the connection to database
// const connection = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'KanBan',
//   password: 'Messi@15086',
// });

export interface User extends RowDataPacket {
  id: number;
  username: string;
  salt: string;
  hashedPassword: string;
}

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'KanBan',
  password: 'Messi@15086',
  connectionLimit: 10,
});

export async function addNewUser(userName:string,salt :string,hashPassword:string)
{
    try{
    await pool.query(
      'INSERT INTO  users (username,salt,hashedPassword) VALUES (?,?,?)',
      [userName, salt,hashPassword]
    );

  }catch (err) {
    console.log(err);
    throw err;
  }

}

export async function getUser(userName:string)
{
  try{
    const result=await pool.query<User[]>('SELECT * FROM users WHERE username=?',[userName]);
    return result[0];
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUserById(userId:number)
{
  try{
    const [result]=await pool.query<User[]>('SELECT * FROM users WHERE id=?',[userId]);

      if (result.length === 0) {
            return null;
        }
    return result[0];
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}



// Close the connection
// await pool.end();
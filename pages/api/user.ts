import type { NextApiRequest, NextApiResponse } from "next";

const mysql =require("mysql2");
//เทส mysql2 
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
}); 

export default (req: NextApiRequest, res: NextApiResponse) =>{
    connection.query(
        'SELECT * FROM user ' ,
        function(err :any, result :any) {
           res.status(200).json(result);
        }
    );
   
}
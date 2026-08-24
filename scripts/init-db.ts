import fs from "fs"; import path from "path"; import mysql from "mysql2/promise"; import dotenv from "dotenv";
dotenv.config();
async function main(){
  const db=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD});
  const sql=fs.readFileSync(path.join(process.cwd(),"database/schema.sql"),"utf8");
  for(const statement of sql.split(";").map(s=>s.trim()).filter(Boolean)) await db.query(statement);
  await db.end(); console.log("Database initialized.");
}
main().catch(e=>{console.error(e);process.exit(1)});

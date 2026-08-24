import dotenv from "dotenv"; dotenv.config();
import {createApp} from "./app";
const port=Number(process.env.PORT||3000);
createApp().listen(port,()=>console.log(`Library Manager: http://localhost:${port} | API docs: http://localhost:${port}/api/docs`));

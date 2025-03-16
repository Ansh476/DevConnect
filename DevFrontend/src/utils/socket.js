import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketconnection = () =>{
return io(BASE_URL)
};

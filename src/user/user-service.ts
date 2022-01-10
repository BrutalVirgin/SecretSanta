import { User } from "./user-interface"
import { v4 as uuidv4 } from 'uuid'
import { db } from "../main"

type newUserSet = Pick<User, "first_name" | "last_name" | "wishlist">

export class UserService {

    constructor() { }


    createUser(user: newUserSet): User {
        const newUSer = {
            id: uuidv4(),
            first_name: user.first_name,
            last_name: user.last_name,
            wishlist: user.wishlist
        }

        db.run('INSERT INTO users(id, first_name, last_name, wishlist) VALUES(?, ?, ?, ?)',
            [1, "ASD", "FGFG", "SDF,SDF,SDF,FGHJ"],
            (err) => {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`Added info`);
            })

        db.close()

        return newUSer
    }
}
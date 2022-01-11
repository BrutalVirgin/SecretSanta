import { User } from "./user-interface"
import { v4 as uuidv4 } from 'uuid'
import sqlite3 from "sqlite3"

type newUserSet = Pick<User, "first_name" | "last_name" | "wishlist">

export class UserService {

    constructor(
        private readonly db: sqlite3.Database
    ) { }


    createUser(user: newUserSet): User {
        const newUSer = {
            id: uuidv4(),
            first_name: user.first_name,
            last_name: user.last_name,
            wishlist: user.wishlist
        }

        this.db.run('INSERT INTO users(id, first_name, last_name, wishlist) VALUES(?, ?, ?, ?)',
            [uuidv4(), user.first_name, user.last_name, user.wishlist],
            (err) => {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`Added info`);
            })

        this.db.close()

        return newUSer
    }
}
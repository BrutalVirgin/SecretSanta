import e from "express"
import express from "express"
import sqlite3 from "sqlite3"
import { stringify } from "uuid"
import { UserService } from "../src/user/user-service"


// зарегистрировать участника имя, фамилия, список побажань

async function main() {
    const app = express()

    const db = new sqlite3.Database("./database.db",
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) return console.error(err)

            console.log("connection is ok")
        })

    const userService = new UserService(db)

    app.use(express.json())

    app.post("/users", (req, res) => {
        const user = req.body
        if (user.first_name != null && typeof (user.first_name) === "string") {
            if (user.last_name != null && typeof (user.last_name) === "string") {
                if (user.wishlist != null && typeof (user.wishlist) === "string") {
                    userService.createUser(req.body)
                } else {
                    res.statusCode = 400
                    res.send("err")
                }
            } else {
                res.statusCode = 400
            }
        } else {
            res.statusCode = 400
        }
    })

    // db.run('CREATE TABLE users (id text, first_name text, last_name text, wishlist text)')

    // db.run('INSERT INTO users(id, first_name, last_name, wishlist) VALUES(?, ?, ?, ?)',
    //     [1, "ASD", "FGFG", "SDF,SDF,SDF,FGHJ"],
    //     (err) => {
    //         if (err) {
    //             return console.log(err.message);
    //         }
    //         console.log(`Added info`);
    //     })

    db.close()

    app.listen(3000, () => console.log("runnin"))
}

main()


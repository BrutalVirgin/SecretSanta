import e from "express"
import express from "express"
import sqlite3 from "sqlite3"
import { stringify } from "uuid"
import { UserService } from "../src/user/user-service"
import { Shuffle } from "../shuffle"



// зарегистрировать участника имя, фамилия, список побажань

async function main() {
    const app = express()

    const db = new sqlite3.Database("./database.db",
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) return console.error(err)

            console.log("connection is ok")
        })


    const userService = new UserService(db)
    const shuffle = new Shuffle(db, userService)

    app.use(express.json())

    app.post("/users", (req, res) => {
        const user = req.body
        if (validation(user)) {
            userService.createUser(req.body)
        } else {
            res.statusCode = 400
            res.send("err")
        }

        res.end()
    })
    // db.run('CREATE TABLE users (id text, first_name text, last_name text, wishlist text)')

    app.post("/shuffle", (_req, res) => {
        var a = shuffle.start()

        res.contentType("json")
        res.end(JSON.stringify(a))
    })
    app.post("/delete", (_req, res) => {
        db.run("DELETE FROM partners")

    })

    app.get("/users/:id", async (req, res) => {
        const user = userService.getUserWishlist(req.params.id)
        await user

        res.contentType("json")
        res.end(JSON.stringify(user))
    })

    app.listen(3000, () => console.log("runnin"))
}

function validation(user: any) {
    if (user["first_name"] != null && typeof (user.first_name) === "string") {
        if (user["last_name"] != null && typeof (user.last_name) === "string") {
            if (user["wishlist"] != null && typeof (user.wishlist) === "object") {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

main()


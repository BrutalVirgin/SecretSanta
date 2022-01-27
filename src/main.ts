import express from "express"
import sqlite3 from "sqlite3"
import { UserService } from "../src/user/user-service"
import { Shuffle } from "../core/shuffle"


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

    app.post("/user", (req, res) => {
        const user = req.body
        if (validation(user)) {
            try {
                userService.createUser(req.body)

                return res.end("User created")
            } catch (e: any) {
                res.end(e.message)
            }
        } else {
            res.statusCode = 400
            return res.end("Wrong user type")
        }
    })
    // db.run('CREATE TABLE users (id text, first_name text, last_name text, wishlist text)')

    app.post("/shuffle", async (_req, res) => {
        const final = await shuffle.start()

        res.contentType("json")
        res.end(JSON.stringify(final))
    })

    app.post("/delete", async (_req, res) => {
        db.run('DELETE FROM partners')
    })

    app.get("/users/:id", async (req, res) => {
        try {
            const userWishList = await userService.getUserWishlist(req.params.id)

            res.contentType("json")
            res.end(JSON.stringify(userWishList))
        } catch (e: any) {
            res.end(e.message)
        }
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


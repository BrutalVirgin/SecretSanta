import { User } from "./user-interface"
import { v4 as uuidv4 } from 'uuid'
import sqlite3 from "sqlite3"
import e from "express"

type newUserSet = Pick<User, "first_name" | "last_name" | "wishlist">

export class UserService {

    constructor(
        private readonly db: sqlite3.Database
    ) { }

    private _userId: string = ""
    private _isGameStarted: Boolean = false



    createUser(user: newUserSet): User {
        const newUSer = {
            id: uuidv4(),
            first_name: user.first_name,
            last_name: user.last_name,
            wishlist: user.wishlist
        }

        console.log(this.getCountOfUsers())

        if (this.WishlistValidator(newUSer.wishlist)) {
            this.db.run('INSERT INTO users(id, first_name, last_name, wishlist) VALUES(?, ?, ?, ?)',
                [uuidv4(), user.first_name, user.last_name, user.wishlist],
                (err) => {
                    if (err) {
                        return console.log(err.message)
                    }
                    console.log(`Added info`)
                })
        }
        return newUSer
    }

    async getUserWishlist(userId: string) {
        if (!this._isGameStarted) {
            throw Error("The game hasn't started yet")
        }

        if (this._isGameStarted) {
            var promise = new Promise((res, rej) => {
                const sql = this.db.get('SELECT reciever_id FROM partners WHERE giver_id =?',
                    [userId],
                    (err, row) => {
                        if (err) {
                            throw Error("This user is not registered")
                        }
                        this._userId = row.reciever_id

                        res(this._userId)
                    })
            }).then(user => {
                const sql = this.db.get('SELECT * FROM users WHERE id =?',
                    [user],
                    (err, row) => {
                        if (err) {
                            throw Error("This user is not registered")
                        }
                        return row
                    })
            })
            await promise
            return promise
        }
        return
    }

    async findUser(id: string) {
        var promise = new Promise((res, rej) => {
            const sql = this.db.run('SELECT * FROM users WHERE id=?',
                [id],
                (err) => {
                    if (err) {
                        throw Error("this user is not registered")
                    }
                    res(sql)
                })
        })
        await promise
    }

    getCountOfUsers() {
        const sql = 'SELECT COUNT (*) AS cnt FROM users'
        var count
        this.db.get(sql, [], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(row["cnt"])
            return count = row["cnt"]
        })
        return count
    }

    WishlistValidator(wishlist: string[]): Boolean {
        if (wishlist.length === 0) {
            throw Error("Write your wishes")
        }
        else if (wishlist.length > 10) {
            throw Error("You can add only 10 wishes")
        } else {
            return true
        }
    }

    changeGameCondition(condition: Boolean) {
        this._isGameStarted = condition
    }
}
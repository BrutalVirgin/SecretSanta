import sqlite3 from "sqlite3"
import { User } from "./src/user/user-interface"
import { UserService } from "./src/user/user-service"

export class Shuffle {

    constructor(
        private readonly db: sqlite3.Database,
        private readonly userService: UserService
    ) { }



    private _members: String[] = []
    private _isActiveShuffle: Boolean = true

    async start() {
        // this.db.run('CREATE TABLE partners (giver_id text, reciever_id text)')
        this.userService.changeGameCondition(true)
        const sql = ('SELECT id FROM users')

        var result = new Promise((res, rej) => {
            this.db.all(sql, [], async (err, rows: User[]) => {
                if (err) {
                    return console.error(err.message);
                }
                this._members = rows.map(c => c["id"])

                res(rows)
            })
        })
        await result
        this.makeShuffle(this._members)
    }

    async makeShuffle(members: String[]) {
        if (this._isActiveShuffle === false) {
            throw Error("You can`t shuffle players second time")
        }

        if (this._isActiveShuffle === true) {
            var recievers = members.slice()

            for (var i = 0; i < members.length; i++) {
                var curMember = members[i]
                var recieverIndex = Math.floor(Math.random() * recievers.length)
                while (recievers[recieverIndex] === curMember) {
                    recieverIndex = Math.floor(Math.random() * recievers.length);
                }
                var reciever = recievers.splice(recieverIndex, 1)[0]

                var promise = new Promise((res, rej) => {
                    var sql = this.db.run('INSERT INTO partners(giver_id, reciever_id) VALUES(?, ?)',
                        [curMember, reciever],
                        (err) => {
                            if (err) {
                                return console.log(err.message)
                            }
                            res(sql)
                        })
                })
                await promise
            }
            console.log("Added partners")
            this._isActiveShuffle = false
        }

    }
}

import express from "express"
import { IsString, validate } from "class-validator"
import { plainToInstance } from "class-transformer"
import 'reflect-metadata';


// зарегистрировать участника имя, фамилия, список побажань

class CreateUserDTO {
    @IsString()
    firstName!: string

    @IsString()
    lastName!: string

    @IsString({ each: true })
    wishList!: string[]
}

async function main() {
    const app = express()

    app.use(express.json())

    app.post("/users", async (req, res) => {
        const user = plainToInstance(CreateUserDTO, req.body)
        const validationsErrors = await validate(user)

        console.log({
            user,
            validationsErrors
        })

        if (validationsErrors.length) {
            res.statusCode = 400
            res.end(JSON.stringify(validationsErrors))
            return
        }

        res.end("kak nado")

    })

    app.listen(3000, () => console.log("runnin"))
}

main()
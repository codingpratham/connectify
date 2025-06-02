import zod, { string } from "zod";
export const signUpbody =  zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
})

export const loginBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
})

export const onBoardBody = zod.object({
    name:string(), bio:string(), location:string(), profilePic:string()
})
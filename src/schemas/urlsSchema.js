import joi from "joi";

export const shortURLSchema = joi.object({
    url: joi.string().uri().required(),
});
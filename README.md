# jwt256

Implementation of JWT using AES-256

![jwt](http://jwt.io/img/logo-asset.svg)

## To Use

`yarn add @random-guys/jwt256` or `npm install @random-guys/jwt256`

---

Ensure `JWT_SECRET` and `REDIS_KEY` environment variables are set, and that `REDIS_KEY` is a 32 digit string.

## Usage

```ts
import { GetUserAuth, SetUserAuth } from "@random-guys/jwt256";
import redisService from "@app/common/services/redis";

//creates an encrpted JWT token and saves it in Redis using the user's id.
@httpPost("/signup")
async signup(@request() req: Request, @response() res: Response, @requestBody(), body: SignupDTO) {
  try {
    let user = create(body);
    const token = await SetUserAuth(redisService, user.id);
    this.handleSuccess(req, res, { token, user });
  } catch (err) {
    this.handleError(req, res, err);
  }
}

/**
 * reads the Authorization header and validates the content with that stored in Redis
 */
@httpPost("/buy", GetUserAuth(redisService))
async buyBook(
  @request() req: Request,
  @response() res: Response,
  @requestBody() body: BuyBookDTO
) {
  try {
    const sale = await this.bookRepo.buyBook({ id: req.user } , body);
    this.handleSuccess(req, res, user);
  } catch (err) {
    console.log(err);
    this.handleError(req, res, err);
  }
}

```

The user id is in the `req.user` field.

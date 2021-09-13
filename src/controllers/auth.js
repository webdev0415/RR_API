import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { User } from "models";

import { generateAuthToken } from "../middleware/auth";
import BaseController from "../utils/baseController";

// TODO: to be moved constants
const msg = 'Welcome to Riot Racers!\n\nClick "Sign" to sign in. No password needed!\n\nI accept the Riot Racers Terms of Service: https://riot.fun/terms-of-service';
const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
class AuthController extends BaseController {
  create = async (req, res) => {
    const { signature, publicAddress, email } = req.body;

    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    if (address.toLowerCase() !== publicAddress.toLowerCase()) {
      return this.unAuthorized(res, {
        error: "Signature verification failed",
      });
    }

    const userByAddress = await User.findRecord({ publicAddress });

    if (userByAddress && email && userByAddress.email !== email) {
      return this.bad(res, { error: "public address already exists" });
    }

    // When we connect after email auth
    if (email) {
      const userByEmail = await User.findRecord({ email });
      if (userByEmail && publicAddress && !userByEmail.publicAddress) {
        const user = await User.updateAndRecordById(userByEmail.id, {
          publicAddress,
          username: publicAddress.slice(0, 8),
        });
        User.addLoginLog(user.id);
        return this.success(res, { user });
      }
    }

    if (!userByAddress) {
      return this.success(res, { user: {} });
    }

    let authToken = null;
    if (userByAddress.email) {
      authToken = generateAuthToken(userByAddress.id);
    }

    User.addLoginLog(userByAddress.id);
    this.success(res, { user: userByAddress, token: authToken });
  };
}

export default AuthController;

import { generateCompares, getWinners } from "../utils/helpers";
import BaseController from "../utils/baseController";

export default class RaceController extends BaseController {
  winners = (req, res) => {
    const { players } = req.body;
    const [compareScope, allChances] = generateCompares(players);
    const picked = getWinners(compareScope, allChances);
    const results = picked.map((pIndx) => players[pIndx]);
    this.success(res, results);
  };
}

import short from "short-uuid";

const generator = short();
const generateShortId = generator.new;
export default generateShortId;

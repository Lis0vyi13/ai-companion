import { Send } from "lucide-react";
import { Button } from "./Button";

const SendButton = () => (
  <Button
    size="icon"
    className="h-10 w-10 bg-secondary text-white rounded-full hover:bg-gray-600 transition cursor-pointer"
  >
    <Send size={22} className="text-gray-300" />
  </Button>
);

export default SendButton;
